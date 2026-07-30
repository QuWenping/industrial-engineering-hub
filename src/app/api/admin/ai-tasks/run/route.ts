// POST /api/admin/ai-tasks/run — dispatch an AI agent, stream progress via SSE.
// Supported agents: keyword, writer, reviewer, calc-writer
// Payload: { agent, keywordId?, contentId?, input? }
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { analyzeKeyword } from "@/lib/ai/agents/keyword";
import { writeGuide } from "@/lib/ai/agents/writer";
import { reviewContent } from "@/lib/ai/agents/reviewer";
import { writeCalculator } from "@/lib/ai/agents/calc-writer";
import { estimateCost } from "@/lib/ai/pricing";
import { MODELS } from "@/lib/ai/models";
import { canTransition } from "@/lib/admin/status-machine";

export const runtime = "nodejs";
// Admin runs locally — relax the function timeout beyond Vercel's 10s default.
export const maxDuration = 300;

type Agent = "keyword" | "writer" | "reviewer" | "calc-writer";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const agent = body.agent as Agent;
  const { keywordId, contentId } = body;

  // Create the AiTask row first
  const task = await prisma.aiTask.create({
    data: {
      agent,
      status: "running",
      input: body.input ?? { keywordId, contentId },
      ...(keywordId ? { keywordId } : {}),
      ...(contentId ? { contentId } : {}),
    },
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      send("start", { taskId: task.id, agent });

      try {
        let output: unknown;
        let tokensIn = 0;
        let tokensOut = 0;
        let model = "";

        if (agent === "keyword") {
          if (!keywordId) throw new Error("keywordId required for keyword agent");
          const kw = await prisma.keyword.findUnique({ where: { id: keywordId } });
          if (!kw) throw new Error("Keyword not found");
          send("progress", { stage: "analyzing", phrase: kw.phrase });
          const r = await analyzeKeyword(kw.phrase);
          tokensIn = r.tokensIn;
          tokensOut = r.tokensOut;
          model = r.model;
          output = r.brief;

          await prisma.keyword.update({
            where: { id: keywordId },
            data: {
              intent: r.brief.intent,
              priority: r.brief.priority,
              volume: r.brief.volume_estimate,
              difficulty: r.brief.difficulty_estimate,
              brief: r.brief.brief as unknown as object,
              status: "analyzed",
            },
          });
        } else if (agent === "writer") {
          if (!keywordId) throw new Error("keywordId required for writer agent");
          const kw = await prisma.keyword.findUnique({ where: { id: keywordId } });
          if (!kw) throw new Error("Keyword not found");

          // Determine kind from input or default to guide
          const kind = (body.input?.kind as "guide" | "material") ?? "guide";

          // Gather related calculators
          const calcs = await prisma.calculator.findMany({
            where: { status: "published" },
            select: { id: true, name: true },
            take: 100,
          });

          send("progress", { stage: "writing", phrase: kw.phrase, kind });
          const r = await writeGuide({
            keyword: kw.phrase,
            brief: (kw.brief as any) ?? {},
            kind,
            existingCalculators: calcs,
          });
          tokensIn = r.tokensIn;
          tokensOut = r.tokensOut;
          model = r.model;
          output = r.output;

          // Create new ContentItem
          const slug = body.input?.slug ?? r.output.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
            .slice(0, 80);

          const content = await prisma.contentItem.create({
            data: {
              slug,
              kind,
              title: r.output.title,
              description: r.output.description,
              category: r.output.category,
              keywords: r.output.keywords,
              bodyMdx: r.output.bodyMdx,
              frontmatter: { suggestedRelated: r.output.suggestedRelated },
              status: "ai_draft",
              keywordId,
            },
          });
          output = { ...(r.output as object), contentId: content.id };

          // Link task to new content
          await prisma.aiTask.update({
            where: { id: task.id },
            data: { contentId: content.id },
          });
        } else if (agent === "reviewer") {
          if (!contentId) throw new Error("contentId required for reviewer agent");
          const c = await prisma.contentItem.findUnique({ where: { id: contentId } });
          if (!c) throw new Error("Content not found");

          // Extract <Formula> expressions from body for fact-checking
          const formulaMatches = [...c.bodyMdx.matchAll(/<Formula>([\s\S]*?)<\/Formula>/g)].map(
            (m) => m[1].trim()
          );

          send("progress", { stage: "reviewing", title: c.title });
          const r = await reviewContent({
            kind: c.kind as "guide" | "material",
            title: c.title,
            bodyMdx: c.bodyMdx,
            keyword: (c.keywords[0] ?? ""),
            formulas: formulaMatches,
          });
          tokensIn = r.tokensIn;
          tokensOut = r.tokensOut;
          model = r.model;
          output = r.output;

          // Persist review
          await prisma.review.create({
            data: {
              contentId,
              reviewer: "ai-engineering",
              scoreAccuracy: r.output.scores.accuracy,
              scoreLogic: r.output.scores.logic,
              scoreSeo: r.output.scores.seo,
              scoreOrig: r.output.scores.originality,
              overall: r.output.overall,
              verdict: r.output.verdict,
              comments: {
                summary: r.output.summary,
                findings: r.output.findings,
              },
            },
          });

          // Move status to engineering_review if currently ai_draft
          if (c.status === "ai_draft" && canTransition(c.status, "engineering_review")) {
            await prisma.contentItem.update({
              where: { id: contentId },
              data: { status: "engineering_review", seoScore: r.output.overall },
            });
          } else {
            await prisma.contentItem.update({
              where: { id: contentId },
              data: { seoScore: r.output.overall },
            });
          }
        } else if (agent === "calc-writer") {
          if (!keywordId) throw new Error("keywordId required for calc-writer agent");
          const kw = await prisma.keyword.findUnique({ where: { id: keywordId } });
          if (!kw) throw new Error("Keyword not found");

          // Fetch existing calc IDs + materials
          const [calcs, materials] = await Promise.all([
            prisma.calculator.findMany({ select: { id: true, name: true, category: true } }),
            prisma.contentItem.findMany({
              where: { kind: "material", status: "published" },
              select: { slug: true, title: true },
              take: 200,
            }),
          ]);

          send("progress", { stage: "writing-calc", phrase: kw.phrase });
          const r = await writeCalculator({
            keyword: kw.phrase,
            brief: (kw.brief as any) ?? {},
            existingCalculators: calcs,
            materialsAvailable: materials.map((m) => m.title),
          });
          tokensIn = r.tokensIn;
          tokensOut = r.tokensOut;
          model = r.model;
          output = { calculator: r.calculator, attempts: r.attempts };

          // Persist calculator
          await prisma.calculator.create({
            data: {
              id: r.calculator.id,
              name: r.calculator.name,
              category: r.calculator.category,
              priority: r.calculator.priority,
              description: r.calculator.description,
              schema: r.calculator as unknown as object,
              status: "review",
              testsPass: r.calculator.tests?.length ?? 0,
              testsFail: 0,
              keywordId,
            },
          });
        } else {
          throw new Error(`Unknown agent: ${agent}`);
        }

        const costUsd = estimateCost(model, tokensIn, tokensOut);

        await prisma.aiTask.update({
          where: { id: task.id },
          data: {
            status: "done",
            output: output as object,
            model,
            tokensIn,
            tokensOut,
            costUsd,
            finishedAt: new Date(),
          },
        });

        send("done", { taskId: task.id, output, tokensIn, tokensOut, costUsd });
        controller.close();
      } catch (err: any) {
        const message = err.message ?? String(err);
        console.error(`[ai-task ${task.id} ${agent}] failed:`, message);
        await prisma.aiTask.update({
          where: { id: task.id },
          data: { status: "failed", error: message.slice(0, 2000), finishedAt: new Date() },
        });
        send("error", { message });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
