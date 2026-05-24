import React from "react";
import { RotateCcw, Sparkles, Download } from "lucide-react";
import MessageBubble from "./MessageBubble";
import RecommendationCard from "./RecommendationCard";
import InputBox from "./InputBox";
import { TOTAL_STEPS } from "../utils/chatFlow";

function OptionControls({ message, selected, setSelected, freeText, setFreeText, onSubmit, disabled }) {
  const canSubmit = selected.length > 0 || freeText.trim().length > 0;

  function toggleOption(option) {
    if (message.multiSelect) {
      setSelected((current) =>
        current.includes(option) ? current.filter((item) => item !== option) : [...current, option]
      );
      return;
    }
    setSelected([option]);
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        {message.options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => toggleOption(option)}
              className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
                active
                  ? "border-accent bg-accent text-[#061411]"
                  : "border-white/10 bg-white/[0.04] text-ink hover:border-accent/60"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {message.freeText && (
        <input
          value={freeText}
          onChange={(event) => setFreeText(event.target.value)}
          placeholder="Add your own interest"
          className="w-full rounded-xl border border-white/10 bg-[#101820] px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent"
        />
      )}
      <button
        type="button"
        disabled={!canSubmit || disabled}
        onClick={() => onSubmit({ selected, text: freeText })}
        className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-[#061411] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue
      </button>
    </div>
  );
}

function RatingControls({ message, onSubmit, disabled }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          disabled={disabled}
          onClick={() => onSubmit({ rating })}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-ink transition hover:border-accent hover:bg-accent hover:text-[#061411] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {rating}
        </button>
      ))}
    </div>
  );
}

export default function ChatWindow({
  activeMessage,
  canInteract,
  completedSteps,
  inputDisabled,
  messages,
  onFreeText,
  onOptionSubmit,
  onRatingSubmit,
  onRestart,
  recommendations
}) {
  const progressPercent = Math.round((completedSteps / TOTAL_STEPS) * 100);

  return (
    <main className="flex min-h-0 flex-1 flex-col bg-surface">
      <header className="no-print border-b border-white/8 bg-panel/85 px-4 py-3 backdrop-blur md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Sparkles size={17} className="text-accent" />
              Career Compass Chat
            </div>
            <p className="mt-1 text-xs text-muted">
              Step {Math.min(completedSteps + 1, TOTAL_STEPS)} of {TOTAL_STEPS}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {recommendations.length > 0 && (
              <button
                type="button"
                onClick={() => window.print()}
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-muted transition hover:border-accent hover:text-accent"
                aria-label="Save as PDF"
                title="Save as PDF"
              >
                <Download size={17} />
              </button>
            )}
            <button
              type="button"
              onClick={onRestart}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-muted transition hover:border-accent hover:text-accent"
              aria-label="Restart chat"
              title="Restart"
            >
              <RotateCcw size={17} />
            </button>
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progressPercent}%` }} />
        </div>
      </header>

      <section className="custom-scrollbar flex-1 overflow-y-auto px-4 py-5 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-5">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message}>
              {message.id === activeMessage?.id && message.type === "options" && (
                <OptionControls
                  message={message}
                  selected={activeMessage.selected}
                  setSelected={activeMessage.setSelected}
                  freeText={activeMessage.freeText}
                  setFreeText={activeMessage.setFreeText}
                  onSubmit={onOptionSubmit}
                  disabled={!canInteract}
                />
              )}
              {message.id === activeMessage?.id && message.type === "rating" && (
                <RatingControls message={message} onSubmit={onRatingSubmit} disabled={!canInteract} />
              )}
            </MessageBubble>
          ))}

          {recommendations.length > 0 && (
            <div className="print-results grid gap-4">
              {recommendations.map((item) => (
                <RecommendationCard key={item.id} recommendation={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="no-print border-t border-white/8 bg-panel px-4 py-4 md:px-8">
        <div className="mx-auto max-w-4xl">
          <InputBox
            disabled={inputDisabled}
            onSubmit={onFreeText}
            placeholder={
              inputDisabled
                ? "Use the quick controls above for this step"
                : "Type an answer, extra context, or a note..."
            }
          />
        </div>
      </footer>
    </main>
  );
}
