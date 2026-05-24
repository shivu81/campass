import React from "react";
import { BriefcaseBusiness, MessageSquareText, Plus } from "lucide-react";

export default function Sidebar({ messages, onRestart }) {
  const snippets = messages
    .filter((message) => message.role === "user")
    .slice(-6)
    .map((message) => message.content);

  return (
    <aside className="no-print hidden w-72 shrink-0 border-r border-white/8 bg-[#0b1015] p-4 lg:flex lg:flex-col">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent/15 text-accent">
          <BriefcaseBusiness size={20} />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-ink">Career Advisor</h1>
          <p className="text-xs text-muted">Smart recommendation chat</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="mt-5 flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
      >
        <Plus size={17} />
        New analysis
      </button>

      <div className="mt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Chat history</p>
        <div className="space-y-2">
          {snippets.length ? (
            snippets.map((snippet, index) => (
              <div key={`${snippet}-${index}`} className="flex gap-2 rounded-lg px-2 py-2 text-sm text-muted">
                <MessageSquareText size={15} className="mt-0.5 shrink-0" />
                <span className="line-clamp-2">{snippet}</span>
              </div>
            ))
          ) : (
            <p className="rounded-lg bg-white/[0.04] p-3 text-sm text-muted">
              Your answers will appear here as you chat.
            </p>
          )}
        </div>
      </div>

      <div className="mt-auto rounded-lg border border-white/8 bg-white/[0.04] p-3 text-xs leading-5 text-muted">
        Matches use 30% interests, 40% skills, and 30% personality alignment.
      </div>
    </aside>
  );
}
