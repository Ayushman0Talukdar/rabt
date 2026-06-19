export default function Footer() {
  return (
    <footer className="bg-[#000] px-8 pt-16 pb-12 w-full relative z-10">
      {/* Ready to level up? Card */}
      <div className="mx-auto max-w-6xl mb-20 rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900/40 to-neutral-950/40 px-6 py-16 text-center relative overflow-hidden shadow-2xl">
        {/* Glow effect at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-gradient-to-t from-blue-600/15 via-indigo-500/5 to-transparent blur-md pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <h2 className="text-3xl sm:text-5xl font-black text-white bricolage-grotesque tracking-tight mb-4">
          Ready to level up?
        </h2>
        <p className="text-white/60 text-sm sm:text-base max-w-md mx-auto mb-8 plus-jakarta-sans">
          Let's create content that makes your audience stop scrolling.
        </p>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-950 transition-all hover:bg-slate-100 hover:gap-3 shadow-lg"
        >
          Book a Discovery Call <span className="text-lg">→</span>
        </a>
      </div>

      {/* Main footer grid */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 gap-12 md:grid-cols-4 mb-16">
        {/* Col 1 — tagline */}
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-relaxed text-white/50 max-w-[240px] plus-jakarta-sans">
            A premium design & video editing agency helping brands create scroll-stopping content that converts.
          </p>
        </div>

        {/* Col 2 — Quick Links */}
        <div>
          <p className="mb-5 text-sm font-semibold text-white">Quick Links</p>
          <ul className="flex flex-col gap-3">
            {["Home", "About Us", "Services", "Portfolio", "Contact"].map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase().replace(" ", "")}`}
                  className="text-sm text-white/50 transition-colors hover:text-white"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Contact Us & Follow Us */}
        <div className="flex flex-col gap-8">
          <div>
            <p className="mb-5 text-sm font-semibold text-white">Contact Us</p>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="mailto:hello@rabt.in"
                  className="text-sm text-white/50 transition-colors hover:text-white"
                >
                  hello@rabt.in
                </a>
              </li>
              <li>
                <a
                  href="tel:+15551234567"
                  className="text-sm text-white/50 transition-colors hover:text-white"
                >
                  Phone: +1 (555) 123–4567
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold text-white">Follow Us</p>
            <div className="flex items-center gap-3">
              {/* Twitter / X */}
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors hover:border-white/30 hover:text-white"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors hover:border-white/30 hover:text-white"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors hover:border-white/30 hover:text-white"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors hover:border-white/30 hover:text-white"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Col 4 — Newsletter */}
        <div>
          <p className="mb-4 text-sm font-semibold text-white">Subscribe to our newsletter</p>
          <p className="mb-6 text-sm text-white/60 plus-jakarta-sans leading-relaxed">
            Get the latest content strategies, trends & insights.
          </p>
          <div className="relative flex items-center bg-white w-full h-14 rounded-full">
            <input
              type="email"
              placeholder="Enter email address"
              className="flex-1 bg-transparent pl-5 pr-4 h-full text-sm text-black placeholder:text-neutral-400 focus:outline-none"
            />
            <button className="min-w-max h-full rounded-full bg-[#2a2a2c] hover:bg-[#1d1d1f] px-7 text-sm font-semibold text-white transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto max-w-6xl border-t border-white/10 pt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-white/35">© 2026 rabt.in. All rights reserved.</p>
        <div className="flex items-center gap-6">
          {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-xs text-white/35 transition-colors hover:text-white/60"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer >
  );
}