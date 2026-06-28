"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getPills } from "@/lib/cms/pills";
import { resolveImageUrl } from "@/lib/sanity";
import { DottedMap } from "@/components/ui/dotted-map";

const markers = [];

const ROW_ONE = [
  {
    label: "Coaches",
    avatarBg: "#1a1f35",
    pillBg: "#111622",
    border: "rgba(80,100,200,0.45)",
    glow: "rgba(60,80,180,0.18)",
  },
  {
    label: "Founders",
    avatarBg: "#1e1428",
    pillBg: "#150f1e",
    border: "rgba(140,70,200,0.45)",
    glow: "rgba(120,50,180,0.18)",
  },
  {
    label: "YouTubers",
    avatarBg: "#1a1a1e",
    pillBg: "#111114",
    border: "rgba(80,80,100,0.4)",
    glow: "rgba(60,60,80,0.15)",
  },
  {
    label: "Streamers",
    avatarBg: "#0f1e20",
    pillBg: "#0a1518",
    border: "rgba(40,130,150,0.45)",
    glow: "rgba(30,110,130,0.18)",
  },
];

const ROW_TWO = [
  {
    label: "Creators",
    avatarBg: "#201010",
    pillBg: "#160a0a",
    border: "rgba(180,40,40,0.5)",
    glow: "rgba(150,30,30,0.2)",
  },
  {
    label: "Gamers",
    avatarBg: "#0f1e10",
    pillBg: "#091409",
    border: "rgba(50,150,50,0.45)",
    glow: "rgba(40,120,40,0.18)",
  },
  {
    label: "Podcasters",
    avatarBg: "#201810",
    pillBg: "#161008",
    border: "rgba(160,100,40,0.5)",
    glow: "rgba(140,80,30,0.2)",
  },
  {
    label: "SaaS Brands",
    avatarBg: "#0c1820",
    pillBg: "#081018",
    border: "rgba(40,100,140,0.42)",
    glow: "rgba(30,80,120,0.15)",
  },
];

const ROW_THREE = [
  {
    label: "Agencies",
    avatarBg: "#141028",
    pillBg: "#0e0b1e",
    border: "rgba(100,80,180,0.45)",
    glow: "rgba(80,60,160,0.18)",
  },
  {
    label: "Influencers",
    avatarBg: "#201018",
    pillBg: "#180810",
    border: "rgba(180,40,80,0.5)",
    glow: "rgba(150,30,60,0.2)",
  },
  {
    label: "Educators",
    avatarBg: "#0e1e1e",
    pillBg: "#081818",
    border: "rgba(40,140,140,0.45)",
    glow: "rgba(30,120,120,0.18)",
  },
  {
    label: "Start-ups",
    avatarBg: "#1a1028",
    pillBg: "#130c1e",
    border: "rgba(130,50,180,0.5)",
    glow: "rgba(110,40,160,0.2)",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Pill = ({ pill }) => {
  const pillBg = pill.theme?.pillBg || pill.pillBg || "#111622";
  const border = pill.theme?.border || pill.border || "rgba(80,100,200,0.45)";
  const glow = pill.theme?.glow || pill.glow || "rgba(60,80,180,0.18)";
  const avatarBg = pill.theme?.avatarBg || pill.avatarBg || "#1a1f35";
  const avatarSrc = resolveImageUrl(pill.avatar) || pill.avatarUrl;

  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Calculate rotation relative to mouse position (max 15 degrees)
    const rotateX = -(y / (rect.height / 2)) * 15;
    const rotateY = (x / (rect.width / 2)) * 15;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const borderStyle = useMemo(() => {
    return `1px solid ${border.replace(/[\d.]+\)$/, (m) => (parseFloat(m) * 0.8).toFixed(2) + ")")}`;
  }, [border]);

  const transformStr = isHovered
    ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.06, 1.06, 1.06)`
    : "none";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: pillBg,
        border: borderStyle,
        boxShadow: isHovered
          ? `rgba(255,255,255,0.08) 0px 1px 0px inset, rgba(0,0,0,0.4) 0px -1px 2px inset, 0 0 24px 8px ${glow}, rgba(0,0,0,0.3) 0px 4px 12px`
          : `rgba(255,255,255,0.05) 0px 1px 0px inset, rgba(0,0,0,0.35) 0px -1px 2px inset, 0 0 16px 3px ${glow}, rgba(0,0,0,0.25) 0px 2px 8px`,
        willChange: isHovered ? "transform" : "auto",
        transform: transformStr,
        transition: isHovered ? "transform 0.08s ease-out, box-shadow 0.2s ease" : "transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease",
      }}
      className="group flex items-center gap-2 sm:gap-3 pr-2 py-1.5 sm:pr-4.5 sm:py-2 sm:pl-2 rounded-full cursor-default select-none flex-shrink-0 pointer-events-auto"
    >
      <div
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: avatarBg, transform: "translateZ(20px)" }}
      >
        {avatarSrc && (
          <Image
            src={avatarSrc}
            alt={pill.label}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <span
        className="text-[12px] sm:text-[14px] text-white/85 group-hover:text-white transition-colors duration-200 whitespace-nowrap pr-1 bricolage-grotesque font-bold"
        style={{ transform: "translateZ(10px)" }}
      >
        {pill.label}
      </span>
    </div>
  );
};

const PillRow = ({ pills }) => (
  <motion.div
    variants={itemVariants}
    className="flex flex-nowrap justify-center gap-2 sm:gap-3 pointer-events-none"
    style={{ willChange: "transform, opacity" }}
  >
    {pills.map((pill) => (
      <Pill key={pill.label} pill={pill} />
    ))}
  </motion.div>
);

export default function Workwith() {
  const [pillsList, setPillsList] = useState([]);
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    getPills()
      .then((data) => {
        if (data && data.length > 0) {
          setPillsList(data);
        }
      })
      .catch((err) => console.error("Error fetching pills:", err));
  }, []);

  const rowOne =
    pillsList.length > 0 ? pillsList.filter((p) => p.row === 1) : ROW_ONE;
  const rowTwo =
    pillsList.length > 0 ? pillsList.filter((p) => p.row === 2) : ROW_TWO;
  const rowThree =
    pillsList.length > 0 ? pillsList.filter((p) => p.row === 3) : ROW_THREE;

  const allPills = [...rowOne, ...rowTwo, ...rowThree];

  return (
    <section ref={sectionRef} className="relative w-full pt-16 pb-56 sm:pt-24 sm:pb-72 overflow-hidden bg-black flex flex-col items-center justify-center min-h-[700px]">
      {/* Centered Eyebrow Subtitle */}
      <motion.div
        variants={itemVariants}
        className="w-full flex justify-center text-center mb-10 sm:mb-16 z-10"
        style={{ willChange: "transform, opacity" }}
      >
        <div className="bricolage-grotesque text-sm sm:text-base font-bold text-neutral-600 px-4">
          The creative partner behind high-performing content
        </div>
      </motion.div>

      {/* Centered Pills Container */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-10 flex flex-col items-center justify-center z-10">
        {/* Background Dotted Map */}
        <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none opacity-45 translate-y-24">
          <div className="w-full max-w-5xl aspect-[2/1]">
            {isInView && (
              <DottedMap
                markers={markers}
                pulse
                dotColor="rgba(255, 255, 255, 0.95)"
                markerColor="rgba(56, 189, 248, 0.95)"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ amount: 0.2 }}
          className="w-full flex flex-col gap-3 sm:gap-4 items-center justify-center pointer-events-none"
        >
          <PillRow pills={rowOne} />
          <PillRow pills={rowTwo} />
          <PillRow pills={rowThree} />
        </motion.div>
      </div>
    </section>
  );
}
