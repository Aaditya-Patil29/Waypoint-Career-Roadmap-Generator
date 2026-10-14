// NOTE: This API key is sent directly from the browser. Anyone who opens
// DevTools can see it. That is acceptable for a personal or college project,
// but never use this pattern in a public deployment.

import type { Roadmap, StudentProfile, ChatMessage } from "../types";
import { SYSTEM_INSTRUCTION, buildRoadmapPrompt } from "./prompts.ts";

const KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const MODEL = (import.meta.env.VITE_GEMINI_MODEL as string | undefined) ?? "gemini-flash-latest";

export const isKeyMissing =
  !KEY || KEY === "your_key_here" || KEY.trim() === "";

const BASE = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// ─── schemas ──────────────────────────────────────────────────────────────

const resourceSchema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    type: {
      type: "STRING",
      enum: ["course", "book", "docs", "video", "practice", "community"],
    },
    note: { type: "STRING" },
  },
  required: ["title", "type", "note"],
};

const phaseSchema = {
  type: "OBJECT",
  properties: {
    id: { type: "STRING" },
    title: { type: "STRING" },
    duration: { type: "STRING" },
    goal: { type: "STRING" },
    skills: { type: "ARRAY", items: { type: "STRING" } },
    projects: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          description: { type: "STRING" },
        },
        required: ["title", "description"],
      },
    },
    resources: { type: "ARRAY", items: resourceSchema },
    milestone: { type: "STRING" },
  },
  required: ["id", "title", "duration", "goal", "skills", "projects", "resources", "milestone"],
};

const roadmapSchema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    summary: { type: "STRING" },
    targetRole: { type: "STRING" },
    totalDuration: { type: "STRING" },
    weeklyHours: { type: "NUMBER" },
    phases: { type: "ARRAY", items: phaseSchema },
    interviewPrep: { type: "ARRAY", items: { type: "STRING" } },
    certifications: { type: "ARRAY", items: { type: "STRING" } },
    honestNote: { type: "STRING" },
  },
  required: [
    "title",
    "summary",
    "targetRole",
    "totalDuration",
    "weeklyHours",
    "phases",
    "interviewPrep",
    "certifications",
    "honestNote",
  ],
};

const refineSchema = {
  type: "OBJECT",
  properties: {
    reply: { type: "STRING" },
    roadmap: roadmapSchema,
  },
  required: ["reply"],
};

// ─── helpers ──────────────────────────────────────────────────────────────

async function postWithRetry(
  body: object,
  attempt = 0
): Promise<Response> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": KEY ?? "",
    },
    body: JSON.stringify(body),
  });

  if ((res.status === 429 || res.status === 503) && attempt < 2) {
    const delay = attempt === 0 ? 2000 : 4000;
    await new Promise((r) => setTimeout(r, delay));
    return postWithRetry(body, attempt + 1);
  }

  return res;
}

function extractText(data: unknown): string {
  const d = data as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  return d?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

async function callApi(body: object): Promise<string> {
  let res: Response;
  try {
    res = await postWithRetry(body);
  } catch {
    throw new Error("NETWORK");
  }

  if (res.status === 400 || res.status === 403) {
    throw new Error("KEY_INVALID");
  }
  if (res.status === 429) {
    throw new Error("RATE_LIMITED");
  }
  if (!res.ok) {
    throw new Error(`HTTP_${res.status}`);
  }

  const data = await res.json();
  const text = extractText(data);
  if (!text) throw new Error("EMPTY_RESPONSE");
  return text;
}

function buildContents(history: ChatMessage[], userMessage: string) {
  const turns = history.slice(-12).map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));
  turns.push({ role: "user", parts: [{ text: userMessage }] });
  return turns;
}

function cleanJson(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

function validateRoadmap(r: unknown): r is Roadmap {
  if (!r || typeof r !== "object") return false;
  const obj = r as Record<string, unknown>;
  return (
    typeof obj.title === "string" &&
    typeof obj.summary === "string" &&
    Array.isArray(obj.phases) &&
    obj.phases.length >= 2
  );
}

// ─── public API ───────────────────────────────────────────────────────────

export async function generateRoadmap(profile: StudentProfile): Promise<Roadmap> {
  const prompt = buildRoadmapPrompt(profile);

  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: roadmapSchema,
    },
  };

  let text = await callApi(body);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleanJson(text));
  } catch {
    // retry once with stricter reminder
    const retryBody = {
      ...body,
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                prompt +
                "\n\nIMPORTANT: Return ONLY valid JSON matching the schema. No markdown fences, no extra text.",
            },
          ],
        },
      ],
    };
    text = await callApi(retryBody);
    try {
      parsed = JSON.parse(cleanJson(text));
    } catch {
      throw new Error("PARSE_FAILED");
    }
  }

  if (!validateRoadmap(parsed)) throw new Error("PARSE_FAILED");

  // ensure each phase has an id and valid arrays
  const roadmap = parsed as Roadmap;
  roadmap.phases = roadmap.phases.map((p, i) => ({
    ...p,
    id: p.id || `phase-${i + 1}`,
    skills: Array.isArray(p.skills) ? p.skills : [],
    projects: Array.isArray(p.projects) ? p.projects : [],
    resources: Array.isArray(p.resources) ? p.resources : [],
  }));

  return roadmap;
}

export async function refineRoadmap(
  roadmap: Roadmap,
  history: ChatMessage[],
  userMessage: string
): Promise<{ reply: string; roadmap?: Roadmap }> {
  const systemText =
    SYSTEM_INSTRUCTION +
    "\n\nCurrent roadmap JSON:\n" +
    JSON.stringify(roadmap) +
    "\n\nIf the user wants a change to the plan, return the full updated roadmap in the roadmap field and a short friendly explanation in reply. If they only asked a question, return reply only.";

  const body = {
    systemInstruction: { parts: [{ text: systemText }] },
    contents: buildContents(history, userMessage),
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: refineSchema,
    },
  };

  const text = await callApi(body);

  let parsed: { reply: string; roadmap?: unknown };
  try {
    parsed = JSON.parse(cleanJson(text));
  } catch {
    throw new Error("PARSE_FAILED");
  }

  const result: { reply: string; roadmap?: Roadmap } = { reply: parsed.reply };

  if (parsed.roadmap && validateRoadmap(parsed.roadmap)) {
    const r = parsed.roadmap as Roadmap;
    r.phases = r.phases.map((p, i) => ({
      ...p,
      id: p.id || `phase-${i + 1}`,
      skills: Array.isArray(p.skills) ? p.skills : [],
      projects: Array.isArray(p.projects) ? p.projects : [],
      resources: Array.isArray(p.resources) ? p.resources : [],
    }));
    result.roadmap = r;
  }

  return result;
}

export async function chatReply(
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    contents: buildContents(history, userMessage),
  };

  return callApi(body);
}

export function friendlyError(err: Error): string {
  switch (err.message) {
    case "KEY_INVALID":
      return "The API key is invalid or not allowed. Check your .env file.";
    case "RATE_LIMITED":
      return "You have been rate limited. Please wait a moment and try again.";
    case "NETWORK":
      return "You appear to be offline. Check your connection and try again.";
    case "EMPTY_RESPONSE":
      return "The response was empty or blocked. Could you rephrase that?";
    case "PARSE_FAILED":
      return "Something went wrong parsing the response. Please try again.";
    case "HTTP_503":
      return "The AI service is temporarily experiencing high traffic. Please try again in a few moments.";
    case "HTTP_404":
      return "The configured AI model is not available. Please verify your VITE_GEMINI_MODEL setting.";
    default:
      return `An error occurred (${err.message}). Please try again.`;
  }
}
