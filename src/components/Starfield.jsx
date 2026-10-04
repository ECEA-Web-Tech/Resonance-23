import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, BackSide, NormalBlending } from "three";
import { isTouch, prefersReducedMotion } from "../lib/theme";
import { flightOffset } from "../lib/flight";
import { Asteroids, Astronaut, Rocket, Satellite } from "./space/Models";

/* ---------- Milky Way sky: one inside-out sphere, shaded procedurally ---------- */

const skyVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragment = /* glsl */ `
  uniform float uLight;
  varying vec3 vDir;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
      f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }
  // One star per lit cell, jittered inside it.
  float stars(vec3 d, float scale, float threshold, float size) {
    vec3 p = d * scale;
    vec3 id = floor(p);
    float h = hash(id);
    if (h < threshold) return 0.0;
    vec3 jitter = vec3(hash(id + 1.3), hash(id + 2.7), hash(id + 4.1)) - 0.5;
    float r = length(fract(p) - 0.5 - jitter * 0.6);
    return smoothstep(size, 0.0, r) * (0.35 + 0.65 * (h - threshold) / (1.0 - threshold));
  }

  void main() {
    vec3 d = normalize(vDir);
    float lat = dot(d, normalize(vec3(0.42, 1.0, 0.18)));   // distance from the galactic plane
    float band = exp(-lat * lat * 7.0);
    float clouds = fbm(d * 3.2);
    float detail = fbm(d * 8.0 + 4.0);
    float lanes = smoothstep(0.5, 0.78, fbm(d * 5.5 + 11.0)) * exp(-lat * lat * 30.0);
    float glow = band * (0.3 + 1.1 * clouds * detail) * (1.0 - 0.8 * lanes);

    float s = stars(d, 160.0, 0.94, 0.16) + stars(d, 380.0, 0.9, 0.2) * (0.35 + band) + stars(d, 60.0, 0.985, 0.09) * 1.6;
    float hue = hash(floor(d * 160.0) + 9.0);
    vec3 starCol = mix(vec3(0.62, 0.74, 1.0), vec3(1.0, 0.93, 0.82), hue);

    if (uLight > 0.5) {
      // Daylight observatory: pearl sky, the galaxy as a faint lavender wash, stars as ink dots.
      vec3 c = vec3(0.935, 0.942, 0.97) - vec3(0.13, 0.11, 0.02) * glow * 0.55 - vec3(0.55, 0.52, 0.4) * s * 0.5;
      gl_FragColor = vec4(c, 1.0);
      return;
    }
    vec3 col = vec3(0.008, 0.014, 0.045)
      + vec3(0.09, 0.14, 0.36) * glow
      + vec3(0.55, 0.5, 0.66) * pow(glow, 2.6) * 0.55
      + vec3(0.22, 0.07, 0.3) * smoothstep(0.55, 0.85, fbm(d * 2.0 + 20.0)) * 0.3
      + starCol * s;
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Sky({ dark }) {
  const ref = useRef();
  const uniforms = useMemo(() => ({ uLight: { value: 0 } }), []);
  uniforms.uLight.value = dark ? 0 : 1;
  useFrame(({ camera, clock }) => {
    ref.current.position.copy(camera.position); // a skybox: never gets closer
    ref.current.rotation.y = clock.elapsedTime * 0.004;
  });
  return (
    <mesh ref={ref} renderOrder={-1}>
      <sphereGeometry args={[250, 64, 32]} />
      <shaderMaterial vertexShader={skyVertex} fragmentShader={skyFragment} uniforms={uniforms} side={BackSide} depthWrite={false} />
    </mesh>
  );
}

/* ---------- Twinkling foreground stars: real depth, so they parallax ---------- */

const starVertex = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixel;
  varying float vTwinkle;
  varying float vSeed;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vTwinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed * 1.8) + aSeed * 40.0);
    vSeed = aSeed;
    gl_PointSize = min(aSize * uPixel * (60.0 / -mv.z), 9.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const starFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying float vTwinkle;
  varying float vSeed;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    vec3 col = vSeed < 0.3 ? uColor * vec3(0.7, 0.82, 1.0) : vSeed > 0.93 ? vec3(0.95, 0.82, 0.5) : uColor;
    gl_FragColor = vec4(col, core * core * vTwinkle * uAlpha);
  }
`;

function Stars({ count, dark, still }) {
  const ref = useRef();
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  const [positions, sizes, seeds] = useMemo(() => {
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    const r = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Shell between radius 20 and 120 so nothing pops in front of the camera.
      const u = Math.random() * 2 - 1;
      const t = Math.random() * Math.PI * 2;
      const rad = 20 + Math.random() * 100;
      const k = Math.sqrt(1 - u * u);
      p.set([rad * k * Math.cos(t), rad * k * Math.sin(t), rad * u], i * 3);
      s[i] = Math.random() ** 3 * 2.4 + 0.35;
      r[i] = Math.random();
    }
    return [p, s, r];
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixel: { value: Math.min(window.devicePixelRatio, 1.5) },
      uColor: { value: [1, 1, 1] },
      uAlpha: { value: 1 },
    }),
    []
  );
  uniforms.uColor.value = dark ? [0.92, 0.93, 1] : [0.12, 0.16, 0.35];
  uniforms.uAlpha.value = dark ? 1 : 0.7;

  useFrame(({ clock, camera, pointer: p }, delta) => {
    if (still) return;
    uniforms.uTime.value = clock.elapsedTime;
    const pt = pointer.current;
    pt.x += (p.x - pt.x) * 0.03;
    pt.y += (p.y - pt.y) * 0.03;
    // Slow drift, a little parallax from the pointer, and depth travel as the page scrolls.
    ref.current.rotation.y = clock.elapsedTime * 0.006 + pt.x * 0.06;
    ref.current.rotation.x = pt.y * 0.04;
    const target = -window.scrollY * 0.004;
    scroll.current += (target - scroll.current) * Math.min(1, delta * 4);
    // Parked 90 units out until the visitor enters orbit, then flies in.
    camera.position.z = scroll.current + flightOffset() * 90;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={starVertex}
        fragmentShader={starFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={dark ? AdditiveBlending : NormalBlending}
      />
    </points>
  );
}

/* ---------- Drifting objects ---------- */

// x/y in world units at depth z in front of the camera; `rise` is how fast each climbs as the page
// scrolls, so new objects float up into view further down the page.
// fx: horizontal position as a fraction of the half-screen (±1 = edges), so objects hug the margins at any width.
// rot: resting orientation; spin: continuous turn (rad/s); sway: gentle rocking amplitude.
const DRIFTERS = [
  { Model: Astronaut, props: { pose: 0 }, fx: -0.8, y: 4.6, z: 17, scale: 2.3, rise: 0.8, rot: [0.25, 0.5, -0.7], sway: 0.25 },
  { Model: Astronaut, props: { pose: 1 }, fx: 0.78, y: -5, z: 16, scale: 2.4, rise: 1, rot: [-0.15, -0.45, 0.55], sway: 0.3 },
  { Model: Satellite, fx: 0.8, y: -20, z: 20, scale: 1.8, rise: 1.15, rot: [0.4, 0, 0.2], spin: [0.03, 0.18, 0.05] },
  { Model: Asteroids, fx: -0.85, y: -30, z: 22, scale: 1.5, rise: 1.2, rot: [0, 0, 0], spin: [0.12, 0.08, 0.1] },
  { Model: Rocket, fx: 0.82, y: -44, z: 18, scale: 2, rise: 1.3, rot: [0.2, 0, -0.55], spin: [0, 0.35, 0] },
  { Model: Astronaut, props: { pose: 0 }, fx: -0.8, y: -58, z: 17, scale: 2.1, rise: 1.3, rot: [0.1, 0.8, 0.9], sway: 0.3 },
];

function Drifter({ d, narrow }) {
  const ref = useRef();
  const spinner = useRef();
  const seed = useMemo(() => Math.random() * 10, []);
  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime + seed;
    const halfWidth = d.z * Math.tan((camera.fov * Math.PI) / 360) * camera.aspect;
    const x = d.fx * halfWidth;
    const y = d.y + scrollY * 0.0105 * d.rise + Math.sin(t * 0.4) * 0.35;
    ref.current.position.set(x + Math.cos(t * 0.3) * 0.3, y, camera.position.z - d.z);
    const spin = d.spin || [0, 0, 0];
    const sway = d.sway || 0;
    spinner.current.rotation.set(
      d.rot[0] + spin[0] * t + Math.sin(t * 0.5) * sway,
      d.rot[1] + spin[1] * t + Math.sin(t * 0.37) * sway,
      d.rot[2] + spin[2] * t + Math.sin(t * 0.29) * sway * 0.6
    );
  });
  return (
    <group ref={ref} scale={narrow ? d.scale * 0.55 : d.scale}>
      <group ref={spinner}>
        <d.Model {...d.props} />
      </group>
    </group>
  );
}

// With reduced motion the scene renders on demand; redraw on scroll so objects still follow the page.
function InvalidateOnScroll() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const on = () => invalidate();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, [invalidate]);
  return null;
}

export default function Starfield({ dark }) {
  const still = prefersReducedMotion();
  const touch = isTouch();
  const narrow = innerWidth < 768;
  return (
    <Canvas
      style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}
      dpr={[1, touch ? 1.25 : 1.5]}
      frameloop={still ? "demand" : "always"}
      camera={{ position: [0, 0, 0], fov: 60, near: 0.1, far: 400 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={document.body}
      eventPrefix="client"
      aria-hidden="true"
    >
      <Sky dark={dark} />
      <Stars count={touch ? 900 : 2200} dark={dark} still={still} />
      <ambientLight intensity={dark ? 0.35 : 0.9} />
      <directionalLight position={[-6, 8, 6]} intensity={2.4} color="#fff3dc" />
      <directionalLight position={[8, -3, -10]} intensity={1.6} color="#6d7cff" />
      {DRIFTERS.map((d, i) => (
        <Drifter key={i} d={d} narrow={narrow} />
      ))}
      {still && <InvalidateOnScroll />}
    </Canvas>
  );
}
