import { z } from "zod";

export const notePayloadSchema = z.object({
  text: z.string().min(1),
  sourceTitle: z.string().min(1),
  author: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export const highlightImportPayloadSchema = z.object({
  source: z.enum(["kindle", "manual", "integration"]),
  entries: z
    .array(
      z.object({
        text: z.string().min(1),
        sourceTitle: z.string().min(1),
        author: z.string().optional(),
        location: z.string().optional(),
        capturedAt: z.string().min(1),
        tags: z.array(z.string()).optional()
      })
    )
    .min(1)
});

export const reviewFeedbackSchema = z.object({
  highlightId: z.string().min(1),
  rating: z.enum(["again", "hard", "good", "easy"])
});

export const digestRequestSchema = z.object({
  userId: z.string().min(1),
  scheduledFor: z.string().min(1)
});
