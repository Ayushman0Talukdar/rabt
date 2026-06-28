"use client";

import { motion } from "framer-motion";

export default function ArticleFadeIn({ children }) {
  return (
    <motion.div
      key="article"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-3xl"
    >
      {children}
    </motion.div>
  );
}
