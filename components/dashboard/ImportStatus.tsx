import type { ImportJob } from "@/lib/types";

interface ImportStatusProps {
  jobs: ImportJob[];
}

const statusColor: Record<ImportJob["status"], string> = {
  pending: "rgba(250, 204, 21, 0.2)",
  processing: "rgba(59, 130, 246, 0.2)",
  completed: "rgba(16, 185, 129, 0.2)",
  failed: "rgba(248, 113, 113, 0.2)"
};

export function ImportStatus({ jobs }: ImportStatusProps) {
  return (
    <section className="card">
      <h2>Import activity</h2>
      <p className="subtle">Monitor Kindle exports and manual uploads currently in flight.</p>
      <div className="list" style={{ marginTop: "1.25rem" }}>
        {jobs.map((job) => (
          <div className="list-item" key={job.id}>
            <div>
              <strong>{job.source.toUpperCase()} import</strong>
              <p className="subtle">Submitted {new Date(job.submittedAt).toLocaleString()}</p>
            </div>
            <span className="badge" style={{ background: statusColor[job.status] }}>
              {job.status}
            </span>
          </div>
        ))}
        {jobs.length === 0 ? <p className="subtle">No imports yet. Drag in a Kindle export to get started.</p> : null}
      </div>
    </section>
  );
}
