"use client";

import { useEffect, useRef, useCallback } from "react";
import styles from "./ContentFlywheel.module.css";

// ── Node definitions — fixed final positions relative to SVG center (0,0) ────
const NODES = [
  { id: "youtube",   label: "YouTube Shorts",  x:  0,    y: -148, bg: "#1e0808", ic: "#e03434", icon: "youtube"   },
  { id: "instagram", label: "Instagram Reels", x:  135,  y:  -72, bg: "#1a060f", ic: "#d04070", icon: "instagram" },
  { id: "tiktok",    label: "TikTok Videos",   x:  118,  y:   80, bg: "#0c0c18", ic: "#a0a8d8", icon: "tiktok"    },
  { id: "linkedin",  label: "LinkedIn Posts",  x:  0,    y:  148, bg: "#050c1a", ic: "#3a8fdd", icon: "linkedin"  },
  { id: "xthreads",  label: "X Threads",       x: -118,  y:   80, bg: "#0d0d0d", ic: "#c8c8c8", icon: "x"         },
  { id: "podcast",   label: "Podcast",          x: -135,  y:  -72, bg: "#080d06", ic: "#58b058", icon: "podcast"   },
];

// ── Easing ────────────────────────────────────────────────────────────────────
function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

// ── Curved SVG path from center → node with slight quadratic bend ─────────────
function curvePath(nx, ny) {
  const dist = Math.sqrt(nx * nx + ny * ny);
  // Perpendicular unit vector
  const px = -ny / dist;
  const py = nx / dist;
  // Control point: midpoint + slight lateral offset
  const cx = nx * 0.5 + px * 22;
  const cy = ny * 0.5 + py * 22;
  return `M 0 0 Q ${cx} ${cy} ${nx} ${ny}`;
}

// ── Label placement: push outward from node circle ────────────────────────────
function labelPos(node) {
  const dist = Math.sqrt(node.x * node.x + node.y * node.y);
  const ux = node.x / dist;
  const uy = node.y / dist;
  return { lx: node.x + ux * 30, ly: node.y + uy * 30 };
}

function textAnchor(x) {
  if (x > 20) return "start";
  if (x < -20) return "end";
  return "middle";
}

// ── Stars canvas ───────────────────────────────────────────────────────────────
function paintStars(canvas) {
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const count = Math.floor((canvas.width * canvas.height) / 8000);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < count; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * 1.1,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = `rgba(255,255,255,${(Math.random() * 0.4 + 0.08).toFixed(2)})`;
    ctx.fill();
  }
}

// ── Icon SVG content per platform ─────────────────────────────────────────────
function NodeIcon({ type, color }) {
  switch (type) {
    case "youtube":
      return (
        <>
          <rect x="-9" y="-7" width="18" height="14" rx="3" fill={color} />
          <polygon points="-2,-4 6,0 -2,4" fill="white" />
        </>
      );
    case "instagram":
      return (
        <>
          <rect x="-9" y="-9" width="18" height="18" rx="4" fill={color} />
          <circle cx="0" cy="0" r="4" fill="none" stroke="white" strokeWidth="1.5" />
          <circle cx="5" cy="-5" r="1.2" fill="white" />
        </>
      );
    case "tiktok":
      return (
        <path
          fill={color}
          d="M5,-8a4,4,0,0,1-3,1.2,4,4,0,0,1-1-1.2H-2V3a2,2,0,1,1-1.4-1.9V-1.5A4.5,4.5,0,1,0,3,3V-5A7,7,0,0,0,7.5-2.5V-6A4,4,0,0,1,5,-8Z"
        />
      );
    case "linkedin":
      return (
        <>
          <rect x="-9" y="-9" width="18" height="18" rx="3" fill={color} />
          <rect x="-6" y="-3" width="3" height="8" fill="white" />
          <circle cx="-4.5" cy="-5.5" r="1.8" fill="white" />
          <path d="M0,-2Q0,-4,2,-4Q4,-4,4,-2L4,5L7,5L7,-2Q7,-7,2,-7Q0,-7,0,-5Z" fill="white" />
        </>
      );
    case "x":
      return (
        <>
          <rect x="-9" y="-9" width="18" height="18" rx="3" fill={color} />
          <text
            x="0" y="1"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="12"
            fill="white"
            fontWeight="700"
            fontFamily="Georgia,serif"
          >
            𝕏
          </text>
        </>
      );
    case "podcast":
      return (
        <>
          <circle cx="0" cy="-2" r="4.5" fill="none" stroke={color} strokeWidth="2" />
          <circle cx="0" cy="-2" r="1.5" fill={color} />
          <path d="M-7,0Q-7,6,0,6Q7,6,7,0" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <line x1="0" y1="6" x2="0" y2="9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <line x1="-3" y1="9" x2="3" y2="9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </>
      );
    default:
      return null;
  }
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ContentFlywheel({
  centerLabel = "rabt.",
  eyebrow = "Content Strategy",
  title = "Content Flywheel",
  subtitle = "One piece of content, repurposed across every platform — optimized for each algorithm.",
  /** Controls scroll zone length. Higher = slower animation. */
  scrollMultiplier = 5,
}) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const scrollHintRef = useRef(null);
  const starsCanvasRef = useRef(null);
  const centerBlobRef = useRef(null);

  // Imperative refs for each animated SVG element
  const lineRefs = useRef([]);
  const nodeCircleGroupRefs = useRef([]); // the circle+icon group
  const nodeLabelRefs = useRef([]);       // the text label

  const applyProgress = useCallback((progress) => {
    const header = headerRef.current;
    const scrollHint = scrollHintRef.current;
    const centerBlob = centerBlobRef.current;
    if (!header || !scrollHint || !centerBlob) return;

    // ── Header ──────────────────────────────────────────────────────────
    const hP = Math.min(1, progress / 0.05);
    header.style.opacity = String(hP);
    header.style.transform = `translateY(${(1 - hP) * 12}px)`;

    // ── Scroll hint ──────────────────────────────────────────────────────
    scrollHint.style.opacity = progress < 0.06 ? String(1 - progress / 0.06) : "0";

    // ── Center blob: scale 0.4→1, fade 0→1 over first 12% ───────────────
    const blobP = easeOut(Math.min(1, progress / 0.12));
    centerBlob.style.opacity = String(blobP);
    centerBlob.style.transform = `scale(${0.4 + 0.6 * blobP})`;

    // ── Nodes: staggered across 10%→100% ────────────────────────────────
    const animStart = 0.10;
    const animEnd   = 1.0;
    const segSize   = (animEnd - animStart) / NODES.length;

    NODES.forEach((node, i) => {
      const start = animStart + i * segSize;
      const end   = start + segSize;

      // Node progress
      const np = easeOut(Math.max(0, Math.min(1, (progress - start) / (end - start))));

      // Line: fade in
      const lineEl = lineRefs.current[i];
      if (lineEl) lineEl.setAttribute("opacity", String(np * 0.55));

      // Circle group: scale 0.5→1 from its own center, fade in
      const circleG = nodeCircleGroupRefs.current[i];
      if (circleG) {
        circleG.style.opacity = String(np);
        circleG.style.transform = `translate(${node.x}px, ${node.y}px) scale(${0.5 + 0.5 * np})`;
        circleG.style.transformOrigin = `${node.x}px ${node.y}px`;
      }

      // Label: delayed slightly behind node, fade in
      const labelP = easeOut(Math.max(0, Math.min(1, (progress - start - segSize * 0.3) / (segSize * 0.7))));
      const labelEl = nodeLabelRefs.current[i];
      if (labelEl) labelEl.setAttribute("opacity", String(labelP * 0.75));
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = starsCanvasRef.current;
    if (!section || !canvas) return;

    paintStars(canvas);

    function getProgress() {
      const rect = section.getBoundingClientRect();
      const zone = section.offsetHeight - window.innerHeight;
      return Math.max(0, Math.min(1, -rect.top / Math.max(1, zone)));
    }

    const onScroll = () => applyProgress(getProgress());
    const onResize = () => { paintStars(canvas); applyProgress(getProgress()); };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    applyProgress(0);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [applyProgress]);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      style={{ height: `${scrollMultiplier * 100}vh` }}
    >
      <div className={styles.stickyViewport}>
        <canvas ref={starsCanvasRef} className={styles.starsCanvas} />

        {/* Header */}
        <div ref={headerRef} className={styles.headerBlock} style={{ opacity: 0 }}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={styles.mainTitle}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        {/* Flywheel SVG */}
        <svg
          className={styles.flywheelSvg}
          width="440"
          height="420"
          viewBox="-220 -210 440 420"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Curved lines — fixed path, only opacity animates */}
          <g>
            {NODES.map((node, i) => (
              <path
                key={`line-${node.id}`}
                ref={(el) => { lineRefs.current[i] = el; }}
                d={curvePath(node.x, node.y)}
                fill="none"
                stroke="#2e2e2e"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0"
              />
            ))}
          </g>

          {/* Satellite nodes — circle + icon scale from own center */}
          <g>
            {NODES.map((node, i) => {
              const { lx, ly } = labelPos(node);
              return (
                <g key={node.id}>
                  {/* Circle + icon group — this scales */}
                  <g
                    ref={(el) => { nodeCircleGroupRefs.current[i] = el; }}
                    style={{
                      opacity: 0,
                      transform: `translate(${node.x}px, ${node.y}px) scale(0.5)`,
                      transformOrigin: `${node.x}px ${node.y}px`,
                    }}
                  >
                    <circle r="24" fill={node.bg} stroke="#282828" strokeWidth="1" />
                    <NodeIcon type={node.icon} color={node.ic} />
                  </g>

                  {/* Label — only fades (no scale) */}
                  <text
                    ref={(el) => { nodeLabelRefs.current[i] = el; }}
                    x={lx}
                    y={ly}
                    textAnchor={textAnchor(node.x)}
                    dominantBaseline="central"
                    fontFamily="system-ui, sans-serif"
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

          {/* Center blob — scales up first */}
          <g
            ref={centerBlobRef}
            style={{ opacity: 0, transform: "scale(0.4)", transformOrigin: "0px 0px" }}
          >
            <circle r="42" fill="#161616" stroke="#2c2c2c" strokeWidth="1" />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              y="0"
              fontFamily="Georgia, serif"
              fontSize="13"
              fontWeight="600"
              fill="#e0e0e0"
            >
              {centerLabel}
            </text>
          </g>
        </svg>

        {/* Scroll hint */}
        <div ref={scrollHintRef} className={styles.scrollHint}>
          <span>Scroll</span>
          <div className={styles.scrollArrow} />
        </div>
      </div>
    </section>
  );
}