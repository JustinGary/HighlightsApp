import { ImportClient } from "./ImportClient";

export default function ImportsPage() {
  return (
    <div style={{ display: "grid", gap: "2rem" }}>
      <header>
        <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>Imports workspace</h1>
        <p className="subtle">
          Upload Kindle exports, capture manual notes, and monitor ingestion jobs feeding the spaced repetition engine.
        </p>
      </header>
      <ImportClient />
    </div>
  );
}
