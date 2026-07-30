import { NextResponse } from "next/server";

// Sprint 9 placeholder — Sprint 11 will replace this with real Lead CRM persistence.
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: "Lead intake service coming online soon. Email hello@industrialengineeringstudio.com in the meantime.",
    },
    { status: 503 }
  );
}
