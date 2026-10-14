import type { StudentProfile } from "../types";

export const SYSTEM_INSTRUCTION = `You are Waypoint, a calm, practical career guide for engineering students, mainly in India but useful anywhere. You give specific, honest, realistic advice. You name real technologies, real kinds of projects and real free or low cost resources, and you say plainly when something is hard or when the market is competitive. You do not hype. You do not invent company names, salaries, URLs or statistics; if you are not sure, say so. Keep language simple and encouraging for a student. Fit the plan to the hours the student actually has. If the student's goal is unrealistic for their timeline, say so kindly and offer a better scoped alternative. When asked for a roadmap, return only JSON that matches the provided schema.`;

export function buildRoadmapPrompt(profile: StudentProfile): string {
  return `Create a roadmap for this student. Branch: ${profile.branch}. Year: ${profile.year}. Goal: ${profile.goal}. Interests: ${profile.interests.join(", ")}. Current skills: ${profile.currentSkills || "None specified"}. Hours per week: ${profile.weeklyHours}. Timeline: ${profile.timeline}. After graduation they prefer: ${profile.preference}. Start from what they already know. Make every phase build on the last. Divide the plan into 3 to 5 realistic sequential phases. Put projects before certificates. Include one portfolio project per phase. Do not include links, only resource titles.`;
}

export const EXPLORE_ROLES_PROMPT = `The student said they are not sure what career goal to pursue. Based on common engineering tracks, suggest exactly three specific role options with a one-sentence description each. Be specific and realistic. Format as a short conversational message, not a list.`;
