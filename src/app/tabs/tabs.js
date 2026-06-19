"use client";

import { useState, useRef, useEffect } from "react";
import {
  Film,
  Scissors,
  Mic,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import { getVideos } from "@/lib/cms/videos";

// ─── Constants ────────────────────────────────────────────────────────────────

const BG = "#000000"; // Pure black background matching screenshot
const CARD_BG = "#0c0c0e"; // Dark premium card background

const TAG_COLOR_MAP = {
  "talking head videos": {
    bg: "rgba(34,197,94,0.06)",
    border: "rgba(34,197,94,0.25)",
    color: "#4ade80",
  },
  "motion graphics videos": {
    bg: "rgba(168,85,247,0.06)",
    border: "rgba(168,85,247,0.25)",
    color: "#c084fc",
  },
  "storytelling videos": {
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.25)",
    color: "#f87171",
  },
  "map animations": {
    bg: "rgba(14,165,233,0.06)",
    border: "rgba(14,165,233,0.25)",
    color: "#38bdf8",
  },
  "reels / shorts / tiktok edits": {
    bg: "rgba(249,115,22,0.06)",
    border: "rgba(249,115,22,0.25)",
    color: "#fb923c",
  },
  "hook-based viral edits": {
    bg: "rgba(234,179,8,0.06)",
    border: "rgba(234,179,8,0.25)",
    color: "#facc15",
  },
  "subtitle-driven edits": {
    bg: "rgba(34,197,94,0.06)",
    border: "rgba(34,197,94,0.25)",
    color: "#4ade80",
  },
  "explainer videos": {
    bg: "rgba(168,85,247,0.06)",
    border: "rgba(168,85,247,0.25)",
    color: "#c084fc",
  },
};

const DEFAULT_TAG_COLORS = [
  {
    bg: "rgba(139,92,246,0.06)",
    border: "rgba(139,92,246,0.22)",
    color: "#a78bfa",
  },
  {
    bg: "rgba(249,115,22,0.06)",
    border: "rgba(249,115,22,0.22)",
    color: "#fdba74",
  },
  {
    bg: "rgba(14,165,233,0.06)",
    border: "rgba(14,165,233,0.22)",
    color: "#7dd3fc",
  },
  {
    bg: "rgba(236,72,153,0.06)",
    border: "rgba(236,72,153,0.22)",
    color: "#f472b6",
  },
  {
    bg: "rgba(34,197,94,0.06)",
    border: "rgba(34,197,94,0.22)",
    color: "#86efac",
  },
];

// Helper to get styled tags
function getTagStyle(label, index) {
  const norm = label.toLowerCase().trim();
  if (TAG_COLOR_MAP[norm]) return TAG_COLOR_MAP[norm];
  return DEFAULT_TAG_COLORS[index % DEFAULT_TAG_COLORS.length];
}

// ─── Data (Fallback structure matching short-form, long-form, distribution, saas) ─

const TABS = [
  {
    id: "short-form",
    icon: Film,
    label: "Short-Form",
    sections: [
      {
        titlePlain: "High-impact,",
        titleHighlight: "scroll-stopping content",
        description:
          "Reels, shorts, and TikTok edits built to capture attention immediately.",
        tags: [
          "Talking Head Videos",
          "Motion Graphics Videos",
          "Storytelling Videos",
          "Map Animations",
          "Reels / Shorts / TikTok Edits",
          "Hook-based Viral Edits",
          "Subtitle-driven Edits",
          "Explainer Videos",
        ],
        videos: [
          "ScMzIvxBSi4",
          "2Vv-BfVoq4g",
          "60ItHLz5WEA",
          "fJ9rUzIMcZQ",
          "RgKAFK5djSk",
        ],
        vertical: true,
      },
    ],
  },
  {
    id: "long-form",
    icon: Scissors,
    label: "Long Form",
    sections: [
      {
        titlePlain: "Trailers and",
        titleHighlight: "Long Form",
        description:
          "YouTube videos, documentaries, cinematic trailers and more.",
        tags: [
          "Motion Graphics",
          "Color Grading",
          "Sound Design",
          "Thumbnail Design",
          "B-Roll Integration",
          "Pacing & Cuts",
        ],
        videos: ["dQw4w9WgXcQ", "jNQXAC9IVRw", "9bZkp7q19f0", "kJQP7kiw5Fk"],
        vertical: false,
      },
    ],
  },
  {
    id: "distribution",
    icon: Mic,
    label: "Distribution",
    sections: [
      {
        titlePlain: "Podcast & Social",
        titleHighlight: "Distribution",
        description:
          "Punchy teasers across all platforms that pull viewers in.",
        tags: [
          "Cross-platform",
          "Brand Overlays",
          "CTA Cards",
          "Analytics Ready",
          "Story Format",
          "Carousel Edits",
        ],
        videos: ["2Vv-BfVoq4g", "fJ9rUzIMcZQ", "kJQP7kiw5Fk"],
        vertical: false,
      },
    ],
  },
  {
    id: "saas",
    icon: Film,
    label: "SaaS",
    sections: [
      {
        titlePlain: "SaaS & Product",
        titleHighlight: "Demos",
        description: "Explainers, onboarding flows, and product walkthroughs.",
        tags: [
          "Screen Recording",
          "UI Animations",
          "Voiceover Sync",
          "CTA Integration",
          "Brand Assets",
          "Conversion Focus",
        ],
        videos: ["ZK-rNEhJIDs", "dQw4w9WgXcQ", "jNQXAC9IVRw"],
        vertical: false,
      },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ plain, highlight }) {
  return (
    <h3
      style={{
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        fontWeight: 700,
        fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
        lineHeight: 1.15,
        color: "#fff",
        margin: 0,
        marginBottom: "1.5rem",
        letterSpacing: "-0.03em",
      }}
    >
      {plain ? plain + " " : ""}
      <span
        style={{
          color: "#fff",
        }}
      >
        {highlight}
      </span>
    </h3>
  );
}

function Tag({ label, index }) {
  const style = getTagStyle(label, index);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "8px 16px",
        borderRadius: "9999px",
        fontSize: "12.5px",
        fontWeight: 500,
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        color: style.color,
        background: style.bg,
        border: `1px solid ${style.border}`,
        whiteSpace: "nowrap",
        transition: "all 0.3s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = `0 4px 12px ${style.border}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {label}
    </span>
  );
}

function YouTubeEmbed({ videoId, vertical }) {
  const containerRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const width = vertical ? 200 : 460;
  const aspectRatio = vertical ? "9 / 16" : "16 / 10";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.3 },
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        flexShrink: 0,
        width,
        aspectRatio,
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
        background: CARD_BG,
        position: "relative",
        pointerEvents: "none", // Disables all hover events and click interactions
      }}
    >
      {isIntersecting ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      ) : (
        <img
          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
          alt="YouTube thumbnail"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
    </div>
  );
}

function Carousel({ videos, vertical, isShortForm }) {
  const scrollRef = useRef(null);

  const scrollBy = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -400 : 400;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div
      className="carousel-wrapper"
      style={{ position: "relative", width: "100%" }}
    >
      {/* Left nav */}
      <button
        className="carousel-nav carousel-nav-left"
        onClick={() => scrollBy("left")}
        style={{
          position: "absolute",
          left: -20,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "rgba(10,10,12,0.80)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.70)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          opacity: 0,
          transition: "opacity 0.2s, color 0.2s, transform 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.transform = "translateY(-50%) scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(255,255,255,0.70)";
          e.currentTarget.style.transform = "translateY(-50%) scale(1)";
        }}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Right nav */}
      <button
        className="carousel-nav carousel-nav-right"
        onClick={() => scrollBy("right")}
        style={{
          position: "absolute",
          right: -20,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "rgba(10,10,12,0.80)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.70)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          opacity: 0,
          transition: "opacity 0.2s, color 0.2s, transform 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.transform = "translateY(-50%) scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(255,255,255,0.70)";
          e.currentTarget.style.transform = "translateY(-50%) scale(1)";
        }}
      >
        <ChevronRight size={20} />
      </button>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingBottom: 12,
        }}
      >
        {videos.map((videoId, i) => (
          <YouTubeEmbed key={i} videoId={videoId} vertical={vertical} />
        ))}
      </div>
    </div>
  );
}

function ServiceSection({ section, isShortForm }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div>
        <SectionTitle
          plain={section.titlePlain}
          highlight={section.titleHighlight}
        />

        {/* Rounded tags matching screenshot */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            maxWidth: "100%",
            marginBottom: 36,
          }}
        >
          {section.tags.map((tag, i) => (
            <Tag key={tag} label={tag} index={i} />
          ))}
        </div>
      </div>

      <Carousel
        videos={section.videos}
        vertical={section.vertical}
        isShortForm={isShortForm}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TabsSections() {
  const [activeTab, setActiveTab] = useState("short-form");
  const [dynamicTabs, setDynamicTabs] = useState(TABS);

  // Helper function to build dynamic tabs structure from database video list
  function getTabsWithData(videoList) {
    const tabCategories = [
      { id: "short-form", icon: Film, label: "Short-Form" },
      { id: "long-form", icon: Scissors, label: "Long Form" },
      { id: "distribution", icon: Mic, label: "Distribution" },
      { id: "saas", icon: Film, label: "SaaS" },
    ];

    return tabCategories.map((tab) => {
      const categoryVideos = videoList.filter((v) => v.category === tab.id);
      const sectionsMap = {};

      categoryVideos.forEach((v) => {
        const titleKey =
          v.title ||
          (v.type === "reel"
            ? "High-impact, scroll-stopping content"
            : "Featured Videos");
        if (!sectionsMap[titleKey]) {
          sectionsMap[titleKey] = {
            titlePlain: "",
            titleHighlight: "",
            description: v.description || "",
            tags: v.tags || [],
            videos: [],
            vertical: v.type === "reel",
          };

          const words = titleKey.split(" ");
          if (words.length <= 1) {
            sectionsMap[titleKey].titlePlain = "";
            sectionsMap[titleKey].titleHighlight = titleKey;
          } else {
            const highlightCount = words.length > 2 ? 2 : 1;
            sectionsMap[titleKey].titlePlain = words
              .slice(0, words.length - highlightCount)
              .join(" ");
            sectionsMap[titleKey].titleHighlight = words
              .slice(words.length - highlightCount)
              .join(" ");
          }
        }

        sectionsMap[titleKey].videos.push(v.videoId);

        if (v.tags && v.tags.length > 0) {
          const uniqueTags = new Set([
            ...sectionsMap[titleKey].tags,
            ...v.tags,
          ]);
          sectionsMap[titleKey].tags = Array.from(uniqueTags);
        }
      });

      return {
        ...tab,
        sections: Object.values(sectionsMap),
      };
    });
  }

  useEffect(() => {
    getVideos()
      .then((data) => {
        if (data && data.length > 0) {
          const formatted = getTabsWithData(data);
          setDynamicTabs(formatted);
        }
      })
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  const currentTab =
    dynamicTabs.find((t) => t.id === activeTab) || dynamicTabs[0];

  return (
    <section
      className="services-section-wrapper"
      style={{
        minHeight: "100vh",
        background: BG,
        fontFamily: '"Plus Jakarta Sans", sans-serif',
      }}
    >
      {/* Injected styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        ::-webkit-scrollbar { display: none; }
        .carousel-wrapper:hover .carousel-nav { opacity: 1 !important; }

        .services-section-wrapper {
          padding: 64px 20px;
        }
        @media (min-width: 640px) {
          .services-section-wrapper {
            padding: 96px 48px;
          }
        }

        @keyframes fadeUpIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .tabs-content-container {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }

        .tab-btn-responsive {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px 20px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          font-family: "Plus Jakarta Sans", sans-serif;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @media (min-width: 640px) {
          .tab-btn-responsive {
            padding: 10px 24px;
            font-size: 14px;
          }
        }

        .service-card-hover:hover {
          transform: translateY(-4px) scale(1.01);
          border-color: rgba(255, 255, 255, 0.15) !important;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.7);
        }

        .grid-short-form {
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 640px) {
          .grid-short-form {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .grid-short-form {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        .grid-large-form {
          grid-template-columns: 1fr;
        }
        @media (min-width: 640px) {
          .grid-large-form {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .grid-large-form {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <span
          style={{
            color: "rgba(255,255,255,0.40)",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            fontSize: 12,
            fontWeight: 600,
            display: "block",
            marginBottom: 12,
          }}
        >
          What We Do
        </span>
        <h2
          style={{
            fontFamily: '"Bricolage Grotesque", sans-serif',
            fontWeight: 800,
            fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
            lineHeight: 1.1,
            color: "#fff",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Our Services
        </h2>
      </div>

      {/* Tab switcher */}
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 56 }}
      >
        <div
          style={{
            display: "inline-flex",
            borderRadius: 9999,
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)",
            padding: 4,
            backdropFilter: "blur(12px)",
            gap: 4,
          }}
        >
          {dynamicTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="tab-btn-responsive"
                style={{
                  background: isActive ? "#ffffff" : "transparent",
                  color: isActive ? "#000000" : "rgba(255,255,255,0.45)",
                  fontWeight: isActive ? 600 : 500,
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                }}
              >
                {/* Render icon only for the active tab to match mockup */}
                {isActive && <Icon size={14} strokeWidth={2.5} />}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="tabs-content-container">
        {currentTab && currentTab.sections && currentTab.sections.length > 0 ? (
          <div
            key={currentTab.id}
            style={{
              animation: "fadeUpIn 600ms cubic-bezier(0.16, 1, 0.3, 1) both",
              display: "flex",
              flexDirection: "column",
              gap: 80,
            }}
          >
            {currentTab.sections.map((section, i) => (
              <ServiceSection
                key={i}
                section={section}
                isShortForm={activeTab === "short-form"}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            No videos uploaded for this category yet.
          </div>
        )}
      </div>
    </section>
  );
}
