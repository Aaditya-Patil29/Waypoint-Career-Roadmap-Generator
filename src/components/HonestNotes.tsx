const NOTES = [
  "Waypoint is an AI guide. It can be wrong, so check anything important against official sources and people in the field.",
  "It does not know your college, your city or the current job market in detail. Treat salary and hiring claims with caution.",
  "The plan only works if it fits your week. Be honest about your hours, and change it when your life changes.",
];

export default function HonestNotes() {
  return (
    <section
      className="honest-notes bg-surface"
      style={{ paddingTop: 100, paddingBottom: 100 }}
    >
      <div className="content-width flex justify-center">
        <div style={{ maxWidth: 560 }}>
          <div className="font-mono-meta text-muted mb-8">Honest notes</div>
          {NOTES.map((note, i) => (
            <p
              key={i}
              className="text-muted"
              style={{
                fontSize: 17,
                lineHeight: 1.65,
                marginBottom: i < NOTES.length - 1 ? 24 : 0,
              }}
            >
              {note}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
