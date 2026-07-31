"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator, RotateCcw } from "lucide-react";
import { FormulaBox } from "./FormulaBox";
import { ResultDisplay } from "./ResultDisplay";
import { InputField } from "./InputField";
import { calculate } from "@/lib/calculator/engine";
import { formatResult } from "@/lib/calculator/formatter";
import type { Calculator as CalculatorType, CalculationResult as CalcResult } from "@/lib/calculator/types";

interface CalculatorCardProps {
  calculator: CalculatorType;
  materials?: { id: string; name: string; density: number }[];
}

export function CalculatorCard({ calculator, materials = [] }: CalculatorCardProps) {
  // Initialize defaults
  const getDefaultValues = useCallback(() => {
    const defaults: Record<string, number | string> = {};
    for (const input of calculator.inputs) {
      if (input.default !== undefined) {
        defaults[input.id] = input.default;
      }
    }
    // Inject material density if any input references material type
    const materialInput = calculator.inputs.find((i) => i.type === "material");
    if (materialInput && materials.length > 0) {
      const defaultMat = materials.find((m) => m.id === materialInput.default) || materials[0];
      defaults[materialInput.id] = defaultMat.density;
      defaults._materialId = defaultMat.id;
    }
    return defaults;
  }, [calculator, materials]);

  const [values, setValues] = useState<Record<string, number | string>>(getDefaultValues);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: string | number) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleMaterialChange = (materialId: string | null) => {
    if (!materialId) return;
    const mat = materials.find((m) => m.id === materialId);
    if (mat) {
      const materialInput = calculator.inputs.find((i) => i.type === "material");
      if (materialInput) {
        setValues((prev) => ({
          ...prev,
          [materialInput.id]: mat.density,
          _materialId: mat.id,
        }));
      }
    }
  };

  const handleCalculate = () => {
    const { result: calcResult, errors: calcErrors } = calculate({ calculator, values });
    if (calcErrors.length > 0) {
      const errMap: Record<string, string> = {};
      for (const e of calcErrors) {
        if (e.field) errMap[e.field] = e.message;
      }
      setErrors(errMap);
      setResult(null);
      return;
    }
    setErrors({});
    setResult(calcResult || null);
  };

  const handleReset = () => {
    setValues(getDefaultValues());
    setResult(null);
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input Panel */}
        <Card className="lg:col-span-3 border-border/60">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="h-5 w-5 text-engineering-blue" />
              <CardTitle className="text-navy text-lg">Inputs</CardTitle>
            </div>
            <CardDescription>Enter your values below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {calculator.inputs.map((input) => {
              if (input.type === "material") {
                return (
                  <div key={input.id} className="space-y-2">
                    <Label htmlFor={input.id} className="text-sm font-medium text-navy">
                      {input.label}
                    </Label>
                    <Select
                      value={String(values._materialId || materials[0]?.id || "")}
                      onValueChange={handleMaterialChange}
                    >
                      <SelectTrigger id={input.id} className="w-full">
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                      <SelectContent className="min-w-[16rem] w-max max-w-[92vw]">
                        {materials.map((mat) => (
                          <SelectItem key={mat.id} value={mat.id}>
                            {mat.name} ({mat.density} kg/m³)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              }

              if (input.type === "select" && input.options) {
                return (
                  <div key={input.id} className="space-y-2">
                    <Label htmlFor={input.id} className="text-sm font-medium text-navy">
                      {input.label}
                    </Label>
                    <Select
                      value={String(values[input.id] || "")}
                      onValueChange={(v) => v && handleChange(input.id, v)}
                    >
                      <SelectTrigger id={input.id} className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="min-w-[16rem] w-max max-w-[92vw]">
                        {input.options.map((opt) => (
                          <SelectItem key={opt.value} value={String(opt.value)}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              }

              return (
                <InputField
                  key={input.id}
                  input={input}
                  value={values[input.id]}
                  error={errors[input.id]}
                  onChange={(v) => handleChange(input.id, v)}
                />
              );
            })}

            <div className="flex gap-3 pt-2">
              <Button onClick={handleCalculate} className="btn-primary-gradient border-0 text-white flex-1">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate
              </Button>
              <Button variant="outline" onClick={handleReset} size="icon">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result Panel */}
        <Card className="lg:col-span-2 border-border/60 bg-gradient-to-br from-navy to-engineering-blue/80 text-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-lg">Result</CardTitle>
          </CardHeader>
          <CardContent>
            <ResultDisplay
              result={result}
              label={calculator.result.label}
              unit={calculator.result.unit}
              decimals={calculator.result.decimals}
            />
          </CardContent>
        </Card>
      </div>

      {/* Formula Box */}
      {calculator.formula.explanation && (
        <FormulaBox
          expression={calculator.formula.expression}
          explanation={calculator.formula.explanation}
          unit={calculator.formula.unit}
        />
      )}
    </div>
  );
}
