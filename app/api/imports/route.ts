import { NextResponse } from "next/server";
import { ensureDemoSeeded } from "@/lib/mock/dashboard";
import { processHighlightImport } from "@/lib/services/importService";
import { importJobRepository } from "@/lib/repositories/inMemoryRepositories";
import { highlightImportPayloadSchema } from "@/lib/validation";

const DEMO_USER_ID = "demo-user";

export async function GET() {
  await ensureDemoSeeded();
  const jobs = await importJobRepository.listByUser(DEMO_USER_ID);
  return NextResponse.json({ jobs });
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = highlightImportPayloadSchema.parse(json);
    const result = await processHighlightImport(DEMO_USER_ID, payload);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to process import" },
      { status: 400 }
    );
  }
}
