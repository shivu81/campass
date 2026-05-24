import { SendHorizontal } from "lucide-react";
import React, { useState } from "react";

export default function InputBox({ disabled, onSubmit, placeholder }) {
  const [value, setValue] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmit(event);
          }
        }}
        disabled={disabled}
        rows={1}
        placeholder={placeholder}
        className="custom-scrollbar max-h-36 min-h-[48px] flex-1 resize-none rounded-2xl border border-white/10 bg-[#101820] px-4 py-3 text-sm text-ink placeholder:text-muted transition focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent text-[#061411] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Send message"
        title="Send"
      >
        <SendHorizontal size={19} />
      </button>
    </form>
  );
}
