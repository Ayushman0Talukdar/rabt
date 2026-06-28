"use client";

import { useState, useEffect } from "react";
import { Mail, User, CheckCircle2, ArrowRight, X } from "lucide-react";
import { useLenis } from "lenis/react";

export default function LeadPopup({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const lenis = useLenis();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const preventDefault = (e) => {
      e.preventDefault();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.userSelect = "none";

      // Stop Lenis smooth scroll loop
      if (lenis) lenis.stop();

      // Prevent scrolling gestures
      window.addEventListener("wheel", preventDefault, { passive: false });
      window.addEventListener("touchmove", preventDefault, { passive: false });
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.userSelect = "";

      // Resume Lenis smooth scroll loop
      if (lenis) lenis.start();

      window.removeEventListener("wheel", preventDefault);
      window.removeEventListener("touchmove", preventDefault);
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.userSelect = "";

      // Resume Lenis smooth scroll loop on unmount
      if (lenis) lenis.start();

      window.removeEventListener("wheel", preventDefault);
      window.removeEventListener("touchmove", preventDefault);
    };
  }, [isOpen, lenis]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsLoading(true);
    // Simulate submission delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const handleClose = (wasSubmitted = false) => {
    onClose(wasSubmitted);
    // Reset states on close
    setTimeout(() => {
      setIsSubmitted(false);
      setName("");
      setEmail("");
    }, 300);
  };

  return (
    <>
      <style>{`
        .liquidGlass-wrapper {
          position: relative;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          user-select: text;
          -webkit-user-select: text;
          background: rgba(12, 13, 18, 0.8);
        }
        .liquidGlass-effect {
          position: absolute;
          z-index: 0;
          inset: 0;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          overflow: hidden;
          isolation: isolate;
          pointer-events: none;
          transform: translate3d(0, 0, 0);
          will-change: backdrop-filter;
        }
        .liquidGlass-tint {
          z-index: 1;
          position: absolute;
          inset: 0;
          background: transparent;
          pointer-events: none;
        }
        .liquidGlass-shine {
          position: absolute;
          inset: 0;
          z-index: 2;
          overflow: hidden;
          box-shadow: inset 1px 1px 2px 0 rgba(255, 255, 255, 0.2),
            inset -1px -1px 2px 0 rgba(255, 255, 255, 0.05);
          pointer-events: none;
        }
      `}</style>

      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all duration-500 ease-out"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          visibility: isOpen ? "visible" : "hidden",
        }}
      >
        {/* Backdrop Tint */}
        <div
          className="absolute inset-0 bg-black/30 transition-opacity duration-500"
          style={{ opacity: isOpen ? 1 : 0 }}
        />

        {/* Backdrop Blur (Fast 150ms transition to prevent lag and snapping) */}
        <div
          className="absolute inset-0 backdrop-blur-[8px]"
          style={{
            visibility: isOpen ? "visible" : "hidden",
            opacity: isOpen ? 1 : 0,
            transition: "opacity 150ms ease-out",
            willChange: "backdrop-filter",
            transform: "translate3d(0, 0, 0)",
          }}
        />

        {/* Modal Container */}
        <div
          className="liquidGlass-wrapper w-full max-w-md rounded-3xl border border-white/10 p-8 text-white transition-all duration-500 ease-out"
          style={{
            transform: isOpen ? "scale(1) translateY(0)" : "scale(0.95) translateY(10px)",
            opacity: isOpen ? 1 : 0,
          }}
        >
          {/* Liquid Glass Effect Layers */}
          <div className="liquidGlass-effect" />
          <div className="liquidGlass-tint" />
          <div className="liquidGlass-shine" />

          {/* Close Button (top-right, only shown when not submitted) */}
          {!isSubmitted && (
            <div
              onClick={() => handleClose(false)}
              className="absolute right-5 top-5 z-[4] p-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer outline-none"
            >
              <X className="h-4 w-4" />
            </div>
          )}

          {/* Form Content (relative z-3 to sit on top of glass layers) */}
          <div className="relative z-[3] w-full">
            {/* Background Glow */}
            <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-blue-500/10 blur-xl pointer-events-none -z-10" />
            <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-indigo-500/10 blur-xl pointer-events-none -z-10" />

            {!isSubmitted ? (
              <div>
                <div className="mb-6 pr-6">
                  <h3 className="mt-3 bricolage-grotesque text-2xl font-bold tracking-tight">
                    Enter email and name to continue
                  </h3>
                  <p className="mt-2 text-sm text-neutral-400">
                    Please provide your name and email address to continue browsing our website.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit(e);
                    }
                  }}
                  className="space-y-4"
                >
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                      Name
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <User className="h-5 w-5 text-neutral-500" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-500 outline-none ring-offset-black transition-all focus:border-white/20 focus:bg-white/10 focus:ring-2 focus:ring-white/20"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail className="h-5 w-5 text-neutral-500" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-500 outline-none ring-offset-black transition-all focus:border-white/20 focus:bg-white/10 focus:ring-2 focus:ring-white/20"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div
                    onClick={handleSubmit}
                    className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-semibold text-slate-950 transition-all hover:bg-neutral-100 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-6">
                <div className="mb-4 rounded-full bg-emerald-500/10 p-3 text-emerald-400">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <h3 className="bricolage-grotesque text-2xl font-bold">
                  Thank You!
                </h3>
                <p className="mt-3 text-sm text-neutral-400 max-w-sm">
                  Welcome to Rabt, <span className="text-white font-medium">{name}</span>. You can now continue browsing.
                </p>
                <div
                  onClick={() => handleClose(true)}
                  className="mt-6 rounded-xl border border-white/10 bg-white/5 px-8 py-2.5 text-sm font-semibold hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Continue to Website
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
