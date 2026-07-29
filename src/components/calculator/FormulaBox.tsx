"use client";

import { motion } from "framer-motion";
import { FunctionSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormulaBoxProps {
  expression: string;
  explanation?: string;
  unit?: string;
}

export function FormulaBox({ expression, explanation, unit }: FormulaBoxProps) {
  // Convert formula expression to a more readable form
  const readable = expression
    .replace(/\*/g, " × ")
    .replace(/\//g, " ÷ ")
    .replace(/-/g, " − ")
    .replace(/pi/g, "π")
    .replace(/sqrt\(/g, "√(")
    .replace(/\^2/g, "²")
    .replace(/\^3/g, "³")
    .replace(/\^4/g, "⁴");

  return (
    <Card className="border-border/60 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <FunctionSquare className="h-4 w-4 text-engineering-blue" />
          <CardTitle className="text-navy text-base">Formula</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <motion.div
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          className="bg-slate-50 rounded-lg px-6 py-4 text-center border border-slate-100"
        >
          <code className="font-mono text-lg text-navy tracking-wide">{readable}</code>
          {unit && (
            <div className="text-sm text-muted-foreground mt-2">
              Result unit: <span className="font-mono">{unit}</span>
            </div>
          )}
        </motion.div>
        {explanation && (
          <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>
        )}
      </CardContent>
    </Card>
  );
}
