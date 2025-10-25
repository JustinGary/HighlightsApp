import { DigestClient } from "./DigestClient";

export default function DigestsPage() {
  return (
    <div style={{ display: "grid", gap: "2rem" }}>
      <header>
        <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>Digest orchestration</h1>
        <p className="subtle">
          Configure weekly email delivery windows and preview the content queued for resurfacing.
        </p>
      </header>
      <DigestClient />
    </div>
  );
}
