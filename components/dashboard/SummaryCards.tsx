import type { DashboardMetrics } from "@/lib/types";

interface SummaryCardsProps {
  metrics: DashboardMetrics;
}

export function SummaryCards({ metrics }: SummaryCardsProps) {
  const items = [
    {
      label: "Highlights captured",
      value: metrics.totalHighlights,
      helper: "Across Kindle imports and manual notes"
    },
    {
      label: "Reviews this week",
      value: metrics.weeklyReviewsCompleted,
      helper: "Completed spaced repetition sessions"
    },
    {
      label: "Retention score",
      value: `${metrics.retentionScore}%`,
      helper: "Rolling average mastery across highlights"
    },
    {
      label: "Streak",
      value: `${metrics.streakWeeks} weeks`,
      helper: "Consecutive weeks with completed digests"
    }
  ];

  return (
    <section className="grid three">
      {items.map((item) => (
        <article className="card" key={item.label}>
          <h2>{item.label}</h2>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>{item.value}</div>
          <p className="subtle">{item.helper}</p>
        </article>
      ))}
    </section>
  );
}
