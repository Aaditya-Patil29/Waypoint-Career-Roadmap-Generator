export default function Navbar({ onStart }: { onStart: () => void }) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-paper border-b"
      style={{ height: 66, borderColor: "var(--line)" }}
    >
      <div className="content-width h-full flex items-center justify-between">
        <span className="font-display text-xl text-ink" style={{ fontSize: 22, letterSpacing: "-0.02em" }}>
          Waypoint
        </span>
        <div className="flex items-center gap-6">
          <span className="font-mono-meta text-muted hidden sm:block">
            Free. For Engineering Students.
          </span>
          <button
            onClick={onStart}
            className="font-mono-meta text-accent border-b border-accent pb-px hover:opacity-70 transition-opacity"
            aria-label="Start building your roadmap"
          >
            Start
          </button>
        </div>
      </div>
    </nav>
  );
}
