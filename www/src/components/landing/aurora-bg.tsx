"use client";

import { useEffect, useId, useRef } from "react";

const COLOR = [200, 165, 50] as const;

const BLOBS = [
  { x: 0.3, y: 0.3, r: 250 },
  { x: 0.7, y: 0.6, r: 220 },
  { x: 0.5, y: 0.4, r: 200 },
];

export function AuroraBackground({ fill }: { fill?: boolean } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const patternId = useId();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;

      for (const b of BLOBS) {
        const gradient = ctx.createRadialGradient(w * b.x, h * b.y, 0, w * b.x, h * b.y, b.r);
        gradient.addColorStop(0, `rgba(${COLOR[0]},${COLOR[1]},${COLOR[2]},0.8)`);
        gradient.addColorStop(1, `rgba(${COLOR[0]},${COLOR[1]},${COLOR[2]},0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(w * b.x, h * b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }

    };

    draw();

    const observer = new ResizeObserver(draw);
    observer.observe(canvas);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="absolute inset-y-0 z-0 overflow-hidden"
      style={fill ? { left: 0, right: 0 } : { left: "var(--rail-offset)", right: "var(--rail-offset)" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-60 blur-2xl animate-in fade-in duration-700"
      />
      <div className="pointer-events-none absolute inset-0 h-full w-full opacity-30">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id={patternId}
              width="4"
              height="4"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0" y1="0" x2="0" y2="4"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>
    </div>
  );
}
