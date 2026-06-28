"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getReviews } from "@/lib/cms/reviews";
import { resolveImageUrl } from "@/lib/sanity";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    quote:
      "Diwas and his team at rabt.in set a new standard for video editing with exceptional quality and efficiency. 10000/10.",
    name: "Lara Acosta",
    role: "Founder @ LA Digital",
  },
  {
    quote:
      "Working with Diwas was seamless. The quality was incredible, with versatile video and animation. It's a one-stop shop. Excited for a long-term partnership.",
    name: "Inge von Aulock",
    role: "Founder @ Penfriend",
  },
  {
    quote:
      "Diwas is the best. He delivers elite videos without hand-holding. I'm thrilled with his short-form work and will use him for YouTube next. Hire him; he's elite.",
    name: "Luke Matthews",
    role: "Founder @ AI WRITING made EASY",
  },
  {
    quote:
      "Diwas and his team are phenomenal. Their unmatched work rate, dedication, and creativity have made them invaluable partners for producing content.",
    name: "Marcus Engel",
    role: "Founder @ 301 Studios",
  },
  {
    quote:
      "Awesome work! Never once left the loop for any revisions, and made sure end video was exactly what we were looking for.",
    name: "Mena Mikhail",
    role: "Founder @ Human Voice Over",
  },
  {
    quote:
      "Diwas transformed our video content overnight. From rushed deadlines to outstanding quality, his work exceeded our expectations and elevated our brand.",
    name: "Niall Ratcliffe",
    role: "Co-founder @ Ratcliffe Brothers",
  },
  {
    quote:
      "Incredible attention to detail. They understood our brand voice from day one and delivered videos that actually convert.",
    name: "Sarah Chen",
    role: "CMO @ Velocity Media",
  },
  {
    quote:
      "They completely transformed how we approach video marketing. Our engagement metrics have never been higher. Truly a game-changer for our brand.",
    name: "James Okafor",
    role: "Founder @ BrightPath",
  },
  {
    quote:
      "Fast, reliable, and the quality speaks for itself. They took our rough footage and turned it into polished, scroll-stopping content every time.",
    name: "Priya Sharma",
    role: "Head of Content @ NovaCo",
  },
  {
    quote:
      "We've worked with many editors before, but none matched this level of consistency and creative instinct. Truly world-class.",
    name: "Tom Berret",
    role: "CEO @ Silverline",
  },
  {
    quote:
      "Delivered beyond the brief. Every video felt intentional, polished, and on-brand. Will absolutely work with them again.",
    name: "Aisha Kamara",
    role: "Director @ PixelBloom",
  },
  {
    quote:
      "Our social media presence has exploded since we started working with Diwas. The ROI on video content has been extraordinary.",
    name: "Carlos Mendez",
    role: "Growth Lead @ Launchpad",
  },
];

function splitIntoColumns(items, count) {
  const cols = Array.from({ length: count }, () => []);
  items.forEach((item, i) => cols[i % count].push({ ...item, originalIndex: i }));
  return cols;
}

function TestimonialCard({ name, role, quote, avatarUrl, avatar, originalIndex = 0 }) {
  const avatarSrc = resolveImageUrl(avatar) || avatarUrl;
  
  // Dynamically but deterministically generate handles and stats
  const cleanName = name ? name.replace(/[^a-zA-Z0-9]/g, "") : "client";
  const handle = `@${cleanName.toLowerCase()}`;
  
  // Deterministic stats
  const indexSeed = (originalIndex + 1) * 7;
  const replyCount = (indexSeed % 20) + 2;
  const retweetCount = ((indexSeed * 3) % 40) + 5;
  const likeCount = ((indexSeed * 11) % 150) + 25;
  const viewCount = (((indexSeed * 47) % 800) + 120) / 10; // e.g. 15.4K
  
  const timeElapsed = ["2h", "5h", "1d", "2d", "3d", "5d"][originalIndex % 6];

  return (
    <motion.div
      className="mb-3 rounded-2xl border border-neutral-800/50 bg-[#0e1015]/80 p-4 backdrop-blur-sm select-none text-left"
      whileHover={{
        backgroundColor: "rgba(20, 22, 28, 0.95)",
        borderColor: "rgba(255, 255, 255, 0.15)"
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex gap-3 items-start">
        {/* Avatar */}
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={name}
            style={{ width: 40, height: 40 }}
            className="h-10 w-10 shrink-0 rounded-full object-cover border border-white/10"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white border border-white/10">
            {name
              ? name
                .split(" ")
                .map((n) => n[0])
                .join("")
              : "?"}
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[14px] font-bold text-white leading-snug">
                {name}
              </span>
              
              {/* Verified Blue Badge */}
              <svg viewBox="0 0 24 24" aria-label="Verified account" className="h-[16px] w-[16px] text-[#1d9bf0] fill-current shrink-0">
                <g>
                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.99-3.818-3.99-.48 0-.94.1-1.348.27C14.825 2.515 13.512 1.5 12 1.5s-2.825 1.015-3.422 2.28c-.406-.17-.866-.27-1.348-.27-2.108 0-3.818 1.78-3.818 3.99 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.71 3.99 3.818 3.99.48 0 .94-.1 1.348-.27.597 1.265 1.91 2.28 3.422 2.28s2.825-1.015 3.422-2.28c.406.17.866.27 1.348.27 2.108 0 3.818-1.78 3.818-3.99 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.72 3.39l-3.21-3.21 1.42-1.41 1.79 1.8 4.31-4.32 1.41 1.41-5.72 5.73z"></path>
                </g>
              </svg>

              <span className="text-[13px] text-neutral-500 truncate max-w-[120px] sm:max-w-none">
                {handle}
              </span>
              
              <span className="text-neutral-500 text-xs">·</span>
              
              <span className="text-[13px] text-neutral-500">
                {timeElapsed}
              </span>
            </div>

            {/* Ellipsis/Menu */}
            <div className="text-neutral-600 p-1 -mr-1">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <g>
                  <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                </g>
              </svg>
            </div>
          </div>

          {/* Role/Subtitle */}
          <div className="text-[11px] text-neutral-500 -mt-0.5 leading-none">
            {role}
          </div>

          {/* Tweet Text */}
          <p className="mt-1.5 text-[14px] leading-normal text-neutral-200 font-normal">
            {quote} <span className="text-[#1d9bf0]">#videoproduction</span> <span className="text-[#1d9bf0]">#editing</span>
          </p>

          {/* Footer Icons */}
          <div className="flex justify-between items-center mt-2.5 text-neutral-500 text-[11px] max-w-[340px]">
            {/* Reply */}
            <div className="flex items-center gap-1.5">
              <span className="p-1.5">
                <svg viewBox="0 0 24 24" className="h-[16px] w-[16px] fill-current">
                  <g>
                    <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.485c4.421 0 8.005 3.58 8.005 8 0 4.42-3.584 8-8.005 8h-2l-4.854 4.85c-.233.24-.542.38-.868.38-.69 0-1.25-.56-1.25-1.25V18C5.335 18 1.751 14.42 1.751 10zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.31 2.688 6 6.005 6h1.249c.553 0 1 .45 1 1v2.18l3.104-3.1c.189-.19.445-.3.712-.3h1.414c3.317 0 6.005-2.69 6.005-6 0-3.31-2.688-6-6.005-6H9.756z"></path>
                  </g>
                </svg>
              </span>
              <span>{replyCount}</span>
            </div>

            {/* Retweet */}
            <div className="flex items-center gap-1.5">
              <span className="p-1.5">
                <svg viewBox="0 0 24 24" className="h-[16px] w-[16px] fill-current">
                  <g>
                    <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
                  </g>
                </svg>
              </span>
              <span>{retweetCount}</span>
            </div>

            {/* Like */}
            <div className="flex items-center gap-1.5">
              <span className="p-1.5">
                <svg viewBox="0 0 24 24" className="h-[16px] w-[16px] fill-current">
                  <g>
                    <path d="M16.697 5.5c-1.222-.06-2.679.69-3.894 2.02L12 8.41l-.803-.89c-1.215-1.33-2.672-2.08-3.894-2.02-2.589.13-4.526 2.27-4.526 4.9 0 2.92 2.607 5.74 7.424 9.57.172.13.383.2.6.2s.428-.07.6-.2c4.817-3.83 7.424-6.65 7.424-9.57 0-2.63-1.937-4.77-4.526-4.9zm-4.7 13.06C7.54 15.23 5 12.69 5 10.4c0-1.5 1.096-2.79 2.533-2.87 1.011-.05 2.124.64 3.011 1.79l1.456 1.62 1.456-1.62c.887-1.15 2-1.84 3.011-1.79 1.437.08 2.533 1.37 2.533 2.87 0 2.29-2.54 4.83-6.997 8.16z"></path>
                  </g>
                </svg>
              </span>
              <span>{likeCount}</span>
            </div>

            {/* Bookmark */}
            <div className="flex items-center">
              <span className="p-1.5">
                <svg viewBox="0 0 24 24" className="h-[16px] w-[16px] fill-current">
                  <g>
                    <path d="M4 4.5C4 3.12 5.12 2 6.5 2h11C18.88 2 20 3.12 20 4.5v16.86c0 .44-.4.76-.82.65L12 18.73l-7.18 3.28c-.42.11-.82-.21-.82-.65V4.5zM6.5 4c-.28 0-.5.22-.5.5v14.56l6-2.73 6 2.73V4.5c0-.28-.22-.5-.5-.5h-11z"></path>
                  </g>
                </svg>
              </span>
            </div>

            {/* Views */}
            <div className="flex items-center gap-1.5">
              <span className="p-1.5">
                <svg viewBox="0 0 24 24" className="h-[16px] w-[16px] fill-current">
                  <g>
                    <path d="M8.75 21V3h2v18h-2zM18 21V11h2v10h-2zM4 21v-6h2v6H4zm9.75 0V7h2v14h-2z"></path>
                  </g>
                </svg>
              </span>
              <span>{viewCount}K</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function InfiniteScrollColumn({
  items,
  direction = "up",
  duration = 30,
  className = "",
  columnIdx,
}) {
  const doubled = [...items, ...items];
  const animationName = direction === "up" ? "scrollUp" : "scrollDown";

  return (
    <div
      className={`relative overflow-hidden py-2 ${className}`}
      style={{ height: "480px" }}
    >
      {/* Top fade mask */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-28"
        style={{
          background: "linear-gradient(to bottom, #000 10%, transparent 100%)",
        }}
      />

      {/* Bottom fade mask */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-28"
        style={{
          background: "linear-gradient(to top, #000 10%, transparent 100%)",
        }}
      />

      {/* Scrolling track */}
      <div
        style={{
          animation: `${animationName} ${duration}s linear infinite`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.animationPlayState = "running";
        }}
      >
        {doubled.map((item, i) => (
          <TestimonialCard
            key={i}
            {...item}
          />
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const [list, setList] = useState(testimonials);

  useEffect(() => {
    getReviews()
      .then((data) => {
        if (data && data.length > 0) {
          setList(data);
        }
      })
      .catch((err) => console.error("Error fetching testimonials:", err));
  }, []);

  const columns = splitIntoColumns(list, 3);

  return (
    <section className="relative overflow-hidden bg-none px-6 py-10 sm:py-24">
      <style>{`
        @keyframes scrollUp {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        @keyframes scrollDown {
          from { transform: translateY(-50%); }
          to   { transform: translateY(0); }
        }
      `}</style>

      {/* Section heading */}
      <div className="relative mb-8 sm:mb-16 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          Testimonials
        </p>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white"
          style={{
            fontFamily: '"Bricolage Grotesque", sans-serif',
            fontOpticalSizing: "auto",
            fontStyle: "normal",
            fontVariationSettings: '"wdth" 100',
            fontWeight: 800,
          }}
        >
          What our clients say
        </h2>
      </div>

      {/* Infinite scroll columns: up / down / up */}
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
        <InfiniteScrollColumn
          items={columns[0]}
          direction="up"
          duration={28}
          columnIdx={0}
        />
        <InfiniteScrollColumn
          items={columns[1]}
          direction="down"
          duration={34}
          columnIdx={1}
          className="hidden md:block"
        />
        <InfiniteScrollColumn
          items={columns[2]}
          direction="up"
          duration={30}
          columnIdx={2}
          className="hidden md:block"
        />
      </div>
    </section>
  );
}
