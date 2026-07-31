// Lead notification — best-effort, never throws.
// Supports two channels (both optional, can be combined):
//   1. LEAD_NOTIFY_WEBHOOK  -> POSTs a JSON summary to a Slack/Discord/Teams/custom webhook.
//   2. RESEND_API_KEY       -> sends an email via Resend (https://resend.com).
//
// If neither env var is set, notification is skipped (the lead is still saved).
// Recipient email: LEAD_NOTIFY_EMAIL (defaults to hello@industrialengineeringstudio.com).
// Sender for Resend: RESEND_FROM (defaults to onboarding@resend.dev — only delivers
// to the Resend account owner until your domain is verified).

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://industrialengineeringstudio.com";

const DEFAULT_TO = "hello@industrialengineeringstudio.com";
const DEFAULT_FROM = "onboarding@resend.dev";

export interface LeadSummary {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string | null;
  industry: string;
  projectType: string;
  location?: string | null;
  projectSize?: string | null;
  services: string[];
  timeline?: string | null;
  message: string;
  source: string;
  sourceRef?: string | null;
  userAgent?: string | null;
}

function plainText(l: LeadSummary): string {
  return [
    `New lead received — ${SITE}`,
    ``,
    `Name:         ${l.name}`,
    `Company:      ${l.company}`,
    `Email:        ${l.email}`,
    `Phone:        ${l.phone || "—"}`,
    `Industry:     ${l.industry}`,
    `Project type: ${l.projectType}`,
    `Location:     ${l.location || "—"}`,
    `Project size: ${l.projectSize || "—"}`,
    `Timeline:     ${l.timeline || "—"}`,
    `Services:     ${l.services.join(", ") || "—"}`,
    `Source:       ${l.source}${l.sourceRef ? ` (${l.sourceRef})` : ""}`,
    ``,
    `Message:`,
    l.message,
    ``,
    `Lead ID: ${l.id}`,
  ].join("\n");
}

function htmlText(l: LeadSummary): string {
  const row = (k: string, v: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#64748b;white-space:nowrap">${k}</td><td style="padding:4px 0">${v}</td></tr>`;
  return `<!doctype html><html><body style="font-family:Inter,Arial,sans-serif;color:#0f172a">
  <h2 style="margin:0 0 8px">New project assessment request</h2>
  <p style="color:#64748b;margin:0 0 16px">${SITE} — lead <code>${l.id}</code></p>
  <table>${row("Name", l.name)}${row("Company", l.company)}${row("Email", `<a href="mailto:${l.email}">${l.email}</a>`)}${row("Phone", l.phone || "—")}${row("Industry", l.industry)}${row("Project type", l.projectType)}${row("Location", l.location || "—")}${row("Project size", l.projectSize || "—")}${row("Timeline", l.timeline || "—")}${row("Services", l.services.join(", ") || "—")}${row("Source", l.source + (l.sourceRef ? ` (${l.sourceRef})` : ""))}</table>
  <h3 style="margin:16px 0 4px">Message</h3>
  <p style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px">${l.message.replace(/</g, "&lt;")}</p>
  </body></html>`;
}

async function notifyWebhook(l: LeadSummary): Promise<boolean> {
  const url = process.env.LEAD_NOTIFY_WEBHOOK;
  if (!url) return false;
  // Send both `text` (Slack) and `content` (Discord) so the same payload works
  // for Slack, Discord, MS Teams, and custom endpoints. Discord caps content at
  // 2000 chars; the summary is well under that.
  const summary = plainText(l);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: summary,          // Slack
      content: summary,       // Discord
      username: "IEH Leads",  // Discord/Slack display name
      lead: l,                // structured data for custom webhooks
      site: SITE,
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    console.warn(`[lead-notify] webhook returned ${res.status}: ${t.slice(0, 200)}`);
  }
  return res.ok;
}

async function notifyEmail(l: LeadSummary): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const to = process.env.LEAD_NOTIFY_EMAIL || DEFAULT_TO;
  const from = process.env.RESEND_FROM || DEFAULT_FROM;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      replyTo: l.email,
      subject: `New lead: ${l.name} — ${l.company} (${l.industry})`,
      text: plainText(l),
      html: htmlText(l),
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    console.warn(`[lead-notify] resend returned ${res.status}: ${t.slice(0, 300)}`);
  }
  return res.ok;
}

/**
 * Send lead notifications through whatever channels are configured.
 * Best-effort: swallows all errors so a notification failure never breaks
 * the form submission or the DB write.
 */
export async function notifyLead(l: LeadSummary): Promise<void> {
  const hasWebhook = !!process.env.LEAD_NOTIFY_WEBHOOK;
  const hasEmail = !!process.env.RESEND_API_KEY;
  if (!hasWebhook && !hasEmail) {
    console.log("[lead-notify] no channel configured (set LEAD_NOTIFY_WEBHOOK or RESEND_API_KEY); skipping.");
    return;
  }
  const results = await Promise.allSettled([notifyWebhook(l), notifyEmail(l)]);
  for (const r of results) {
    if (r.status === "rejected") console.warn("[lead-notify] channel error:", r.reason?.message);
  }
}
