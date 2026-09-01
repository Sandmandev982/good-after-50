import React from "react";
import { Link } from "react-router-dom";

// Apple-style completion ring. Score = % of mandatory check-in fields logged today.
// This is an accountability/logging metric, NOT a health score.
export default function DailyScoreRing({ score }) {
  const pct = Math.max(0, Math.min(100, score || 0));
  const empty = pct === 0;

  const ring = (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-[84px] h-[84px] rounded-full p-2"
        style={{ background: `conic-gradient(hsl(var(--primary)) 0 ${pct}%, #37332e ${pct}% 100%)` }}
      >
        <div className="w-full h-full rounded-full bg-background flex flex-col items-center justify-center">
          <strong className="text-[22px] text-foreground leading-none">
            {pct}
            <span className="text-sm">%</span>
          </strong>
        </div>
      </div>
      <span className="text-xs text-muted-foreground text-center max-w-[120px]">
        {empty ? "Complete today's check-in" : "Check-In Completion"}
      </span>
    </div>
  );

  if (empty) {
    return (
      <Link to="/log" className="block text-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {ring}
      </Link>
    );
  }
  return ring;
}