'use client';

import { useEffect, useRef } from 'react';

export function WavesBackground() {
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

      // Create multiple wave layers for depth
      const waves = [
        { amplitude: 58.5, frequency: 0.02, speed: 0.02, opacity: 0.5, color: '59, 130, 246' },
        { amplitude: 39, frequency: 0.015, speed: 0.025, opacity: 0.4, color: '20, 184, 166' },
        { amplitude: 48.75, frequency: 0.018, speed: 0.015, opacity: 0.35, color: '99, 102, 241' },
      ];

      waves.forEach((wave, index) => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 0.5);

        // Draw wave path
        for (let x = 0; x <= canvas.width; x += 2) {
          const y = canvas.height * 0.5 + 
                   Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude +
                   Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 1.5) * (wave.amplitude * 0.5);
          ctx.lineTo(x, y);
        }

        // Complete the wave shape
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        // Fill with gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, `rgba(${wave.color}, ${wave.opacity})`);
        gradient.addColorStop(1, `rgba(${wave.color}, ${wave.opacity * 0.5})`);
        
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-5"
      aria-hidden="true"
    />
  );
}