import React from "react";

// Five-segment walkthrough progress bar. Segments for completed steps are gold.
export default function ProgressSteps({ current = 0, total = 5 }) {
  return (
    <div
      className="flex gap-2"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current + 1}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${i < current ? "bg-primary" : "bg-muted"}`}
        />
      ))}
    </div>
  );
}