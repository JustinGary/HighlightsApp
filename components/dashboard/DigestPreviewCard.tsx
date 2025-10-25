import type { DigestPreview } from "@/lib/types";

interface DigestPreviewCardProps {
  digest: DigestPreview;
}

export function DigestPreviewCard({ digest }: DigestPreviewCardProps) {
  return (
    <section className="card">
      <h2>Upcoming weekly digest</h2>
      <p className="subtle">
        The digest curates highlights you're likely to forget and surfaces new notes captured during the week.
      </p>
      <div style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
        <div className="list-item">
          <div>
            <strong>Scheduled send</strong>
            <p className="subtle">{new Date(digest.scheduledFor).toLocaleString()}</p>
          </div>
          <span className="badge">Weekly cadence</span>
        </div>
        <div className="list-item">
          <div>
            <strong>Highlights queued</strong>
            <p className="subtle">{digest.highlightCount} due for review</p>
          </div>
        </div>
        <div className="list-item">
          <div>
            <strong>Recent additions</strong>
            <p className="subtle">{digest.recentlyAddedCount} new notes ready to feature</p>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
        {digest.actions.map((action) => (
          <a className="badge" key={action.href} href={action.href}>
            {action.label}
          </a>
        ))}
      </div>
    </section>
  );
}
