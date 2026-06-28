"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "../../public/RABTwt.png";

const Navbar = ({ onClaimTrial }) => {
  const pathname = usePathname();

  const handleScroll = (e, targetId) => {
    e.preventDefault();
    if (pathname === "/") {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      window.location.href = `/#${targetId}`;
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed left-1/2 top-4 z-50 flex w-[90%] md:w-auto max-w-[450px] md:max-w-none -translate-x-1/2 rounded-full border border-white/15 bg-black/70 py-2 pr-0 sm:px-4 sm:py-2.5 sm:px-2.5 shadow-[0_30px_100px_rgba(8,10,24,0.35)] backdrop-blur-xl backdrop-saturate-180 md:scale-100"
    >
      <div className="flex w-full items-center rounded-full justify-between gap-3 sm:gap-5 text-[15px] text-slate-200">
        <a
          href="/"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center rounded-full gap-2"
        >
          <Image
            src={logo}
            alt="RABT"
            className="h-12 w-auto rounded-full object-cover"
          />
        </a>

        <nav className="hidden items-center gap-2 md:flex whitespace-nowrap">
          <a
            href="#services"
            onClick={(e) => handleScroll(e, "services")}
            className="transition hover:text-white text-neutral-400 hover:bg-white/10 px-3 py-2 rounded-full font-semibold whitespace-nowrap"
          >
            Services
          </a>
          <a className="transition hover:text-white text-neutral-400 hover:bg-white/10 px-3 py-2 rounded-full font-semibold whitespace-nowrap" href="">
            A2A
          </a>
          <a
            href="#work"
            onClick={(e) => handleScroll(e, "work")}
            className="transition hover:text-white text-neutral-400 hover:bg-white/10 px-3 py-2 rounded-full font-semibold whitespace-nowrap"
          >
            Work
          </a>
          <a
            href="#reviews"
            onClick={(e) => handleScroll(e, "reviews")}
            className="transition hover:text-white text-neutral-400 hover:bg-white/10 px-3 py-2 rounded-full font-semibold whitespace-nowrap"
          >
            Review
          </a>
          <a
            href="#faq"
            onClick={(e) => handleScroll(e, "faq")}
            className="transition hover:text-white text-neutral-400 hover:bg-white/10 px-3 py-2 rounded-full font-semibold whitespace-nowrap"
          >
            FAQ
          </a>
          <a className="transition hover:text-white text-neutral-400 hover:bg-white/10 px-3 py-2 rounded-full font-semibold whitespace-nowrap" href="/content-secrets">
            Content Secrets
          </a>
        </nav>

        <button
          onClick={(e) => {
            if (onClaimTrial) {
              e.preventDefault();
              onClaimTrial();
            } else {
              handleScroll(e, "contact");
            }
          }}
          className="rounded-full bg-white px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-[15px] font-semibold text-slate-950 transition hover:bg-slate-100 whitespace-nowrap"
        >
          Claim Your Trial
        </button>
      </div>
    </motion.header>
  );
};

export default Navbar;
