'use client';

import { useEffect, useRef } from 'react';

type WavesVariant = 'behind' | 'front';

interface WavesBackgroundProps {
  variant?: WavesVariant; // which layers to draw
  zIndexClass?: string; // tailwind z-index class
}

export function WavesBackground({ variant = 'behind', zIndexClass = 'z-10' }: WavesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

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

    const drawWaves = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Define base waves (back, middle, front)
      const baseWaves = [
        { amplitude: 58.5, frequency: 0.02, speed: 0.02, opacity: 0.5, color: '59, 130, 246' },   // blue
        { amplitude: 39, frequency: 0.015, speed: 0.025, opacity: 0.4, color: '20, 184, 166' },   // teal
        { amplitude: 48.75, frequency: 0.018, speed: 0.015, opacity: 0.35, color: '99, 102, 241' } // indigo (front)
      ];

      // Choose which layers to draw based on variant
      // Front: blue (index 0). Behind: purple (index 2) + teal (index 1) for depth.
      const indices = variant === 'front' ? [0] : [2, 1];
      const waves = indices.map(i => baseWaves[i]);

      waves.forEach((wave, index) => {
        ctx.beginPath();
        const baseY = canvas.height * 0.5 + (variant === 'front' ? canvas.height * 0.05 : 0);
        ctx.moveTo(0, baseY);

        // Draw wave path
        const amp = wave.amplitude * (variant === 'front' ? 0.5 : 1);
        for (let x = 0; x <= canvas.width; x += 2) {
          const y = baseY + 
                   Math.sin(x * wave.frequency + time * wave.speed) * amp +
                   Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 1.5) * (amp * 0.5);
          ctx.lineTo(x, y);
        }

        // Complete the wave shape
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        // Fill with gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        const opacityTop = wave.opacity * (variant === 'front' ? 0.9 : 1);
        const opacityBottom = (wave.opacity * 0.5) * (variant === 'front' ? 0.9 : 1);
        gradient.addColorStop(0, `rgba(${wave.color}, ${opacityTop})`);
        gradient.addColorStop(1, `rgba(${wave.color}, ${opacityBottom})`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
      });

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
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${zIndexClass}`}
      aria-hidden="true"
    />
  );
}