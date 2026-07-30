// V0.2 Seed — import existing content/calculators into Postgres.
// Idempotent: uses upsert. Safe to re-run.
// Run via: npm run db:seed
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { prisma } from "../src/lib/db";
import { runTests } from "../src/lib/calculator/engine";
import type { Calculator } from "../src/lib/calculator/types";

const ROOT = path.join(__dirname, "..", "content");

async function seedCalculators() {
  const dir = path.join(ROOT, "calculators");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  console.log(`[seed] ${files.length} calculators`);

  let ok = 0;
  let fail = 0;
  for (const file of files) {
    const id = file.replace(/\.json$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    let calc: Calculator;
    try {
      calc = JSON.parse(raw);
    } catch (e) {
      console.warn(`  ! ${id}: JSON parse failed — ${(e as Error).message}`);
      fail++;
      continue;
    }

    const tr = runTests(calc);

    await prisma.calculator.upsert({
      where: { id },
      update: {
        name: calc.name,
        category: calc.category,
        priority: calc.priority,
        description: calc.description,
        schema: calc as unknown as object,
        status: "published",
        testsPass: tr.passed,
        testsFail: tr.failed,
        publishedAt: new Date(),
      },
      create: {
        id,
        name: calc.name,
        category: calc.category,
        priority: calc.priority,
        description: calc.description,
        schema: calc as unknown as object,
        status: "published",
        testsPass: tr.passed,
        testsFail: tr.failed,
        publishedAt: new Date(),
      },
    });

    if (tr.failed > 0) {
      console.warn(`  ! ${id}: ${tr.failed} tests failing`);
      fail++;
    } else {
      ok++;
    }
  }
  console.log(`[seed] calculators: ${ok} ok, ${fail} issues`);
}

async function seedContent(kind: "guide" | "material") {
  const subdir = kind === "guide" ? "guides" : "materials";
  const dir = path.join(ROOT, subdir);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")) : [];
  console.log(`[seed] ${files.length} ${kind}s`);

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);

    const title = String(data.title ?? slug);
    const description = String(data.description ?? "");
    const category = data.category ? String(data.category) : null;
    const keywords = Array.isArray(data.keywords) ? data.keywords.map(String) : [];

    await prisma.contentItem.upsert({
      where: { kind_slug: { kind, slug } },
      update: {
        title,
        description,
        category,
        keywords,
        bodyMdx: content,
        frontmatter: data as unknown as object,
        status: "published",
        publishedAt: new Date(),
      },
      create: {
        slug,
        kind,
        title,
        description,
        category,
        keywords,
        bodyMdx: content,
        frontmatter: data as unknown as object,
        status: "published",
        publishedAt: new Date(),
      },
    });
  }
}

async function main() {
  console.log("[seed] Starting…");
  await seedCalculators();
  await seedContent("guide");
  await seedContent("material");
  console.log("[seed] Done ✓");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
