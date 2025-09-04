'use client';

import { useEffect, useRef } from 'react';

type WavesVariant = 'behind' | 'front';

interface WavesBackgroundProps {
  variant?: WavesVariant; // which layers to draw
  zIndexClass?: string; // tailwind z-index class
  onWaveUpdate?: (y: number) => void; // emits Y position of the middle wave
  baselineRatio?: number; // 0..1 baseline of waves vertically (default 0.4)
  bubbleOptions?: {
    enabled?: boolean;
    density?: number; // approximate bubbles per second
    minRadius?: number; // px
    maxRadius?: number; // px
    speedMin?: number; // px per second
    speedMax?: number; // px per second
    fadeStartRatio?: number; // 0..1 of canvas height from bottom where fading begins
    maxHeightRatio?: number; // 0..1 of canvas height from bottom where bubble is removed
    baseAlpha?: number; // 0..1 starting alpha
  };
}

export function WavesBackground({ variant = 'behind', zIndexClass = 'z-10', onWaveUpdate, baselineRatio = 0.4, bubbleOptions }: WavesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const darkenRef = useRef<number>(0);
  const scrollProgressRef = useRef<number>(0); // 0..1 how deep into the section we are
  const scrollRafRef = useRef<number | null>(null);
  const bubblesRef = useRef<Array<{ x: number; y: number; r: number; vy: number; alpha: number }>>([]);
  const lastTsRef = useRef<number>(0);

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

    // --- Scroll progress tracking (parallax driver) ---
    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const updateScrollProgress = () => {
      const hostSection = canvas.closest('section');
      if (!hostSection) return;
      const rect = hostSection.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when section just starts entering, 1 when it has fully passed
      const total = rect.height + vh;
      const scrolled = vh - rect.top;
      scrollProgressRef.current = clamp01(scrolled / total);
    };
    const onScroll = () => {
      if (scrollRafRef.current != null) return;
      scrollRafRef.current = requestAnimationFrame(() => {
        updateScrollProgress();
        scrollRafRef.current = null;
      });
    };
    updateScrollProgress();
    window.addEventListener('scroll', onScroll, { passive: true });

    const darkenColor = (rgb: string, factor: number) => {
      const [r, g, b] = rgb.split(',').map(v => parseInt(v.trim(), 10));
      const f = Math.max(0, Math.min(1, factor));
      const dr = Math.round(r * (1 - f));
      const dg = Math.round(g * (1 - f));
      const db = Math.round(b * (1 - f));
      return `${dr}, ${dg}, ${db}`;
    };

    const drawWaves = (ts?: number) => {
      const now = typeof ts === 'number' ? ts : performance.now();
      const last = lastTsRef.current || now;
      const dtMs = Math.min(100, now - last); // clamp to avoid huge jumps
      lastTsRef.current = now;
      const dt = dtMs / 1000; // seconds

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- Bubbles (spawn + update) before waves so front wave can occlude ---
      const bo: {
        enabled?: boolean;
        density?: number; // approximate bubbles per second
        minRadius?: number; // px
        maxRadius?: number; // px
        speedMin?: number; // px per second
        speedMax?: number; // px per second
        fadeStartRatio?: number; // 0..1 of canvas height from bottom where fading begins
        maxHeightRatio?: number; // 0..1 of canvas height from bottom where bubble is removed
        baseAlpha?: number; // 0..1 starting alpha
      } = {
        enabled: false,
        density: 6, // bubbles per second (approx)
        minRadius: 2,
        maxRadius: 8,
        speedMin: 40,
        speedMax: 90,
        fadeStartRatio: 0.5,
        maxHeightRatio: 1.0,
        baseAlpha: 0.8,
        ...bubbleOptions,
      };

      if (bo.enabled) {
        // Spawn new bubbles probabilistically per frame
        const expected = (bo.density || 0) * dt;
        // Spawn floor(expected) + maybe one more
        let toSpawn = Math.floor(expected);
        if (Math.random() < expected - toSpawn) toSpawn += 1;
        for (let i = 0; i < toSpawn; i++) {
          const r = (bo.minRadius || 2) + Math.random() * Math.max(0, (bo.maxRadius || 8) - (bo.minRadius || 2));
          const x = Math.random() * canvas.width;
          const y = canvas.height + r + Math.random() * (canvas.height * 0.05);
          const speed = (bo.speedMin || 40) + Math.random() * Math.max(0, (bo.speedMax || 90) - (bo.speedMin || 40));
          const vy = speed; // px/sec upward
          const alpha = Math.max(0, Math.min(1, bo.baseAlpha || 0.8)) * (0.7 + Math.random() * 0.3);
          bubblesRef.current.push({ x, y, r, vy, alpha });
        }

        // Update and draw bubbles
        const fadeStartY = canvas.height * (1 - Math.max(0, Math.min(1, bo.fadeStartRatio || 0.5)));
        const maxHeightY = canvas.height * (1 - Math.max(0, Math.min(1, bo.maxHeightRatio || 1.0)));
        const next: typeof bubblesRef.current = [];
        for (const b of bubblesRef.current) {
          // Move up
          b.y -= b.vy * dt;
          // Fade when above fadeStartY (closer to top)
          if (b.y <= fadeStartY) {
            // fade proportional to how far past fadeStart we are until maxHeightY
            const t = Math.max(0, Math.min(1, (fadeStartY - b.y) / Math.max(1, (fadeStartY - maxHeightY))));
            b.alpha = Math.max(0, b.alpha * (1 - t * 0.9));
          }
          // Cull if above maxHeightY or fully transparent
          if (b.y <= maxHeightY || b.alpha <= 0.03) continue;
          // Draw
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha})`;
          ctx.fill();
          next.push(b);
        }
        // Limit bubble count for performance
        bubblesRef.current = next.slice(-300);
      }

      // Define base waves (back, middle, front)
      const baseWaves = [
        { amplitude: 58.5, frequency: 0.02, speed: 0.02, opacity: 0.5, color: '59, 130, 246' },   // blue (front wave)
        { amplitude: 39, frequency: 0.015, speed: 0.025, opacity: 1, color: '35, 72, 156' },   // darker medium blue
        { amplitude: 48.75, frequency: 0.009, speed: 0.01125, opacity: 1, color: '30, 58, 138' } // dark blue (wider wavelength, speed -25%)
      ];

      // Choose which layers to draw based on variant
      // Front: blue (index 0). Behind: purple (index 2) + teal (index 1) for depth.
      const indices = variant === 'front' ? [0] : [2, 1];
      const waves = indices.map(i => {
        const w = { ...baseWaves[i] };
        if (variant === 'front') {
          // Reduce front wave height by 50%
          w.amplitude = w.amplitude * 0.5;
        } else {
          // Behind waves: slow back wave by 50%, middle wave by 25%
          if (i === 2) w.speed = w.speed * 0.5; // back
          if (i === 1) w.speed = w.speed * 0.75; // middle
        }
        return w;
      });

      // Scroll-driven parallax: front > middle > back, converge to equal as exiting
      const p = scrollProgressRef.current;
      const ps = (p < 0.0001) ? 0 : (p > 0.9999 ? 1 : (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)); // easeInOutCubic inline
      const maxLift = canvas.height * 0.28; // stronger upward shift for max effect
      const depthStartMultiplier = { front: 1.6, middle: 1.3, back: 1.0 } as const; // front fastest, then middle
      // Start with waves lower on screen so the card is not underwater at the beginning
      const startDropPx = canvas.height * 0.20;
      const startOffset = startDropPx * (1 - ps);
      // Depth-based start offset so the front wave starts lowest
      const depthStartOffsetMultiplier = { front: 1.6, middle: 1.1, back: 0.9 } as const;

      waves.forEach((wave, index) => {
        ctx.beginPath();
        // Start from the left bottom corner
        ctx.moveTo(0, canvas.height);

        // Determine depth for this layer and compute vertical shift
        let depth: 'front' | 'middle' | 'back' = 'front';
        if (variant === 'behind') {
          depth = indices[index] === 2 ? 'back' : 'middle';
        } else {
          depth = 'front';
        }
        const startMul = depthStartMultiplier[depth];
        const effectiveMul = startMul + (1 - startMul) * ps; // lerp to 1 as ps -> 1
        const verticalShift = maxLift * ps * effectiveMul;
        const depthStartOffset = startOffset * depthStartOffsetMultiplier[depth];

        // Create wave path
        for (let x = 0; x <= canvas.width; x += 4) {
          const y = canvas.height * baselineRatio - verticalShift + depthStartOffset + Math.sin((x * wave.frequency) + time * wave.speed) * wave.amplitude;
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
          // Start the fade at the crest of the front wave and darken towards the bottom
          const crestY = canvas.height * baselineRatio - verticalShift + depthStartOffset - wave.amplitude;
          // Start higher above the crest so the top is even more transparent over the card/text
          const gradient = ctx.createLinearGradient(0, Math.max(0, crestY - 20), 0, canvas.height);

          // Reference colors for a smooth transition from the front wave into the darker section
          const frontBase = baseWaves[0].color; // lighter blue
          const midBase = baseWaves[1].color;   // medium blue
          const backBase = baseWaves[2].color;  // darkest blue (matches behind/next section tone)

          const frontCol = darkenColor(frontBase, darkenRef.current);
          const midCol = darkenColor(midBase, darkenRef.current);
          const backCol = darkenColor(backBase, darkenRef.current);

          // Softer occlusion with a delayed, slower ramp so the fade is less abrupt
          // Start occlusion after ~15% progress and ease it in more gently
          const occlRaw = Math.max(0, (ps - 0.15) / 0.85);
          const occl = Math.min(1, occlRaw * 0.8); // reduce overall strength
          const scaleAlpha = (a: number) => Math.max(0, Math.min(1, a * (1 + 0.6 * occl)));
          // Deeper, more spread-out stops for a slower fade
          gradient.addColorStop(0.0, `rgba(${frontCol}, ${scaleAlpha(0.04)})`);
          gradient.addColorStop(0.25, `rgba(${midCol}, ${scaleAlpha(0.28)})`);
          gradient.addColorStop(0.55, `rgba(${midCol}, ${scaleAlpha(0.6)})`);
          // Use an extra-darkened bottom color to ensure it matches the next section's dark band
          const extraDarkBottom = darkenColor(backBase, Math.min(1, darkenRef.current + 0.35));
          gradient.addColorStop(0.85, `rgba(${extraDarkBottom}, ${scaleAlpha(0.9)})`);
          gradient.addColorStop(1.0, `rgba(${extraDarkBottom}, ${scaleAlpha(0.98)})`);
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
        const midPs = ps;
        const midVerticalShift = maxLift * midPs * (1.2 + (1 - 1.2) * midPs);
        const middleDepthStartOffset = startOffset * depthStartOffsetMultiplier.middle;
        const y = canvas.height * baselineRatio - midVerticalShift + middleDepthStartOffset + Math.sin((centerX * mid.frequency) + time * mid.speed) * mid.amplitude;
        try {
          onWaveUpdate(y);
        } catch {}
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
      updateScrollProgress();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', onScroll as EventListener);
      mql && mql.removeEventListener && mql.removeEventListener('change', handleSchemeChange);
    };
  }, [variant, onWaveUpdate, baselineRatio, bubbleOptions]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${zIndexClass}`}
      aria-hidden="true"
    />
  );
}