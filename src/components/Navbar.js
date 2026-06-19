
'use client';

import { motion } from 'framer-motion';

const Navbar = () => {
  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed left-1/2 top-4 z-50 flex w-[90%] md:w-auto max-w-[450px] md:max-w-none -translate-x-1/2 rounded-full border border-white/15 bg-black/70 px-2 py-1.5 pl-3 sm:px-3 sm:py-2 sm:pl-4 shadow-[0_30px_100px_rgba(8,10,24,0.35)] backdrop-blur-xl backdrop-saturate-180 md:scale-90">
        <div className="flex w-full items-center justify-between gap-3 sm:gap-4 text-sm text-slate-200">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center text-sm font-semibold tracking-widest text-white gap-1.5 sm:gap-4">
            <img src="/Rabt.png" alt="RABT" className="h-6 w-8 sm:h-7 sm:w-10 rounded-lg invert object-cover" />
            <p className="bricolage-grotesque font-bold text-[12px] sm:text-[14px] hidden min-[360px]:block">rabt.in</p>
          </a>

          <nav className="hidden items-center gap-2 md:flex">
            <a href="#services" onClick={(e) => handleScroll(e, 'services')} className="transition hover:text-white text-neutral-400 hover:bg-white/10 px-2 py-2 rounded-full font-semibold">Services</a>
            <a href="#work" onClick={(e) => handleScroll(e, 'work')} className="transition hover:text-white text-neutral-400 hover:bg-white/10 px-2 py-2 rounded-full font-semibold">Work</a>
            <a href="#reviews" onClick={(e) => handleScroll(e, 'reviews')} className="transition hover:text-white text-neutral-400 hover:bg-white/10 px-2 py-2 rounded-full font-semibold">Review</a>
            <a href="#faq" onClick={(e) => handleScroll(e, 'faq')} className="transition hover:text-white text-neutral-400 hover:bg-white/10 px-2 py-2 rounded-full font-semibold">FAQ</a>
          </nav>

          <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="rounded-full bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-slate-950 transition hover:bg-slate-100 whitespace-nowrap">
            Book a call
          </a>
        </div>
      </motion.header>
  )
}

export default Navbar;