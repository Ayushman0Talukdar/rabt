"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function CursorFollower() {
  const cursorRef = useRef(null);
  const pathname = usePathname();

  // Disable blob on Sanity studio dashboard and content-secrets pages
  if (pathname && (pathname.startsWith("/studio") || pathname.includes("content-secrets"))) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="custom-cursor-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        backgroundColor: "rgb(255, 255, 255)",
        mixBlendMode: "difference",
        pointerEvents: "none",
        zIndex: 9999,
        transform: "translate3d(-100px, -100px, 0)",
        transition: "width var(--cursor-duration, 0.22s) cubic-bezier(0.16, 1, 0.3, 1), height var(--cursor-duration, 0.22s) cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.22s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s, border 0.2s",
        willChange: "transform, width, height, border-radius",
      }}
    >
      <FollowerLogic cursorRef={cursorRef} />
    </div>
  );
}

function FollowerLogic({ cursorRef }) {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Local coordinates and variables
    const mouse = { x: 0, y: 0 };
    const blob = { x: 0, y: 0 };
    const lastBlob = { x: 0, y: 0 };
    const lastMouse = { x: 0, y: 0 };

    let lastUnhoverTime = 0;
    let lastTargetWidth = 20;

    let magneticTarget = null;
    let interactiveElements = [];

    // Track mouse coordinates
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("pointermove", onMouseMove);

    // Scan interactive elements periodically to support dynamic routes/updates
    const updateInteractiveElements = () => {
      interactiveElements = Array.from(
        document.querySelectorAll("a, button, [role='button'], .magnetic-target")
      ).filter((el) => !el.closest(".custom-cursor-container"));
    };

    updateInteractiveElements();
    const interval = setInterval(updateInteractiveElements, 1500);

    // Animation loop variables
    let animationFrameId;
    const speedCoeff = 0.16;

    const playSound = () => {
      if (typeof window !== "undefined") {
        const soundInstance = new Audio("/click.mp3");
        soundInstance.volume = 0.025;
        soundInstance.play().catch((err) => {
          console.debug("Audio playback prevented or failed:", err);
        });
      }
    };

    const animate = () => {
      // Check if body scroll is locked (popup is open)
      const isScrollLocked = typeof document !== "undefined" && 
        (document.body.style.overflow === "hidden" || document.documentElement.style.overflow === "hidden");

      if (isScrollLocked) {
        cursor.style.opacity = "0";
        cursor.style.visibility = "hidden";
        animationFrameId = requestAnimationFrame(animate);
        return;
      } else {
        cursor.style.opacity = "1";
        cursor.style.visibility = "visible";
      }

      let targetX = mouse.x;
      let targetY = mouse.y;
      let targetWidth = 20;
      let targetHeight = 20;
      let targetBorderRadius = "50%";
      let isLatched = false;

      // Find the closest interactive element to the cursor
      let closestElement = null;
      let minDistance = Infinity;
      let closestBounds = null;

      for (let i = 0; i < interactiveElements.length; i++) {
        const el = interactiveElements[i];
        const bounds = el.getBoundingClientRect();
        if (bounds.width === 0 || bounds.height === 0) continue;

        const closestX = Math.max(bounds.left, Math.min(mouse.x, bounds.right));
        const closestY = Math.max(bounds.top, Math.min(mouse.y, bounds.bottom));
        const dx = mouse.x - closestX;
        const dy = mouse.y - closestY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance) {
          minDistance = distance;
          closestElement = el;
          closestBounds = bounds;
        }
      }

      // Magnetic latch threshold: latch to closest element if within 80px of its bounding box
      if (closestElement && minDistance < 80) {
        isLatched = true;

        if (magneticTarget !== closestElement) {
          playSound();
        }

        magneticTarget = closestElement;

        const centerX = closestBounds.left + closestBounds.width / 2;
        const centerY = closestBounds.top + closestBounds.height / 2;

        const dx = mouse.x - centerX;
        const dy = mouse.y - centerY;

        targetX = centerX + dx * 0.15;
        targetY = centerY + dy * 0.15;
        targetWidth = closestBounds.width + 12;
        targetHeight = closestBounds.height + 12;
        lastTargetWidth = targetWidth;
        targetBorderRadius = window.getComputedStyle(closestElement).borderRadius || "9999px";
      } else {
        // Trigger unhover suppression ONLY if we were previously latched
        if (magneticTarget) {
          lastUnhoverTime = Date.now();
          magneticTarget = null;
        }
      }

      // Interpolation logic
      blob.x += (targetX - blob.x) * speedCoeff;
      blob.y += (targetY - blob.y) * speedCoeff;

      // Calculate real mouse velocity for stretching (only when not latched)
      const mx = mouse.x - lastMouse.x;
      const my = mouse.y - lastMouse.y;
      const mouseVelocity = Math.sqrt(mx * mx + my * my);

      lastBlob.x = blob.x;
      lastBlob.y = blob.y;
      lastMouse.x = mouse.x;
      lastMouse.y = mouse.y;

      let transformStr = `translate3d(calc(${blob.x}px - 50%), calc(${blob.y}px - 50%), 0)`;

      const isRecentlyUnhovered = Date.now() - lastUnhoverTime < 1000;

      if (!isLatched && !isRecentlyUnhovered && mouseVelocity > 0.5) {
        const maxStretch = 1.7;
        const stretch = Math.min(1 + mouseVelocity * 0.015, maxStretch);
        const shrink = 1 / stretch;
        const angle = Math.atan2(my, mx) * (180 / Math.PI);

        transformStr += ` rotate(${angle}deg) scaleX(${stretch}) scaleY(${shrink})`;
      }

      // Check if hovering over media (images, videos, or iframes)
      let isOverMedia = false;
      if (typeof document !== "undefined") {
        let el = document.elementFromPoint(mouse.x, mouse.y);
        while (el) {
          const tagName = el.tagName ? el.tagName.toLowerCase() : "";
          if (tagName === "img" || tagName === "video" || tagName === "iframe") {
            isOverMedia = true;
            break;
          }
          el = el.parentElement;
        }
      }

      // Calculate dynamic transition duration based on size when unlatching
      let duration = "0.22s";
      if (!isLatched && lastTargetWidth > 120) {
        const timeSinceUnhover = Date.now() - lastUnhoverTime;
        if (timeSinceUnhover < 450) {
          duration = "0.45s"; // Slower collapse for larger elements to prevent flicker
        } else {
          lastTargetWidth = 20;
        }
      }

      // Update DOM
      cursor.style.transform = transformStr;
      cursor.style.width = `${targetWidth}px`;
      cursor.style.height = `${targetHeight}px`;
      cursor.style.borderRadius = targetBorderRadius;
      cursor.style.setProperty("--cursor-duration", duration);

      if (isLatched) {
        cursor.style.background = "rgba(255, 255, 255, 0.14)";
        cursor.style.border = "1.5px solid rgba(255, 255, 255, 0.4)";
        cursor.style.mixBlendMode = "normal";
      } else if (isOverMedia) {
        cursor.style.background = "rgba(255, 255, 255, 0.25)";
        cursor.style.border = "1px solid rgba(255, 255, 255, 0.5)";
        cursor.style.mixBlendMode = "normal";
      } else {
        cursor.style.background = "rgb(255, 255, 255)";
        cursor.style.border = "none";
        cursor.style.mixBlendMode = "difference";
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", onMouseMove);
      clearInterval(interval);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return null;
}
