import type { Roadmap, StudentProfile, ChatMessage, PhaseChecklist } from "../types";

const STORAGE_KEYS = {
  PROFILE: "waypoint_profile",
  ROADMAP: "waypoint_roadmap",
  HISTORY: "waypoint_history",
  CHECKLIST: "waypoint_checklist",
  STAGE: "waypoint_stage",
  INTAKE_STEP: "waypoint_intake_step",
};

function safeGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or private browsing — fail silently
  }
}

export function saveProfile(profile: StudentProfile): void {
  safeSet(STORAGE_KEYS.PROFILE, profile);
}

export function loadProfile(): StudentProfile | null {
  return safeGet<StudentProfile>(STORAGE_KEYS.PROFILE);
}

export function saveRoadmap(roadmap: Roadmap): void {
  safeSet(STORAGE_KEYS.ROADMAP, roadmap);
}

export function loadRoadmap(): Roadmap | null {
  return safeGet<Roadmap>(STORAGE_KEYS.ROADMAP);
}

export function saveHistory(history: ChatMessage[]): void {
  safeSet(STORAGE_KEYS.HISTORY, history);
}

export function loadHistory(): ChatMessage[] {
  return safeGet<ChatMessage[]>(STORAGE_KEYS.HISTORY) ?? [];
}

export function saveChecklist(checklist: PhaseChecklist): void {
  safeSet(STORAGE_KEYS.CHECKLIST, checklist);
}

export function loadChecklist(): PhaseChecklist {
  return safeGet<PhaseChecklist>(STORAGE_KEYS.CHECKLIST) ?? {};
}

export function saveStage(stage: string): void {
  safeSet(STORAGE_KEYS.STAGE, stage);
}

export function loadStage(): string | null {
  return safeGet<string>(STORAGE_KEYS.STAGE);
}

export function saveIntakeStep(step: number): void {
  safeSet(STORAGE_KEYS.INTAKE_STEP, step);
}

export function loadIntakeStep(): number {
  return safeGet<number>(STORAGE_KEYS.INTAKE_STEP) ?? 1;
}

export function clearAll(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  });
}
