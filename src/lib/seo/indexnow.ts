// IndexNow: notify participating search engines (Bing, Yandex, Naver, …)
// of changed/added URLs without needing to log into their webmaster tools.
// See https://www.indexnow.org/documentation

export const INDEXNOW_KEY = "c89651c353098b057db3dd682b8b72e1";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://industrialengineeringstudio.com";

export const INDEXNOW_KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;

const ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
];

/**
 * Submit a list of absolute URLs to IndexNow.
 * Returns the first endpoint's response status, or 0 if nothing was submitted.
 * Never throws — notification is best-effort.
 */
export async function submitToIndexNow(urls: string[]): Promise<{
  ok: boolean;
  status: number;
  endpoint?: string;
  error?: string;
}> {
  if (urls.length === 0) return { ok: true, status: 0 };

  const body = {
    host: new URL(BASE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: urls.slice(0, 10000),
  };

  for (const endpoint of ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(body),
      });
      if (res.status === 200 || res.status === 202) {
        return { ok: true, status: res.status, endpoint };
      }
      const text = await res.text().catch(() => "");
      console.warn(`[indexnow] ${endpoint} returned ${res.status}: ${text.slice(0, 200)}`);
      return { ok: false, status: res.status, endpoint, error: text.slice(0, 200) };
    } catch (err: any) {
      console.warn(`[indexnow] ${endpoint} failed: ${err?.message}`);
    }
  }
  return { ok: false, status: 0, error: "all endpoints failed" };
}

/** Submit a single URL (convenience for per-path revalidation). */
export async function submitPathToIndexNow(path: string): Promise<void> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  await submitToIndexNow([url]);
}
