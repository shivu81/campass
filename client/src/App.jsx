import React, { useEffect, useMemo, useState } from "react";
import { fetchRecommendations } from "./api";
import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/Sidebar";
import { createId } from "./utils/createId";
import { createInitialMessage, formatUserAnswer, getNextPrompt, TOTAL_STEPS } from "./utils/chatFlow";

const STORAGE_KEY = "career-compass-session";

const emptyProfile = {
  interests: [],
  skills: {},
  personality: []
};

function assistantTypingMessage() {
  return {
    id: createId(),
    role: "assistant",
    content: "",
    isTyping: true
  };
}

function normalizeFreeText(text) {
  return text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function App() {
  const savedSession = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  }, []);

  const [messages, setMessages] = useState(savedSession?.messages || [createInitialMessage()]);
  const [profile, setProfile] = useState(savedSession?.profile || emptyProfile);
  const [skillIndex, setSkillIndex] = useState(savedSession?.skillIndex || 0);
  const [completedSteps, setCompletedSteps] = useState(savedSession?.completedSteps || 0);
  const [recommendations, setRecommendations] = useState(savedSession?.recommendations || []);
  const [isThinking, setIsThinking] = useState(false);
  const [selected, setSelected] = useState([]);
  const [freeText, setFreeText] = useState("");

  const lastMessage = messages[messages.length - 1];
  const activeAssistantMessage =
    lastMessage?.role === "assistant" && !lastMessage.isTyping && !recommendations.length
      ? lastMessage
      : null;
  const canInteract = Boolean(activeAssistantMessage) && !isThinking;
  const inputDisabled =
    !canInteract || activeAssistantMessage?.type === "options" || activeAssistantMessage?.type === "rating";

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ messages, profile, skillIndex, completedSteps, recommendations })
    );
  }, [messages, profile, skillIndex, completedSteps, recommendations]);

  useEffect(() => {
    setSelected([]);
    setFreeText("");
  }, [activeAssistantMessage?.id]);

  function addUserAnswer(activeMessage, answer) {
    const content = formatUserAnswer(activeMessage, answer);
    setMessages((current) => [
      ...current,
      {
        id: createId(),
        role: "user",
        content
      }
    ]);
  }

  function appendAssistantWithDelay(nextMessage) {
    const typing = assistantTypingMessage();
    setMessages((current) => [...current, typing]);
    setIsThinking(true);

    window.setTimeout(() => {
      setMessages((current) => current.map((message) => (message.id === typing.id ? nextMessage : message)));
      setIsThinking(false);
    }, 650);
  }

  async function generateResults(nextProfile) {
    const typing = assistantTypingMessage();
    setMessages((current) => [...current, typing]);
    setIsThinking(true);

    try {
      const data = await fetchRecommendations(nextProfile);
      const resultMessage = {
        id: createId(),
        role: "assistant",
        type: "results",
        content:
          "Here are your strongest career matches. I ranked them by interest fit, current skill readiness, and personality alignment."
      };
      setMessages((current) => current.map((message) => (message.id === typing.id ? resultMessage : message)));
      setRecommendations(data.recommendations);
    } catch (error) {
      setMessages((current) =>
        current.map((message) =>
          message.id === typing.id
            ? {
                id: createId(),
                role: "assistant",
                type: "error",
                content: error.message
              }
            : message
        )
      );
    } finally {
      setIsThinking(false);
    }
  }

  function continueFlow(nextProfile, nextCompletedSteps) {
    if (nextCompletedSteps >= TOTAL_STEPS) {
      appendAssistantWithDelay(getNextPrompt(nextProfile, nextCompletedSteps));
      window.setTimeout(() => generateResults(nextProfile), 850);
      return;
    }

    appendAssistantWithDelay(getNextPrompt(nextProfile, nextCompletedSteps));
  }

  function handleOptionSubmit(answer) {
    if (!activeAssistantMessage) return;
    addUserAnswer(activeAssistantMessage, answer);

    const customInterests = activeAssistantMessage.field === "interests" ? normalizeFreeText(answer.text || "") : [];
    const selectedValues = answer.selected || [];
    const nextProfile =
      activeAssistantMessage.field === "interests"
        ? {
            ...profile,
            interests: Array.from(new Set([...selectedValues, ...customInterests]))
          }
        : {
            ...profile,
            personality: [...profile.personality, selectedValues[0]]
          };

    const nextCompletedSteps = completedSteps + 1;
    setProfile(nextProfile);
    setCompletedSteps(nextCompletedSteps);
    continueFlow(nextProfile, nextCompletedSteps);
  }

  function handleRatingSubmit(answer) {
    if (!activeAssistantMessage) return;
    addUserAnswer(activeAssistantMessage, answer);

    const nextProfile = {
      ...profile,
      skills: {
        ...profile.skills,
        [activeAssistantMessage.skill]: answer.rating
      }
    };
    const nextSkillIndex = skillIndex + 1;
    const nextCompletedSteps = completedSteps + 1;

    setProfile(nextProfile);
    setSkillIndex(nextSkillIndex);
    setCompletedSteps(nextCompletedSteps);
    continueFlow(nextProfile, nextCompletedSteps);
  }

  function handleFreeText(text) {
    if (!activeAssistantMessage) return;

    if (activeAssistantMessage.field === "interests") {
      handleOptionSubmit({ selected: [], text });
    }
  }

  function restart() {
    const initialMessage = createInitialMessage();
    setMessages([initialMessage]);
    setProfile(emptyProfile);
    setSkillIndex(0);
    setCompletedSteps(0);
    setRecommendations([]);
    setIsThinking(false);
    setSelected([]);
    setFreeText("");
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div className="flex h-screen overflow-hidden text-ink">
      <Sidebar messages={messages} onRestart={restart} />
      <ChatWindow
        activeMessage={
          activeAssistantMessage
            ? { ...activeAssistantMessage, selected, setSelected, freeText, setFreeText }
            : null
        }
        canInteract={canInteract}
        completedSteps={completedSteps}
        inputDisabled={inputDisabled}
        messages={messages}
        onFreeText={handleFreeText}
        onOptionSubmit={handleOptionSubmit}
        onRatingSubmit={handleRatingSubmit}
        onRestart={restart}
        recommendations={recommendations}
      />
    </div>
  );
}
