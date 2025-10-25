import type { ReviewQueueItem } from "@/lib/types";

interface ReviewQueueProps {
  items: ReviewQueueItem[];
}

export function ReviewQueue({ items }: ReviewQueueProps) {
  return (
    <section className="card">
      <h2>Review queue</h2>
      <p className="subtle">
        Highlights due for spaced repetition. Record feedback to tune the learning schedule.
      </p>
      <div className="list" style={{ marginTop: "1.25rem" }}>
        {items.map((item) => (
          <div className="list-item" key={item.highlightId}>
            <div>
              <strong>{item.sourceTitle}</strong>
              <p className="highlight-text">{item.text}</p>
              <p className="subtle">Due {new Date(item.dueAt).toLocaleString()}</p>
            </div>
            <span className="badge">{item.recommendedAction}</span>
          </div>
        ))}
        {items.length === 0 ? <p className="subtle">You're all caught up! 🎉</p> : null}
      </div>
    </section>
  );
}
