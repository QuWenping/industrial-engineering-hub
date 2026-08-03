"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * 3D Tank / Vessel Visualization
 * Supports: vertical cylinder, sphere, cone, horizontal cylinder with fill level, pressure vessel
 * Detects shape from input field names.
 * Shows liquid fill level with semi-transparent water material.
 * Premium engineering style: metal walls, liquid level, dimension labels.
 */

interface Props {
  values: Record<string, number | string>;
  result: { value: number; unit: string; formatted: string } | null;
}

const NAVY = "#0B1F3A";
const BLUE = "#1677FF";
const CYAN = "#00D4FF";
const GREEN = "#00B578";

type TankShape = "vertical-cylinder" | "horizontal-cylinder" | "sphere" | "cone" | "generic";

function detectShape(values: Record<string, number>): TankShape {
  if (values.r !== undefined && values.length !== undefined) return "horizontal-cylinder";
  if (values.diameter !== undefined && values.height === undefined && values.length === undefined) return "sphere";
  if (values.diameter !== undefined && values.height !== undefined) {
    // Could be cone or cylinder — default to cylinder
    return "vertical-cylinder";
  }
  if (values.volume !== undefined) return "generic";
  return "vertical-cylinder";
}

/* ── Tank Scene ────────────────────────────────────────────── */

function TankScene({ values, result }: Props) {
  const v = values as Record<string, number>;
  const shape = detectShape(v);

  // Normalize dimensions
  const diameter = v.diameter || (v.r ? v.r * 2 : 3);
  const height = v.height || v.length || 6;
  const radius = v.r || diameter / 2;
  const fillHeight = v.h || 0;
  const fillRatio = fillHeight > 0 ? Math.min(fillHeight / (radius * 2), 1) : 0.85;

  // Scale to fit scene (max dimension ~3 units)
  const maxDim = Math.max(diameter, height, radius * 2);
  const scale = 2.5 / maxDim;
  const r = radius * scale;
  const h = height * scale;

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.3} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-5, 3, -3]} intensity={0.3} color={BLUE} />

      {shape === "vertical-cylinder" && <VerticalCylinder r={r} h={h} fillRatio={fillRatio} result={result} />}
      {shape === "horizontal-cylinder" && <HorizontalCylinder r={r} h={h} fillRatio={fillRatio} result={result} />}
      {shape === "sphere" && <SphereTank r={r} fillRatio={fillRatio} result={result} />}
      {shape === "cone" && <ConeTank r={r} h={h} fillRatio={fillRatio} result={result} />}
      {shape === "generic" && <GenericTank fillRatio={fillRatio} result={result} />}

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.35}
        scale={8}
        blur={2}
        far={4}
        color={NAVY}
      />
      <Grid
        args={[10, 10]}
        position={[0, -1.52, 0]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor={NAVY}
        sectionSize={2}
        sectionThickness={1}
        sectionColor={BLUE}
        fadeDistance={10}
        fadeStrength={1}
        infiniteGrid
      />
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={3}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2 - 0.05}
        target={[0, 0, 0]}
      />
    </>
  );
}

/* ── Vertical Cylinder ─────────────────────────────────────── */

function VerticalCylinder({ r, h, fillRatio, result }: { r: number; h: number; fillRatio: number; result: Props["result"] }) {
  const groupRef = useRef<THREE.Group>(null);
  const fillH = h * fillRatio;
  const yCenter = -h / 2 + fillH / 2;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Tank wall (transparent) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[r, r, h, 64, 1, true]} />
        <meshPhysicalMaterial
          color={NAVY}
          metalness={0.6}
          roughness={0.3}
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          clearcoat={0.3}
        />
      </mesh>

      {/* Top rim */}
      <mesh position={[0, h / 2, 0]}>
        <torusGeometry args={[r, 0.03, 8, 64]} />
        <meshStandardMaterial color={NAVY} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Bottom rim */}
      <mesh position={[0, -h / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r, 0.03, 8, 64]} />
        <meshStandardMaterial color={NAVY} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Liquid fill */}
      {fillRatio > 0 && (
        <mesh position={[0, yCenter, 0]}>
          <cylinderGeometry args={[r * 0.97, r * 0.97, fillH, 64]} />
          <meshPhysicalMaterial
            color={BLUE}
            metalness={0.1}
            roughness={0.1}
            transparent
            opacity={0.6}
            transmission={0.3}
            ior={1.33}
          />
        </mesh>
      )}

      {/* Liquid surface ripple */}
      {fillRatio > 0 && (
        <mesh position={[0, yCenter + fillH / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[r * 0.97, 64]} />
          <meshStandardMaterial color={CYAN} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Dimension lines */}


      {/* Result label */}
      {result && (
        <Html position={[r + 1, h / 2 + 0.3, 0]} center>
          <div style={{
            background: "rgba(11,31,58,0.9)",
            color: GREEN,
            padding: "4px 10px",
            borderRadius: "6px",
            fontFamily: "monospace",
            fontSize: "12px",
            whiteSpace: "nowrap",
            border: "1px solid #00B57840",
          }}>
            {result.formatted}
          </div>
        </Html>
      )}
    </group>
  );
}


/* ── Horizontal Cylinder ────────────────────────────────────── */

function HorizontalCylinder({ r, h, fillRatio, result }: { r: number; h: number; fillRatio: number; result: Props["result"] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 2]}>
      {/* Tank wall */}
      <mesh>
        <cylinderGeometry args={[r, r, h, 64, 1, true]} />
        <meshPhysicalMaterial color={NAVY} metalness={0.6} roughness={0.3} transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* End caps */}
      <mesh position={[0, h / 2, 0]}>
        <circleGeometry args={[r, 64]} />
        <meshStandardMaterial color={NAVY} metalness={0.7} roughness={0.25} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -h / 2, 0]} rotation={[Math.PI, 0, 0]}>
        <circleGeometry args={[r, 64]} />
        <meshStandardMaterial color={NAVY} metalness={0.7} roughness={0.25} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Liquid fill (partial) */}
      {fillRatio > 0 && (
        <LiquidFillHorizontal r={r} h={h} fillRatio={fillRatio} />
      )}

      {result && (
        <Html position={[h / 2 + 0.5, r + 0.3, 0]} center>
          <div style={{
            background: "rgba(11,31,58,0.9)",
            color: GREEN,
            padding: "4px 10px",
            borderRadius: "6px",
            fontFamily: "monospace",
            fontSize: "12px",
            whiteSpace: "nowrap",
            border: "1px solid #00B57840",
          }}>
            {result.formatted}
          </div>
        </Html>
      )}
    </group>
  );
}

function LiquidFillHorizontal({ r, h, fillRatio }: { r: number; h: number; fillRatio: number }) {
  const fillH = r * 2 * fillRatio;
  const yOffset = -r + fillH / 2;

  // Create a custom geometry: cylinder clipped at fill height
  // For simplicity, use a box approximation inside the cylinder
  if (fillRatio >= 0.99) {
    return (
      <mesh>
        <cylinderGeometry args={[r * 0.97, r * 0.97, h * 0.98, 64]} />
        <meshPhysicalMaterial color={BLUE} metalness={0.1} roughness={0.1} transparent opacity={0.55} transmission={0.3} ior={1.33} />
      </mesh>
    );
  }

  // Use a segment approach - scaled cylinder
  return (
    <mesh position={[0, yOffset, 0]} scale={[1, fillRatio, 1]}>
      <cylinderGeometry args={[r * 0.97, r * 0.97, h * 0.98, 64]} />
      <meshPhysicalMaterial color={BLUE} metalness={0.1} roughness={0.1} transparent opacity={0.55} transmission={0.3} ior={1.33} />
    </mesh>
  );
}

/* ── Sphere Tank ────────────────────────────────────────────── */

function SphereTank({ r, fillRatio, result }: { r: number; fillRatio: number; result: Props["result"] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Sphere wall */}
      <mesh>
        <sphereGeometry args={[r, 64, 32]} />
        <meshPhysicalMaterial color={NAVY} metalness={0.6} roughness={0.3} transparent opacity={0.2} side={THREE.DoubleSide} clearcoat={0.3} />
      </mesh>

      {/* Support legs (4) */}
      {[0, 90, 180, 270].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const lx = Math.cos(rad) * r * 0.7;
        const lz = Math.sin(rad) * r * 0.7;
        return (
          <mesh key={angle} position={[lx, -r - 0.5, lz]}>
            <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
            <meshStandardMaterial color={NAVY} metalness={0.8} roughness={0.2} />
          </mesh>
        );
      })}

      {/* Liquid fill */}
      {fillRatio > 0 && (
        <mesh position={[0, -r + r * 2 * fillRatio * 0.5, 0]} scale={[1, fillRatio, 1]}>
          <sphereGeometry args={[r * 0.97, 64, 32]} />
          <meshPhysicalMaterial color={BLUE} metalness={0.1} roughness={0.1} transparent opacity={0.55} transmission={0.3} ior={1.33} />
        </mesh>
      )}

      {result && (
        <Html position={[r + 0.8, r + 0.3, 0]} center>
          <div style={{
            background: "rgba(11,31,58,0.9)",
            color: GREEN,
            padding: "4px 10px",
            borderRadius: "6px",
            fontFamily: "monospace",
            fontSize: "12px",
            whiteSpace: "nowrap",
            border: "1px solid #00B57840",
          }}>
            {result.formatted}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ── Cone Tank ──────────────────────────────────────────────── */

function ConeTank({ r, h, fillRatio, result }: { r: number; h: number; fillRatio: number; result: Props["result"] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Cone wall (pointing down) */}
      <mesh rotation={[Math.PI, 0, 0]} position={[0, h / 2, 0]}>
        <coneGeometry args={[r, h, 64, 1, true]} />
        <meshPhysicalMaterial color={NAVY} metalness={0.6} roughness={0.3} transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* Top rim */}
      <mesh position={[0, h / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r, 0.03, 8, 64]} />
        <meshStandardMaterial color={NAVY} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Liquid fill */}
      {fillRatio > 0 && (
        <mesh position={[0, h / 2 - h * fillRatio * 0.5, 0]} rotation={[Math.PI, 0, 0]} scale={[fillRatio, fillRatio, fillRatio]}>
          <coneGeometry args={[r * 0.97, h * fillRatio, 64]} />
          <meshPhysicalMaterial color={BLUE} metalness={0.1} roughness={0.1} transparent opacity={0.55} transmission={0.3} ior={1.33} />
        </mesh>
      )}

      {result && (
        <Html position={[r + 0.8, h / 2 + 0.3, 0]} center>
          <div style={{
            background: "rgba(11,31,58,0.9)",
            color: GREEN,
            padding: "4px 10px",
            borderRadius: "6px",
            fontFamily: "monospace",
            fontSize: "12px",
            whiteSpace: "nowrap",
            border: "1px solid #00B57840",
          }}>
            {result.formatted}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ── Generic Tank (for calculators without geometry) ────────── */

function GenericTank({ fillRatio, result }: { fillRatio: number; result: Props["result"] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  const r = 1.5;
  const h = 3;

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[r, r, h, 64, 1, true]} />
        <meshPhysicalMaterial color={NAVY} metalness={0.6} roughness={0.3} transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -h / 2 + h * fillRatio * 0.5, 0]}>
        <cylinderGeometry args={[r * 0.97, r * 0.97, h * fillRatio, 64]} />
        <meshPhysicalMaterial color={BLUE} metalness={0.1} roughness={0.1} transparent opacity={0.55} transmission={0.3} ior={1.33} />
      </mesh>
      {result && (
        <Html position={[r + 0.8, h / 2 + 0.3, 0]} center>
          <div style={{
            background: "rgba(11,31,58,0.9)",
            color: GREEN,
            padding: "4px 10px",
            borderRadius: "6px",
            fontFamily: "monospace",
            fontSize: "12px",
            whiteSpace: "nowrap",
            border: "1px solid #00B57840",
          }}>
            {result.formatted}
          </div>
        </Html>
      )}
    </group>
  );
}


/* ── Main Export ────────────────────────────────────────────── */

export default function Tank3DVisualization(props: Props) {
  const v = props.values as Record<string, number>;
  const shape = detectShape(v);
  const shapeLabel = shape === "vertical-cylinder" ? "Vertical Cylinder" :
    shape === "horizontal-cylinder" ? "Horizontal Cylinder" :
    shape === "sphere" ? "Sphere" :
    shape === "cone" ? "Cone / Hopper" : "Storage Tank";

  return (
    <div className="p-2 bg-gradient-to-br from-slate-50 to-blue-50" style={{ minHeight: "400px" }}>
      <Canvas
        shadows
        camera={{ position: [4, 3, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)" }}
      >
        <Suspense fallback={null}>
          <TankScene {...props} />
        </Suspense>
      </Canvas>
      <div className="mt-2 flex items-center justify-center gap-3 text-xs font-mono text-muted-foreground">
        <span className="text-navy font-semibold">{shapeLabel}</span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: BLUE, opacity: 0.6 }} /> Liquid
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-sm border" style={{ borderColor: NAVY, background: "transparent" }} /> Wall
        </span>
        <span className="ml-2 text-slate-400">Drag to rotate · Scroll to zoom</span>
      </div>
    </div>
  );
}



