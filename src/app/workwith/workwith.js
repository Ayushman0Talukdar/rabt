'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPills } from "@/lib/cms/pills";
import { resolveImageUrl } from "@/lib/sanity";

const ROW_ONE = [
  { label: "Coaches", avatarBg: "#1a1f35", pillBg: "#111622", border: "rgba(80,100,200,0.45)", glow: "rgba(60,80,180,0.18)" },
  { label: "Founders", avatarBg: "#1e1428", pillBg: "#150f1e", border: "rgba(140,70,200,0.45)", glow: "rgba(120,50,180,0.18)" },
  { label: "YouTubers", avatarBg: "#1a1a1e", pillBg: "#111114", border: "rgba(80,80,100,0.4)", glow: "rgba(60,60,80,0.15)" },
  { label: "Streamers", avatarBg: "#0f1e20", pillBg: "#0a1518", border: "rgba(40,130,150,0.45)", glow: "rgba(30,110,130,0.18)" },
];

const ROW_TWO = [
  { label: "Creators", avatarBg: "#201010", pillBg: "#160a0a", border: "rgba(180,40,40,0.5)", glow: "rgba(150,30,30,0.2)" },
  { label: "Gamers", avatarBg: "#0f1e10", pillBg: "#091409", border: "rgba(50,150,50,0.45)", glow: "rgba(40,120,40,0.18)" },
  { label: "Podcasters", avatarBg: "#201810", pillBg: "#161008", border: "rgba(160,100,40,0.5)", glow: "rgba(140,80,30,0.2)" },
  { label: "SaaS Brands", avatarBg: "#0c1820", pillBg: "#081018", border: "rgba(40,100,140,0.42)", glow: "rgba(30,80,120,0.15)" },
];

const ROW_THREE = [
  { label: "Agencies", avatarBg: "#141028", pillBg: "#0e0b1e", border: "rgba(100,80,180,0.45)", glow: "rgba(80,60,160,0.18)" },
  { label: "Influencers", avatarBg: "#201018", pillBg: "#180810", border: "rgba(180,40,80,0.5)", glow: "rgba(150,30,60,0.2)" },
  { label: "Educators", avatarBg: "#0e1e1e", pillBg: "#081818", border: "rgba(40,140,140,0.45)", glow: "rgba(30,120,120,0.18)" },
  { label: "Musicians", avatarBg: "#1a1028", pillBg: "#130c1e", border: "rgba(130,50,180,0.5)", glow: "rgba(110,40,160,0.2)" },
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

const PillRow = ({ pills }) => (
  <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 md:gap-4">
    {pills.map((pill) => {
      const pillBg = pill.theme?.pillBg || pill.pillBg || "#111622";
      const border = pill.theme?.border || pill.border || "rgba(80,100,200,0.45)";
      const glow = pill.theme?.glow || pill.glow || "rgba(60,80,180,0.18)";
      const avatarBg = pill.theme?.avatarBg || pill.avatarBg || "#1a1f35";
      const avatarSrc = resolveImageUrl(pill.avatar) || pill.avatarUrl;

      return (
        <div
          key={pill.label}
          style={{
            background: `linear-gradient(145deg, ${pillBg} 0%, rgba(255,255,255,0.01) 100%)`,
            border: `1px solid ${border.replace(/[\d.]+\)$/, (m) => `${(parseFloat(m) * 0.3).toFixed(2)})`)}`,
            boxShadow: `rgba(255,255,255,0.03) 0px 1px 0px inset, rgba(0,0,0,0.35) 0px -1px 2px inset, 0 0 18px 4px ${glow}, rgba(0,0,0,0.25) 0px 2px 8px`,
          }}
          className="group flex items-center gap-2.5 px-1.5 py-1 pr-3 rounded-full cursor-default transition-all duration-300 hover:scale-[1.04]"
        >
          <div
            className="w-10 h-10 rounded-full border border-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: avatarBg }}
          >
            {avatarSrc && (
              <img src={avatarSrc} alt={pill.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
          </div>
          <span className="text-[12px] text-white/50 whitespace-nowrap pr-3 bricolage-grotesque font-bold">
            {pill.label}
          </span>
        </div>
      );
    })}
  </motion.div>
);

export default function Workwith() {
  const [pillsList, setPillsList] = useState([]);

  useEffect(() => {
    getPills()
      .then((data) => {
        if (data && data.length > 0) {
          setPillsList(data);
        }
      })
      .catch((err) => console.error("Error fetching pills:", err));
  }, []);

  const rowOne = pillsList.length > 0 ? pillsList.filter((p) => p.row === 1) : ROW_ONE;
  const rowTwo = pillsList.length > 0 ? pillsList.filter((p) => p.row === 2) : ROW_TWO;
  const rowThree = pillsList.length > 0 ? pillsList.filter((p) => p.row === 3) : ROW_THREE;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      viewport={{ amount: 0.3 }}
      className="space-y-4 px-4 pb-10"
    >
      <motion.div variants={itemVariants} className="w-full flex justify-center">
        <div className="bricolage-grotesque text-s font-bold text-neutral-600 mb-10">
          We work with all kinds of creators & brands
        </div>
      </motion.div>

      <div className="flex flex-col gap-4 scale-95">
        <PillRow pills={rowOne} />
        <PillRow pills={rowTwo} />
        <PillRow pills={rowThree} />
      </div>
    </motion.div>
  );
}