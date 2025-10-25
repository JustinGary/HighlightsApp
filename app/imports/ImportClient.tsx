"use client";

import { useEffect, useState, useTransition } from "react";
import type { Highlight, ImportJob } from "@/lib/types";

interface ImportResponse {
  job: ImportJob;
  highlights: Highlight[];
}

export function ImportClient() {
  const [noteText, setNoteText] = useState("");
  const [noteSource, setNoteSource] = useState("");
  const [noteTags, setNoteTags] = useState("");
  const [importSourceTitle, setImportSourceTitle] = useState("");
  const [importText, setImportText] = useState("");
  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/imports")
      .then((res) => res.json())
      .then((data) => setJobs(data.jobs ?? []))
      .catch(() => setMessage("Unable to load import history"));
  }, []);

  const submitManualNote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    const tags = noteTags.split(",").map((tag) => tag.trim()).filter(Boolean);
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: noteText, sourceTitle: noteSource, tags })
    });

    if (!response.ok) {
      const payload = await response.json();
      setMessage(payload.error ?? "Unable to save note");
      return;
    }

    setNoteText("");
    setNoteSource("");
    setNoteTags("");
    setMessage("Manual note saved and scheduled for review");
  };

  const submitImport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    const response = await fetch("/api/imports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "kindle",
        entries: [
          {
            text: importText,
            sourceTitle: importSourceTitle,
            capturedAt: new Date().toISOString()
          }
        ]
      })
    });

    if (!response.ok) {
      const payload = await response.json();
      setMessage(payload.error ?? "Unable to import highlight");
      return;
    }

    const payload: ImportResponse = await response.json();
    setJobs((prev) => [payload.job, ...prev]);
    setImportText("");
    setImportSourceTitle("");
    setMessage(`Imported ${payload.highlights.length} highlight(s)`);
  };

  const refreshJobs = () => {
    startTransition(() => {
      fetch("/api/imports")
        .then((res) => res.json())
        .then((data) => setJobs(data.jobs ?? []))
        .catch(() => setMessage("Unable to refresh import history"));
    });
  };

  return (
    <div className="grid two">
      <form className="card" onSubmit={submitManualNote}>
        <h2>Capture manual note</h2>
        <p className="subtle">Add highlights from print books, web, or meetings.</p>
        <label style={{ display: "grid", gap: "0.5rem", marginTop: "1rem" }}>
          <span className="subtle">Source title</span>
          <input
            required
            value={noteSource}
            onChange={(event) => setNoteSource(event.target.value)}
            style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.12)" }}
          />
        </label>
        <label style={{ display: "grid", gap: "0.5rem", marginTop: "1rem" }}>
          <span className="subtle">Highlight text</span>
          <textarea
            required
            rows={5}
            value={noteText}
            onChange={(event) => setNoteText(event.target.value)}
            style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.12)" }}
          />
        </label>
        <label style={{ display: "grid", gap: "0.5rem", marginTop: "1rem" }}>
          <span className="subtle">Tags (comma separated)</span>
          <input
            value={noteTags}
            onChange={(event) => setNoteTags(event.target.value)}
            style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.12)" }}
          />
        </label>
        <button
          type="submit"
          style={{ marginTop: "1.5rem", padding: "0.85rem", borderRadius: "10px", border: "none", fontWeight: 600 }}
        >
          Save note
        </button>
      </form>

      <form className="card" onSubmit={submitImport}>
        <h2>Upload Kindle highlight</h2>
        <p className="subtle">Paste a highlight to simulate a Kindle export import.</p>
        <label style={{ display: "grid", gap: "0.5rem", marginTop: "1rem" }}>
          <span className="subtle">Source title</span>
          <input
            required
            value={importSourceTitle}
            onChange={(event) => setImportSourceTitle(event.target.value)}
            style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.12)" }}
          />
        </label>
        <label style={{ display: "grid", gap: "0.5rem", marginTop: "1rem" }}>
          <span className="subtle">Highlight text</span>
          <textarea
            required
            rows={5}
            value={importText}
            onChange={(event) => setImportText(event.target.value)}
            style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.12)" }}
          />
        </label>
        <button
          type="submit"
          style={{ marginTop: "1.5rem", padding: "0.85rem", borderRadius: "10px", border: "none", fontWeight: 600 }}
        >
          Process import
        </button>
      </form>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Import history</h2>
          <button
            type="button"
            onClick={refreshJobs}
            disabled={isPending}
            style={{ padding: "0.65rem 1rem", borderRadius: "10px", border: "none", fontWeight: 600 }}
          >
            Refresh
          </button>
        </div>
        <div className="list" style={{ marginTop: "1.25rem" }}>
          {jobs.map((job) => (
            <div className="list-item" key={job.id}>
              <div>
                <strong>{job.source.toUpperCase()} import</strong>
                <p className="subtle">Submitted {new Date(job.submittedAt).toLocaleString()}</p>
              </div>
              <span className="badge">{job.status}</span>
            </div>
          ))}
          {jobs.length === 0 ? <p className="subtle">No imports yet.</p> : null}
        </div>
        {message ? <p style={{ marginTop: "1rem" }}>{message}</p> : null}
      </section>
    </div>
  );
}
