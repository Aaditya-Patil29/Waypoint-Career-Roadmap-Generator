export default function Statement() {
  return (
    <section
      className="statement-section bg-paper"
      style={{ paddingTop: 100, paddingBottom: 100 }}
    >
      <div className="content-width">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
          {/* Label column */}
          <div className="flex-shrink-0" style={{ width: 120 }}>
            <span className="font-mono-meta text-muted">001/ The plan</span>
          </div>
          {/* Text */}
          <div style={{ maxWidth: "58ch" }}>
            <p
              className="font-display text-ink"
              style={{ fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.35, margin: 0 }}
            >
              Most advice for students is either a list of fifty things to learn or a
              motivational video. Waypoint gives you an order.
            </p>
            <p
              className="text-muted mt-6"
              style={{ fontSize: 17, lineHeight: 1.6, maxWidth: "55ch" }}
            >
              It starts from what you already know, puts projects ahead of
              certificates, fits the work into the hours you really have, and tells you
              plainly when a goal needs more time than you planned.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
