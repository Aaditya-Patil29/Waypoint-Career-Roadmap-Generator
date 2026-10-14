import { useEffect, useRef, useState } from "react";
import { useChat } from "./hooks/useChat";
import { loadRoadmap, loadHistory, loadStage, loadIntakeStep } from "./lib/storage";
import type { ChatStage } from "./types";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Generator from "./components/Generator";
import Statement from "./components/Statement";
import Tracks from "./components/Tracks";
import PullQuotes from "./components/PullQuotes";
import HonestNotes from "./components/HonestNotes";
import CtaPanel from "./components/CtaPanel";
import Footer from "./components/Footer";

export default function App() {
  const generatorRef = useRef<HTMLElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);
  const tracksRef = useRef<HTMLElement>(null);

  const [heroImageUrl, setHeroImageUrl] = useState<string | undefined>(undefined);
  const [preselectedGoal, setPreselectedGoal] = useState<string | undefined>(undefined);
  const [showResume, setShowResume] = useState(false);

  const {
    stage, messages, roadmap, checklist,
    isLoading, loadingMsg, error,
    intakeStep, intakeAnswers, setIntakeAnswers,
    submitIntakeAnswer, sendMessage, toggleCheck,
    startOver, restoreFromStorage,
  } = useChat();

  // Restore from localStorage on mount
  useEffect(() => {
    const savedStage = loadStage() as ChatStage | null;
    const savedHistory = loadHistory();
    const savedRoadmap = loadRoadmap();
    const savedStep = loadIntakeStep();

    if (savedHistory.length > 0 || savedRoadmap) {
      setShowResume(true);
      restoreFromStorage({
        stage: savedStage ?? "intake",
        history: savedHistory,
        roadmap: savedRoadmap,
        intakeStep: savedStep,
      });
    }
  }, []);

  // Use SVG hero image (always available)
  useEffect(() => {
    setHeroImageUrl("/hero.svg");
  }, []);

  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTracks = () => {
    tracksRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTrackSelect = (goal: string) => {
    setPreselectedGoal(goal);
    scrollToGenerator();
  };

  const handleIntakeAnswer = (answer: string, answers: typeof intakeAnswers) => {
    setIntakeAnswers(answers);
    submitIntakeAnswer(answer, answers);
  };

  const handleStartOver = () => {
    startOver();
    setPreselectedGoal(undefined);
    setShowResume(false);
  };

  return (
    <div style={{ overflowX: "hidden" }}>
      {/* Resume banner */}
      {showResume && stage !== "intake" && (
        <div
          className="no-print"
          style={{
            background: "var(--surface)",
            borderBottom: "1px solid var(--line)",
            padding: "10px 20px",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            color: "var(--muted)",
          }}
        >
          <span className="font-mono-meta">Session restored.</span>
          <button
            onClick={scrollToGenerator}
            className="font-mono-meta text-accent underline"
          >
            Continue where you left off
          </button>
          <span style={{ color: "var(--line)" }}>·</span>
          <button
            onClick={handleStartOver}
            className="font-mono-meta hover:text-ink transition-colors"
          >
            Start fresh
          </button>
        </div>
      )}

      <Navbar onStart={scrollToGenerator} />

      <main>
        <Hero
          onStart={scrollToGenerator}
          onHowItWorks={scrollToHowItWorks}
          heroImage={heroImageUrl}
        />

        <HowItWorks ref={howItWorksRef} />

        <Generator
          sectionRef={generatorRef}
          stage={stage}
          messages={messages}
          intakeStep={intakeStep}
          intakeAnswers={intakeAnswers}
          isLoading={isLoading}
          loadingMsg={loadingMsg}
          error={error}
          roadmap={roadmap}
          checklist={checklist}
          onIntakeAnswer={handleIntakeAnswer}
          onSendMessage={sendMessage}
          onBack={() => {}}
          onStartOver={handleStartOver}
          onToggle={toggleCheck}
          preselectedGoal={preselectedGoal}
        />

        <Statement />

        <Tracks ref={tracksRef} onTrackSelect={handleTrackSelect} />

        <PullQuotes />

        <HonestNotes />

        <CtaPanel onStart={scrollToGenerator} />
      </main>

      <Footer
        onHowItWorks={scrollToHowItWorks}
        onTracks={scrollToTracks}
        onStart={scrollToGenerator}
      />
    </div>
  );
}
