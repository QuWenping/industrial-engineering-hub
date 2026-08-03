"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Premium Canvas 2D pipe flow particle simulation.
 * Realistic pipe rendering with 3D-like shading, velocity-colored particles
 * with motion trails, parabolic velocity profile, professional annotations.
 */

interface Props {
  values: Record<string, number | string>;
  result: { value: number; unit: string; formatted: string } | null;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  size: number;
  trail: { x: number; y: number }[];
  offset: number;
}

const NAVY = "#0B1F3A";
const BLUE = "#1677FF";
const CYAN = "#00D4FF";
const GREEN = "#00B578";
const SLATE = "#64748B";

function velocityColor(v: number): [string, string] {
  if (v < 1.0) return ["#3B82F6", "#1D4ED8"];
  if (v < 2.5) return ["#06B6D4", "#0891B2"];
  if (v < 5.0) return ["#F59E0B", "#D97706"];
  return ["#EF4444", "#DC2626"];
}

export default function PipeFlowCanvas({ values, result }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const valuesRef = useRef(values);
  const resultRef = useRef(result);

  useEffect(() => { valuesRef.current = values; }, [values]);
  useEffect(() => { resultRef.current = result; }, [result]);

  const initParticles = useCallback((diameter: number, velocity: number) => {
    const particles: Particle[] = [];
    const count = 150;
    const isLaminar = velocity < 2.0;
    for (let i = 0; i < count; i++) {
      const ny = (Math.random() - 0.5) * 1.85;
      const speedFactor = isLaminar
        ? (1 - ny * ny) * (0.85 + Math.random() * 0.3)
        : (0.7 + Math.random() * 0.6);
      particles.push({
        x: Math.random() * 760,
        y: ny,
        vx: Math.max(0.5, velocity * 1.2 * speedFactor),
        size: 1.5 + Math.random() * 2.5,
        trail: [],
        offset: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const v = valuesRef.current as Record<string, number>;
    const diameter = v.diameter || v.pipeDiameter || v.innerDiameter || 100;
    const velocity = v.velocity || v.flowVelocity || 2;
    const res = resultRef.current;

    // Clear with gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, "#F8FAFC");
    bgGrad.addColorStop(1, "#E2E8F0");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Pipe geometry
    const pipeY = H / 2;
    const pipeR = Math.min(75, Math.max(25, diameter * 0.5));
    const pipeStartX = 70;
    const pipeEndX = W - 90;
    const wallT = 8;

    // Pipe wall — 3D-like shading
    // Top wall gradient
    const topGrad = ctx.createLinearGradient(0, pipeY - pipeR - wallT, 0, pipeY - pipeR);
    topGrad.addColorStop(0, NAVY);
    topGrad.addColorStop(0.5, "#334155");
    topGrad.addColorStop(1, "#1E293B");
    ctx.fillStyle = topGrad;
    ctx.fillRect(pipeStartX, pipeY - pipeR - wallT, pipeEndX - pipeStartX, wallT);

    // Bottom wall gradient
    const botGrad = ctx.createLinearGradient(0, pipeY + pipeR, 0, pipeY + pipeR + wallT);
    botGrad.addColorStop(0, "#1E293B");
    botGrad.addColorStop(0.5, "#334155");
    botGrad.addColorStop(1, NAVY);
    ctx.fillStyle = botGrad;
    ctx.fillRect(pipeStartX, pipeY + pipeR, pipeEndX - pipeStartX, wallT);

    // Pipe interior background
    const interiorGrad = ctx.createLinearGradient(0, pipeY - pipeR, 0, pipeY + pipeR);
    interiorGrad.addColorStop(0, "#1E293B");
    interiorGrad.addColorStop(0.5, "#0F172A");
    interiorGrad.addColorStop(1, "#1E293B");
    ctx.fillStyle = interiorGrad;
    ctx.fillRect(pipeStartX, pipeY - pipeR, pipeEndX - pipeStartX, pipeR * 2);

    // Velocity profile background gradient
    const [vColor1, vColor2] = velocityColor(velocity);
    const isLaminar = velocity < 2.0;
    for (let py = pipeY - pipeR; py < pipeY + pipeR; py += 1) {
      const ny = (py - pipeY) / pipeR;
      const intensity = isLaminar ? 1 - ny * ny : Math.pow(1 - Math.abs(ny), 0.3);
      ctx.globalAlpha = Math.max(0.03, intensity * 0.12);
      ctx.fillStyle = vColor1;
      ctx.fillRect(pipeStartX, py, pipeEndX - pipeStartX, 1);
    }
    ctx.globalAlpha = 1;

    // Pipe wall highlight lines
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pipeStartX, pipeY - pipeR - wallT);
    ctx.lineTo(pipeEndX, pipeY - pipeR - wallT);
    ctx.moveTo(pipeStartX, pipeY - pipeR);
    ctx.lineTo(pipeEndX, pipeY - pipeR);
    ctx.moveTo(pipeStartX, pipeY + pipeR);
    ctx.lineTo(pipeEndX, pipeY + pipeR);
    ctx.moveTo(pipeStartX, pipeY + pipeR + wallT);
    ctx.lineTo(pipeEndX, pipeY + pipeR + wallT);
    ctx.stroke();

    // Inlet/outlet flanges
    ctx.fillStyle = NAVY;
    ctx.fillRect(pipeStartX - 15, pipeY - pipeR - wallT - 5, 15, pipeR * 2 + wallT * 2 + 10);
    ctx.fillRect(pipeEndX, pipeY - pipeR - wallT - 5, 15, pipeR * 2 + wallT * 2 + 10);
    // Flange bolts
    ctx.fillStyle = SLATE;
    for (let by = pipeY - pipeR - wallT; by <= pipeY + pipeR + wallT; by += 12) {
      ctx.beginPath();
      ctx.arc(pipeStartX - 7, by, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(pipeEndX + 7, by, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Init particles
    if (particlesRef.current.length === 0) {
      initParticles(diameter, velocity);
    }

    // Draw particles with trails
    const particles = particlesRef.current;
    for (const p of particles) {
      p.x += p.vx * 1.5;
      if (p.x > pipeEndX) {
        p.x = pipeStartX + Math.random() * 20;
        p.trail = [];
      }

      const yPx = pipeY + p.y * (pipeR - 3);
      const pSpeed = velocity * (isLaminar ? (1 - p.y * p.y) : 1);
      const [c1, c2] = velocityColor(pSpeed);

      // Trail
      p.trail.push({ x: p.x, y: yPx });
      if (p.trail.length > 8) p.trail.shift();

      // Draw trail
      if (p.trail.length > 1) {
        ctx.strokeStyle = c1;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = p.size * 0.8;
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let j = 1; j < p.trail.length; j++) {
          ctx.lineTo(p.trail[j].x, p.trail[j].y);
        }
        ctx.stroke();
      }

      // Particle glow
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = c1;
      ctx.beginPath();
      ctx.arc(p.x, yPx, p.size * 2, 0, Math.PI * 2);
      ctx.fill();

      // Particle core
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = c2;
      ctx.beginPath();
      ctx.arc(p.x, yPx, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Velocity profile curve (right side)
    const profileX = pipeEndX + 20;
    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let py = pipeY - pipeR; py <= pipeY + pipeR; py++) {
      const ny = (py - pipeY) / pipeR;
      const speed = isLaminar ? (1 - ny * ny) : Math.pow(1 - Math.abs(ny), 0.3);
      ctx.lineTo(profileX + speed * 25, py);
    }
    ctx.stroke();
    // Profile axis
    ctx.strokeStyle = SLATE;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(profileX, pipeY - pipeR);
    ctx.lineTo(profileX, pipeY + pipeR);
    ctx.stroke();

    // Annotations
    ctx.fillStyle = SLATE;
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`Ø ${diameter} mm`, W / 2, pipeY + pipeR + wallT + 22);
    ctx.fillStyle = vColor1;
    ctx.fillText(`v = ${velocity} m/s`, W / 2, pipeY - pipeR - wallT - 12);

    // Flow direction arrow
    ctx.fillStyle = CYAN;
    ctx.font = "10px monospace";
    ctx.fillText("→ FLOW", W / 2, H - 12);

    // Inlet/outlet labels
    ctx.fillStyle = SLATE;
    ctx.font = "9px monospace";
    ctx.textAlign = "left";
    ctx.fillText("INLET", pipeStartX - 12, pipeY - pipeR - wallT - 10);
    ctx.textAlign = "right";
    ctx.fillText("OUTLET", pipeEndX + 12, pipeY - pipeR - wallT - 10);

    // Result badge
    if (res) {
      const badgeX = W - 160;
      const badgeY = 10;
      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.fillRect(badgeX + 2, badgeY + 2, 148, 42);
      // Background
      ctx.fillStyle = NAVY;
      ctx.fillRect(badgeX, badgeY, 148, 42);
      // Border
      ctx.strokeStyle = GREEN;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(badgeX, badgeY, 148, 42);
      // Text
      ctx.fillStyle = CYAN;
      ctx.font = "8px monospace";
      ctx.textAlign = "left";
      ctx.fillText("FLOW RATE", badgeX + 10, badgeY + 15);
      ctx.fillStyle = GREEN;
      ctx.font = "bold 14px monospace";
      ctx.fillText(res.formatted, badgeX + 10, badgeY + 34);
    }

    animRef.current = requestAnimationFrame(animate);
  }, [initParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 780;
    canvas.height = 240;

    initParticles(
      (values as Record<string, number>).diameter || 100,
      (values as Record<string, number>).velocity || 2
    );
    animate();

    return () => cancelAnimationFrame(animRef.current);
  }, [animate, initParticles, values]);

  return (
    <div className="p-4 bg-gradient-to-b from-slate-50 to-white">
      <canvas ref={canvasRef} className="w-full max-w-2xl mx-auto rounded-xl shadow-sm" style={{ maxHeight: "260px" }} />
      <div className="mt-3 flex items-center justify-center gap-4 text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full shadow-sm" style={{ background: "linear-gradient(135deg,#3B82F6,#1D4ED8)" }} /> Low velocity
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full shadow-sm" style={{ background: "linear-gradient(135deg,#06B6D4,#0891B2)" }} /> Medium
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full shadow-sm" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }} /> High
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full shadow-sm" style={{ background: "linear-gradient(135deg,#EF4444,#DC2626)" }} /> Very High
        </span>
      </div>
    </div>
  );
}

