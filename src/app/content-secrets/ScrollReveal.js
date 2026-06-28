"use client";

import { motion } from "framer-motion";

export default function ScrollReveal({
  children,
  baseOpacity = 0.1,
  enableBlur = false,
  baseRotation = 0,
  blurStrength = 4,
}) {
  const variants = {
    hidden: {
      opacity: baseOpacity,
      rotate: baseRotation,
      y: 30,
      filter: enableBlur ? `blur(${blurStrength}px)` : "blur(0px)",
    },
    visible: {
      opacity: 1,
      rotate: 0,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for a premium, smooth easing
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1 }}
      variants={variants}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
