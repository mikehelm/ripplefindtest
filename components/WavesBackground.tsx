'use client';

import { useEffect, useRef } from 'react';

type WavesVariant = 'behind' | 'front';

interface WavesBackgroundProps {
  variant?: WavesVariant; // which layers to draw
  zIndexClass?: string; // tailwind z-index class
  onWaveUpdate?: (y: number) => void; // emits Y position of the middle wave
  baselineRatio?: number; // 0..1 baseline of waves vertically (default 0.4)
}

export function WavesBackground({ variant = 'behind', zIndexClass = 'z-10', onWaveUpdate, baselineRatio = 0.4 }: WavesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const darkenRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    // Detect dark mode (supports next-themes 'dark' class and prefers-color-scheme)
    const computeDarkenFactor = () => {
      const hasDarkClass = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
      const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return (hasDarkClass || prefersDark) ? 0.2 : 0;
    };

    darkenRef.current = computeDarkenFactor();

    const mql = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const handleSchemeChange = () => {
      darkenRef.current = computeDarkenFactor();
    };
    mql && mql.addEventListener && mql.addEventListener('change', handleSchemeChange);

    const darkenColor = (rgb: string, factor: number) => {
      const [r, g, b] = rgb.split(',').map(v => parseInt(v.trim(), 10));
      const f = Math.max(0, Math.min(1, factor));
      const dr = Math.round(r * (1 - f));
      const dg = Math.round(g * (1 - f));
      const db = Math.round(b * (1 - f));
      return `${dr}, ${dg}, ${db}`;
    };

    const drawWaves = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Define base waves (back, middle, front)
      const baseWaves = [
        { amplitude: 58.5, frequency: 0.02, speed: 0.02, opacity: 0.5, color: '59, 130, 246' },   // blue (front wave)
        { amplitude: 39, frequency: 0.015, speed: 0.025, opacity: 1, color: '35, 72, 156' },   // darker medium blue
        { amplitude: 48.75, frequency: 0.018, speed: 0.015, opacity: 1, color: '30, 58, 138' } // dark blue
      ];

      // Choose which layers to draw based on variant
      // Front: blue (index 0). Behind: purple (index 2) + teal (index 1) for depth.
      const indices = variant === 'front' ? [0] : [2, 1];
      const waves = indices.map(i => baseWaves[i]);

      waves.forEach((wave, index) => {
        ctx.beginPath();
        // Start from the left bottom corner
        ctx.moveTo(0, canvas.height);

        // Create wave path
        for (let x = 0; x <= canvas.width; x += 4) {
          const y = canvas.height * baselineRatio + Math.sin((x * wave.frequency) + time * wave.speed) * wave.amplitude;
          if (x === 0) {
            ctx.lineTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        // Complete the wave shape
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        // Fill with gradient
        if (variant === 'front') {
          const gradient = ctx.createLinearGradient(0, canvas.height * 0.3, 0, canvas.height);
          // Front wave: gradient from light blue to dark blue
          const frontBase = baseWaves[0].color;
          const frontWaveOpacity = baseWaves[0].opacity;
          const backBase = baseWaves[2].color; // Dark blue for the bottom

          const frontWaveColor = darkenColor(frontBase, darkenRef.current);
          const backWaveColor = darkenColor(backBase, darkenRef.current);

          gradient.addColorStop(0, `rgba(${frontWaveColor}, ${frontWaveOpacity})`);
          gradient.addColorStop(1, `rgba(${backWaveColor}, ${frontWaveOpacity})`);
          ctx.fillStyle = gradient;
        } else {
          // Background waves: solid color
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          const c = darkenColor(wave.color, darkenRef.current);
          gradient.addColorStop(0, `rgba(${c}, ${wave.opacity})`);
          gradient.addColorStop(1, `rgba(${c}, ${wave.opacity})`);
          ctx.fillStyle = gradient;
        }
        
        ctx.fill();
      });

      // Emit middle-wave Y position at canvas center for consumers
      if (onWaveUpdate) {
        const mid = baseWaves[1];
        const centerX = canvas.width / 2;
        const y = canvas.height * baselineRatio + Math.sin((centerX * mid.frequency) + time * mid.speed) * mid.amplitude;
        try {
          onWaveUpdate(y);
        } catch {}
      }

      // Add some floating particles/bubbles
      for (let i = 0; i < 5; i++) {
        const x = (time * 0.5 + i * 100) % (canvas.width + 50);
        const y = canvas.height * 0.3 + Math.sin(time * 0.01 + i) * 20;
        
        ctx.beginPath();
        ctx.arc(x, y, (2 + Math.sin(time * 0.02 + i) * 1) * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, 0.8)`;
        ctx.fill();
      }

      time += 1;
      animationRef.current = requestAnimationFrame(drawWaves);
    };

    // Initialize
    resizeCanvas();
    drawWaves();

    // Handle resize
    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      mql && mql.removeEventListener && mql.removeEventListener('change', handleSchemeChange);
    };
  }, [variant, onWaveUpdate, baselineRatio]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${zIndexClass}`}
      aria-hidden="true"
    />
  );
}