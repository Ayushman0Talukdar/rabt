import { resolveImageUrl } from "@/lib/sanity";
import Image from "next/image";

const CreatorCard = ({ card }) => (
  <div
    className="group relative flex-shrink-0 overflow-hidden transition-all duration-300 hover:border-white/[0.12]"
    style={{
      width: "380px",
      borderRadius: "16px",
      border: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(255,255,255,0.02)",
    }}
  >
    <div className="relative overflow-hidden user-select-none" style={{ height: "256px" }}>
      <Image
        src={resolveImageUrl(card.image)}
        alt={card.name}
        fill
        sizes="380px"
        className="w-full user-select-none h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, #08080a, rgba(8,8,10,0.4), transparent)",
        }}
      />
      <span
        className="absolute user-select-none top-3 right-3 rounded-full border border-white/[0.1] bg-black/50 backdrop-blur-md text-white/60"
        style={{
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.05em",
          padding: "4px 12px",
        }}
      >
        {card.platform}
      </span>
      <div className="absolute user-select-none bottom-3 left-4">
        <div
          className="text-white user-select-none"
          style={{
            fontFamily: '"Bricolage Grotesque", sans-serif',
            fontWeight: 600,
            fontSize: "18px",
          }}
        >
          {card.name}
        </div>
        <div className="text-white/40 user-select-none" style={{ fontSize: "12px" }}>
          {card.role}
        </div>
      </div>
    </div>
    <div className="p-4 user-select-none">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white/25"
          >
            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span className="text-white/35" style={{ fontSize: "12px" }}>
            Total Views
          </span>
        </div>
        <span
          className="flex items-center gap-1 text-emerald-400/80"
          style={{ fontSize: "11px", fontWeight: 600 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
          {card.growth}
        </span>
      </div>
      <div
        className="text-white"
        style={{
          fontFamily: '"Bricolage Grotesque", sans-serif',
          fontWeight: 700,
          fontSize: "32px",
          lineHeight: 1.1,
        }}
      >
        {card.metric}
      </div>
    </div>
  </div>
);

export default CreatorCard;
