"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Film,
  Scissors,
  Mic,
  ChevronLeft,
  ChevronRight,
  Play,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  RotateCw,
} from "lucide-react";
import { getVideos } from "@/lib/cms/videos";


// ─── Constants ────────────────────────────────────────────────────────────────

const BG = "#000000"; // Pure black background matching screenshot
const CARD_BG = "#0c0c0e"; // Dark premium card background

const ShortsLogo = () => (
  <svg viewBox="0 0 24 24" style={{ width: 24, height: 24, fill: "#FF0000" }}>
    <path d="m18.931 9.99l-1.441-.601l1.717-.913a4.48 4.48 0 0 0 1.874-6.078a4.506 4.506 0 0 0-6.09-1.874L4.792 5.929a4.5 4.5 0 0 0-2.402 4.193a4.52 4.52 0 0 0 2.666 3.904c.036.012 1.442.6 1.442.6l-1.706.901a4.51 4.51 0 0 0-2.369 3.967A4.53 4.53 0 0 0 6.93 24c.725 0 1.437-.174 2.08-.508l10.21-5.406a4.49 4.49 0 0 0 2.39-4.192a4.53 4.53 0 0 0-2.678-3.904Zm-9.334 5.2V8.824l6.007 3.184z" />
  </svg>
);

const YoutubeLogo = () => (
  <svg viewBox="0 0 24 24" style={{ width: 28, height: 28, fill: "#FF0000" }}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.387.507 9.387.507s7.517 0 9.387-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const mockViews = ["61k views", "18k views", "134k views", "4.6k views", "1.8m views"];

const mockChannels = [
  {
    avatar: "https://picsum.photos/seed/techno/100/100",
    name: "Technoblade",
    verified: true,
    duration: "28:43",
    views: "24m views • 6 years ago",
    ambience: "rgba(244, 63, 94, 0.08)", // Red/pink dominant tint
    border: "rgba(244, 63, 94, 0.25)"
  },
  {
    avatar: "https://picsum.photos/seed/notyourtype/100/100",
    name: "NOT YOUR TYPE",
    verified: true,
    duration: "8:03",
    views: "23m views • 9 months ago",
    ambience: "rgba(56, 189, 248, 0.08)", // Blue dominant tint
    border: "rgba(56, 189, 248, 0.25)"
  },
  {
    avatar: "https://picsum.photos/seed/alexa/100/100",
    name: "alexa hare",
    verified: false,
    duration: "1:57",
    views: "218k views • 2 weeks ago",
    ambience: "rgba(251, 146, 60, 0.08)", // Orange dominant tint
    border: "rgba(251, 146, 60, 0.25)"
  }
];

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
        titlePlain: "Short-form content designed for attention.",
        titleHighlight: "",
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
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
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
        videos: [
          "https://res.cloudinary.com/demo/video/upload/dog.mp4",
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        ],
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
        videos: [
          "https://res.cloudinary.com/demo/video/upload/dog.mp4",
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        ],
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
        videos: [
          "https://res.cloudinary.com/demo/video/upload/dog.mp4",
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        ],
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
        padding: "9px 0",
        borderRadius: "9999px",
        fontSize: "13.5px",
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
        e.currentTarget.style.boxShadow = `0 4px 4px ${style.border}`;
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

function getOptimizedCloudinaryUrl(url) {
  if (!url || !url.includes("cloudinary.com")) return url;
  if (url.includes("/upload/")) {
    if (!url.includes("/w_480")) {
      return url.replace("/upload/", "/upload/f_auto,q_auto,w_480/");
    }
  }
  return url;
}

function NativeVideoEmbed({ videoUrl, isIntersecting, videoRef }) {
  const optimizedVideoUrl = getOptimizedCloudinaryUrl(videoUrl);
  const baseUrl = optimizedVideoUrl.split("?")[0];
  const posterUrl = baseUrl.includes("cloudinary.com")
    ? baseUrl.replace(/\.[^/.]+$/, ".jpg")
    : undefined;

  const isImg = videoUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i) || videoUrl.includes("/image/upload/");

  if (isImg) {
    return (
      <img
        src={optimizedVideoUrl}
        alt="Thumbnail placeholder"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      src={optimizedVideoUrl}
      poster={posterUrl}
      preload={isIntersecting ? "auto" : "none"}
      autoPlay
      muted
      loop
      playsInline
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
      onError={(e) => {
        const target = e.currentTarget;
        console.warn("Video failed to load:", target.src);
      }}
    />
  );
}

function VideoPlayer({ video, vertical }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const width = vertical ? 250 : 520;
  const aspectRatio = vertical ? "9 / 16" : "16 / 10";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.01,
        rootMargin: "0px 00px 0px 300px"
      },
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isIntersecting) {
      videoEl.play().catch((err) => {
        // Safe catch if browser blocks autoplay or play interrupts
        console.log("Play interrupted:", err.message);
      });
    } else {
      videoEl.pause();
    }
  }, [isIntersecting]);

  let videoUrl = "";

  if (typeof video === "string") {
    videoUrl = video;
  } else if (video && typeof video === "object") {
    videoUrl = video.videoUrl || "";
  }

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
        cursor: "pointer",
        pointerEvents: "auto",
        transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s",
      }}
      className="service-card-hover"
    >
      {videoUrl ? (
        <NativeVideoEmbed videoUrl={videoUrl} isIntersecting={isIntersecting} videoRef={videoRef} />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#121214",
          }}
        />
      )}
    </div>
  );
}

function ServiceSection({ section, isShortForm }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [selectedTag, setSelectedTag] = useState("All");

  // Filter video items based on selectedTag
  const filteredVideos = section.videos.filter((video, idx) => {
    if (selectedTag === "All") return true;

    // Check if the video object itself contains the tag
    if (video && typeof video === "object" && video.tags) {
      return video.tags.includes(selectedTag);
    }

    // Fallback static mapping for mock video URLs
    const mockTagsMap = [
      ["Motion Graphics", "Color Grading", "Sound Design"],
      ["B-Roll Integration", "Pacing & Cuts", "Sound Design"],
      ["Thumbnail Design", "Motion Graphics", "Color Grading"],
    ];
    const tags = mockTagsMap[idx % mockTagsMap.length];
    return tags.includes(selectedTag);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: section.vertical ? 24 : 20 }}>
      {/* YouTube Shorts style Header or Standard Header */}
      {section.vertical ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 20px" }}>
          <ShortsLogo />
          <h3 style={{ fontSize: 24, fontWeight: 700, color: "#fff", fontFamily: '"Plus Jakarta Sans", sans-serif', margin: 0 }}>
            Shorts
          </h3>
        </div>
      ) : (
        (section.titlePlain || section.titleHighlight || section.description) && (
          <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <YoutubeLogo />
              {section.titlePlain && (
                <h3 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: 0, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                  {section.titlePlain} <span style={{ color: "#fa3c23" }}>{section.titleHighlight}</span>
                </h3>
              )}
            </div>
            {section.description && (
              <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 16, lineHeight: 1.5, maxWidth: "600px", margin: 0 }}>
                {section.description}
              </p>
            )}
          </div>
        )
      )}

      {/* YouTube-style Filter Pills (only on long-form / horizontal grids) */}
      {!section.vertical && section.tags && section.tags.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            padding: "0 20px",
            width: "100%",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="tag-pills-row"
        >
          {["All", ...section.tags].map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                style={{
                  background: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.08)",
                  color: isActive ? "#000000" : "#ffffff",
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid of video cards */}
      <div
        className={section.vertical ? "grid-short-form" : "grid-large-form"}
        style={{
          display: "grid",
          gap: 20,
          padding: "0 20px",
          width: "100%",
        }}
      >
        {filteredVideos.map((video, idx) => {
          let url = "";
          let title = "";
          if (typeof video === "string") {
            url = video;
          } else if (video && typeof video === "object") {
            url = video.videoUrl || "";
            title = video.title || "";
          }

          if (section.vertical) {
            // YouTube Shorts high-fidelity layout
            return (
              <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div
                  className="service-card-hover"
                  style={{
                    background: CARD_BG,
                    borderRadius: 12,
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    overflow: "hidden",
                    position: "relative",
                    aspectRatio: "9/16",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                  }}
                >
                  {/* "New" Badge Overlay */}
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      background: "rgba(0, 0, 0, 0.6)",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: 4,
                      zIndex: 10,
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                    }}
                  >
                    New
                  </span>

                  <div
                    style={{
                      position: "absolute",
                      right: 8,
                      bottom: 12,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                      zIndex: 10,
                    }}
                  >
                    {/* Like */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "rgba(0, 0, 0, 0.6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        <ThumbsUp size={16} />
                      </div>
                      <span style={{ fontSize: 9, color: "#fff", fontWeight: 600, marginTop: 2, textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}>
                        79k
                      </span>
                    </div>

                    {/* Dislike */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "rgba(0, 0, 0, 0.6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        <ThumbsDown size={16} />
                      </div>
                      <span style={{ fontSize: 9, color: "#fff", fontWeight: 600, marginTop: 2, textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}>
                        Dislike
                      </span>
                    </div>

                    {/* Comment */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "rgba(0, 0, 0, 0.6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        <MessageSquare size={16} />
                      </div>
                      <span style={{ fontSize: 9, color: "#fff", fontWeight: 600, marginTop: 2, textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}>
                        917
                      </span>
                    </div>

                    {/* Share */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "rgba(0, 0, 0, 0.6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        <Share2 size={16} />
                      </div>
                      <span style={{ fontSize: 9, color: "#fff", fontWeight: 600, marginTop: 2, textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}>
                        Share
                      </span>
                    </div>

                    {/* Remix */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "rgba(0, 0, 0, 0.6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        <RotateCw size={14} />
                      </div>
                      <span style={{ fontSize: 9, color: "#fff", fontWeight: 600, marginTop: 2, textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}>
                        Remix
                      </span>
                    </div>

                    {/* Channel Profile Icon */}
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 4,
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.3)",
                        cursor: "pointer",
                        marginTop: 4,
                      }}
                    >
                      <img
                        src="https://picsum.photos/seed/shortsavatar/100/100"
                        alt="avatar"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  </div>

                  <video
                    src={url}
                    loop
                    muted
                    playsInline
                    autoPlay
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>

                {/* Title, options menu, and views metadata below card */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "0 4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <p
                      style={{
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 600,
                        margin: 0,
                        lineHeight: 1.3,
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {title || "Short video showing premium visual editing"}
                    </p>
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "rgba(255, 255, 255, 0.6)",
                        cursor: "pointer",
                        padding: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 0.4)",
                      fontSize: 12,
                      fontWeight: 500,
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                    }}
                  >
                    {mockViews[idx % mockViews.length]}
                  </span>
                </div>
              </div>
            );
          }

          // Standard horizontal layout
          const channel = mockChannels[idx % mockChannels.length];
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                background: isHovered ? channel.ambience : "transparent",
                border: "1px solid",
                borderColor: isHovered ? channel.border : "transparent",
                borderRadius: 16,
                padding: 12,
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                cursor: "pointer",
              }}
            >
              {/* Video container */}
              <div
                className="service-card-hover"
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  borderRadius: 12,
                  overflow: "hidden",
                  position: "relative",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
              >
                <video
                  src={url}
                  loop
                  muted
                  playsInline
                  autoPlay
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                {/* Duration Badge */}
                <span
                  style={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    background: "rgba(0, 0, 0, 0.75)",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 6px",
                    borderRadius: 4,
                    zIndex: 10,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                  }}
                >
                  {channel.duration}
                </span>
              </div>

              {/* Metadata block below video */}
              <div style={{ display: "flex", gap: 12, padding: "0 4px" }}>
                {/* Channel avatar */}
                <div style={{ flexShrink: 0 }}>
                  <img
                    src={channel.avatar}
                    alt={channel.name}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  />
                </div>

                {/* Details */}
                <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <p
                      style={{
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 600,
                        margin: 0,
                        lineHeight: 1.3,
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {title || "Premium video showing custom high-quality editing"}
                    </p>
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "rgba(255, 255, 255, 0.6)",
                        cursor: "pointer",
                        padding: 0,
                        marginTop: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  {/* Channel name & verified check badge */}
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                    <span
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: 12,
                        fontWeight: 500,
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                      }}
                    >
                      {channel.name}
                    </span>
                    {channel.verified && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: "rgba(255, 255, 255, 0.25)",
                          color: "#fff",
                          fontSize: 8,
                          fontWeight: 900,
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </div>

                  {/* Views count */}
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 0.4)",
                      fontSize: 12,
                      fontWeight: 500,
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                    }}
                  >
                    {channel.views}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
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
            titlePlain: tab.id === "short-form" ? "Short-form content designed for attention." : "",
            titleHighlight: "",
            description: v.description || "",
            tags: v.tags || [],
            videos: [],
            vertical: v.type === "reel",
          };

          if (tab.id !== "short-form") {
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
        }

        sectionsMap[titleKey].videos.push({
          videoId: v.videoId,
          videoUrl: v.videoUrl,
        });

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
        ::-webkit-scrollbar { display: none; }
        .carousel-wrapper:hover .carousel-nav { opacity: 1 !important; }

        .services-section-wrapper {
          padding: 0px 20px;
        }
        @media (min-width: 1024px) {
          .services-section-wrapper {
            padding: 0px 200px;
          }
        }

        @keyframes fadeUpIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .tabs-content-container {
          max-width: 100%;
          width: 100%;
          margin: 0;
        }

        .tab-btn-responsive {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 10px 22px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          font-family: "Plus Jakarta Sans", sans-serif;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @media (min-width: 640px) {
          .tab-btn-responsive {
            padding: 12px 28px;
            font-size: 15.5px;
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
      <div style={{ textAlign: "center", marginBottom: 40, padding: "0 24px" }}>
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
        style={{ display: "flex", justifyContent: "center", marginBottom: 0, padding: "0 20px" }}
      >
        <div
          style={{
            display: "inline-flex",
            borderRadius: 9999,
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)",
            padding: 0,
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
