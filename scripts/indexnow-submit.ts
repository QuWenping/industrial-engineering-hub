// One-off: bulk-submit every sitemap URL to IndexNow (Bing/Yandex/Naver).
// Run: npm run indexnow:submit
// IndexNow validates the key file hosted at the production origin, so this
// works even when run locally.
import { submitToIndexNow } from "../src/lib/seo/indexnow";
import sitemap from "../src/app/sitemap";

(async () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);
  console.log(`Submitting ${urls.length} URLs to IndexNow…`);
  const r = await submitToIndexNow(urls);
  console.log("Result:", JSON.stringify(r));
  process.exit(r.ok ? 0 : 1);
})();
