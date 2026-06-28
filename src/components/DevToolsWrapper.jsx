"use client";
import React, { useState, useEffect } from "react";

export default function DevToolsWrapper({ children }) {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  useEffect(() => {
    // Disable protection during development
    if (
      process.env.NODE_ENV === "development" ||
      (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"))
    ) {
      return;
    }

    // Docked DevTools check
    const checkDocked = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      return widthThreshold || heightThreshold;
    };

    // Initialize state
    if (checkDocked()) {
      setIsDevToolsOpen(true);
    }

    // Resize event listener (covers docked window adjustments)
    const handleResize = () => {
      if (checkDocked()) {
        setIsDevToolsOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);

    // Disable right click (blocks Inspect element)
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    window.addEventListener("contextmenu", handleContextMenu);

    // Disable keyboard short-cuts
    const handleKeyDown = (e) => {
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || // Ctrl+Shift+I/J/C
        (e.metaKey && e.altKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) // Cmd+Alt+I/J/C
      ) {
        e.preventDefault();
        setIsDevToolsOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (isDevToolsOpen) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "#050507",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
          color: "#ffffff",
          fontFamily: '"Bricolage Grotesque", sans-serif',
          textAlign: "center",
          padding: "24px",
          userSelect: "none",
          animation: "fadeIn 0.5s ease-out both",
        }}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .quote-text {
            font-size: clamp(1.5rem, 4vw, 2.5rem);
            font-weight: 800;
            line-height: 1.3;
            max-width: 800px;
            letter-spacing: -0.02em;
            background: linear-gradient(135deg, #ffffff 40%, #a78bfa 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 40px rgba(167, 139, 250, 0.15);
          }
        `}</style>
        <p className="quote-text">
          World-class content isn&apos;t created by chance. It&apos;s built by systems.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
