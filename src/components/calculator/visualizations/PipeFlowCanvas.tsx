"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Canvas 2D pipe flow particle simulation.
 * Particles colored by velocity (blue → cyan → amber → red).
 * Parabolic velocity profile for laminar flow, flat for turbulent.
 * Zero dependency, client-side only.
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
  offset: number;
}

const NAVY = "#0B1F3A";
const BLUE = "#1677FF";
const CYAN = "#00D4FF";
const SLATE = "#64748B";

export default function PipeFlowCanvas({ values, result }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const valuesRef = useRef(values);
  const resultRef = useRef(result);

  useEffect(() => { valuesRef.current = values; }, [values]);
  useEffect(() => { resultRef.current = result; }, [result]);

  const velocityColor = (v: number): string => {
    if (v < 1.0) return BLUE;
    if (v < 2.5) return CYAN;
    if (v < 5.0) return "#F59E0B";
    return "#EF4444";
  };

  const initParticles = useCallback((diameterMm: number, velocity: number) => {
    const particles: Particle[] = [];
    const count = 120;
    const isLaminar = velocity < 2.0;
    for (let i = 0; i < count; i++) {
      const ny = (Math.random() - 0.5) * 1.8;
      const speedFactor = isLaminar
        ? (1 - ny * ny) * (0.85 + Math.random() * 0.3)
        : (0.7 + Math.random() * 0.6);
      particles.push({
        x: Math.random() * 720,
        y: ny,
        vx: Math.max(0.5, velocity * 0.8 * speedFactor),
        size: 1.5 + Math.random() * 2.5,
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

    // Clear
    ctx.fillStyle = "#F8FAFC";
    ctx.fillRect(0, 0, W, H);

    // Pipe dimensions
    const pipeY = H / 2;
    const pipeR = Math.min(80, Math.max(25, diameter * 0.6));
    const pipeStartX = 60;
    const pipeEndX = W - 60;
    const wallT = 10;

    // Pipe walls
    ctx.fillStyle = NAVY;
    ctx.fillRect(pipeStartX, pipeY - pipeR - wallT, pipeEndX - pipeStartX, wallT);
    ctx.fillRect(pipeStartX, pipeY + pipeR, pipeEndX - pipeStartX, wallT);

    // Pipe interior gradient (velocity profile)
    const color = velocityColor(velocity);
    const isLaminar = velocity < 2.0;
    for (let py = pipeY - pipeR; py < pipeY + pipeR; py += 2) {
      const ny = (py - pipeY) / pipeR;
      const intensity = isLaminar
        ? 1 - ny * ny
        : Math.pow(1 - Math.abs(ny), 0.3);
      ctx.globalAlpha = Math.max(0.05, intensity * 0.15);
      ctx.fillStyle = color;
      ctx.fillRect(pipeStartX, py, pipeEndX - pipeStartX, 2);
    }
    ctx.globalAlpha = 1;

    // Flow direction arrows
    ctx.strokeStyle = SLATE;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(pipeStartX - 20, pipeY);
    ctx.lineTo(pipeStartX, pipeY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Init particles if empty
    if (particlesRef.current.length === 0 || particlesRef.current.length < 60) {
      initParticles(diameter, velocity);
    }

    // Draw particles
    const particles = particlesRef.current;
    const dt = 1 / 60;
    for (const p of particles) {
      p.x += p.vx * 20 * dt;
      if (p.x > pipeEndX) p.x = pipeStartX + Math.random() * 20;

      const yPx = pipeY + p.y * (pipeR - 4);
      const pColor = velocityColor(velocity * (isLaminar ? (1 - p.y * p.y) : 1));

      ctx.beginPath();
      ctx.arc(p.x, yPx, p.size, 0, Math.PI * 2);
      ctx.fillStyle = pColor;
      ctx.globalAlpha = 0.7;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Labels
    ctx.fillStyle = SLATE;
    ctx.font = "11px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`Ø ${diameter} mm`, W / 2, pipeY + pipeR + wallT + 22);
    ctx.fillText(`v = ${velocity} m/s`, W / 2, pipeY - pipeR - wallT - 14);
    ctx.fillText("→ Flow Direction", W / 2, H - 16);

    // Velocity profile overlay (right side)
    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const profileX = pipeEndX + 15;
    for (let py = pipeY - pipeR; py <= pipeY + pipeR; py++) {
      const ny = (py - pipeY) / pipeR;
      const speed = isLaminar ? (1 - ny * ny) : Math.pow(1 - Math.abs(ny), 0.3);
      ctx.lineTo(profileX + speed * 30, py);
    }
    ctx.stroke();
    ctx.strokeStyle = SLATE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(profileX, pipeY - pipeR);
    ctx.lineTo(profileX, pipeY + pipeR);
    ctx.stroke();

    // Result badge
    if (res) {
      ctx.fillStyle = "#00B578";
      ctx.globalAlpha = 0.1;
      ctx.fillRect(W - 145, 8, 130, 34);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#00B578";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(W - 145, 8, 130, 34);
      ctx.fillStyle = "#64748B";
      ctx.font = "9px monospace";
      ctx.textAlign = "left";
      ctx.fillText("FLOW RATE", W - 138, 20);
      ctx.fillStyle = "#00B578";
      ctx.font = "12px monospace";
      ctx.fillText(res.formatted, W - 138, 36);
    }

    animRef.current = requestAnimationFrame(animate);
  }, [initParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 760;
    canvas.height = 220;

    initParticles(
      (values as Record<string, number>).diameter || 100,
      (values as Record<string, number>).velocity || 2
    );
    animate();

    return () => cancelAnimationFrame(animRef.current);
  }, [animate, initParticles, values]);

  return (
    <div className="p-4 bg-light-bg">
      <canvas ref={canvasRef} className="w-full max-w-2xl mx-auto rounded-lg" style={{ maxHeight: "240px" }} />
      <div className="mt-2 flex items-center justify-center gap-4 text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{ background: BLUE }} /> Low</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{ background: CYAN }} /> Medium</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{ background: "#F59E0B" }} /> High</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{ background: "#EF4444" }} /> Very High</span>
        <span className="ml-2 text-slate-400">Velocity →</span>
      </div>
    </div>
  );
}
