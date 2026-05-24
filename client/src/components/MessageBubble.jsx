import React from "react";
import { Bot, UserRound } from "lucide-react";

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1" aria-label="Assistant is typing">
      <span className="typing-dot h-2 w-2 rounded-full bg-muted" />
      <span className="typing-dot h-2 w-2 rounded-full bg-muted" />
      <span className="typing-dot h-2 w-2 rounded-full bg-muted" />
    </div>
  );
}

export default function MessageBubble({ message, children }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
          <Bot size={18} />
        </div>
      )}

      <div
        className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm md:max-w-[72%] ${
          isUser
            ? "rounded-br-md bg-accent text-[#061411]"
            : "rounded-bl-md border border-white/8 bg-panelSoft text-ink"
        }`}
      >
        {message.isTyping ? <TypingIndicator /> : <p className="whitespace-pre-wrap">{message.content}</p>}
        {children}
      </div>

      {isUser && (
        <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 text-ink">
          <UserRound size={17} />
        </div>
      )}
    </div>
  );
}
