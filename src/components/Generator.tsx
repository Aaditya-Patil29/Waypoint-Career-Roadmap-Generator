import ChatPanel from "./ChatPanel";
import RoadmapView from "./RoadmapView";
import type { ChatStage, ChatMessage, Roadmap, PhaseChecklist } from "../types";
import type { IntakeAnswers } from "../hooks/useChat";

interface GeneratorProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  stage: ChatStage;
  messages: ChatMessage[];
  intakeStep: number;
  intakeAnswers: IntakeAnswers;
  isLoading: boolean;
  loadingMsg: string;
  error: string | null;
  roadmap: Roadmap | null;
  checklist: PhaseChecklist;
  onIntakeAnswer: (answer: string, answers: IntakeAnswers) => void;
  onSendMessage: (msg: string) => void;
  onBack: () => void;
  onStartOver: () => void;
  onToggle: (phaseId: string, kind: "skill" | "project", index: number) => void;
  preselectedGoal?: string;
}

export default function Generator({
  sectionRef,
  stage, messages, intakeStep, intakeAnswers,
  isLoading, loadingMsg, error,
  roadmap, checklist,
  onIntakeAnswer, onSendMessage, onBack, onStartOver, onToggle,
  preselectedGoal,
}: GeneratorProps) {
  return (
    <section
      ref={sectionRef}
      id="generator"
      className="bg-surface"
      style={{ paddingTop: 80, paddingBottom: 80 }}
    >
      <div className="content-width">
        <div className="font-mono-meta text-muted mb-6">The Generator</div>

        {/* Main panel */}
        <div
          className="chat-panel-wrapper border"
          style={{
            borderColor: "var(--line)",
            borderRadius: "var(--panel-radius)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            minHeight: 560,
          }}
        >
          {/* Chat side */}
          <div
            className="flex flex-col"
            style={{
              width: "42%",
              minWidth: 280,
              borderRight: "1px solid var(--line)",
              background: "var(--paper)",
            }}
          >
            <ChatPanel
              stage={stage}
              messages={messages}
              intakeStep={intakeStep}
              intakeAnswers={intakeAnswers}
              isLoading={isLoading}
              loadingMsg={loadingMsg}
              error={error}
              roadmap={roadmap}
              onIntakeAnswer={onIntakeAnswer}
              onSendMessage={onSendMessage}
              onBack={onBack}
              onStartOver={onStartOver}
              preselectedGoal={preselectedGoal}
            />
          </div>

          {/* Roadmap side */}
          <div
            className="flex-1 overflow-y-auto"
            style={{
              background: "var(--paper)",
              padding: "28px 32px",
            }}
          >
            <RoadmapView
              roadmap={roadmap}
              checklist={checklist}
              onToggle={onToggle}
            />
          </div>
        </div>

        {/* Responsive: mobile stacks, handled via CSS below */}
        <style>{`
          @media (max-width: 768px) {
            .chat-panel-wrapper {
              flex-direction: column !important;
            }
            .chat-panel-wrapper > div:first-child {
              width: 100% !important;
              border-right: none !important;
              border-bottom: 1px solid var(--line);
            }
          }
        `}</style>
      </div>
    </section>
  );
}
