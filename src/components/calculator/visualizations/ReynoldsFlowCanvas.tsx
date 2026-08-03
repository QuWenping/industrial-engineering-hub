"use client";

import { useEffect, useRef } from "react";

/**
 * Reynolds Number flow visualization.
 * Shows side-by-side laminar vs turbulent flow comparison.
 * Particle color and behavior changes based on Reynolds number.
 * Zero dependency, client-side Canvas.
 */

interface Props {
  values: Record<string, number | string>;
  result: { value: number; unit: string; formatted: string } | null;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
}

const NAVY = "#0B1F3A";
const BLUE = "#1677FF";
const CYAN = "#00D4FF";
const GREEN = "#00B578";
const AMBER = "#F59E0B";
const RED = "#EF4444";
const SLATE = "#64748B";

export default function ReynoldsFlowCanvas({ values, result }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const resultRef = useRef(result);
  const valuesRef = useRef(values);

  useEffect(() => { resultRef.current = result; }, [result]);
  useEffect(() => { valuesRef.current = values; }, [values]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 760;
    canvas.height = 280;
    const W = canvas.width;
    const H = canvas.height;

    // Two channels: top = laminar, bottom = turbulent
    const lamY = H * 0.25;
    const turY = H * 0.7;
    const channelH = 60;
    const startX = 70;
    const endX = W - 70;

    const lamParticles: Particle[] = [];
    const turParticles: Particle[] = [];

    const initParticles = () => {
      lamParticles.length = 0;
      turParticles.length = 0;
      for (let i = 0; i < 60; i++) {
        lamParticles.push({
          x: startX + Math.random() * (endX - startX),
          y: lamY + (Math.random() - 0.5) * channelH * 0.8,
          vx: 1.5 + Math.random() * 0.5,
          vy: 0,
          size: 2 + Math.random() * 1.5,
          life: 1,
        });
      }
      for (let i = 0; i < 60; i++) {
        turParticles.push({
          x: startX + Math.random() * (endX - startX),
          y: turY + (Math.random() - 0.5) * channelH * 0.8,
          vx: 1 + Math.random() * 2,
          vy: (Math.random() - 0.5) * 0.8,
          size: 2 + Math.random() * 2,
          life: Math.random(),
        });
      }
    };

    initParticles();

    const animate = () => {
      const res = resultRef.current;
      const re = res?.value || 2000;
      const isLaminar = re < 2300;
      const isTurbulent = re > 4000;
      const isTransitional = !isLaminar && !isTurbulent;

      // Clear
      ctx.fillStyle = "#F8FAFC";
      ctx.fillRect(0, 0, W, H);

      // Channel walls
      ctx.fillStyle = NAVY;
      // Laminar channel
      ctx.fillRect(startX - 10, lamY - channelH / 2 - 6, endX - startX + 20, 6);
      ctx.fillRect(startX - 10, lamY + channelH / 2, endX - startX + 20, 6);
      // Turbulent channel
      ctx.fillRect(startX - 10, turY - channelH / 2 - 6, endX - startX + 20, 6);
      ctx.fillRect(startX - 10, turY + channelH / 2, endX - startX + 20, 6);

      // Labels
      ctx.font = "12px monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = isLaminar ? GREEN : SLATE;
      ctx.fillText("Laminar (Re < 2300)", startX - 5, lamY - channelH / 2 - 14);
      ctx.fillStyle = isTurbulent ? RED : SLATE;
      ctx.fillText("Turbulent (Re > 4000)", startX - 5, turY - channelH / 2 - 14);

      // Flow indicator
      ctx.fillStyle = SLATE;
      ctx.font = "10px monospace";
      ctx.textAlign = "center";
      const regimeLabel = isLaminar ? "← LAMINAR FLOW" : isTurbulent ? "← TURBULENT FLOW" : "← TRANSITIONAL";
      ctx.fillStyle = isLaminar ? GREEN : isTurbulent ? RED : AMBER;
      ctx.fillText(regimeLabel, W / 2, H - 12);

      // Laminar particles — smooth parallel lines
      for (const p of lamParticles) {
        // Parabolic velocity profile
        const ny = (p.y - lamY) / (channelH / 2);
        p.vx = 2.0 * (1 - ny * ny * 0.6);
        p.x += p.vx;
        p.vy = 0; // no vertical motion

        if (p.x > endX) p.x = startX;
        p.y = lamY + ny * (channelH / 2 - 4);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isLaminar ? BLUE : `${BLUE}60`;
        ctx.globalAlpha = isLaminar ? 0.8 : 0.3;
        ctx.fill();

        // Streamline trail
        if (isLaminar) {
          ctx.strokeStyle = `${BLUE}30`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x - 15, p.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // Turbulent particles — chaotic motion
      for (const p of turParticles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += (Math.random() - 0.5) * 0.15;
        p.vy = Math.max(-1.5, Math.min(1.5, p.vy));
        p.life -= 0.005;

        if (p.x > endX || p.life < 0) {
          p.x = startX;
          p.y = turY + (Math.random() - 0.5) * channelH * 0.8;
          p.life = 1;
          p.vy = (Math.random() - 0.5) * 0.8;
        }

        // Bounce off walls
        if (Math.abs(p.y - turY) > channelH / 2 - 4) {
          p.vy *= -0.8;
          p.y = turY + Math.sign(p.y - turY) * (channelH / 2 - 4);
        }

        // Vortex color
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const color = speed > 2 ? RED : speed > 1.5 ? AMBER : CYAN;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isTurbulent ? color : `${color}40`;
        ctx.globalAlpha = (isTurbulent ? 0.7 : 0.2) * p.life;
        ctx.fill();

        // Eddy trail
        if (isTurbulent && Math.random() < 0.1) {
          ctx.strokeStyle = `${RED}20`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4 + Math.random() * 6, 0, Math.PI * 1.5);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // Reynolds number badge
      if (res) {
        ctx.fillStyle = isLaminar ? GREEN : isTurbulent ? RED : AMBER;
        ctx.globalAlpha = 0.1;
        ctx.fillRect(W - 160, 8, 145, 36);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = isLaminar ? GREEN : isTurbulent ? RED : AMBER;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(W - 160, 8, 145, 36);
        ctx.fillStyle = SLATE;
        ctx.font = "9px monospace";
        ctx.textAlign = "left";
        ctx.fillText("REYNOLDS NUMBER", W - 153, 20);
        ctx.fillStyle = isLaminar ? GREEN : isTurbulent ? RED : AMBER;
        ctx.font = "14px monospace";
        ctx.fillText(`Re = ${res.value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`, W - 153, 36);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="p-4 bg-light-bg">
      <canvas ref={canvasRef} className="w-full max-w-2xl mx-auto rounded-lg" style={{ maxHeight: "300px" }} />
      <div className="mt-2 flex items-center justify-center gap-4 text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{ background: BLUE }} /> Smooth streamlines</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{ background: CYAN }} /> Low turbulence</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{ background: AMBER }} /> Medium</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{ background: RED }} /> High turbulence</span>
      </div>
    </div>
  );
}
