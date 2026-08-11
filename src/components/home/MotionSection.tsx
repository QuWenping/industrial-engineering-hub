"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MotionSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
}

/**
 * Lightweight client-side motion wrapper. Keeps the homepage server-rendered
 * (SSG) while preserving scroll-triggered entrance animations for cards.
 */
export function MotionSection({
  children,
  className,
  delay = 0,
  duration = 0.4,
  y = 20,
  once = true,
}: MotionSectionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}
