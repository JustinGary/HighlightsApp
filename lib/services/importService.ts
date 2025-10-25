import { highlightRepository, importJobRepository } from "@/lib/repositories/inMemoryRepositories";
import type { Highlight, HighlightImportPayload, ImportJob } from "@/lib/types";

interface ProcessImportResult {
  job: ImportJob;
  highlights: Highlight[];
}

export async function processHighlightImport(userId: string, payload: HighlightImportPayload): Promise<ProcessImportResult> {
  const job = await importJobRepository.create({
    userId,
    source: payload.source,
    submittedAt: new Date().toISOString()
  });

  try {
    const highlights = await highlightRepository.upsertMany(userId, payload.entries);
    await importJobRepository.updateStatus(job.id, "completed");
    return {
      job: {
        ...job,
        status: "completed",
        processedAt: new Date().toISOString()
      },
      highlights
    };
  } catch (error) {
    await importJobRepository.updateStatus(job.id, "failed", (error as Error).message);
    throw error;
  }
}
