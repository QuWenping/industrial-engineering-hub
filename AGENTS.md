<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent 协作工作流

接手本项目的 agent 必须先读 README.md 的「Agent 协作规则」一节，并遵守：

1. 开工前通读 README.md + AGENTS.md + CLAUDE.md，Next.js 16 相关 API 查 node_modules/next/dist/docs/。
2. 按 Obsidian [[ieh-plan]] / Sprint 规划的优先级推进，做完一项再取下一项。
3. 任务完成立即在 Obsidian ieh-progress.md 标记 ✅ 并补 commit 记录。
4. 每个节点/bug 修复后在 Obsidian ieh-sprints.md 或 ieh-fix-*-postmortem.md 写「问题→原因→解决→经验」总结，并在 industrial-engineering-hub.md 索引登记。
5. 小步提交，commit message 写清根因与解决方式，推送后确认 Vercel 构建通过。
6. 不破坏生产：改 schema 先本地 db:push 验证；改构建/部署配置先本地 npm run build 通过；环境变量改动手动同步到 Vercel（本地 .env 不会自动同步）。

Obsidian 项目笔记：C:\Users\QuQu\Documents\ObsidianVault\03-Projects\industrial-engineering-hub\
