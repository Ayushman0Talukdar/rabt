import * as React from "react"
import { cn } from "@/lib/utils";
import mapData from "./map-data.json";

export function DottedMap(
  {
    width = 150,
    height = 75,
    mapSamples = 5000,
    markers = [],
    dotColor = "currentColor",
    markerColor = "#fff",
    dotRadius = 0.2,
    stagger = true,
    pulse = false,
    renderMarkerOverlay,
    className,
    style,
    ...svgProps
  }
) {
  const points = mapData.points;
  const processedMarkers = markers;

  // Compute stagger helpers in a single, simple pass
  const { xStep, yToRowIndex } = React.useMemo(() => {
    const sorted = [...points].sort((a, b) => a.y - b.y || a.x - b.x)
    const rowMap = new Map()
    let step = 0
    let prevY = Number.NaN
    let prevXInRow = Number.NaN

    for (const p of sorted) {
      if (p.y !== prevY) {
        prevY = p.y
        prevXInRow = Number.NaN
        if (!rowMap.has(p.y)) rowMap.set(p.y, rowMap.size)
      }
      if (!Number.isNaN(prevXInRow)) {
        const delta = p.x - prevXInRow
        if (delta > 0) step = step === 0 ? delta : Math.min(step, delta)
      }
      prevXInRow = p.x
    }

    return { xStep: step || 1, yToRowIndex: rowMap }
  }, [points])

  // ── Optimization 1: Pre-compute point metadata once ──
  // Eliminates per-frame string allocations, hash computations, and Set lookups.
  const processedPoints = React.useMemo(() => {
    const europeSet = new Set(mapData.europePoints);

    const getCoordinateHash = (str) => {
      let h = 0;
      for (let i = 0; i < str.length; i++) {
        h = (h << 5) - h + str.charCodeAt(i);
        h |= 0;
      }
      return Math.abs(h);
    };

    return points.map((point) => {
      const rowIndex = yToRowIndex.get(point.y) ?? 0;
      const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0;
      const px = point.x + offsetX;
      const py = point.y;

      const pointKey = `${point.x.toFixed(2)}-${point.y.toFixed(2)}`;
      const isEurope = europeSet.has(pointKey);
      const isTargetRegion = !isEurope && (getCoordinateHash(pointKey) % 100 < 8);
      const isHighlighted = isEurope || isTargetRegion;

      return { px, py, isHighlighted };
    });
  }, [points, stagger, xStep, yToRowIndex]);

  // ── Optimization 3: Spatial grid index for hover hit-testing ──
  // Reduces distance checks from ~1833 to ~10-30 per frame.
  const HOVER_RADIUS = 10;
  const HOVER_RADIUS_SQ = HOVER_RADIUS * HOVER_RADIUS;

  const spatialGrid = React.useMemo(() => {
    const cellSize = HOVER_RADIUS;
    const grid = new Map();

    for (let i = 0; i < processedPoints.length; i++) {
      const { px, py } = processedPoints[i];
      const cellX = Math.floor(px / cellSize);
      const cellY = Math.floor(py / cellSize);
      const key = (cellX << 16) | (cellY & 0xFFFF); // bitwise cell key, no string alloc
      if (!grid.has(key)) grid.set(key, []);
      grid.get(key).push(i);
    }

    return { grid, cellSize };
  }, [processedPoints]);

  const staticCanvasRef = React.useRef(null);
  const hoverCanvasRef = React.useRef(null);
  const mouseRef = React.useRef(null);
  const rectRef = React.useRef(null);
  const rafRef = React.useRef(0);

  // ── Optimization 6: Batched static draw by fill color ──
  // Draws all dots in 2 batched paths instead of 1833 individual draw calls.
  const drawStatic = React.useCallback(() => {
    const canvas = staticCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    let resolvedDotColor = dotColor;
    if (dotColor === "currentColor") {
      resolvedDotColor = "#fff";
    }

    const highlightColor = "rgba(56, 189, 248, 0.95)";
    const TWO_PI = Math.PI * 2;

    // Batch 1: Normal dots
    ctx.beginPath();
    ctx.fillStyle = resolvedDotColor;
    for (let i = 0; i < processedPoints.length; i++) {
      const pt = processedPoints[i];
      if (!pt.isHighlighted) {
        ctx.moveTo(pt.px + dotRadius, pt.py);
        ctx.arc(pt.px, pt.py, dotRadius, 0, TWO_PI);
      }
    }
    ctx.fill();

    // Batch 2: Highlighted dots (Europe + target region)
    ctx.beginPath();
    ctx.fillStyle = highlightColor;
    for (let i = 0; i < processedPoints.length; i++) {
      const pt = processedPoints[i];
      if (pt.isHighlighted) {
        ctx.moveTo(pt.px + dotRadius, pt.py);
        ctx.arc(pt.px, pt.py, dotRadius, 0, TWO_PI);
      }
    }
    ctx.fill();
  }, [processedPoints, dotColor, dotRadius]);

  // ── Optimization 2: Hover overlay draws only affected dots ──
  // Only clears and redraws the ~5-15 dots within hover radius.
  const drawHover = React.useCallback(() => {
    const canvas = hoverCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    const mouse = mouseRef.current;
    if (!mouse || mouse.x === null || mouse.y === null) return;

    const { grid, cellSize } = spatialGrid;
    const mx = mouse.x;
    const my = mouse.y;
    const cellX = Math.floor(mx / cellSize);
    const cellY = Math.floor(my / cellSize);

    let resolvedDotColor = dotColor;
    if (dotColor === "currentColor") {
      resolvedDotColor = "#fff";
    }
    const highlightColor = "rgba(56, 189, 248, 0.95)";
    const TWO_PI = Math.PI * 2;

    // Check only the 9 neighboring cells
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = ((cellX + dx) << 16) | ((cellY + dy) & 0xFFFF);
        const indices = grid.get(key);
        if (!indices) continue;

        for (let k = 0; k < indices.length; k++) {
          const pt = processedPoints[indices[k]];
          const ddx = pt.px - mx;
          const ddy = pt.py - my;
          const distSq = ddx * ddx + ddy * ddy;

          if (distSq < HOVER_RADIUS_SQ) {
            // Compute smoothstep scale factor
            const dist = Math.sqrt(distSq);
            const factor = 1 - dist / HOVER_RADIUS;
            const easeFactor = factor * factor * (3 - 2 * factor);
            const scaledRadius = dotRadius + dotRadius * 1.2 * easeFactor;

            // Erase the base dot from the static canvas by drawing over it
            // (We draw a slightly larger circle on the hover canvas to cover the base)
            const baseColor = pt.isHighlighted ? highlightColor : resolvedDotColor;

            // Draw the scaled-up dot on the hover layer
            ctx.beginPath();
            ctx.arc(pt.px, pt.py, scaledRadius, 0, TWO_PI);
            ctx.fillStyle = baseColor;
            ctx.fill();
          }
        }
      }
    }
  }, [processedPoints, spatialGrid, dotColor, dotRadius]);

  React.useEffect(() => {
    const staticCanvas = staticCanvasRef.current;
    const hoverCanvas = hoverCanvasRef.current;
    if (!staticCanvas || !hoverCanvas) return;

    const scale = 4;
    staticCanvas.width = width * scale;
    staticCanvas.height = height * scale;
    hoverCanvas.width = width * scale;
    hoverCanvas.height = height * scale;

    const staticCtx = staticCanvas.getContext("2d");
    const hoverCtx = hoverCanvas.getContext("2d");
    if (staticCtx) staticCtx.scale(scale, scale);
    if (hoverCtx) hoverCtx.scale(scale, scale);

    // Draw the static layer once
    drawStatic();

    // ── Optimization 5: Cache getBoundingClientRect ──
    rectRef.current = hoverCanvas.getBoundingClientRect();
    const resizeObserver = new ResizeObserver(() => {
      rectRef.current = hoverCanvas.getBoundingClientRect();
    });
    resizeObserver.observe(hoverCanvas);

    // ── Optimization 4: rAF-gated mousemove ──
    const handleMouseMove = (e) => {
      const rect = rectRef.current;
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current = {
        x: (x / rect.width) * width,
        y: (y / rect.height) * height,
      };

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = 0;
          drawHover();
        });
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current = null;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      drawHover();
    };

    hoverCanvas.addEventListener("mousemove", handleMouseMove);
    hoverCanvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      hoverCanvas.removeEventListener("mousemove", handleMouseMove);
      hoverCanvas.removeEventListener("mouseleave", handleMouseLeave);
      resizeObserver.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
  }, [width, height, drawStatic, drawHover]);

  return (
    <div
      className={cn("relative text-gray-500 dark:text-gray-500", className)}
      style={{ width: "100%", height: "100%", ...style }}
    >
      <canvas
        ref={staticCanvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      <canvas
        ref={hoverCanvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "auto",
        }}
      />
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="absolute top-0 left-0 w-full h-full"
        style={{ pointerEvents: "none" }}
        {...svgProps}>
        {processedMarkers.map((marker, index) => {
          const rowIndex = yToRowIndex.get(marker.y) ?? 0
          const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0

          const x = marker.x + offsetX
          const y = marker.y
          const r = marker.size ?? dotRadius
          const shouldPulse = pulse
            ? marker.pulse !== false
            : marker.pulse === true
          const pulseTo = r * 2.8

          return (
            <g key={`${marker.x}-${marker.y}-${index}`} style={{ pointerEvents: "auto" }}>
              <circle cx={x} cy={y} r={r} fill={markerColor} />
              {shouldPulse ? (
                <g pointerEvents="none">
                  <circle
                    cx={x}
                    cy={y}
                    r={r}
                    fill="none"
                    stroke={markerColor}
                    strokeOpacity={1}
                    strokeWidth={1}>
                    <animate
                      attributeName="r"
                      values={`${r};${pulseTo}`}
                      dur="1.4s"
                      repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0" dur="1.4s" repeatCount="indefinite" />
                  </circle>
                  <circle
                    cx={x}
                    cy={y}
                    r={r}
                    fill="none"
                    stroke={markerColor}
                    strokeOpacity={0.9}
                    strokeWidth={0.3}>
                    <animate
                      attributeName="r"
                      values={`${r};${pulseTo}`}
                      dur="1.4s"
                      begin="0.7s"
                      repeatCount="indefinite" />
                    <animate
                      attributeName="opacity"
                      values="0.9;0"
                      dur="1.4s"
                      begin="0.7s"
                      repeatCount="indefinite" />
                  </circle>
                </g>
              ) : null}
              {renderMarkerOverlay?.({
                marker: { ...marker, x, y },
                index,
                x,
                y,
                r,
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

