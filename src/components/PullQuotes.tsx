const QUOTES = [
  {
    label: "On using a plan",
    text: "A roadmap is not a promise. It is a way of deciding what to do on a Tuesday evening.",
  },
  {
    label: "On building",
    text: "One finished project teaches more than three half watched courses.",
  },
  {
    label: "On pace",
    text: "If a phase feels too big, the plan is wrong, not you. Ask for it to be smaller.",
  },
];

export default function PullQuotes() {
  return (
    <section
      className="pull-quotes bg-paper"
      style={{ paddingTop: 100, paddingBottom: 100 }}
    >
      <div className="content-width">
        <div className="flex flex-col gap-0">
          {QUOTES.map((q, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row gap-4 md:gap-10 py-10 border-b"
              style={{ borderColor: "var(--line)" }}
            >
              <div className="flex-shrink-0" style={{ width: 120 }}>
                <span className="font-mono-meta text-muted">{q.label}</span>
              </div>
              <blockquote
                className="font-display text-ink m-0"
                style={{ fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.3, maxWidth: "52ch" }}
              >
                {q.text}
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
