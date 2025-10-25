import type { DigestPreview, Highlight } from "@/lib/types";

export function renderDigestEmail(digest: DigestPreview, highlights: Highlight[]): string {
  const highlightList = highlights
    .slice(0, digest.highlightCount)
    .map((highlight) => `
      <li>
        <strong>${highlight.sourceTitle}</strong>
        <p>${highlight.text}</p>
      </li>
    `)
    .join("\n");

  return `
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0b0d12; color: #f7f9fc; }
          .card { background: #111623; border-radius: 16px; padding: 24px; }
          h1 { font-size: 20px; }
          ul { padding: 0; list-style: none; display: grid; gap: 16px; }
          li { background: rgba(255, 255, 255, 0.06); padding: 16px; border-radius: 12px; }
          p { margin: 8px 0 0 0; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Weekly Highlights Digest</h1>
          <p>Scheduled for ${new Date(digest.scheduledFor).toLocaleString()}</p>
          <p>You have ${digest.highlightCount} highlights ready for review.</p>
          <ul>${highlightList}</ul>
        </div>
      </body>
    </html>
  `;
}
