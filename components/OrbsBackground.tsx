import React, { useEffect, useRef } from 'react';

interface OrbsBackgroundProps {
  className?: string;
  density?: number; // approximate orbs per 10k px^2
  minRadius?: number;
  maxRadius?: number;
  minSpeed?: number; // px/s
  maxSpeed?: number; // px/s
  alpha?: number; // base opacity 0..1
}

export default function OrbsBackground({
  className = '',
  density = 0.06,
  minRadius = 6,
  maxRadius = 16,
  minSpeed = 18,
  maxSpeed = 42,
  alpha = 0.18,
}: OrbsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    type Orb = {
      x: number;
      y: number;
      r: number;
      speed: number; // horizontal speed
      phase: number; // for vertical sine drift
      amp: number; // vertical amplitude
      a: number; // alpha
    };

    let orbs: Orb[] = [];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const createOrb = (spawnLeft: boolean): Orb => ({
      x: spawnLeft ? -rand(10, 60) : rand(width * 0.05, width * 0.3),
      y: rand(height * 0.05, height * 0.55),
      r: rand(minRadius, maxRadius),
      speed: rand(minSpeed, maxSpeed) * (spawnLeft ? 1 : 1),
      phase: rand(0, Math.PI * 2),
      amp: rand(6, 20),
      a: alpha * (0.7 + Math.random() * 0.6),
    });

    const reseed = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      const areaUnits = (width * height) / 10000;
      const count = Math.max(8, Math.floor(areaUnits * density));
      orbs = Array.from({ length: count }, (_, i) => createOrb(true));
      // spread across width a bit
      orbs.forEach((o, i) => (o.x = rand(0, width)));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const dt = 1 / 60; // simple fixed timestep good enough for subtle drift

      for (let i = 0; i < orbs.length; i++) {
        const o = orbs[i];
        o.x += o.speed * dt;
        o.y += Math.sin(t * 0.0015 + o.phase) * 0.2; // very gentle bob

        // recycle when off the right edge
        if (o.x - o.r > width + 40) {
          orbs[i] = createOrb(true);
        }

        // draw
        const grd = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        grd.addColorStop(0, `rgba(255,255,255,${o.a})`);
        grd.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    reseed();
    const ro = new ResizeObserver(reseed);
    ro.observe(canvas);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [alpha, density, maxRadius, maxSpeed, minRadius, minSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
