import { getDashboardSnapshot } from "@/lib/mock/dashboard";

export default async function AnalyticsPage() {
  const snapshot = await getDashboardSnapshot();
  const masteryBuckets = snapshot.recentHighlights.reduce(
    (acc, highlight) => {
      const score = Math.round(highlight.masteryScore * 100);
      if (score >= 80) acc.mastered += 1;
      else if (score >= 50) acc.inProgress += 1;
      else acc.new += 1;
      return acc;
    },
    { mastered: 0, inProgress: 0, new: 0 }
  );

  return (
    <div style={{ display: "grid", gap: "2rem" }}>
      <header>
        <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>Analytics</h1>
        <p className="subtle">
          Monitor retention trends, weekly engagement, and quality of resurfaced highlights.
        </p>
      </header>
      <section className="grid three">
        <article className="card">
          <h2>Average retention</h2>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>{snapshot.metrics.retentionScore}%</div>
          <p className="subtle">Based on the SM-2 mastery curve.</p>
        </article>
        <article className="card">
          <h2>Weekly reviews</h2>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>{snapshot.metrics.weeklyReviewsCompleted}</div>
          <p className="subtle">Sessions completed in the last 7 days.</p>
        </article>
        <article className="card">
          <h2>Digest readiness</h2>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>{snapshot.upcomingDigest.highlightCount}</div>
          <p className="subtle">Highlights scheduled for the next email.</p>
        </article>
      </section>
      <section className="card">
        <h2>Mastery distribution</h2>
        <div className="list" style={{ marginTop: "1.25rem" }}>
          <div className="list-item">
            <strong>Mastered</strong>
            <span className="badge">{masteryBuckets.mastered}</span>
          </div>
          <div className="list-item">
            <strong>In progress</strong>
            <span className="badge">{masteryBuckets.inProgress}</span>
          </div>
          <div className="list-item">
            <strong>New</strong>
            <span className="badge">{masteryBuckets.new}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
