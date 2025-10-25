import type { Highlight } from "@/lib/types";

interface RecentHighlightsProps {
  highlights: Highlight[];
}

export function RecentHighlights({ highlights }: RecentHighlightsProps) {
  return (
    <section className="card">
      <h2>Latest highlights</h2>
      <p className="subtle">Imported this week across Kindle exports and manual notes.</p>
      <div className="list" style={{ marginTop: "1.25rem" }}>
        {highlights.map((highlight) => (
          <div className="list-item" key={highlight.id}>
            <div>
              <strong>{highlight.sourceTitle}</strong>
              <p className="highlight-text">{highlight.text}</p>
            </div>
            <div>
              <p className="subtle">Captured {new Date(highlight.capturedAt).toLocaleDateString()}</p>
              <p className="subtle">Tags: {highlight.tags.join(", ") || "—"}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
