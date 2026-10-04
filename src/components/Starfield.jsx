import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, BackSide, Vector3 } from "three";
import { isTouch, prefersReducedMotion } from "../lib/theme";
import { flightOffset } from "../lib/flight";
import { easePointer, pointer } from "../lib/pointer";
import { tickScroll } from "../lib/scroll";
import { baked } from "./space/bake";
import Planets from "./space/Planets";

const scrollProgress = () => scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);

/* ---------- Sky: baked nebula on an inside-out sphere, turned by scroll so the view "descends" ---------- */

const skyVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const skyFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uFade;
  varying vec2 vUv;
  float dither(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453) - 0.5; }
  void main() {
    vec3 col = texture2D(uMap, vUv).rgb * uFade;
    col = 1.0 - exp(-col * 1.3);
    col = pow(col, vec3(1.0 / 2.2)) + dither(gl_FragCoord.xy) / 255.0;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const look = { x: 0, y: 0 };

function Sky({ quality, still }) {
  const ref = useRef();
  const gl = useThree((s) => s.gl);
  const uniforms = useMemo(() => ({ uMap: { value: baked(gl, "sky", 0, quality === "low" ? 2048 : 4096) }, uFade: { value: 1 } }), [gl, quality]);
  useFrame(({ camera, clock }, delta) => {
    ref.current.position.copy(camera.position); // a skybox: never gets closer
    const p = scrollProgress();
    // Tilting down through the galaxy as the page scrolls, plus a slow drift and a little pointer parallax.
    const tx = p * 0.9 + pointer.sy * 0.015;
    const ty = (still ? 0 : clock.elapsedTime * 0.0035) + p * 0.5 - pointer.sx * 0.025;
    const k = still ? 1 : Math.min(1, delta * 3);
    look.x += (tx - look.x) * k;
    look.y += (ty - look.y) * k;
    ref.current.rotation.set(look.x, look.y, 0);
    uniforms.uFade.value = (0.38 + 0.34 * (1 - flightOffset()));
  });
  return (
    <mesh ref={ref} renderOrder={-2}>
      <sphereGeometry args={[250, 96, 48]} />
      <shaderMaterial vertexShader={skyVertex} fragmentShader={skyFragment} uniforms={uniforms} side={BackSide} depthWrite={false} />
    </mesh>
  );
}

/* ---------- Near stars: real depth, so they parallax and stream past as you scroll ---------- */

const starVertex = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixel;
  varying float vAlpha;
  varying float vSeed;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float twinkle = 0.6 + 0.4 * sin(uTime * (0.6 + aSeed * 1.8) + aSeed * 40.0);
    // Fade stars that come close, so nothing drifts in front of a planet.
    vAlpha = twinkle * smoothstep(30.0, 48.0, -mv.z);
    vSeed = aSeed;
    gl_PointSize = clamp(aSize * uPixel * (70.0 / -mv.z), 0.0, 6.0);
    gl_Position = projectionMatrix * mv;
  }
`;
const starFragment = /* glsl */ `
  varying float vAlpha;
  varying float vSeed;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    vec3 col = vSeed < 0.3 ? vec3(0.66, 0.78, 1.0) : vSeed > 0.92 ? vec3(1.0, 0.85, 0.62) : vec3(0.93, 0.94, 1.0);
    gl_FragColor = vec4(col, core * core * vAlpha);
  }
`;

function Stars({ count, still }) {
  const ref = useRef();
  const travel = useRef(0);
  const [positions, sizes, seeds] = useMemo(() => {
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    const r = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const u = Math.random() * 2 - 1;
      const t = Math.random() * Math.PI * 2;
      const rad = 40 + Math.random() * 110;
      const k = Math.sqrt(1 - u * u);
      p.set([rad * k * Math.cos(t), rad * k * Math.sin(t), rad * u], i * 3);
      s[i] = Math.random() ** 4 * 2.4 + 0.3;
      r[i] = Math.random();
    }
    return [p, s, r];
  }, [count]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPixel: { value: Math.min(devicePixelRatio, 1.5) } }), []);

  useFrame(({ clock, camera }, delta) => {
    uniforms.uTime.value = still ? 0 : clock.elapsedTime;
    ref.current.rotation.y = (still ? 0 : clock.elapsedTime * 0.005) + pointer.sx * 0.05;
    ref.current.rotation.x = pointer.sy * 0.03;
    // Depth travel with the page; the camera is parked far out until the visitor enters orbit.
    const target = -scrollY * 0.0035;
    travel.current += (target - travel.current) * (still ? 1 : Math.min(1, delta * 5));
    camera.position.z = travel.current + flightOffset() * 90;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial vertexShader={starVertex} fragmentShader={starFragment} uniforms={uniforms} transparent depthWrite={false} blending={AdditiveBlending} />
    </points>
  );
}

/* ---------- A few bright stars with diffraction spikes, fixed to the sky ---------- */

const brightVertex = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixel;
  varying vec3 vColor;
  varying float vTw;
  void main() {
    vColor = aColor;
    vTw = 0.8 + 0.2 * sin(uTime * (0.8 + aSeed * 2.0) + aSeed * 30.0);
    gl_PointSize = aSize * uPixel;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const brightFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vTw;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float r = length(p);
    float core = exp(-r * r * 900.0) * 1.6;
    float halo = exp(-r * 14.0) * 0.35;
    float spikes = exp(-abs(p.x) * 160.0) * exp(-abs(p.y) * 7.0) + exp(-abs(p.y) * 160.0) * exp(-abs(p.x) * 7.0);
    float a = (core + halo + spikes * 0.7) * vTw * smoothstep(0.5, 0.35, r);
    gl_FragColor = vec4(mix(vColor, vec3(1.0), core * 0.6) * a, 1.0);
  }
`;

const BRIGHT_COLORS = [[0.62, 0.75, 1], [0.8, 0.86, 1], [1, 0.75, 0.42], [0.85, 0.7, 1], [1, 0.95, 0.88]];

function BrightStars({ count, still }) {
  const ref = useRef();
  const [positions, sizes, colors, seeds] = useMemo(() => {
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    const c = new Float32Array(count * 3);
    const r = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const u = Math.random() * 2 - 1;
      const t = Math.random() * Math.PI * 2;
      const k = Math.sqrt(1 - u * u);
      p.set([200 * k * Math.cos(t), 200 * k * Math.sin(t), 200 * u], i * 3);
      s[i] = 14 + Math.random() ** 2.5 * 40;
      c.set(BRIGHT_COLORS[(Math.random() * BRIGHT_COLORS.length) | 0], i * 3);
      r[i] = Math.random();
    }
    return [p, s, c, r];
  }, [count]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPixel: { value: Math.min(devicePixelRatio, 1.5) } }), []);
  useFrame(({ clock, camera }) => {
    uniforms.uTime.value = still ? 0 : clock.elapsedTime;
    ref.current.position.copy(camera.position);
    ref.current.rotation.set(look.x, look.y, 0); // turns with the sky
  });
  return (
    <points ref={ref} renderOrder={-1}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial vertexShader={brightVertex} fragmentShader={brightFragment} uniforms={uniforms} transparent depthWrite={false} blending={AdditiveBlending} />
    </points>
  );
}

/* ---------- An occasional shooting star ---------- */

const meteorFragment = /* glsl */ `
  uniform float uLife;
  varying vec2 vUv;
  void main() {
    float tail = pow(vUv.x, 3.0);
    float width = exp(-pow((vUv.y - 0.5) * 9.0, 2.0) / max(vUv.x, 0.05));
    float life = sin(uLife * 3.1415927);
    gl_FragColor = vec4(vec3(0.75, 0.85, 1.0) * tail * width * life * 1.4, 1.0);
  }
`;
const meteorVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

function ShootingStar() {
  const ref = useRef();
  const s = useMemo(() => ({ start: 3, dur: 1.1, from: new Vector3(), dir: new Vector3() }), []);
  const uniforms = useMemo(() => ({ uLife: { value: 0 } }), []);
  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    const m = ref.current;
    if (t > s.start + s.dur) {
      s.start = t + 6 + Math.random() * 10;
      s.dur = 0.8 + Math.random() * 0.7;
      s.from.set((Math.random() - 0.2) * 70, 10 + Math.random() * 25, -100);
      s.dir.set(-(0.6 + Math.random() * 0.4), -(0.25 + Math.random() * 0.35), 0).normalize();
    }
    const life = (t - s.start) / s.dur;
    m.visible = life > 0 && life < 1;
    if (!m.visible) return;
    uniforms.uLife.value = life;
    m.position.copy(camera.position).add(s.from).addScaledVector(s.dir, life * 40);
    m.rotation.z = Math.atan2(s.dir.y, s.dir.x) + Math.PI;
  });
  return (
    <mesh ref={ref} renderOrder={-1} visible={false}>
      <planeGeometry args={[14, 0.35]} />
      <shaderMaterial vertexShader={meteorVertex} fragmentShader={meteorFragment} uniforms={uniforms} transparent depthWrite={false} blending={AdditiveBlending} />
    </mesh>
  );
}

/* ---------- Frame driver ---------- */

// Runs first each frame: advances smooth scrolling so DOM and planets move together, then eases the pointer.
function Driver() {
  useFrame((_, delta) => {
    tickScroll(performance.now());
    easePointer(delta);
  }, -1);
  return null;
}

// With reduced motion the scene renders on demand; redraw on scroll and resize so planets follow the page.
function InvalidateOnScroll() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const on = () => invalidate();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => (removeEventListener("scroll", on), removeEventListener("resize", on));
  }, [invalidate]);
  return null;
}

export default function Starfield() {
  const still = prefersReducedMotion();
  const touch = isTouch();
  const quality = touch || innerWidth < 768 ? "low" : "high";
  return (
    <Canvas
      style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}
      dpr={[1, touch ? 1.5 : 1.75]}
      frameloop={still ? "demand" : "always"}
      camera={{ position: [0, 0, 0], fov: 50, near: 0.1, far: 400 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <color attach="background" args={["#010208"]} />
      <Driver />
      <Sky quality={quality} still={still} />
      <BrightStars count={touch ? 26 : 44} still={still} />
      <Stars count={touch ? 450 : 900} still={still} />
      {!still && <ShootingStar />}
      <Planets quality={quality} />
      {still && <InvalidateOnScroll />}
    </Canvas>
  );
}
