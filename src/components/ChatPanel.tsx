import { useRef, useState, useEffect, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, RotateCcw, ChevronLeft, WifiOff } from "lucide-react";
import ReactMarkdown from "react-markdown";
import OptionChips from "./OptionChips";
import { isKeyMissing } from "../lib/gemini";
import type { ChatMessage, ChatStage, Roadmap } from "../types";
import type { IntakeAnswers } from "../hooks/useChat";

const EASE = [0.22, 1, 0.36, 1] as const;

const BRANCHES = ["Computer", "IT", "Electronics", "Mechanical", "Civil", "Electrical", "Other"];
const YEARS = ["First", "Second", "Third", "Final", "Graduate"];
const GOALS = [
  "Backend Developer", "Frontend Developer", "Full Stack Developer",
  "DevOps Engineer", "Cloud Engineer", "Data Analyst",
  "ML Engineer", "Embedded Engineer", "Cybersecurity Analyst",
  "Core Engineering", "Not sure yet",
];
const INTERESTS = [
  "Building apps", "Data and AI", "Hardware and embedded",
  "Cloud and DevOps", "Security", "Design", "Core engineering", "Research",
];
const HOURS = ["5", "10", "15", "20+"];
const TIMELINES = ["6 months", "1 year", "2 years", "Until graduation"];
const PREFS = ["Job", "Higher studies", "Startup", "Government exam", "Undecided"];

const REFINE_STARTERS = [
  "Make it lighter",
  "Add more projects",
  "Focus more on DevOps",
  "What should I do this week?",
  "Explain phase 2",
];

const INTAKE_QUESTIONS = [
  "Which branch are you in?",
  "Which year are you in?",
  "Do you already have a goal role, or should we explore?",
  "What do you enjoy most? (select all that apply)",
  "What can you already do? (free text, or skip)",
  "How many hours per week can you give?",
  "How long do you want the plan to cover?",
  "What do you want after graduation?",
];

interface ChatPanelProps {
  stage: ChatStage;
  messages: ChatMessage[];
  intakeStep: number;
  intakeAnswers: IntakeAnswers;
  isLoading: boolean;
  loadingMsg: string;
  error: string | null;
  roadmap: Roadmap | null;
  onIntakeAnswer: (answer: string, answers: IntakeAnswers) => void;
  onSendMessage: (msg: string) => void;
  onBack: () => void;
  onStartOver: () => void;
  preselectedGoal?: string;
}

export default function ChatPanel({
  stage,
  messages,
  intakeStep,
  intakeAnswers,
  isLoading,
  loadingMsg,
  error,
  roadmap,
  onIntakeAnswer,
  onSendMessage,
  onBack,
  onStartOver,
  preselectedGoal,
}: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [confirmRestart, setConfirmRestart] = useState(false);
  const [localInterests, setLocalInterests] = useState<string[]>(intakeAnswers.interests ?? []);
  const [skillsText, setSkillsText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, stage]);

  useEffect(() => {
    if (preselectedGoal && intakeStep === 3) {
      handleChipSelect(preselectedGoal);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedGoal]);

  const handleChipSelect = (value: string) => {
    let newAnswers = { ...intakeAnswers };
    let answerText = value;

    if (intakeStep === 1) newAnswers.branch = value;
    else if (intakeStep === 2) newAnswers.year = value;
    else if (intakeStep === 3) newAnswers.goal = value;
    else if (intakeStep === 6) {
      newAnswers.weeklyHours = parseInt(value) || 10;
      answerText = `${value} hours per week`;
    } else if (intakeStep === 7) newAnswers.timeline = value;
    else if (intakeStep === 8) newAnswers.preference = value;

    onIntakeAnswer(answerText, newAnswers);
  };

  const handleInterestToggle = (val: string) => {
    setLocalInterests((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    );
  };

  const handleInterestConfirm = () => {
    if (localInterests.length === 0) return;
    const newAnswers = { ...intakeAnswers, interests: localInterests };
    onIntakeAnswer(localInterests.join(", "), newAnswers);
  };

  const handleSkillsSubmit = (skip?: boolean) => {
    const text = skip ? "Nothing specific yet" : skillsText.trim() || "Nothing specific yet";
    const newAnswers = { ...intakeAnswers, currentSkills: text };
    onIntakeAnswer(text, newAnswers);
  };

  const handleSend = () => {
    const msg = inputValue.trim();
    if (!msg) return;
    setInputValue("");
    onSendMessage(msg);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const totalSteps = 8;
  const progress = (intakeStep / totalSteps) * 100;

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
      {/* Key missing banner */}
      {isKeyMissing && (
        <div className="key-banner no-print flex-shrink-0">
          Add your Gemini key to the .env file and restart the dev server.
        </div>
      )}

      {/* Progress bar (intake only) */}
      {stage === "intake" && (
        <div className="flex-shrink-0 px-5 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono-meta text-muted">
              Step {intakeStep} of {totalSteps}
            </span>
            {intakeStep > 1 && (
              <button className="btn-ghost py-1 px-2 text-xs" onClick={onBack}>
                <ChevronLeft size={12} />
                Back
              </button>
            )}
          </div>
          <div className="progress-bar rounded-full overflow-hidden">
            <div className="progress-bar-fill rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3" style={{ minHeight: 0 }}>
        {/* Greeting */}
        {messages.length === 0 && stage === "intake" && (
          <div className="chat-message-model">
            <p style={{ color: "var(--ink)", fontWeight: 400 }}>
              Hello. I am Waypoint. I will ask eight short questions, then build your roadmap. You can change it afterwards.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <AnimatePresence key={i}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className={msg.role === "user" ? "chat-message-user" : "chat-message-model"}
            >
              {msg.role === "model" ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                <span>{msg.content}</span>
              )}
            </motion.div>
          </AnimatePresence>
        ))}

        {/* Loading state */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="chat-message-model"
          >
            <div className="flex items-center gap-3">
              <div className="loading-dots">
                <span /><span /><span />
              </div>
              <span className="font-mono-meta text-muted">{loadingMsg}</span>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="chat-message-model"
            style={{
              background: "#FEF2F2",
              padding: "10px 14px",
              borderRadius: "var(--radius)",
              borderLeft: "3px solid #FCA5A5",
            }}
          >
            <p style={{ color: "#991B1B", margin: 0 }}>{error}</p>
            {error.toLowerCase().includes("offline") && (
              <button
                className="btn-ghost mt-2"
                onClick={() => window.location.reload()}
              >
                <WifiOff size={12} /> Retry
              </button>
            )}
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Intake chips / input area */}
      {stage === "intake" && !isLoading && (
        <div className="flex-shrink-0 px-5 pb-5 border-t pt-4" style={{ borderColor: "var(--line)" }}>
          <p className="text-muted mb-2" style={{ fontSize: 15 }}>
            {INTAKE_QUESTIONS[intakeStep - 1]}
          </p>

          {intakeStep === 1 && (
            <OptionChips options={BRANCHES} onSelect={handleChipSelect} />
          )}
          {intakeStep === 2 && (
            <OptionChips options={YEARS} onSelect={handleChipSelect} />
          )}
          {intakeStep === 3 && (
            <OptionChips options={GOALS} onSelect={handleChipSelect} />
          )}
          {intakeStep === 4 && (
            <div>
              <OptionChips
                options={INTERESTS}
                selected={localInterests}
                multiSelect
                onSelect={handleInterestToggle}
              />
              <button
                className="btn-primary mt-4"
                onClick={handleInterestConfirm}
                disabled={localInterests.length === 0}
                style={{ opacity: localInterests.length === 0 ? 0.4 : 1 }}
              >
                <span>Continue</span>
              </button>
            </div>
          )}
          {intakeStep === 5 && (
            <div className="flex flex-col gap-2">
              <textarea
                className="chat-input w-full"
                placeholder="e.g. Python basics, some HTML..."
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                rows={2}
                aria-label="Current skills"
              />
              <div className="flex gap-2">
                <button className="btn-primary" onClick={() => handleSkillsSubmit()}>
                  <span>Continue</span>
                </button>
                <button className="btn-ghost" onClick={() => handleSkillsSubmit(true)}>
                  Skip
                </button>
              </div>
            </div>
          )}
          {intakeStep === 6 && (
            <OptionChips options={HOURS} onSelect={(v) => handleChipSelect(v)} />
          )}
          {intakeStep === 7 && (
            <OptionChips options={TIMELINES} onSelect={handleChipSelect} />
          )}
          {intakeStep === 8 && (
            <OptionChips options={PREFS} onSelect={handleChipSelect} />
          )}
        </div>
      )}

      {/* Refine input */}
      {stage === "refine" && (
        <div className="flex-shrink-0 px-5 pb-5 border-t pt-4" style={{ borderColor: "var(--line)" }}>
          {/* Starter chips */}
          {roadmap && messages.filter((m) => m.role === "user").length < 2 && (
            <div className="mb-3">
              <OptionChips
                options={REFINE_STARTERS}
                onSelect={(v) => {
                  onSendMessage(v);
                }}
              />
            </div>
          )}

          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="Ask anything about your plan"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
              aria-label="Chat input"
            />
            <button
              className="btn-send"
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>

          {/* Start over */}
          <div className="mt-3 flex justify-end">
            {!confirmRestart ? (
              <button
                className="btn-ghost text-xs"
                onClick={() => setConfirmRestart(true)}
              >
                <RotateCcw size={11} /> Start over
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-mono-meta text-muted">Are you sure?</span>
                <button className="btn-ghost text-xs" onClick={onStartOver}>Yes, restart</button>
                <button className="btn-ghost text-xs" onClick={() => setConfirmRestart(false)}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
