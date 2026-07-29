// Load calculator JSON configs from content/calculators/
import fs from "fs";
import path from "path";
import type { Calculator } from "./types";

const CALCULATORS_DIR = path.join(process.cwd(), "content", "calculators");

export function getAllCalculatorSlugs(): string[] {
  if (!fs.existsSync(CALCULATORS_DIR)) return [];
  return fs
    .readdirSync(CALCULATORS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}

export function getCalculatorBySlug(slug: string): Calculator | null {
  const filePath = path.join(CALCULATORS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as Calculator;
  } catch {
    return null;
  }
}

export function getAllCalculators(): Calculator[] {
  const slugs = getAllCalculatorSlugs();
  return slugs
    .map((slug) => getCalculatorBySlug(slug))
    .filter((c): c is Calculator => c !== null)
    .sort((a, b) => {
      // P0 first, then by priority then name
      const pOrder = { P0: 0, P1: 1, P2: 2 };
      return pOrder[a.priority] - pOrder[b.priority] || a.name.localeCompare(b.name);
    });
}

export function getCalculatorsByCategory(category: string): Calculator[] {
  return getAllCalculators().filter(
    (c) => c.category.toLowerCase() === category.toLowerCase()
  );
}

export function getCategories(): { name: string; slug: string; count: number }[] {
  const all = getAllCalculators();
  const catMap = new Map<string, number>();
  for (const c of all) {
    catMap.set(c.category, (catMap.get(c.category) || 0) + 1);
  }
  return Array.from(catMap.entries()).map(([name, count]) => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    count,
  }));
}
