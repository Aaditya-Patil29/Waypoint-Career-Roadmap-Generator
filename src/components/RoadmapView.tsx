import type { Roadmap, PhaseChecklist } from "../types";
import PhaseCard from "./PhaseCard";
import { downloadMarkdown, roadmapToMarkdown } from "../lib/exportMarkdown";
import { Copy, Download, Printer } from "lucide-react";
import { useState } from "react";

interface RoadmapViewProps {
  roadmap: Roadmap | null;
  checklist: PhaseChecklist;
  onToggle: (phaseId: string, kind: "skill" | "project", index: number) => void;
}

export default function RoadmapView({ roadmap, checklist, onToggle }: RoadmapViewProps) {
  const [copied, setCopied] = useState(false);

  if (!roadmap) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full"
        style={{ minHeight: 300, opacity: 0.5 }}
        aria-live="polite"
      >
        <svg
          viewBox="0 0 120 200"
          width={80}
          height={133}
          aria-hidden="true"
          style={{ marginBottom: 16 }}
        >
          <path
            d="M 60 10 C 60 50 100 50 100 100 C 100 150 20 150 20 190"
            fill="none"
            stroke="var(--accent)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray="4 4"
          />
          {[10, 100, 190].map((y, i) => (
            <circle
              key={i}
              cx={i === 0 ? 60 : i === 1 ? 100 : 20}
              cy={y}
              r={4}
              fill="var(--paper)"
              stroke="var(--accent)"
              strokeWidth={1.5}
            />
          ))}
        </svg>
        <p className="font-mono-meta text-muted">Your roadmap will appear here.</p>
      </div>
    );
  }

  const handleCopy = () => {
    const md = roadmapToMarkdown(roadmap);
    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Compute overall progress
  const totalItems = roadmap.phases.reduce(
    (sum, p) => sum + p.skills.length + p.projects.length, 0
  );
  const doneItems = roadmap.phases.reduce((sum, p) => {
    const c = checklist[p.id];
    if (!c) return sum;
    return sum + c.skills.filter(Boolean).length + c.projects.filter(Boolean).length;
  }, 0);

  return (
    <div className="roadmap-print" style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div className="pb-6 border-b mb-6" style={{ borderColor: "var(--line)" }}>
        <div className="font-mono-meta text-muted mb-2">{roadmap.targetRole}</div>
        <h2
          className="font-display text-ink mb-2"
          style={{ fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.1 }}
        >
          {roadmap.title}
        </h2>
        <p style={{ fontSize: 15, color: "var(--muted)", maxWidth: "55ch", margin: 0 }}>
          {roadmap.summary}
        </p>

        <div className="flex flex-wrap gap-4 mt-4">
          <span className="font-mono-meta text-muted">
            {roadmap.totalDuration}
          </span>
          <span className="font-mono-meta text-muted">
            {roadmap.weeklyHours}h / week
          </span>
          <span className="font-mono-meta text-muted">
            {doneItems} of {totalItems} done
          </span>
        </div>

        {/* Overall progress */}
        <div className="progress-bar rounded-full mt-3" style={{ height: 3 }}>
          <div
            className="progress-bar-fill rounded-full"
            style={{ width: totalItems > 0 ? `${(doneItems / totalItems) * 100}%` : "0%", height: 3 }}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mb-6 no-print">
        <button className="btn-ghost" onClick={handleCopy} aria-label="Copy roadmap as text">
          <Copy size={13} />
          {copied ? "Copied!" : "Copy"}
        </button>
        <button className="btn-ghost" onClick={() => downloadMarkdown(roadmap)} aria-label="Download roadmap as Markdown">
          <Download size={13} />
          Download .md
        </button>
        <button className="btn-ghost" onClick={() => window.print()} aria-label="Print or save roadmap as PDF">
          <Printer size={13} />
          Print / PDF
        </button>
      </div>

      {/* Phase cards with vertical line */}
      <div className="relative">
        <div
          style={{
            position: "absolute",
            left: 8,
            top: 0,
            bottom: 0,
            width: 1.5,
            background: "var(--accent)",
            opacity: 0.3,
          }}
          aria-hidden="true"
        />
        <div style={{ paddingLeft: 28 }}>
          {roadmap.phases.map((phase, i) => (
            <div key={phase.id} className="relative">
              {/* Marker */}
              <div
                style={{
                  position: "absolute",
                  left: -28,
                  top: 28,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "var(--paper)",
                  border: "1.5px solid var(--accent)",
                  zIndex: 1,
                }}
                aria-hidden="true"
              />
              <PhaseCard
                phase={phase}
                index={i}
                checklist={checklist}
                onToggle={onToggle}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Interview Prep */}
      {roadmap.interviewPrep.length > 0 && (
        <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--line)" }}>
          <div className="font-mono-meta text-muted mb-3">Interview Preparation</div>
          <ul style={{ paddingLeft: 20 }}>
            {roadmap.interviewPrep.map((item, i) => (
              <li key={i} style={{ fontSize: 15, color: "var(--ink)", marginBottom: 6 }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Certifications */}
      {roadmap.certifications.length > 0 && (
        <div className="mt-6 pt-6 border-t" style={{ borderColor: "var(--line)" }}>
          <div className="font-mono-meta text-muted mb-3">Certifications</div>
          <ul style={{ paddingLeft: 20 }}>
            {roadmap.certifications.map((cert, i) => (
              <li key={i} style={{ fontSize: 15, color: "var(--ink)", marginBottom: 6 }}>
                {cert}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Honest note */}
      <div
        className="mt-6 pt-6 border-t"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="font-mono-meta text-muted mb-2">Honest Note</div>
        <p style={{ fontSize: 15, color: "var(--muted)", fontStyle: "italic", margin: 0, maxWidth: "55ch" }}>
          {roadmap.honestNote}
        </p>
      </div>
    </div>
  );
}
