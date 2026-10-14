interface CtaPanelProps {
  onStart: () => void;
}

export default function CtaPanel({ onStart }: CtaPanelProps) {
  return (
    <section
      className="cta-panel bg-paper"
      style={{ paddingTop: 80, paddingBottom: 80 }}
    >
      <div className="content-width">
        <div
          className="bg-ink"
          style={{
            borderRadius: "var(--panel-radius)",
            padding: "clamp(40px, 6vw, 72px) clamp(32px, 5vw, 60px)",
            margin: "0 16px",
          }}
        >
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(28px, 5vw, 60px)",
              color: "var(--paper)",
              marginBottom: 32,
              maxWidth: "14ch",
            }}
          >
            Your next three months, planned.
          </h2>

          <button
            id="cta-start-btn"
            className="btn-accent"
            onClick={onStart}
            aria-label="Build my roadmap"
          >
            <span>Build my roadmap</span>
          </button>

          <div className="font-mono-meta mt-6" style={{ color: "var(--muted)" }}>
            Free. No account. Your plan stays in your browser.
          </div>
        </div>
      </div>
    </section>
  );
}
