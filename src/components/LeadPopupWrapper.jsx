"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LeadPopup from "./LeadPopup";

export default function LeadPopupWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if user has already submitted the lead (global/per-device)
    const submitted = localStorage.getItem("rabt_lead_submitted");
    if (submitted === "true") {
      setIsOpen(false);
      return;
    }

    // Check if user has dismissed the popup on the current page session
    const dismissedOnPage = sessionStorage.getItem(`rabt_lead_dismissed_${pathname}`);
    if (dismissedOnPage === "true") {
      setIsOpen(false);
      return;
    }

    let timer = null;

    const handleInteraction = () => {
      timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);

      removeListeners();
    };

    const addListeners = () => {
      window.addEventListener("scroll", handleInteraction, { passive: true });
      window.addEventListener("mousemove", handleInteraction, { passive: true });
      window.addEventListener("mousedown", handleInteraction, { passive: true });
      window.addEventListener("keydown", handleInteraction, { passive: true });
      window.addEventListener("touchstart", handleInteraction, { passive: true });
    };

    const removeListeners = () => {
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("mousedown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };

    addListeners();

    return () => {
      removeListeners();
      if (timer) clearTimeout(timer);
    };
  }, [pathname]);

  const handleClose = (wasSubmitted) => {
    setIsOpen(false);
    if (wasSubmitted) {
      localStorage.setItem("rabt_lead_submitted", "true");
    } else {
      // Set page-specific dismissal so it doesn't pop up again on this page visit
      sessionStorage.setItem(`rabt_lead_dismissed_${pathname}`, "true");
    }
  };

  return <LeadPopup isOpen={isOpen} onClose={handleClose} />;
}
