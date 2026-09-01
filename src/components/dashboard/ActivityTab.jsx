import React from "react";
import { SectionCard, SectionTitle, Pill, ProgressBar } from "./shared";

export default function ActivityTab({ checkins }) {
  const last7 = [...(checkins || [])].slice(-7);
  const count = (f) => last7.filter((c) => c[f]).length;
  const sum = (f) => last7.reduce((s, c) => s + (c[f] || 0), 0);

  const movementSnacks = count("movement_snacks_completed");
  const steps = sum("steps");
  const strength = count("strength_workout_completed");
  const mobility = count("mobility_completed");

  return (
    <div className="space-y-3.5">
      <SectionCard
        head={
          <div className="flex justify-between items-center gap-4 mb-1">
            <div>
              <SectionTitle>Activity Breakdown</SectionTitle>
              <p className="text-sm text-muted-foreground mt-1">A weekly view without mixing unlike activities.</p>
            </div>
            <Pill>This week</Pill>
          </div>
        }
      >
        <ProgressBar label="Movement Snacks" right={`${movementSnacks} sessions`} value={(movementSnacks / 14) * 100} />
        <ProgressBar label="Walks" right={`${steps.toLocaleString()} steps`} value={(steps / 70000) * 100} variant="teal" />
        <ProgressBar label="Strength Workouts" right={`${strength} workouts`} value={(strength / 3) * 100} />
        <ProgressBar label="Mobility" right={`${mobility} days`} value={(mobility / 7) * 100} variant="teal" />
      </SectionCard>

      <div className="grid gap-3.5 md:grid-cols-2">
        <SectionCard head={<div className="mb-3"><SectionTitle>Weekly Highlights</SectionTitle></div>}>
          <div className="grid grid-cols-2 gap-3.5">
            <div className="rounded-2xl p-4 bg-[#202020] border border-border">
              <div className="text-sm text-muted-foreground">Strength sessions</div>
              <strong className="block text-[26px] mt-2 text-chart-3">{strength}</strong>
              <div className="text-sm text-muted-foreground mt-1">Goal: 3 / week</div>
            </div>
            <div className="rounded-2xl p-4 bg-[#202020] border border-border">
              <div className="text-sm text-muted-foreground">Mobility days</div>
              <strong className="block text-[26px] mt-2 text-chart-4">{mobility}</strong>
              <div className="text-sm text-muted-foreground mt-1">Goal: 7 / week</div>
            </div>
          </div>
        </SectionCard>
        <SectionCard head={<div className="mb-3"><SectionTitle>Stay Consistent</SectionTitle></div>}>
          <p className="text-sm text-muted-foreground">
            Never miss an opportunity. Each snack, walk, and session compounds into measurable change over time.
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="text-[26px] font-extrabold text-chart-3">{movementSnacks} snacks</div>
              <div className="text-sm text-muted-foreground">logged this week</div>
            </div>
            <Pill variant="teal">Keep going</Pill>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}