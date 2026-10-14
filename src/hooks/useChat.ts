import { useState, useCallback, useRef } from "react";
import type { ChatMessage, ChatStage, Roadmap, StudentProfile, PhaseChecklist } from "../types";
import { generateRoadmap, refineRoadmap, chatReply, friendlyError } from "../lib/gemini";
import {
  saveProfile, saveRoadmap, saveHistory, saveChecklist,
  saveStage, saveIntakeStep, loadChecklist, clearAll,
} from "../lib/storage";

export type IntakeAnswers = Partial<StudentProfile> & { interests: string[] };

const LOADING_MESSAGES = [
  "Reading your profile",
  "Sequencing the phases",
  "Checking the workload",
];

export function useChat() {
  const [stage, setStageState] = useState<ChatStage>("intake");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [roadmap, setRoadmapState] = useState<Roadmap | null>(null);
  const [checklist, setChecklistState] = useState<PhaseChecklist>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [error, setError] = useState<string | null>(null);
  const [intakeStep, setIntakeStepState] = useState(1);
  const [intakeAnswers, setIntakeAnswers] = useState<IntakeAnswers>({ interests: [] });

  const loadingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const setStage = useCallback((s: ChatStage) => {
    setStageState(s);
    saveStage(s);
  }, []);

  const setIntakeStep = useCallback((n: number) => {
    setIntakeStepState(n);
    saveIntakeStep(n);
  }, []);

  const addMessage = useCallback((role: "user" | "model", content: string) => {
    setMessages((prev) => {
      const next = [...prev, { role, content }];
      saveHistory(next);
      return next;
    });
  }, []);

  const setRoadmap = useCallback((r: Roadmap) => {
    setRoadmapState(r);
    saveRoadmap(r);
    // init checklist for any new phases
    setChecklistState((prev) => {
      const next = { ...prev };
      r.phases.forEach((p) => {
        if (!next[p.id]) {
          next[p.id] = {
            skills: p.skills.map(() => false),
            projects: p.projects.map(() => false),
          };
        }
      });
      saveChecklist(next);
      return next;
    });
  }, []);

  const startLoadingCycle = useCallback(() => {
    let idx = 0;
    setLoadingMsg(LOADING_MESSAGES[0]);
    loadingInterval.current = setInterval(() => {
      idx = (idx + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[idx]);
    }, 1800);
  }, []);

  const stopLoadingCycle = useCallback(() => {
    if (loadingInterval.current) {
      clearInterval(loadingInterval.current);
      loadingInterval.current = null;
    }
  }, []);

  const submitIntakeAnswer = useCallback(
    async (answer: string, answers: IntakeAnswers) => {
      addMessage("user", answer);
      setIntakeAnswers(answers);

      const nextStep = intakeStep + 1;

      if (intakeStep === 8) {
        // generate roadmap
        const profile: StudentProfile = {
          branch: answers.branch ?? "",
          year: answers.year ?? "",
          goal: answers.goal ?? "",
          interests: answers.interests,
          currentSkills: answers.currentSkills ?? "",
          weeklyHours: answers.weeklyHours ?? 10,
          timeline: answers.timeline ?? "1 year",
          preference: answers.preference ?? "Job",
        };
        saveProfile(profile);

        setStage("generating");
        setIsLoading(true);
        startLoadingCycle();
        setError(null);

        try {
          const result = await generateRoadmap(profile);
          setRoadmap(result);
          addMessage("model", `Your roadmap is ready. You have ${result.phases.length} phases ahead. Feel free to ask me to adjust anything.`);
          setStage("refine");
        } catch (err) {
          setError(friendlyError(err as Error));
          setStage("refine");
        } finally {
          setIsLoading(false);
          stopLoadingCycle();
        }
      } else {
        setIntakeStep(nextStep);
      }
    },
    [intakeStep, addMessage, setStage, setIntakeStep, setRoadmap, startLoadingCycle, stopLoadingCycle]
  );

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim() || isLoading) return;
      addMessage("user", userMessage);
      setIsLoading(true);
      setError(null);

      try {
        if (roadmap) {
          const { reply, roadmap: updatedRoadmap } = await refineRoadmap(
            roadmap,
            messages,
            userMessage
          );
          addMessage("model", reply);
          if (updatedRoadmap) {
            setRoadmap(updatedRoadmap);
          }
        } else {
          const reply = await chatReply(messages, userMessage);
          addMessage("model", reply);
        }
      } catch (err) {
        setError(friendlyError(err as Error));
      } finally {
        setIsLoading(false);
      }
    },
    [roadmap, messages, isLoading, addMessage, setRoadmap]
  );

  const toggleCheck = useCallback(
    (phaseId: string, kind: "skill" | "project", index: number) => {
      setChecklistState((prev) => {
        const phaseData = prev[phaseId] ?? { skills: [], projects: [] };
        const next: PhaseChecklist = {
          ...prev,
          [phaseId]: {
            skills: [...phaseData.skills],
            projects: [...phaseData.projects],
          },
        };
        if (kind === "skill") {
          next[phaseId].skills[index] = !phaseData.skills[index];
        } else {
          next[phaseId].projects[index] = !phaseData.projects[index];
        }
        saveChecklist(next);
        return next;
      });
    },
    []
  );

  const startOver = useCallback(() => {
    clearAll();
    setStageState("intake");
    setMessages([]);
    setRoadmapState(null);
    setChecklistState({});
    setIntakeStepState(1);
    setIntakeAnswers({ interests: [] });
    setError(null);
  }, []);

  const restoreFromStorage = useCallback(
    (opts: {
      stage: ChatStage;
      history: ChatMessage[];
      roadmap: Roadmap | null;
      intakeStep: number;
    }) => {
      setStageState(opts.stage);
      setMessages(opts.history);
      if (opts.roadmap) setRoadmapState(opts.roadmap);
      setIntakeStepState(opts.intakeStep);
      const saved = loadChecklist();
      setChecklistState(saved);
    },
    []
  );

  return {
    stage,
    messages,
    roadmap,
    checklist,
    isLoading,
    loadingMsg,
    error,
    intakeStep,
    intakeAnswers,
    setIntakeAnswers,
    submitIntakeAnswer,
    sendMessage,
    toggleCheck,
    startOver,
    restoreFromStorage,
  };
}
