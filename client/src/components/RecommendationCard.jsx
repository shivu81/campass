import React from "react";
import { TrendingUp } from "lucide-react";

export default function RecommendationCard({ recommendation }) {
  const improvements = recommendation.requiredSkillsToImprove;

  return (
    <article className="rounded-lg border border-white/10 bg-[#121a22] p-4 shadow-glow">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-ink">{recommendation.careerName}</h3>
          <p className="mt-1 text-sm text-muted">{recommendation.description}</p>
        </div>
        <div className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
          {recommendation.score}% match
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${recommendation.score}%` }}
        />
      </div>

      <p className="mt-4 text-sm leading-6 text-ink">{recommendation.why}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {Object.entries(recommendation.breakdown).map(([label, value]) => (
          <div key={label} className="rounded-lg bg-white/[0.04] p-3">
            <p className="text-xs capitalize text-muted">{label}</p>
            <p className="mt-1 text-base font-semibold text-ink">{value}%</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-white/[0.04] p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Skills to improve</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {improvements.length ? (
            improvements.map((item) => (
              <span
                key={item.skill}
                className="rounded-full bg-warning/10 px-3 py-1 text-xs text-warning"
              >
                {item.skill}: {item.current} to {item.target}
              </span>
            ))
          ) : (
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">
              Current skills already meet this path
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2 text-sm leading-6 text-muted">
        <TrendingUp className="mt-1 shrink-0 text-accentBlue" size={17} />
        <span>{recommendation.futureScope}</span>
      </div>
    </article>
  );
}
