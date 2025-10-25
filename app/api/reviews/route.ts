import { NextResponse } from "next/server";
import { ensureDemoSeeded } from "@/lib/mock/dashboard";
import { getReviewQueue, submitReviewFeedback } from "@/lib/services/reviewService";
import { reviewFeedbackSchema } from "@/lib/validation";

const DEMO_USER_ID = "demo-user";

export async function GET() {
  await ensureDemoSeeded();
  const queue = await getReviewQueue(DEMO_USER_ID);
  return NextResponse.json({ queue });
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = reviewFeedbackSchema.parse(json);
    const updated = await submitReviewFeedback(payload);
    return NextResponse.json(updated ?? { ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to submit review" },
      { status: 400 }
    );
  }
}
