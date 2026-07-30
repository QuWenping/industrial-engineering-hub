"use client";

import Link from "next/link";
import { PublishButton } from "./PublishButton";
import { SchemaBuilder } from "./SchemaBuilder";

interface Props {
  id: string;
  name: string;
  status: string;
  schema: unknown;
  publicUrl: string;
}

export function CalculatorEditor({ id, name, status, schema, publicUrl }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">{name}</h1>
          <p className="text-sm text-slate-500 mt-1 font-mono">{id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={publicUrl} target="_blank" className="text-sm text-engineering-blue hover:underline">
            Public ↗
          </Link>
          {(status === "approved" || status === "published") && (
            <PublishButton kind="calculator" id={id} slug={id} />
          )}
        </div>
      </div>
      <SchemaBuilder initialId={id} initialSchema={schema} />
    </div>
  );
}
