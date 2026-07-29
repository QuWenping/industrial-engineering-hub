"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import type { CalculationResult } from "@/lib/calculator/types";

interface ResultDisplayProps {
  result: CalculationResult | null;
  label: string;
  unit: string;
  decimals?: number;
}

export function ResultDisplay({ result, label, unit, decimals = 2 }: ResultDisplayProps) {
  return (
    <div className="min-h-[180px] flex flex-col items-center justify-center text-center">
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
            className="w-full"
          >
            <div className="text-sm text-white/60 mb-2">{label}</div>
            <div className="text-4xl font-bold text-white mb-2 break-all">
              {result.value.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: decimals,
              })}
            </div>
            <div className="text-lg text-ai-glow font-medium">{unit}</div>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-sm text-white/50">
              <CheckCircle2 className="h-4 w-4 text-accent-green" />
              Calculated successfully
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-white/40"
          >
            <div className="text-sm mb-2">{label}</div>
            <div className="text-3xl font-bold text-white/20">—</div>
            <div className="text-sm mt-2">Enter values and click Calculate</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
