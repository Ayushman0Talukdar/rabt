"use client";

import { useState, useEffect } from "react";
import { getReviews } from "@/lib/cms/reviews";
import { resolveImageUrl } from "@/lib/sanity";

// Add to layout.js:
// import { Bricolage_Grotesque } from "next/font/google";
// const bricolage = Bricolage_Grotesque({ subsets: ["latin"], axes: ["wdth"], weight: ["800"] });

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

// Split testimonials into N columns, top-to-bottom order
function splitIntoColumns(items, count) {
  const cols = Array.from({ length: count }, () => []);
  items.forEach((item, i) => cols[i % count].push(item));
  return cols;
}

function TestimonialCard({ name, role, quote, avatarUrl, avatar }) {
  const avatarSrc = resolveImageUrl(avatar) || avatarUrl;
  return (
    <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <p className="mb-5 text-sm leading-relaxed text-white/60">{quote}</p>
      <div className="flex items-center gap-3">
        {/* Profile picture if available, otherwise fallback to first letter/initials */}
        {avatarSrc ? (
          <img src={avatarSrc} alt={name} className="h-9 w-9 shrink-0 rounded-full object-cover border border-white/10" />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-semibold text-white">
            {name
              ? name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : "?"}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-xs text-white/40">{role}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * InfiniteScrollColumn
 *
 * Duplicates card list so the loop is seamless (no jump).
 * direction "up"   → animates 0 to -50%  (scrolls upward)
 * direction "down" → animates -50% to 0  (scrolls downward)
 * Pauses on hover so users can read.
 */
function InfiniteScrollColumn({ items, direction = "up", duration = 30, className = "" }) {
  // Duplicate items for seamless infinite loop
  const doubled = [...items, ...items];

  const animationName = direction === "up" ? "scrollUp" : "scrollDown";

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ height: "600px" }}>
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
        onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
        onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
      >
        {doubled.map((item, i) => (
          <TestimonialCard key={i} {...item} />
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

      {/* Subtle ambient glow behind heading */}
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-white/[0.03] blur-3xl"
      /> */}

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
        <InfiniteScrollColumn items={columns[0]} direction="up"   duration={28} />
        <InfiniteScrollColumn items={columns[1]} direction="down" duration={34} className="hidden md:block" />
        <InfiniteScrollColumn items={columns[2]} direction="up"   duration={30} className="hidden md:block" />
      </div>
    </section>
  );
}