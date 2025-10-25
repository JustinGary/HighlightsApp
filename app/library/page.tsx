import { ensureDemoSeeded } from "@/lib/mock/dashboard";
import { highlightRepository } from "@/lib/repositories/inMemoryRepositories";

const DEMO_USER_ID = "demo-user";

function groupByTag(highlights: Awaited<ReturnType<typeof highlightRepository.listByUser>>) {
  const map = new Map<string, number>();
  highlights.forEach((highlight) => {
    highlight.tags.forEach((tag) => {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    });
  });
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export default async function LibraryPage() {
  await ensureDemoSeeded();
  const highlights = await highlightRepository.listByUser(DEMO_USER_ID);
  const tagSummary = groupByTag(highlights);

  return (
    <div style={{ display: "grid", gap: "2rem" }}>
      <header>
        <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>Library</h1>
        <p className="subtle">
          Browse all captured highlights, organized by tags and readiness for spaced repetition.
        </p>
      </header>
      <section className="card">
        <h2>Tag distribution</h2>
        <div className="list" style={{ marginTop: "1.25rem" }}>
          {tagSummary.length > 0 ? (
            tagSummary.map((item) => (
              <div className="list-item" key={item.tag}>
                <strong>{item.tag}</strong>
                <span className="badge">{item.count}</span>
              </div>
            ))
          ) : (
            <p className="subtle">Add tags to highlights to unlock smart filtering.</p>
          )}
        </div>
      </section>
      <section className="card">
        <h2>Highlights</h2>
        <div className="list" style={{ marginTop: "1.25rem" }}>
          {highlights.map((highlight) => (
            <div className="list-item" key={highlight.id}>
              <div>
                <strong>{highlight.sourceTitle}</strong>
                <p className="highlight-text">{highlight.text}</p>
                <p className="subtle">Captured {new Date(highlight.capturedAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="subtle">Mastery {Math.round(highlight.masteryScore * 100)}%</p>
                <p className="subtle">Next review {new Date(highlight.nextReviewAt).toLocaleDateString()}</p>
                <p className="subtle">Tags: {highlight.tags.join(", ") || "—"}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
