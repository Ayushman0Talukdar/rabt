"use client";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

// Utility for cubic-bezier timing
const EASE = [0.22, 1, 0.36, 1];

// Background Atmosphere
function Atmosphere({ scrollYProgress }) {
  // Subtle opacity/gradient/blur shifts
  const opacity = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const blur = useTransform(scrollYProgress, [0, 1], [16, 4]);
  return (
    <motion.div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ opacity }}
    >
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0 w-full h-full"
        style={{ filter: blur.to((b) => `blur(${b}px)`) }}
      >
        <defs>
          <radialGradient id="bg-grad" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor="#0a1931" stopOpacity="1" />
            <stop offset="80%" stopColor="#0a1931" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#050a18" stopOpacity="0.95" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-grad)" />
        {/* Blurred blobs */}
        <ellipse
          cx="30%"
          cy="40%"
          rx="320"
          ry="180"
          fill="#1e3a8a"
          opacity="0.18"
        />
        <ellipse
          cx="70%"
          cy="60%"
          rx="260"
          ry="120"
          fill="#38bdf8"
          opacity="0.10"
        />
        <ellipse
          cx="50%"
          cy="80%"
          rx="400"
          ry="100"
          fill="#64748b"
          opacity="0.08"
        />
      </svg>
    </motion.div>
  );
}

// Digital Grid
function DigitalGrid({ scrollYProgress }) {
  // Faint, drifting grid
  const gridOpacity = useTransform(scrollYProgress, [0, 1], [0.13, 0.22]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  return (
    <motion.svg
      className="absolute inset-0 w-full h-full z-10 pointer-events-none"
      width="100%"
      height="100%"
      style={{ opacity: gridOpacity, y: gridY }}
    >
      <defs>
        <linearGradient id="grid-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopOpacity="0" />
          <stop offset="20%" stopOpacity="0.7" />
          <stop offset="80%" stopOpacity="0.7" />
          <stop offset="100%" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Vertical lines */}
      {[...Array(18)].map((_, i) => (
        <line
          key={i}
          x1={`${(i + 1) * 5.2}%`}
          y1="0%"
          x2={`${(i + 1) * 5.2}%`}
          y2="100%"
          stroke="url(#grid-fade)"
          strokeWidth="0.7"
        />
      ))}
      {/* Horizontal lines */}
      {[...Array(10)].map((_, i) => (
        <line
          key={i}
          x1="0%"
          y1={`${(i + 1) * 8.5}%`}
          x2="100%"
          y2={`${(i + 1) * 8.5}%`}
          stroke="url(#grid-fade)"
          strokeWidth="0.7"
        />
      ))}
    </motion.svg>
  );
}

// Radar Circles & Rings
function RadarSystem({ scrollYProgress }) {
  // Animate formation, rotation, scale, opacity
  // Each ring has its own timing and direction
  const base = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const rotate0 = useTransform(base, (v) => v * 360);
  const scale0 = useTransform(base, [0, 0.2, 1], [0.7, 1, 1.04]);
  const opacity0 = useTransform(base, [0, 0.1, 0.7, 1], [0, 0.22, 0.18, 0.12]);

  const rotate1 = useTransform(base, (v) => -v * 360);
  const scale1 = useTransform(base, [0, 0.2 + 0.18, 1], [0.7, 1, 1.04]);
  const opacity1 = useTransform(
    base,
    [0, 0.1 + 0.18, 0.7, 1],
    [0, 0.22, 0.18, 0.12],
  );

  const rotate2 = useTransform(base, (v) => v * 360);
  const scale2 = useTransform(base, [0, 0.2 + 0.36, 1], [0.7, 1, 1.04]);
  const opacity2 = useTransform(
    base,
    [0, 0.1 + 0.36, 0.7, 1],
    [0, 0.22, 0.18, 0.12],
  );

  const rotate3 = useTransform(base, (v) => -v * 360);
  const scale3 = useTransform(base, [0, 0.2 + 0.54, 1], [0.7, 1, 1.04]);
  const opacity3 = useTransform(
    base,
    [0, 0.1 + 0.54, 0.7, 1],
    [0, 0.22, 0.18, 0.12],
  );

  const rings = [
    {
      r: 90,
      rotate: rotate0,
      scale: scale0,
      opacity: opacity0,
      strokeWidth: 1.5,
      hasDash: false,
    },
    {
      r: 150,
      rotate: rotate1,
      scale: scale1,
      opacity: opacity1,
      strokeWidth: 1,
      hasDash: false,
    },
    {
      r: 210,
      rotate: rotate2,
      scale: scale2,
      opacity: opacity2,
      strokeWidth: 1,
      hasDash: false,
    },
    {
      r: 270,
      rotate: rotate3,
      scale: scale3,
      opacity: opacity3,
      strokeWidth: 1,
      hasDash: true,
    },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
      <svg width="700" height="700" viewBox="0 0 700 700" className="block">
        {/* Center Glow */}
        <motion.circle
          cx="350"
          cy="350"
          r="38"
          fill="#38bdf8"
          style={{
            opacity: base.to([0, 0.08, 0.18, 1], [0, 0.18, 0.32, 0.12]),
          }}
          filter="blur(18px)"
        />
        {/* Main Radar Rings */}
        {rings.map((ring, i) => {
          return (
            <motion.circle
              key={i}
              cx="350"
              cy="350"
              r={ring.r}
              fill="none"
              stroke="#60a5fa"
              strokeWidth={ring.strokeWidth}
              strokeDasharray={Math.PI * 2 * ring.r * (ring.hasDash ? 0.7 : 1)}
              strokeDashoffset={base.to((v) => (1 - v) * Math.PI * 2 * ring.r)}
              style={{
                rotate: ring.rotate,
                scale: ring.scale,
                opacity: ring.opacity,
              }}
              filter="url(#glow)"
            />
          );
        })}
        {/* Segmented Arcs */}
        {[...Array(7)].map((_, i) => {
          const r = 180 + i * 32;
          const start = 60 * i;
          const end = start + 80 + i * 7;
          const dash = (Math.PI * r * (end - start)) / 180;
          return (
            <motion.circle
              key={i + 10}
              cx="350"
              cy="350"
              r={r}
              fill="none"
              stroke="#7dd3fc"
              strokeWidth={0.7}
              strokeDasharray={`${dash} ${Math.PI * 2 * r - dash}`}
              strokeDashoffset={base.to((v) => (1 - v) * dash)}
              style={{ opacity: base.to([0, 0.3, 1], [0, 0.13, 0.09]) }}
              filter="url(#glow)"
            />
          );
        })}
        {/* SVG filter for glow */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}

// Glowing Connection Lines
function ConnectionLines({ scrollYProgress }) {
  // Animate lines tracing, glowing, pulsing
  const base = useTransform(scrollYProgress, [0, 1], [0, 1]);
  // Example: 3 engineered paths
  const lines = [
    "M180,400 Q350,320 520,400",
    "M350,180 Q420,350 350,520",
    "M220,220 Q350,350 480,220",
  ];
  return (
    <svg
      width="700"
      height="700"
      viewBox="0 0 700 700"
      className="absolute inset-0 z-30 pointer-events-none"
    >
      {lines.map((d, i) => {
        const length = 600;
        return (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={length}
            strokeDashoffset={base.to((v) => (1 - v) * length)}
            style={{ opacity: base.to([0, 0.2, 1], [0, 0.18, 0.12]) }}
            filter="url(#glow)"
          />
        );
      })}
    </svg>
  );
}

// Particle System
function Particles({ scrollYProgress }) {
  // 12 particles orbiting, drifting, pulsing
  const base = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <svg
      width="700"
      height="700"
      viewBox="0 0 700 700"
      className="absolute inset-0 z-40 pointer-events-none"
    >
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = 220 + (i % 3) * 60;
        // Animate orbit
        const x = 350 + Math.cos(angle) * r;
        const y = 350 + Math.sin(angle) * r;
        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={3 + (i % 2)}
            fill="#7dd3fc"
            style={{
              opacity: base.to([0, 0.3, 1], [0, 0.22, 0.13]),
              scale: base.to([0, 0.5, 1], [0.7, 1.1, 1]),
            }}
            filter="url(#glow)"
          />
        );
      })}
    </svg>
  );
}

// Vignette & Mask
function Vignette() {
  return (
    <div
      className="absolute inset-0 z-50 pointer-events-none"
      style={{
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 60% at 50% 50%, white 80%, transparent 100%)",
      }}
    />
  );
}

// Main Cinematic Background Component
export default function CinematicBackground() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={ref}
      className="fixed inset-0 w-full h-full overflow-hidden z-0 select-none"
    >
      <Atmosphere scrollYProgress={scrollYProgress} />
      <DigitalGrid scrollYProgress={scrollYProgress} />
      <RadarSystem scrollYProgress={scrollYProgress} />
      <ConnectionLines scrollYProgress={scrollYProgress} />
      <Particles scrollYProgress={scrollYProgress} />
      <Vignette />
    </div>
  );
}
