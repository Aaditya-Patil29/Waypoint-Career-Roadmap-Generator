import { forwardRef, useRef } from "react";
import { motion, useInView } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

const TRACKS = [
  {
    name: "Backend",
    desc: "APIs, databases and the systems behind every app.",
    roles: "Junior Backend. SDE.",
    goal: "Backend Developer",
  },
  {
    name: "Frontend",
    desc: "Interfaces, design systems and the browser.",
    roles: "Frontend Developer.",
    goal: "Frontend Developer",
  },
  {
    name: "Full stack",
    desc: "Both sides, shipped end to end.",
    roles: "Full Stack Developer.",
    goal: "Full Stack Developer",
  },
  {
    name: "DevOps and Cloud",
    desc: "Pipelines, containers and infrastructure that stays up.",
    roles: "DevOps. Cloud Engineer.",
    goal: "DevOps Engineer",
  },
  {
    name: "Data and AI",
    desc: "Data pipelines, models and the maths behind them.",
    roles: "Data Analyst. ML Engineer.",
    goal: "ML Engineer",
  },
  {
    name: "Embedded and IoT",
    desc: "Firmware, sensors and hardware that talks.",
    roles: "Embedded Engineer.",
    goal: "Embedded Engineer",
  },
  {
    name: "Cybersecurity",
    desc: "Finding weaknesses before someone else does.",
    roles: "Security Analyst.",
    goal: "Cybersecurity Analyst",
  },
  {
    name: "Core and government exams",
    desc: "Mechanical, civil, electrical and the competitive route.",
    roles: "GATE. PSU. Core Roles.",
    goal: "Core Engineering",
  },
];

interface TracksProps {
  onTrackSelect: (goal: string) => void;
}

const Tracks = forwardRef<HTMLElement, TracksProps>(({ onTrackSelect }, ref) => {
  return (
    <section
      ref={ref}
      className="tracks-section bg-ink"
      style={{ paddingTop: 100, paddingBottom: 100 }}
    >
      <div className="content-width">
        <div className="font-mono-meta mb-10" style={{ color: "var(--muted)" }}>
          002/ Tracks
        </div>

        <div className="border-t" style={{ borderColor: "var(--line-dark)" }}>
          {TRACKS.map((track, i) => (
            <TrackRow key={track.name} track={track} index={i} onSelect={() => onTrackSelect(track.goal)} />
          ))}
        </div>
      </div>
    </section>
  );
});

Tracks.displayName = "Tracks";
export default Tracks;

function TrackRow({
  track,
  index,
  onSelect,
}: {
  track: typeof TRACKS[0];
  index: number;
  onSelect: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.button
      ref={ref}
      onClick={onSelect}
      className="w-full text-left border-b py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
      style={{ borderColor: "var(--line-dark)", background: "transparent" }}
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease: EASE, delay: index * 0.04 }}
      aria-label={`Start roadmap for ${track.name}`}
    >
      <div>
        <div
          className="font-display"
          style={{
            fontSize: "clamp(20px, 2.5vw, 28px)",
            color: "var(--paper)",
          }}
        >
          {track.name}
        </div>
        <div style={{ fontSize: 15, color: "var(--muted)", marginTop: 2 }}>
          {track.desc}
        </div>
      </div>
      <div
        className="font-mono-meta flex-shrink-0"
        style={{ color: "var(--muted)", letterSpacing: "0.06em" }}
      >
        {track.roles}
      </div>
    </motion.button>
  );
}
