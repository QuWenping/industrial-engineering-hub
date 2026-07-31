"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CalculatorInput } from "@/lib/calculator/types";

interface InputFieldProps {
  input: CalculatorInput;
  value?: number | string;
  error?: string;
  onChange: (value: number | string) => void;
}

export function InputField({ input, value, error, onChange }: InputFieldProps) {
  if (input.type === "number") {
    return (
      <div className="space-y-2">
        <Label htmlFor={input.id} className="text-sm font-medium text-navy flex items-center justify-between">
          <span>
            {input.label}
            {input.required && <span className="text-danger ml-0.5">*</span>}
          </span>
          {input.unit && (
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {input.unit}
            </span>
          )}
        </Label>
        <Input
          id={input.id}
          type="number"
          inputMode="decimal"
          value={value ?? ""}
          min={input.min}
          max={input.max}
          step={input.step || "any"}
          placeholder={input.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={error ? "border-danger focus-visible:ring-danger" : ""}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        {input.hint && !error && <p className="text-xs text-muted-foreground">{input.hint}</p>}
      </div>
    );
  }

  if (input.type === "select" && input.options) {
    return (
      <div className="space-y-2">
        <Label htmlFor={input.id} className="text-sm font-medium text-navy">
          {input.label}
          {input.required && <span className="text-danger ml-0.5">*</span>}
        </Label>
        <Select value={String(value || "")} onValueChange={(v) => v && onChange(v)}>
          <SelectTrigger id={input.id} className="w-full">
            <SelectValue placeholder="Select..." />
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

  return null;
}
