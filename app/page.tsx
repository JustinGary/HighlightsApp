import { DigestPreviewCard } from "@/components/dashboard/DigestPreviewCard";
import { ImportStatus } from "@/components/dashboard/ImportStatus";
import { RecentHighlights } from "@/components/dashboard/RecentHighlights";
import { ReviewQueue } from "@/components/dashboard/ReviewQueue";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { getDashboardSnapshot } from "@/lib/mock/dashboard";

export default async function DashboardPage() {
  const snapshot = await getDashboardSnapshot();

  return (
    <div style={{ display: "grid", gap: "2.5rem" }}>
      <header>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Review hub</h1>
        <p className="subtle">
          Track imports, complete spaced repetition sessions, and keep weekly digests on schedule.
        </p>
      </header>
      <SummaryCards metrics={snapshot.metrics} />
      <div className="grid two">
        <ReviewQueue items={snapshot.reviewQueue} />
        <DigestPreviewCard digest={snapshot.upcomingDigest} />
      </div>
      <div className="grid two">
        <RecentHighlights highlights={snapshot.recentHighlights} />
        <ImportStatus jobs={snapshot.importJobs} />
      </div>
    </div>
  );
}
