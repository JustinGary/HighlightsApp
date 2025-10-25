"use client";

import { useEffect, useState } from "react";
import type { DigestPreview } from "@/lib/types";

export function DigestClient() {
  const [digest, setDigest] = useState<DigestPreview | null>(null);
  const [scheduledFor, setScheduledFor] = useState(() => {
    const defaultDate = new Date(Date.now() + 1000 * 60 * 60 * 24);
    defaultDate.setMinutes(0, 0, 0);
    return defaultDate.toISOString().slice(0, 16);
  });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/digests")
      .then((res) => res.json())
      .then((data) => {
        setDigest(data.digest ?? null);
        if (data.digest) {
          setScheduledFor(data.digest.scheduledFor.slice(0, 16));
        }
      })
      .catch(() => setMessage("Unable to load digest"));
  }, []);

  const schedule = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (!scheduledFor) {
      setMessage("Choose a schedule before saving");
      return;
    }

    const scheduledDate = new Date(scheduledFor);
    if (Number.isNaN(scheduledDate.getTime())) {
      setMessage("Choose a valid schedule time");
      return;
    }

    const response = await fetch("/api/digests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "demo-user", scheduledFor: scheduledDate.toISOString() })
    });

    if (!response.ok) {
      const payload = await response.json();
      setMessage(payload.error ?? "Unable to schedule digest");
      return;
    }

    const payload: DigestPreview = await response.json();
    setDigest(payload);
    setScheduledFor(payload.scheduledFor.slice(0, 16));
    setMessage("Digest scheduled");
  };

  return (
    <div className="grid two">
      <section className="card">
        <h2>Digest schedule</h2>
        <p className="subtle">Adjust the next delivery window for the weekly review email.</p>
        <form onSubmit={schedule} style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
          <label style={{ display: "grid", gap: "0.5rem" }}>
            <span className="subtle">Send at</span>
            <input
              type="datetime-local"
              required
              value={scheduledFor}
              onChange={(event) => setScheduledFor(event.target.value)}
              style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.12)" }}
            />
          </label>
          <button
            type="submit"
            style={{ padding: "0.85rem", borderRadius: "10px", border: "none", fontWeight: 600 }}
          >
            Save schedule
          </button>
        </form>
        {message ? <p style={{ marginTop: "1rem" }}>{message}</p> : null}
      </section>

      <section className="card">
        <h2>Preview</h2>
        {digest ? (
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
            <div>
              <strong>Scheduled for</strong>
              <p className="subtle">{new Date(digest.scheduledFor).toLocaleString()}</p>
            </div>
            <div>
              <strong>Highlights queued</strong>
              <p className="subtle">{digest.highlightCount}</p>
            </div>
            <div>
              <strong>New this week</strong>
              <p className="subtle">{digest.recentlyAddedCount}</p>
            </div>
            <div>
              <strong>Quick actions</strong>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {digest.actions.map((action) => (
                  <span className="badge" key={action.href}>
                    {action.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="subtle">Schedule a digest to see preview details.</p>
        )}
      </section>
    </div>
  );
}
