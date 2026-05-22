

const Navbar = () => {
  return (
    <header className="fixed left-1/2 top-4 z-50 inline-flex -translate-x-1/2 rounded-full border border-white/15 bg-black/70 px-3 py-2 pl-4 shadow-[0_30px_100px_rgba(8,10,24,0.35)] backdrop-blur-xl backdrop-saturate-180 md:scale-90">
        <div className="flex items-center justify-center gap-4 text-sm text-slate-200">
          <a href="#" className="flex items-center text-sm font-semibold tracking-widest text-white gap-4">
            <img src="/Rabt.png" alt="RABT" className="h-7 w-10 rounded-lg invert object-cover" /><p className="bricolage-grotesque font-bold text-[14px]">rabt.in</p>
          </a>

          <nav className="hidden items-center gap-2 md:flex">
            <a href="#services" className="transition hover:text-white text-neutral-400 hover:bg-white/10 px-2 py-2 rounded-full font-semibold">Services</a>
            <a href="#work" className="transition hover:text-white text-neutral-400 hover:bg-white/10 px-2 py-2 rounded-full font-semibold">Work</a>
            <a href="#studio" className="transition hover:text-white text-neutral-400 hover:bg-white/10 px-2 py-2 rounded-full font-semibold">Review</a>
            <a href="#contact" className="transition hover:text-white text-neutral-400 hover:bg-white/10 px-2 py-2 rounded-full font-semibold">FAQ</a>
          </nav>

          <a href="#contact" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
            Book a call
          </a>
        </div>
      </header>
  )
}

export default Navbar;