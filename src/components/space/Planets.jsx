import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, BackSide, DoubleSide, Vector3 } from "three";
import { useAnchors, warmNext } from "../../lib/planets";
import { markSceneReady, scene as sceneState } from "../../lib/scene";
import { flight, flightOffset } from "../../lib/flight";
import { pointer } from "../../lib/pointer";
import { baked } from "./bake";
import { haloFragment, haloVertex, planetFragment, planetVertex, ringFragment, ringVertex } from "./shaders";

const v = (x, y, z) => new Vector3(x, y, z).normalize();

// One look per world. sun: world-space light direction. tilt: axial tilt (x, z). spin: rad/s.
const LOOKS = {
  earth: { kind: "earth", atmo: [0.32, 0.58, 1.0], atmoStrength: 1, halo: 1.1, bump: 0.035, sun: v(-0.85, 0.4, 0.28), tilt: [-0.3, 0.41], spin: 0.012, moon: true },
  home: { kind: "earth", atmo: [0.32, 0.58, 1.0], atmoStrength: 1, halo: 1.1, bump: 0.035, sun: v(0.3, 0.7, -0.62), tilt: [-0.55, 0.2], spin: 0.01 },
  tech: { kind: "ice", atmo: [0.45, 0.72, 1.0], atmoStrength: 0.85, halo: 0.9, bump: 0, sun: v(-0.9, 0.3, 0.12), tilt: [0.2, -0.5], spin: 0.02 },
  nontech: { kind: "gas", atmo: [0.95, 0.82, 0.6], atmoStrength: 0.45, halo: 0.45, bump: 0, sun: v(0.85, 0.42, 0.2), tilt: [0.32, 0.38], spin: 0.03, ring: [1.28, 2.25] },
  workshop: { kind: "mars", atmo: [1.0, 0.62, 0.42], atmoStrength: 0.4, halo: 0.4, bump: 0.06, sun: v(-0.88, 0.38, 0.15), tilt: [0.2, 0.44], spin: 0.015 },
};

const DEPTH = 30; // planets sit this far in front of the camera
const HALO = 1.12;
const tmp = new Vector3();
const up = new Vector3();

// Texture width per tier: [earth, other worlds]. Earth fills the hero, so it gets the most detail.
const SIZES = { min: [1024, 1024], low: [2048, 1024], high: [4096, 2048] };

function Planet({ anchor, tier }) {
  const look = LOOKS[anchor.variant] || LOOKS.earth;
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const group = useRef();
  const tilt = useRef();
  const body = useRef();
  const moonPivot = useRef();
  const moon = useRef();
  const seed = useMemo(() => Math.random() * 100, []);
  const size = (SIZES[tier] || SIZES.low)[look.kind === "earth" ? 0 : 1];
  const fine = tier === "high";

  const { planetU, haloU, ringU, moonU } = useMemo(() => {
    const mapA = baked(gl, look.kind, 0, size);
    const mapB = look.kind === "earth" ? baked(gl, "earth", 1, size) : mapA;
    const shared = { uSun: { value: look.sun }, uFade: { value: 1 }, uCenter: { value: new Vector3() }, uRadius: { value: 1 }, uRingN: { value: new Vector3(0, 1, 0) }, uRingR: { value: look.ring || [0, 0] } };
    const planetU = {
      ...shared,
      uMapA: { value: mapA },
      uMapB: { value: mapB },
      uAtmo: { value: look.atmo },
      uAtmoStrength: { value: look.atmoStrength },
      uBump: { value: look.bump },
      uCloudShift: { value: 0 },
      uEarth: { value: look.kind === "earth" ? 1 : 0 },
      uSpec: { value: 1 },
      uDetail: { value: look.kind === "gas" || look.kind === "ice" ? 0 : 1 },
    };
    const haloU = { uSun: shared.uSun, uAtmo: planetU.uAtmo, uStrength: { value: look.halo }, uInner: { value: Math.sqrt(1 - 1 / (HALO * HALO)) } };
    const ringU = shared;
    const moonMap = look.moon && baked(gl, "moon", 0, size / 2);
    const moonU = look.moon && {
      ...shared,
      uFade: shared.uFade,
      uRingR: { value: [0, 0] },
      uMapA: { value: moonMap },
      uMapB: { value: moonMap },
      uAtmo: { value: [0, 0, 0] },
      uAtmoStrength: { value: 0 },
      uBump: { value: 0.08 },
      uCloudShift: { value: 0 },
      uEarth: { value: 0 },
      uSpec: { value: 0 },
      uDetail: { value: 1 },
      uCenter: { value: new Vector3() },
      uRadius: { value: 1 },
    };
    return { planetU, haloU, ringU, moonU };
  }, [gl, look, size]);

  // Compile this world's shaders now, while it is still off screen, so its first frame costs nothing extra.
  useEffect(() => {
    gl.compile(group.current, camera, scene);
  }, [gl, camera, scene]);

  useFrame(({ camera, clock, size: view }) => {
    const g = group.current;
    // Far from the viewport: skip the layout read entirely.
    if (!anchor.inRange) {
      g.visible = anchor.onScreen = false;
      return;
    }
    const r = anchor.el.getBoundingClientRect();
    const h = view.height;
    const reach = look.ring ? r.width * 0.7 : look.moon ? r.width * 0.5 : r.width * 0.15;
    const onScreen = r.width > 0 && r.bottom + reach > 0 && r.top - reach < h;
    const fade = onScreen ? (1 - flightOffset()) * (anchor.opacity?.get() ?? 1) : 0;
    g.visible = anchor.onScreen = fade > 0.002;
    if (!g.visible) return;

    // Pixel box → world position at DEPTH, keeping the sphere's silhouette the size of the box.
    const perPx = (2 * DEPTH * Math.tan((camera.fov * Math.PI) / 360)) / h;
    const x = (r.left + r.width / 2 - view.width / 2) * perPx;
    const y = -(r.top + r.height / 2 - h / 2) * perPx;
    const apparent = (r.width / 2) * perPx;
    const radius = DEPTH * Math.sin(Math.atan(apparent / DEPTH));
    g.position.set(camera.position.x + x, camera.position.y + y, camera.position.z - DEPTH);
    g.scale.setScalar(radius);

    const t = clock.elapsedTime + seed;
    // Scroll turns the planet: the further it travels up the screen, the more it rotates.
    const scrollTurn = ((r.top + r.height / 2) / h) * -0.45;
    body.current.rotation.y = t * look.spin + scrollTurn + seed;
    tilt.current.rotation.set(look.tilt[0] + pointer.sy * 0.05, pointer.sx * 0.08, look.tilt[1]);

    planetU.uFade.value = fade;
    planetU.uCenter.value.copy(g.position);
    planetU.uRadius.value = radius;
    planetU.uCloudShift.value = t * 0.0016;
    tilt.current.updateWorldMatrix(true, false);
    up.set(0, 1, 0).applyQuaternion(tilt.current.quaternion);
    planetU.uRingN.value.copy(up);
    haloU.uStrength.value = look.halo * fade;

    if (moonU) {
      moonPivot.current.rotation.y = t * 0.05 + scrollTurn * 1.6;
      moon.current.rotation.y = t * 0.02;
      moon.current.getWorldPosition(tmp);
      moonU.uCenter.value.copy(tmp);
      moonU.uRadius.value = radius * 0.13;
    }
  });

  return (
    <group ref={group}>
      <group ref={tilt}>
        <mesh ref={body} renderOrder={1}>
          <sphereGeometry args={[1, fine ? 128 : 64, fine ? 80 : 48]} />
          <shaderMaterial vertexShader={planetVertex} fragmentShader={planetFragment} uniforms={planetU} transparent />
        </mesh>
        <mesh scale={HALO} renderOrder={2}>
          <sphereGeometry args={[1, fine ? 96 : 48, fine ? 64 : 32]} />
          <shaderMaterial vertexShader={haloVertex} fragmentShader={haloFragment} uniforms={haloU} side={BackSide} transparent blending={AdditiveBlending} depthWrite={false} />
        </mesh>
        {look.ring && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={3}>
            <ringGeometry args={[look.ring[0], look.ring[1], fine ? 192 : 96, 1]} />
            <shaderMaterial vertexShader={ringVertex} fragmentShader={ringFragment} uniforms={ringU} side={DoubleSide} transparent depthWrite={false} />
          </mesh>
        )}
      </group>
      {moonU && (
        // Orbit tilted so the moon crosses in front of the planet and behind it.
        <group rotation={[0.32, 0, -0.18]}>
          <group ref={moonPivot}>
            <mesh ref={moon} position={[1.62, 0, 0]} scale={0.13} renderOrder={1}>
              <sphereGeometry args={[1, 48, 32]} />
              <shaderMaterial vertexShader={planetVertex} fragmentShader={planetFragment} uniforms={moonU} transparent />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
}

// The way a game fills its loading screen: every world on the page is built ahead of time, one per pause, behind
// the launch loader. Textures are generated and shaders compiled then, so none of that work lands mid-scroll.
// A world the visitor reaches before its turn is still built on the spot (see lib/planets.js).
export default function Planets({ tier }) {
  const anchors = useAnchors();
  useEffect(() => {
    if (!anchors.length) return;
    if (anchors.every((a) => a.near)) return markSceneReady();
    // Never during a scroll: wait for a quiet moment.
    let id;
    const step = () => (performance.now() - sceneState.active < 250 ? (id = setTimeout(step, 250)) : warmNext());
    // Back to back behind the loader; spaced out if the visitor is already on the page.
    id = setTimeout(step, flight.start === null ? 40 : 400);
    return () => clearTimeout(id);
  }, [anchors]);
  return anchors.filter((a) => a.near).map((a) => <Planet key={a.id} anchor={a} tier={tier} />);
}
