export default function Footer({
  onHowItWorks,
  onTracks,
  onStart,
}: {
  onHowItWorks: () => void;
  onTracks: () => void;
  onStart: () => void;
}) {
  return (
    <footer className="bg-ink" style={{ paddingTop: 60, paddingBottom: 40 }}>
      <div className="content-width">
        {/* Giant wordmark */}
        <div
          className="font-display overflow-hidden"
          style={{
            fontSize: "clamp(48px, 14vw, 140px)",
            color: "var(--paper)",
            opacity: 0.08,
            lineHeight: 1,
            marginBottom: 48,
            letterSpacing: "-0.04em",
          }}
          aria-hidden="true"
        >
          WAYPOINT
        </div>

        <div
          className="border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6"
          style={{ borderColor: "var(--line-dark)" }}
        >
          <div>
            <div className="font-display text-paper mb-2" style={{ fontSize: 18 }}>
              Waypoint
            </div>
            <p className="font-mono-meta" style={{ color: "var(--muted)", margin: 0 }}>
              Built for engineering students.
            </p>
          </div>

          <nav className="flex gap-5" aria-label="Footer navigation">
            <button
              onClick={onHowItWorks}
              className="font-mono-meta hover:opacity-70 transition-opacity"
              style={{ color: "var(--muted)" }}
            >
              How it works
            </button>
            <button
              onClick={onTracks}
              className="font-mono-meta hover:opacity-70 transition-opacity"
              style={{ color: "var(--muted)" }}
            >
              Tracks
            </button>
            <button
              onClick={onStart}
              className="font-mono-meta hover:opacity-70 transition-opacity"
              style={{ color: "var(--muted)" }}
            >
              Start
            </button>
          </nav>
        </div>

        <div className="mt-6 font-mono-meta" style={{ color: "var(--muted)", opacity: 0.6 }}>
          Roadmaps are guidance, not guarantees.
        </div>
      </div>
    </footer>
  );
}
