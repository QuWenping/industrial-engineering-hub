"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, Environment, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * 3D Beam Deflection Visualization
 * - Shows I-beam/H-beam/box-beam with real-time deflection
 * - Force arrow, supports, deformation animation
 * - Premium engineering style: metal material, contact shadows, studio lighting
 * - Lazy loaded (Three.js only loads when user expands this section)
 */

interface Props {
  values: Record<string, number | string>;
  result: { value: number; unit: string; formatted: string } | null;
}

// Brand colors
const NAVY = "#0B1F3A";
const BLUE = "#1677FF";
const CYAN = "#00D4FF";
const GREEN = "#00B578";

function getDeflectionScale(deflection: number): number {
  // Exaggerate deflection for visibility (real deflection is tiny)
  if (deflection < 1) return 0.08;
  if (deflection < 5) return 0.15;
  if (deflection < 20) return 0.3;
  if (deflection < 50) return 0.5;
  return 0.8;
}

function getColorByStress(stress: number): string {
  // Q355 yield = 355 MPa
  if (stress < 200) return GREEN;
  if (stress < 300) return "#F59E0B";
  return "#EF4444";
}

/* ── Beam cross-section shapes ─────────────────────────────── */

function createIBeamShape(): THREE.Shape {
  const s = new THREE.Shape();
  const w = 0.3, h = 0.5, tf = 0.06, tw = 0.04;
  s.moveTo(-w/2, -h/2);
  s.lineTo(w/2, -h/2);
  s.lineTo(w/2, -h/2 + tf);
  s.lineTo(tw/2, -h/2 + tf);
  s.lineTo(tw/2, h/2 - tf);
  s.lineTo(w/2, h/2 - tf);
  s.lineTo(w/2, h/2);
  s.lineTo(-w/2, h/2);
  s.lineTo(-w/2, h/2 - tf);
  s.lineTo(-tw/2, h/2 - tf);
  s.lineTo(-tw/2, -h/2 + tf);
  s.lineTo(-w/2, -h/2 + tf);
  s.closePath();
  return s;
}

function createHBeamShape(): THREE.Shape {
  const s = new THREE.Shape();
  const w = 0.4, h = 0.4, tf = 0.07, tw = 0.04;
  s.moveTo(-w/2, -h/2);
  s.lineTo(w/2, -h/2);
  s.lineTo(w/2, -h/2 + tf);
  s.lineTo(tw/2, -h/2 + tf);
  s.lineTo(tw/2, h/2 - tf);
  s.lineTo(w/2, h/2 - tf);
  s.lineTo(w/2, h/2);
  s.lineTo(-w/2, h/2);
  s.lineTo(-w/2, h/2 - tf);
  s.lineTo(-tw/2, h/2 - tf);
  s.lineTo(-tw/2, -h/2 + tf);
  s.lineTo(-w/2, -h/2 + tf);
  s.closePath();
  return s;
}

function createBoxBeamShape(): THREE.Shape {
  const s = new THREE.Shape();
  const outer = 0.35, inner = 0.26;
  const h = outer / 2, hi = inner / 2;
  s.moveTo(-h, -h);
  s.lineTo(h, -h);
  s.lineTo(h, h);
  s.lineTo(-h, h);
  s.closePath();
  const hole = new THREE.Path();
  hole.moveTo(-hi, -hi);
  hole.lineTo(hi, -hi);
  hole.lineTo(hi, hi);
  hole.lineTo(-hi, hi);
  hole.closePath();
  s.holes.push(hole);
  return s;
}

/* ── Beam mesh with deflection ─────────────────────────────── */

function BeamMesh({ values, result }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const deflection = result?.value || 0;
  const scale = getDeflectionScale(deflection);
  const stressColor = getColorByStress(deflection);

  // Determine beam type from inputs
  const beamType = (values.beamType || values.section || "i-beam") as string;
  const shape = useMemo(() => {
    if (beamType === "h-beam") return createHBeamShape();
    if (beamType === "box-beam") return createBoxBeamShape();
    return createIBeamShape();
  }, [beamType]);

  // Extrude geometry
  const geometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 4,
      bevelEnabled: false,
      steps: 100,
    });
    // Deform vertices along length (parabolic deflection)
    const positions = geo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const z = positions.getZ(i);
      const normalized = z / 4; // 0 to 1 along beam
      // Simply supported beam, midpoint load: deflection = 4*delta_max * (3x-4x^3) * x for x < 0.5
      let deflFactor: number;
      const x = normalized;
      if (x <= 0.5) {
        deflFactor = (3 * x - 4 * x * x * x) / (3 * 0.5 - 4 * 0.125);
      } else {
        const xm = 1 - x;
        deflFactor = (3 * xm - 4 * xm * xm * xm) / (3 * 0.5 - 4 * 0.125);
      }
      positions.setY(i, positions.getY(i) - deflFactor * scale);
    }
    positions.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, [shape, scale]);

  // Animate subtle breathing
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.005;
    }
  });

  return (
    <group>
      {/* Beam */}
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow rotation={[0, 0, 0]} position={[0, 0, -2]}>
        <meshStandardMaterial
          color={stressColor}
          metalness={0.7}
          roughness={0.35}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Original beam outline (ghost) */}
      <mesh position={[0, 0, -2]}>
        <extrudeGeometry args={[shape, { depth: 4, bevelEnabled: false }]} />
        <meshBasicMaterial color={NAVY} wireframe transparent opacity={0.12} />
      </mesh>

      {/* Supports (triangles at both ends) */}
      <Support position={[0, -0.3, 0]} />
      <Support position={[0, -0.3, -4]} />

      {/* Force arrow (midpoint) */}
      <ForceArrow position={[0, 0.4, -2]} />

      {/* Deflection label */}
      {result && (
        <Html position={[1.5, -0.5, -2]} center>
          <div style={{
            background: "rgba(11,31,58,0.9)",
            color: CYAN,
            padding: "4px 10px",
            borderRadius: "6px",
            fontFamily: "monospace",
            fontSize: "12px",
            whiteSpace: "nowrap",
            border: `1px solid ${CYAN}40`,
          }}>
            δ = {result.formatted}
          </div>
        </Html>
      )}
    </group>
  );
}

function Support({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <coneGeometry args={[0.15, 0.3, 4]} />
      <meshStandardMaterial color={NAVY} metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

function ForceArrow({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Shaft */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.3} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Arrowhead */}
      <mesh position={[0, -0.05, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.08, 0.15, 8]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.4} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Force label */}
      <Html position={[0.2, 0.5, 0]} center>
        <div style={{
          color: "#EF4444",
          fontFamily: "monospace",
          fontSize: "11px",
          fontWeight: 600,
        }}>
          P ↓
        </div>
      </Html>
    </group>
  );
}

/* ── Scene ─────────────────────────────────────────────────── */

function Scene(props: Props) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.4} color={BLUE} />

      <BeamMesh {...props} />

      <ContactShadows
        position={[0, -0.35, -2]}
        opacity={0.4}
        scale={8}
        blur={2}
        far={3}
        color={NAVY}
      />

      <Grid
        args={[12, 6]}
        position={[0, -0.36, -2]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor={NAVY}
        sectionSize={2}
        sectionThickness={1}
        sectionColor={BLUE}
        fadeDistance={12}
        fadeStrength={1}
        infiniteGrid
      />

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={3}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2 - 0.05}
        target={[0, -0.2, -2]}
      />
    </>
  );
}

export default function Beam3DVisualization(props: Props) {
  return (
    <div className="p-2 bg-gradient-to-br from-slate-50 to-blue-50" style={{ minHeight: "400px" }}>
      <Canvas
        shadows
        camera={{ position: [4, 3, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)" }}
      >
        <Suspense fallback={null}>
          <Scene {...props} />
        </Suspense>
      </Canvas>
      <div className="mt-2 flex items-center justify-center gap-3 text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: GREEN }} /> Safe
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: "#F59E0B" }} /> Caution
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: "#EF4444" }} /> Over limit
        </span>
        <span className="ml-2 text-slate-400">Drag to rotate · Scroll to zoom</span>
      </div>
    </div>
  );
}
