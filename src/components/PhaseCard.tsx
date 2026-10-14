import { useRef } from "react";
import { motion, useInView } from "motion/react";
import type { Phase, PhaseChecklist } from "../types";

const EASE = [0.22, 1, 0.36, 1] as const;

const RESOURCE_COLORS: Record<string, string> = {
  course: "#0F6B5C",
  book: "#5C4B0F",
  docs: "#0F3E6B",
  video: "#6B0F3C",
  practice: "#2E0F6B",
  community: "#6B4F0F",
};

interface PhaseCardProps {
  phase: Phase;
  index: number;
  checklist: PhaseChecklist;
  onToggle: (phaseId: string, kind: "skill" | "project", index: number) => void;
}

export default function PhaseCard({ phase, index, checklist, onToggle }: PhaseCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const phaseCheck = checklist[phase.id] ?? {
    skills: phase.skills.map(() => false),
    projects: phase.projects.map(() => false),
  };

  const doneSkills = phaseCheck.skills.filter(Boolean).length;
  const doneProjects = phaseCheck.projects.filter(Boolean).length;
  const totalItems = phase.skills.length + phase.projects.length;
  const doneItems = doneSkills + doneProjects;

  return (
    <motion.div
      ref={ref}
      className="phase-card"
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.12 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="font-mono-meta text-muted mb-1">Phase {index + 1} · {phase.duration}</div>
          <h3 className="font-display text-ink" style={{ fontSize: "clamp(22px, 3vw, 28px)" }}>
            {phase.title}
          </h3>
        </div>
        <div className="font-mono-meta text-muted text-right flex-shrink-0">
          {doneItems} of {totalItems} done
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar rounded-full mb-4">
        <div
          className="progress-bar-fill rounded-full"
          style={{ width: totalItems > 0 ? `${(doneItems / totalItems) * 100}%` : "0%" }}
        />
      </div>

      {/* Goal */}
      <p className="text-muted mb-5" style={{ fontSize: 15, fontStyle: "italic" }}>
        {phase.goal}
      </p>

      {/* Skills */}
      <div className="mb-5">
        <div className="font-mono-meta text-muted mb-2">Skills</div>
        <div className="flex flex-col gap-2">
          {phase.skills.map((skill, si) => (
            <label key={si} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={phaseCheck.skills[si] ?? false}
                onChange={() => onToggle(phase.id, "skill", si)}
                className="w-4 h-4 rounded accent-accent flex-shrink-0"
                aria-label={`Mark skill "${skill}" as done`}
              />
              <span
                style={{
                  fontSize: 15,
                  textDecoration: phaseCheck.skills[si] ? "line-through" : "none",
                  color: phaseCheck.skills[si] ? "var(--muted)" : "var(--ink)",
                  transition: "color 0.2s",
                }}
              >
                {skill}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="mb-5">
        <div className="font-mono-meta text-muted mb-2">Projects</div>
        <div className="flex flex-col gap-3">
          {phase.projects.map((proj, pi) => (
            <label key={pi} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={phaseCheck.projects[pi] ?? false}
                onChange={() => onToggle(phase.id, "project", pi)}
                className="w-4 h-4 rounded accent-accent flex-shrink-0 mt-1"
                aria-label={`Mark project "${proj.title}" as done`}
              />
              <div>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    textDecoration: phaseCheck.projects[pi] ? "line-through" : "none",
                    color: phaseCheck.projects[pi] ? "var(--muted)" : "var(--ink)",
                    display: "block",
                  }}
                >
                  {proj.title}
                </span>
                <span style={{ fontSize: 14, color: "var(--muted)" }}>{proj.description}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="mb-4">
        <div className="font-mono-meta text-muted mb-2">Resources</div>
        <div className="flex flex-col gap-2">
          {phase.resources.map((res, ri) => (
            <div key={ri} className="flex items-start gap-2">
              <span
                className="resource-badge flex-shrink-0 mt-1"
                style={{ borderColor: `${RESOURCE_COLORS[res.type] ?? "var(--line)"}40`, color: RESOURCE_COLORS[res.type] ?? "var(--muted)" }}
              >
                {res.type}
              </span>
              <div style={{ fontSize: 14 }}>
                <span style={{ color: "var(--ink)" }}>{res.title}</span>
                {res.note && (
                  <span style={{ color: "var(--muted)" }}> — {res.note}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestone */}
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "var(--radius)",
          padding: "12px 16px",
        }}
      >
        <div className="font-mono-meta text-muted mb-1">Milestone</div>
        <p style={{ fontSize: 15, color: "var(--ink)", margin: 0 }}>{phase.milestone}</p>
      </div>
    </motion.div>
  );
}
