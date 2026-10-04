import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, DoubleSide, IcosahedronGeometry, Vector2 } from "three";

// Procedural, low-poly models: no downloads, a few hundred triangles each.

const suit = { color: "#ece9e2", roughness: 0.75 };
const trim = { color: "#8f8a80", roughness: 0.8 };
const gold = { color: "#d9b45a", metalness: 0.75, roughness: 0.28 };
const navy = { color: "#1a2558", metalness: 0.35, roughness: 0.4 };

function Limb({ position, rotation, length = 0.42, radius = 0.1, end }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, -length / 2, 0]}>
        <capsuleGeometry args={[radius, length, 6, 12]} />
        <meshStandardMaterial {...suit} />
      </mesh>
      <mesh position={[0, -length - radius * 0.6, 0]}>
        <sphereGeometry args={[radius * 1.15, 12, 10]} />
        <meshStandardMaterial {...(end === "boot" ? trim : { color: "#d8d4cb", roughness: 0.8 })} />
      </mesh>
    </group>
  );
}

export function Astronaut({ pose = 0 }) {
  // pose 0: spread-eagle drift. pose 1: one arm raised, knees bent.
  const arms = pose ? [[0.2, 0, 2.5], [0.5, 0, -0.75]] : [[0.25, 0, 1.1], [-0.35, 0, -1.25]];
  const legs = pose ? [[0.7, 0, 0.2], [-0.35, 0, -0.12]] : [[-0.2, 0, 0.32], [0.25, 0, -0.3]];
  return (
    <group>
      {/* torso */}
      <mesh>
        <capsuleGeometry args={[0.36, 0.5, 8, 18]} />
        <meshStandardMaterial {...suit} />
      </mesh>
      <mesh position={[0, 0.12, 0.33]}>
        <boxGeometry args={[0.34, 0.24, 0.1]} />
        <meshStandardMaterial {...trim} />
      </mesh>
      {[-0.08, 0.06].map((x, i) => (
        <mesh key={x} position={[x, 0.14, 0.385]}>
          <boxGeometry args={[0.07, 0.05, 0.02]} />
          <meshStandardMaterial {...(i ? navy : gold)} emissive={i ? "#4a6cff" : "#d9b45a"} emissiveIntensity={0.6} />
        </mesh>
      ))}
      {/* life-support pack with two tanks */}
      <mesh position={[0, 0.08, -0.4]}>
        <boxGeometry args={[0.66, 0.78, 0.32]} />
        <meshStandardMaterial {...suit} />
      </mesh>
      {[-0.17, 0.17].map((x) => (
        <mesh key={x} position={[x, 0.08, -0.6]}>
          <cylinderGeometry args={[0.11, 0.11, 0.7, 14]} />
          <meshStandardMaterial {...trim} />
        </mesh>
      ))}
      {/* helmet, neck ring, gold visor */}
      <mesh position={[0, 0.46, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.24, 0.05, 10, 28]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      <mesh position={[0, 0.76, 0]}>
        <sphereGeometry args={[0.35, 28, 20]} />
        <meshStandardMaterial {...suit} />
      </mesh>
      <mesh position={[0, 0.76, 0.17]} scale={[1, 0.86, 0.7]}>
        <sphereGeometry args={[0.28, 28, 20]} />
        <meshStandardMaterial {...gold} roughness={0.15} metalness={0.85} emissive="#6b4e14" emissiveIntensity={0.7} />
      </mesh>
      <Limb position={[-0.46, 0.32, 0]} rotation={arms[0]} length={0.56} radius={0.115} />
      <Limb position={[0.46, 0.32, 0]} rotation={arms[1]} length={0.56} radius={0.115} />
      <Limb position={[-0.19, -0.48, 0]} rotation={legs[0]} length={0.64} radius={0.14} end="boot" />
      <Limb position={[0.19, -0.48, 0]} rotation={legs[1]} length={0.64} radius={0.14} end="boot" />
    </group>
  );
}

export function Satellite() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.6, 0.6, 0.9]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 1.25, 0, 0]}>
          <mesh>
            <boxGeometry args={[1.6, 0.03, 0.62]} />
            <meshStandardMaterial {...navy} emissive="#2a3c9a" emissiveIntensity={0.25} />
          </mesh>
          {[-0.4, 0, 0.4].map((x) => (
            <mesh key={x} position={[x, 0.02, 0]}>
              <boxGeometry args={[0.015, 0.01, 0.62]} />
              <meshStandardMaterial color="#9fb0ff" />
            </mesh>
          ))}
          <mesh position={[-s * 0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.2, 8]} />
            <meshStandardMaterial {...trim} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0, 0.62]} rotation={[-Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[0.38, 24, 10, 0, Math.PI * 2, 0, 0.95]} />
        <meshStandardMaterial color="#f2f0ea" roughness={0.5} side={DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.82]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.4, 6]} />
        <meshStandardMaterial {...gold} />
      </mesh>
    </group>
  );
}

function rockGeometry(seed, detail = 2) {
  const g = new IcosahedronGeometry(1, detail);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const n = 1 + 0.22 * Math.sin(x * 3.1 + seed) * Math.cos(y * 2.7 - seed) + 0.12 * Math.sin(z * 5.3 + seed * 2);
    p.setXYZ(i, x * n, y * n * 0.82, z * n);
  }
  g.computeVertexNormals();
  return g;
}

export function Asteroids() {
  const rocks = useMemo(
    () => [
      { g: rockGeometry(1.3), pos: [0, 0, 0], s: 1 },
      { g: rockGeometry(4.1, 1), pos: [1.7, 0.9, -0.6], s: 0.35 },
      { g: rockGeometry(7.7, 1), pos: [-1.5, -0.7, 0.4], s: 0.25 },
      { g: rockGeometry(2.2, 1), pos: [-0.9, 1.3, -1], s: 0.16 },
    ],
    []
  );
  return (
    <group>
      {rocks.map((r, i) => (
        <mesh key={i} geometry={r.g} position={r.pos} scale={r.s}>
          <meshStandardMaterial color="#7a6f66" roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

export function Rocket() {
  const flame = useRef();
  const body = useMemo(
    () =>
      [
        [0, 1.25], [0.12, 1.1], [0.24, 0.8], [0.3, 0.4], [0.3, -0.5], [0.24, -0.7], [0.18, -0.75],
      ].map(([x, y]) => new Vector2(x, y)),
    []
  );
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    flame.current.scale.set(1, 1 + Math.sin(t * 30) * 0.12 + Math.sin(t * 13) * 0.08, 1);
  });
  return (
    <group>
      <mesh>
        <latheGeometry args={[body, 32]} />
        <meshStandardMaterial color="#f1eee7" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.245, 0.27, 0.12, 32]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      <mesh position={[0, 0.35, 0.29]}>
        <circleGeometry args={[0.09, 24]} />
        <meshStandardMaterial color="#9fd8ff" emissive="#4aa8ff" emissiveIntensity={0.6} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]} position={[0, -0.55, 0]}>
          <boxGeometry args={[0.04, 0.42, 0.5]} />
          <meshStandardMaterial {...gold} />
        </mesh>
      ))}
      <group ref={flame} position={[0, -0.78, 0]}>
        <mesh position={[0, -0.35, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.16, 0.7, 20, 1, true]} />
          <meshBasicMaterial color="#ffb347" transparent opacity={0.85} blending={AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh position={[0, -0.22, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.08, 0.4, 16, 1, true]} />
          <meshBasicMaterial color="#fff2c4" transparent blending={AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}
