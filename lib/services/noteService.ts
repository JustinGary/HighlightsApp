import { highlightRepository } from "@/lib/repositories/inMemoryRepositories";
import type { Highlight, NotePayload } from "@/lib/types";

export async function createManualNote(userId: string, payload: NotePayload): Promise<Highlight> {
  const [highlight] = await highlightRepository.upsertMany(userId, [
    {
      text: payload.text,
      sourceTitle: payload.sourceTitle,
      author: payload.author,
      capturedAt: new Date().toISOString(),
      tags: payload.tags ?? [],
      location: undefined
    }
  ]);
  return highlight;
}
