import { NextResponse } from "next/server";
import { ensureDemoSeeded } from "@/lib/mock/dashboard";
import { latestDigestForUser, scheduleDigest } from "@/lib/services/digestService";
import { digestRequestSchema } from "@/lib/validation";

const DEMO_USER_ID = "demo-user";

export async function GET() {
  await ensureDemoSeeded();
  const digest = await latestDigestForUser(DEMO_USER_ID);
  return NextResponse.json({ digest });
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = digestRequestSchema.parse(json);
    await ensureDemoSeeded();
    const scheduled = await scheduleDigest(DEMO_USER_ID, payload);
    return NextResponse.json(scheduled, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to schedule digest" },
      { status: 400 }
    );
  }
}
