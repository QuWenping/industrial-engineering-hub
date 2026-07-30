"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ValidatedCalculator } from "@/lib/calculator/schema.zod";

interface Props {
  initialId?: string;
  initialSchema?: unknown;
}

const BLANK: ValidatedCalculator = {
  id: "",
  name: "",
  category: "",
  priority: "P1",
  description: "",
  seo: { title: "", description: "", keyword: "" },
  formula: { expression: "", unit: "" },
  inputs: [{ id: "x", label: "X", type: "number", unit: "" }],
  result: { label: "Result", unit: "", decimals: 2 },
  content: { introduction: "" },
  tests: [{ inputs: { x: 0 }, expected: 0, tolerance: 0.01, description: "basic" }],
};

export function SchemaBuilder({ initialId, initialSchema }: Props) {
  const router = useRouter();
  const [value, setValue] = useState<string>(
    JSON.stringify(initialSchema ?? BLANK, null, 2)
  );
  const [validation, setValidation] = useState<{
    ok: boolean;
    errors?: string[];
    passed?: number;
    failed?: number;
  } | null>(null);
  const [isValidating, startValidate] = useTransition();
  const [isSaving, startSave] = useTransition();
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  async function handleValidate() {
    startValidate(async () => {
      try {
        const parsed = JSON.parse(value);
        const res = await fetch("/api/admin/calculators/validate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(parsed),
        });
        const data = await res.json();
        setValidation({
          ok: data.valid,
          errors: data.errors,
          passed: data.testResults?.passed,
          failed: data.testResults?.failed,
        });
      } catch (e: any) {
        setValidation({ ok: false, errors: [`JSON parse error: ${e.message}`] });
      }
    });
  }

  async function handleSave() {
    startSave(async () => {
      try {
        const parsed = JSON.parse(value);
        const isEdit = !!initialId;
        const url = isEdit
          ? `/api/admin/calculators/${initialId}`
          : "/api/admin/calculators";
        const res = await fetch(url, {
          method: isEdit ? "PATCH" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(isEdit ? { schema: parsed } : { schema: parsed }),
        });
        const data = await res.json();
        if (!res.ok) {
          setSaveMsg(`Error: ${data.error ?? "save failed"} ${data.errors?.join?.(", ") ?? ""}`);
        } else {
          setSaveMsg("Saved ✓");
          if (!isEdit && data.calculator?.id) {
            router.push(`/admin/calculators/${data.calculator.id}`);
          } else {
            router.refresh();
          }
        }
      } catch (e: any) {
        setSaveMsg(`Save failed: ${e.message}`);
      }
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Schema (JSON)</h2>
          <div className="flex gap-2">
            <button
              onClick={handleValidate}
              disabled={isValidating}
              className="px-3 py-1.5 text-xs font-medium rounded border border-slate-300 hover:bg-slate-50 disabled:opacity-50"
            >
              {isValidating ? "Running…" : "Run Tests"}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-1.5 text-xs font-medium rounded bg-navy text-white hover:bg-navy/90 disabled:opacity-50"
            >
              {isSaving ? "Saving…" : initialId ? "Update" : "Create"}
            </button>
          </div>
        </div>

        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          className="w-full h-[600px] font-mono text-xs p-3 border border-slate-300 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-engineering-blue/30"
        />

        {saveMsg && (
          <div className={`text-xs px-3 py-2 rounded ${saveMsg.includes("Error") || saveMsg.includes("failed") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            {saveMsg}
          </div>
        )}

        {validation && (
          <div className={`text-xs px-3 py-2 rounded ${validation.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            <div className="font-semibold">
              {validation.ok ? "✓ Valid" : "✗ Invalid"}
              {validation.passed !== undefined && (
                <span className="ml-2 font-normal">
                  Tests: {validation.passed} pass / {validation.failed} fail
                </span>
              )}
            </div>
            {validation.errors && validation.errors.length > 0 && (
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                {validation.errors.map((e, i) => (
                  <li key={i} className="font-mono">{e}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">Preview</h2>
        <SchemaPreview value={value} />
      </div>
    </div>
  );
}

function SchemaPreview({ value }: { value: string }) {
  let calc: ValidatedCalculator | null = null;
  let parseErr: string | null = null;
  try {
    calc = JSON.parse(value);
  } catch (e: any) {
    parseErr = e.message;
  }

  if (parseErr || !calc) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs text-slate-500 font-mono">
        {parseErr ? `JSON error: ${parseErr}` : "Enter a valid schema"}
      </div>
    );
  }

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-4">
      <div>
        <div className="text-xs uppercase tracking-wide text-slate-400 font-semibold">{calc.category}</div>
        <h3 className="text-lg font-bold text-navy mt-0.5">{calc.name || "(untitled)"}</h3>
        <p className="text-sm text-slate-600 mt-1">{calc.description || "(no description)"}</p>
      </div>

      <div className="bg-slate-50 p-3 rounded border border-slate-200">
        <div className="text-xs font-semibold text-slate-500 mb-2">Formula</div>
        <div className="font-mono text-sm text-navy bg-white px-3 py-2 rounded border border-slate-200">
          {calc.formula.expression || "(no expression)"}
          <span className="text-slate-400 ml-2 text-xs">[{calc.formula.unit}]</span>
        </div>
      </div>

      <div>
        <div className="text-xs font-semibold text-slate-500 mb-2">Inputs</div>
        <div className="space-y-2">
          {calc.inputs?.map((inp, i) => (
            <div key={i} className="flex items-center gap-2">
              <label className="text-sm text-slate-700 w-32 shrink-0">
                {inp.label}
                {inp.unit && <span className="text-xs text-slate-400 ml-1">({inp.unit})</span>}
              </label>
              <input
                type="text"
                disabled
                placeholder={inp.placeholder ?? String(inp.default ?? "")}
                className="flex-1 px-2 py-1 text-sm border border-slate-200 rounded bg-white"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-engineering-blue/5 p-3 rounded border border-engineering-blue/20">
        <div className="text-xs font-semibold text-engineering-blue mb-1">
          {calc.result.label}
        </div>
        <div className="text-lg font-bold text-navy font-mono">
          --
          <span className="text-sm font-normal text-slate-500 ml-2">{calc.result.unit}</span>
        </div>
      </div>

      {calc.tests && calc.tests.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-slate-500 mb-2">
            Test Cases ({calc.tests.length})
          </div>
          <div className="text-xs font-mono bg-slate-50 p-2 rounded border border-slate-200 space-y-1">
            {calc.tests.map((t, i) => (
              <div key={i}>
                #{i + 1}: {JSON.stringify(t.inputs)} → {t.expected}
                {t.description && <span className="text-slate-400"> ({t.description})</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
