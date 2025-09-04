'use client';

import { useEffect, useRef } from 'react';

interface StarsBackgroundProps {
  className?: string;
  density?: number; // stars per 10,000 px^2
}

export default function StarsBackground({ className = '', density = 0.12 }: StarsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let stars: { x: number; y: number; r: number; baseA: number; speed: number }[] = [];

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      // Recreate stars based on area
      const area = (width * height) / 10000;
      const count = Math.max(50, Math.floor(area * density));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.4,
        baseA: Math.random() * 0.5 + 0.5,
        speed: Math.random() * 0.02 + 0.005,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        const twinkle = (Math.sin(t * s.speed + s.x * 0.01) + 1) * 0.5; // 0..1
        const a = s.baseA * (0.6 + 0.4 * twinkle);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      }
      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
