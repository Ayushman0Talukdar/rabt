"use client";
import { BasilYoutubeOutline } from "@/components/icons/youtubeicon";
import { FeInstagram } from "@/components/icons/instaicon";
import { LineMdTiktok } from "@/components/icons/tiktokicon";
import { UitLinkedinAlt } from "@/components/icons/linkedin";
import { RiTwitterXFill } from "@/components/icons/Xicon";
import { RiThreadsFill } from "@/components/icons/threadsicon";

import { useEffect, useRef, useCallback } from "react";
import styles from "./ContentFlywheel.module.css";
// import { Particles } from "@/components/ui/particles";
import Strands from "@/components/Strands";

const NODE_SCALE = 0.85;
const NODES = [
  {
    id: "youtube",
    label: "YouTube Shorts",
    x: 0,
    y: -240,
    bg: "#1e0808",
    ic: "#e03434",
    icon: "youtube",
  },
  {
    id: "instagram",
    label: "Instagram Reels",
    x: 208,
    y: -120,
    bg: "#1a060f",
    ic: "#d04070",
    icon: "instagram",
  },
  {
    id: "tiktok",
    label: "TikTok Videos",
    x: 208,
    y: 120,
    bg: "#0c0c18",
    ic: "#a0a8d8",
    icon: "tiktok",
  },
  {
    id: "linkedin",
    label: "LinkedIn Posts",
    x: 0,
    y: 240,
    bg: "#050c1a",
    ic: "#3a8fdd",
    icon: "linkedin",
  },
  {
    id: "xPosts",
    label: "X Posts",
    x: -208,
    y: 120,
    bg: "#0d0d0d",
    ic: "#c8c8c8",
    icon: "x",
  },
  {
    id: "Threads",
    label: "Threads",
    x: -208,
    y: -120,
    bg: "#080d06",
    ic: "#58b058",
    icon: "podcast",
  },
].map((node) => ({ ...node, x: node.x * NODE_SCALE, y: node.y * NODE_SCALE }));

function hexToRgba(hex, alpha) {
  const cleaned = hex.replace("#", "");
  const bigint = parseInt(
    cleaned.length === 3
      ? cleaned
        .split("")
        .map((c) => c + c)
        .join("")
      : cleaned,
    16,
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

/** Point on quadratic bezier from (0,0) through control point to (nx,ny) at t */
function bezierPoint(nx, ny, t) {
  const dist = Math.sqrt(nx * nx + ny * ny);
  const px = -ny / dist;
  const py = nx / dist;
  const cpx = nx * 0.5 + px * 20;
  const cpy = ny * 0.5 + py * 20;
  const mt = 1 - t;
  return {
    x: 2 * mt * t * cpx + t * t * nx,
    y: 2 * mt * t * cpy + t * t * ny,
  };
}

/** Build a partial bezier path from center to t (0→1) via ~30 line segments */
function partialBezierPath(nx, ny, endT) {
  const steps = 30;
  let d = "M 0 0";
  for (let s = 1; s <= steps; s++) {
    const t = (s / steps) * endT;
    const pt = bezierPoint(nx, ny, t);
    d += ` L ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
  }
  return d;
}

/** Label position — pushed outward past node edge */
function labelPos(node) {
  const dist = Math.sqrt(node.x * node.x + node.y * node.y);
  const ux = node.x / dist;
  const uy = node.y / dist;
  // For top/bottom nodes push further vertically
  const offset = Math.abs(node.x) < 20 ? 40 : 32;
  return {
    lx: node.x + ux * offset,
    ly: node.y + uy * offset,
  };
}

function textAnchor(x) {
  if (x > 20) return "start";
  if (x < -20) return "end";
  return "middle";
}

function dominantBaseline(node) {
  if (Math.abs(node.x) < 20) return node.y < 0 ? "auto" : "hanging";
  return "central";
}

function NodeIcon({ type, color }) {
  const glowRect = (
    <g filter="url(#nodeGlow)">
      <rect
        x={-36}
        y={-36}
        width={72}
        height={72}
        rx={22}
        fill="none"
        stroke={color}
        strokeWidth="3"
        opacity="0.1"
        blur="0.5"
      />
    </g>
  );

  switch (type) {
    case "youtube":
      return (
        <g>
          {glowRect}
          <rect
            x={-35}
            y={-35}
            width={70}
            height={70}
            rx={20}
            fill="#18181b"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1.2"
          />
          <BasilYoutubeOutline width={40} height={40} x={-19} y={-20} />
        </g>
      );
    case "instagram":
      return (
        <g>
          {glowRect}
          <rect
            x={-35}
            y={-35}
            width={70}
            height={70}
            rx={20}
            fill="#18181b"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1.2"
          />
          <FeInstagram width={40} height={40} x={-19} y={-20} />
        </g>
      );
    case "tiktok":
      return (
        <g>
          {glowRect}
          <rect
            x={-35}
            y={-35}
            width={70}
            height={70}
            rx={20}
            fill="#18181b"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1.2"
          />
          <LineMdTiktok width={25} height={25} x={-12} y={-12} />
        </g>
      );
    case "linkedin":
      return (
        <g>
          {glowRect}
          <rect
            x={-35}
            y={-35}
            width={70}
            height={70}
            rx={20}
            fill="#18181b"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1.2"
          />
          <UitLinkedinAlt width={40} height={40} x={-19} y={-20} />
        </g>
      );
    case "x":
      return (
        <g>
          {glowRect}
          <rect
            x={-35}
            y={-35}
            width={70}
            height={70}
            rx={20}
            fill="#18181b"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1.2"
          />
          <RiTwitterXFill width={40} height={40} x={-19} y={-20} />
        </g>
      );
    case "podcast":
      return (
        <g>
          {glowRect}
          <rect
            x={-35}
            y={-35}
            width={70}
            height={70}
            rx={20}
            fill="#18181b"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1.2"
          />
          <RiThreadsFill width={40} height={40} x={-19} y={-20} />
        </g>
      );
    default:
      return null;
  }
}

export default function ContentFlywheel({
  centerLabel = "rabt.",
  eyebrow = "Turn your recording into dozens of assets",
  title = "Content System",
  subtitle = "One piece of content, repurposed across every platform — optimized for each algorithm.",
  scrollMultiplier = 5,
}) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const scrollHintRef = useRef(null);
  const centerBlobRef = useRef(null);

  // Per-node imperative refs
  const lineRefs = useRef([]); // <path> elements for growing lines
  const tipDotRefs = useRef([]); // <circle> tip dots
  const nodeGroupRefs = useRef([]); // <g> circle+icon groups
  const labelRefs = useRef([]); // <text> labels

  const applyProgress = useCallback((progress) => {
    const header = headerRef.current;
    const scrollHint = scrollHintRef.current;
    const centerBlob = centerBlobRef.current;
    if (!header || !scrollHint || !centerBlob) return;

    // Header
    const hP = easeOut(Math.min(1, progress / 0.15));
    header.style.opacity = String(hP);
    header.style.transform = `translateY(${(1 - hP) * 10}px)`;

    // Scroll hint
    scrollHint.style.opacity =
      progress < 0.06 ? String(1 - progress / 0.06) : "0";

    // Center blob
    const blobP = easeOut(Math.min(1, progress / 0.1));
    centerBlob.style.opacity = String(blobP);
    centerBlob.style.transform = `scale(${0.3 + 0.7 * blobP})`;

    // Nodes
    const N = NODES.length;
    const animStart = 0.08;
    const animEnd = 1.0;
    const segSize = (animEnd - animStart) / N;

    NODES.forEach((node, i) => {
      const start = animStart + i * segSize;
      const end = start + segSize;
      const raw = Math.max(0, Math.min(1, (progress - start) / (end - start)));
      const np = easeOut(raw);

      // Line grows from center outward
      const lineEl = lineRefs.current[i];
      const tipEl = tipDotRefs.current[i];
      if (lineEl && tipEl) {
        if (raw === 0) {
          lineEl.setAttribute("d", "");
          tipEl.setAttribute("opacity", "0");
        } else {
          lineEl.setAttribute("d", partialBezierPath(node.x, node.y, np));
          lineEl.setAttribute("opacity", "0.9");
          const tip = bezierPoint(node.x, node.y, np);
          tipEl.setAttribute("cx", tip.x.toFixed(2));
          tipEl.setAttribute("cy", tip.y.toFixed(2));
          tipEl.setAttribute("opacity", np < 1 ? String(np * 0.9) : "0");
        }
      }

      // Node scale + fade
      const nodeEl = nodeGroupRefs.current[i];
      if (nodeEl) {
        nodeEl.style.opacity = String(np);
        nodeEl.style.transform = `translate(${node.x}px,${node.y}px) scale(${0.2 + 0.8 * np})`;
        nodeEl.style.transformOrigin = `${node.x}px ${node.y}px`;
      }

      // Label fades in after node
      const labelRaw = Math.max(
        0,
        Math.min(1, (progress - (start + segSize * 0.4)) / (segSize * 0.6)),
      );
      const labelEl = labelRefs.current[i];
      if (labelEl) labelEl.setAttribute("opacity", String(easeOut(labelRaw)));
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let isVisible = false;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        applyProgress(getProgress());
      }
    }, { threshold: 0.01 });
    observer.observe(section);

    function getProgress() {
      const rect = section.getBoundingClientRect();
      const zone = section.offsetHeight - window.innerHeight;
      return Math.max(0, Math.min(1, -rect.top / Math.max(1, zone)));
    }

    let ticking = false;
    const onScroll = () => {
      if (!isVisible) return;
      if (!ticking) {
        requestAnimationFrame(() => {
          applyProgress(getProgress());
          ticking = false;
        });
        ticking = true;
      }
    };

    const onResize = () => {
      if (isVisible) {
        applyProgress(getProgress());
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    applyProgress(0);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, [applyProgress]);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section}`}
      style={{ height: `${scrollMultiplier * 100}vh` }}
    >
      <div className={styles.stickyViewport}>

        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 100, pointerEvents: 'none', zIndex: 0 }}>
          {/* <Strands
            colors={["#e8e8e8", "#0051f1", "#1c004f"]}
            count={15}
            speed={0.3}
            amplitude={0.5}
            waviness={0.1}
            thickness={0.5}
            glow={0.3}
            taper={0}
            spread={0.7}
            intensity={0.85}
            saturation={2}
            opacity={0.2}
            scale={3}
            glass={false}
            refraction={1}
            dispersion={1}
            glassSize={1}
            hueShift={0}
          /> */}
        </div>

        <div
          ref={headerRef}
          className={styles.headerBlock}
          style={{ opacity: 0 }}
        >
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={`${styles.mainTitle}  bricolage-grotesque`}>
            {title}
          </h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <svg
          className={styles.flywheelSvg}
          width="520"
          height="520"
          viewBox="-260 -260 520 520"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="centerImageClip">
              <circle cx="0" cy="0" r="34" />
            </clipPath>
            <filter id="nodeGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="4"
                result="blur"
              />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="ringFade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.03)" />
            </linearGradient>
            {NODES.map((node, i) => (
              <linearGradient
                key={`lineGradient-${node.id}`}
                id={`lineGradient-${node.id}`}
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2={node.x}
                y2={node.y}
              >
                <stop offset="0%" stopColor={node.ic} stopOpacity="0.5" />
                <stop offset="0%" stopColor={node.ic} stopOpacity="0.5">
                  <animate attributeName="offset" values="-0.3; 1.0" dur="2.2s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
                </stop>
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1">
                  <animate attributeName="offset" values="-0.15; 1.15" dur="2.2s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
                </stop>
                <stop offset="0%" stopColor={node.ic} stopOpacity="0.5">
                  <animate attributeName="offset" values="0.0; 1.3" dur="2.2s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor={node.ic} stopOpacity="0.5" />
              </linearGradient>
            ))}
          </defs>
          <g
            fill="none"
            stroke="rgba(255,255,255,0.24)"
            strokeWidth="1"
            opacity="0.45"
          >
            <circle cx="0" cy="0" r="80" opacity="0.94" />
            <circle cx="0" cy="0" r="108" opacity="0.82" />
            <circle cx="0" cy="0" r="136" opacity="0.72" />
            <circle cx="0" cy="0" r="164" opacity="0.58" />
            <circle cx="0" cy="0" r="192" opacity="0.44" />
            <circle cx="0" cy="0" r="220" opacity="0.32" />
          </g>
          {/* Growing lines */}
          <g>
            {NODES.map((node, i) => (
              <g key={`line-${node.id}`}>
                <path
                  ref={(el) => {
                    lineRefs.current[i] = el;
                  }}
                  d=""
                  fill="none"
                  stroke={`url(#lineGradient-${node.id})`}
                  strokeWidth="1"
                  strokeLinecap="round"
                  opacity="0"
                />
                <circle
                  ref={(el) => {
                    tipDotRefs.current[i] = el;
                  }}
                  r="1.5"
                  fill={node.ic}
                  opacity="0"
                />
              </g>
            ))}
          </g>

          {/* Nodes */}
          <g>
            {NODES.map((node, i) => {
              const { lx, ly } = labelPos(node);
              return (
                <g key={node.id}>
                  <g
                    ref={(el) => {
                      nodeGroupRefs.current[i] = el;
                    }}
                    style={{
                      opacity: 0,
                      transform: `translate(${node.x}px,${node.y}px) scale(0.2)`,
                      transformOrigin: `${node.x}px ${node.y}px`,
                    }}
                  >
                    <NodeIcon type={node.icon} color={node.ic} />
                  </g>
                  <text
                    ref={(el) => {
                      labelRefs.current[i] = el;
                    }}
                    x={node.x}
                    y={node.y + 42}
                    textAnchor="middle"
                    dominantBaseline="hanging"
                    className="plus-jakarta-sans"
                    fontSize="10.5"
                    fill="#666"
                    opacity="0"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Center blob */}
          <g
            ref={centerBlobRef}
            style={{
              opacity: 0,
              transform: "scale(0.3)",
              transformOrigin: "0px 0px",
            }}
          >
            <circle r="55" fill="#000" stroke="#252525" strokeWidth="1.2" />
            <image
              href="/Rabt.png"
              x="-32"
              y="-34"
              width="68"
              height="68"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#centerImageClip)"
              className="invert"
            />
          </g>
        </svg>

        <div ref={scrollHintRef} className={styles.scrollHint}>
          <span>Scroll</span>
          <div className={styles.scrollArrow} />
        </div>
      </div>
    </section>
  );
}
