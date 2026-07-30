import { redirect } from "next/navigation";

// V0.2 /enterprise placeholder — replaced by /services in V1.0.
// Permanent redirect via Next.js navigation + next.config.ts redirects() as backup.
export default function EnterprisePage() {
  redirect("/services");
}
