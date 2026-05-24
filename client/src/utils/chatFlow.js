import { INTEREST_OPTIONS, PERSONALITY_STEPS, SKILL_OPTIONS } from "../data/questionFlow";
import { createId } from "./createId";

export const TOTAL_STEPS = 1 + SKILL_OPTIONS.length + PERSONALITY_STEPS.length;

export function createInitialMessage() {
  return {
    id: createId(),
    role: "assistant",
    type: "options",
    content:
      "Hi, I am your career recommendation assistant. Pick the interests that sound most like you, and add anything extra in your own words.",
    options: INTEREST_OPTIONS,
    multiSelect: true,
    freeText: true,
    field: "interests"
  };
}

export function getNextPrompt(profile, completedSteps) {
  const nextIndex = completedSteps - 1;

  if (nextIndex < SKILL_OPTIONS.length) {
    const skill = SKILL_OPTIONS[nextIndex];
    return {
      id: createId(),
      role: "assistant",
      type: "rating",
      content: `Rate your ${skill.toLowerCase()} skill from 1 to 5.`,
      skill,
      field: "skills"
    };
  }

  const personalityIndex = nextIndex - SKILL_OPTIONS.length;
  if (personalityIndex < PERSONALITY_STEPS.length) {
    const item = PERSONALITY_STEPS[personalityIndex];
    return {
      id: createId(),
      role: "assistant",
      type: "options",
      content: item.question,
      options: item.choices,
      multiSelect: false,
      field: "personality"
    };
  }

  return {
    id: createId(),
    role: "assistant",
    type: "analysis",
    content:
      "Thanks. I have enough signal now: interests, skill ratings, and personality pattern. I am analyzing the best-fit career paths for you."
  };
}

export function formatUserAnswer(message, answer) {
  if (message.field === "interests") {
    return answer.selected?.length ? answer.selected.join(", ") : answer.text;
  }

  if (message.type === "rating") {
    return `${message.skill}: ${answer.rating}/5`;
  }

  if (message.field === "personality") {
    return answer.selected?.[0] || answer.text;
  }

  return answer.text;
}
