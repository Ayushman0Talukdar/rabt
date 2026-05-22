"use client";
import { BasilYoutubeOutline } from "@/components/icons/youtubeicon";

import { useEffect, useRef, useCallback } from "react";
import styles from "./ContentFlywheel.module.css";

const NODES = [
  { id: "youtube",   label: "YouTube Shorts",  x:  0,   y: -152, bg: "#1e0808", ic: "#e03434", icon: "youtube"   },
  { id: "instagram", label: "Instagram Reels", x:  138, y:  -74, bg: "#1a060f", ic: "#d04070", icon: "instagram" },
  { id: "tiktok",    label: "TikTok Videos",   x:  120, y:   82, bg: "#0c0c18", ic: "#a0a8d8", icon: "tiktok"    },
  { id: "linkedin",  label: "LinkedIn Posts",  x:  0,   y:  152, bg: "#050c1a", ic: "#3a8fdd", icon: "linkedin"  },
  { id: "xthreads",  label: "X Threads",       x: -120, y:   82, bg: "#0d0d0d", ic: "#c8c8c8", icon: "x"         },
  { id: "podcast",   label: "Podcast",          x: -138, y:  -74, bg: "#080d06", ic: "#58b058", icon: "podcast"   },
];

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

function NodeIcon({ type, color }) {
  switch (type) {
    case "youtube":
      return (
        <g>
          <rect x={-12} y={-12} width={24} height={24} rx={6} fill="#18181b" />
          <BasilYoutubeOutline width={14} height={14} x={-7} y={-7} />
        </g>
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
          <text x="0" y="1" textAnchor="middle" dominantBaseline="central"
            fontSize="12" fill="white" fontWeight="700" fontFamily="Georgia,serif">𝕏</text>
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

export default function ContentFlywheel({
  centerLabel = "rabt.",
  eyebrow = "Content Strategy",
  title = "Content Flywheel",
  subtitle = "One piece of content, repurposed across every platform — optimized for each algorithm.",
  scrollMultiplier = 5,
}) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const scrollHintRef = useRef(null);
  const starsCanvasRef = useRef(null);
  const centerBlobRef = useRef(null);

  // Per-node imperative refs
  const lineRefs = useRef([]);      // <path> elements for growing lines
  const tipDotRefs = useRef([]);    // <circle> tip dots
  const nodeGroupRefs = useRef([]); // <g> circle+icon groups
  const labelRefs = useRef([]);     // <text> labels

  const applyProgress = useCallback((progress) => {
    const header = headerRef.current;
    const scrollHint = scrollHintRef.current;
    const centerBlob = centerBlobRef.current;
    if (!header || !scrollHint || !centerBlob) return;

    // Header
    const hP = easeOut(Math.min(1, progress / 0.05));
    header.style.opacity = String(hP);
    header.style.transform = `translateY(${(1 - hP) * 10}px)`;

    // Scroll hint
    scrollHint.style.opacity = progress < 0.06 ? String(1 - progress / 0.06) : "0";

    // Center blob
    const blobP = easeOut(Math.min(1, progress / 0.10));
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
          lineEl.setAttribute("opacity", "0.55");
          const tip = bezierPoint(node.x, node.y, np);
          tipEl.setAttribute("cx", tip.x.toFixed(2));
          tipEl.setAttribute("cy", tip.y.toFixed(2));
          tipEl.setAttribute("opacity", np < 1 ? String(np * 0.6) : "0");
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
      const labelRaw = Math.max(0, Math.min(1, (progress - (start + segSize * 0.4)) / (segSize * 0.6)));
      const labelEl = labelRefs.current[i];
      if (labelEl) labelEl.setAttribute("opacity", String(easeOut(labelRaw)));
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

        <div ref={headerRef} className={styles.headerBlock} style={{ opacity: 0 }}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={styles.mainTitle}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <svg
          className={styles.flywheelSvg}
          width="460"
          height="440"
          viewBox="-230 -215 460 440"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Growing lines */}
          <g>
            {NODES.map((node, i) => (
              <g key={`line-${node.id}`}>
                <path
                  ref={(el) => { lineRefs.current[i] = el; }}
                  d=""
                  fill="none"
                  stroke="#2a2a2a"
                  strokeWidth="1"
                  strokeLinecap="round"
                  opacity="0"
                />
                <circle
                  ref={(el) => { tipDotRefs.current[i] = el; }}
                  r="1.5"
                  fill="#333"
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
                    ref={(el) => { nodeGroupRefs.current[i] = el; }}
                    style={{
                      opacity: 0,
                      transform: `translate(${node.x}px,${node.y}px) scale(0.2)`,
                      transformOrigin: `${node.x}px ${node.y}px`,
                    }}
                  >
                    <NodeIcon type={node.icon} color={node.ic} />
                  </g>
                  <text
                    ref={(el) => { labelRefs.current[i] = el; }}
                    x={lx}
                    y={ly}
                    textAnchor={textAnchor(node.x)}
                    dominantBaseline={dominantBaseline(node)}
                    fontFamily="system-ui,sans-serif"
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
            style={{ opacity: 0, transform: "scale(0.3)", transformOrigin: "0px 0px" }}
          >
            <circle r="42" fill="#161616" stroke="#252525" strokeWidth="1" />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              y="0"
              fontFamily="Georgia,serif"
              fontSize="13"
              fontWeight="600"
              fill="#e0e0e0"
            >
              {centerLabel}
            </text>
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