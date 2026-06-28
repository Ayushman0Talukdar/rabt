"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";

import Image from "next/image";

export default function Masonry({
  items = [],
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
}) {
  const [columns, setColumns] = useState([]);
  const containerRef = useRef(null);

  // Distribute items into columns depending on screen size and height
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let colCount = 3;
      if (width < 640) colCount = 1;
      else if (width < 1024) colCount = 2;

      const cols = Array.from({ length: colCount }, () => []);
      const colHeights = Array(colCount).fill(0);

      items.forEach((item) => {
        // Find the column with the minimum height
        let minColIdx = 0;
        let minHeight = colHeights[0];
        for (let i = 1; i < colCount; i++) {
          if (colHeights[i] < minHeight) {
            minHeight = colHeights[i];
            minColIdx = i;
          }
        }

        cols[minColIdx].push(item);
        colHeights[minColIdx] += item.height || 400;
      });

      setColumns(cols);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [items]);

  // Entrance animation using GSAP
  useEffect(() => {
    if (columns.length === 0) return;

    const cards = containerRef.current.querySelectorAll(".masonry-card");
    if (cards.length === 0) return;

    const yVal = animateFrom === "bottom" ? 50 : animateFrom === "top" ? -50 : 0;
    const xVal = animateFrom === "left" ? -50 : animateFrom === "right" ? 50 : 0;

    gsap.killTweensOf(cards);
    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: yVal,
        x: xVal,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: duration,
        ease: ease,
        stagger: stagger,
        overwrite: "auto",
      }
    );
  }, [columns, animateFrom, duration, ease, stagger]);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full items-start"
    >
      {columns.map((col, colIdx) => (
        <div key={colIdx} className="flex flex-col gap-2 w-full">
          {col.map((item) => {
            return (
              <Link
                key={item.id}
                href={item.url || `/content-secrets/${item.id}`}
                className="masonry-card group relative block overflow-hidden border border-white/10 bg-[#0b0b0e] focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                style={{
                  height: item.height ? `${item.height}px` : "auto",
                  opacity: 0,
                }}
              >
                {/* Image Wrap */}
                <div className="w-full h-full overflow-hidden relative">
                  <Image
                    src={item.img || item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover blur-[2px] transition-all duration-700 ease-out group-hover:blur-md group-hover:scale-[1.03]"
                  />
                </div>

                {/* Hover Details Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out flex flex-col justify-end p-6 z-10">
                  {/* Category */}
                  <span className="text-xs font-bold tracking-widest text-sky-400 uppercase mb-2 block translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-[50ms]">
                    {item.category}
                  </span>

                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug mb-3 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-[120ms]">
                    {item.title}
                  </h2>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4 line-clamp-3 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-[200ms]">
                    {item.description}
                  </p>

                  {/* Meta details */}
                  <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-[280ms]">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span>{item.readTime}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
