import { NextResponse } from "next/server";
import { createManualNote } from "@/lib/services/noteService";
import { notePayloadSchema } from "@/lib/validation";

const DEMO_USER_ID = "demo-user";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = notePayloadSchema.parse(json);
    const highlight = await createManualNote(DEMO_USER_ID, payload);
    return NextResponse.json(highlight, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create note" },
      { status: 400 }
    );
  }
}
