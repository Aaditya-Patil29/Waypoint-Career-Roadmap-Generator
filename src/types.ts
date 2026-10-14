export type ResourceType = "course" | "book" | "docs" | "video" | "practice" | "community";

export type Resource = {
  title: string;
  type: ResourceType;
  note: string;
};

export type Phase = {
  id: string;
  title: string;
  duration: string;
  goal: string;
  skills: string[];
  projects: { title: string; description: string }[];
  resources: Resource[];
  milestone: string;
};

export type Roadmap = {
  title: string;
  summary: string;
  targetRole: string;
  totalDuration: string;
  weeklyHours: number;
  phases: Phase[];
  interviewPrep: string[];
  certifications: string[];
  honestNote: string;
};

export type StudentProfile = {
  branch: string;
  year: string;
  goal: string;
  interests: string[];
  currentSkills: string;
  weeklyHours: number;
  timeline: string;
  preference: string;
};

export type ChatMessage = {
  role: "user" | "model";
  content: string;
};

export type ChatStage = "intake" | "generating" | "refine";

export type IntakeStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type PhaseChecklist = {
  [phaseId: string]: {
    skills: boolean[];
    projects: boolean[];
  };
};
