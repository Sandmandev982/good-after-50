import React from "react";
import {
  Pill,
  SectionCard,
  SectionTitle,
  MetricCard,
  ProgressBar,
  ActivityNode,
  pct,
  pctCap,
  fmtRange,
  fmtCap,
} from "./shared";

function foundationCount(latest) {
  if (!latest) return 0;
  const checks = [
    latest.protein >= 175,
    latest.steps >= 10000,
    latest.sleep_duration >= 8,
    !!latest.strength_workout_completed,
    !!latest.movement_snacks_completed,
  ];
  return checks.filter(Boolean).length;
}

export default function TodayTab({ latest, profile }) {
  const has = !!latest;
  const v = (f) => (latest?.[f] != null ? latest[f] : "—");

  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard
          label="Blood pressure"
          value={has && latest.blood_pressure_systolic != null ? `${latest.blood_pressure_systolic}/${latest.blood_pressure_diastolic ?? ""}` : "—"}
          sub={latest?.resting_heart_rate != null ? `Pulse ${latest.resting_heart_rate}` : " "}
          subClass="text-chart-4 font-bold"
        />
        <MetricCard label="Glucose" value={v("fasting_glucose")} sub="mg/dL" />
        <MetricCard label="Ketones" value={v("blood_ketones")} sub="mmol/L" />
        <MetricCard label="Weight" value={v("body_weight")} sub="lb" />
      </div>

      <div className="grid gap-3.5 lg:grid-cols-[1.35fr_0.65fr]">
        <SectionCard
          head={
            <div className="flex justify-between items-center gap-4 mb-1">
              <div>
                <SectionTitle>Today's Foundation</SectionTitle>
                <p className="text-sm text-muted-foreground mt-1">The few actions that drive the larger numbers.</p>
              </div>
              <Pill variant="teal">{foundationCount(latest)} of 5 complete</Pill>
            </div>
          }
        >
          <ProgressBar label="Protein" right={fmtRange(latest?.protein, 175, "g")} value={pct(latest?.protein, 175)} />
          <ProgressBar label="Walking" right={fmtRange(latest?.steps, 10000, " steps")} value={pct(latest?.steps, 10000)} variant="teal" />
          <ProgressBar label="Total carbohydrates" right={fmtCap(latest?.total_carbohydrates, 35, "g")} value={pctCap(latest?.total_carbohydrates, 35)} variant="teal" />
          <ProgressBar label="Sleep" right={fmtRange(latest?.sleep_duration, 8, "h")} value={pct(latest?.sleep_duration, 8)} />
        </SectionCard>

        <div className="rounded-2xl p-4 md:p-5 border border-primary/60 bg-gradient-to-br from-primary/20 to-primary/5 flex flex-col justify-center">
          <div className="text-[13px] font-black tracking-wide text-chart-3">FOCUS OF THE WEEK</div>
          <h2 className="font-display text-xl font-extrabold text-foreground mt-2">
            {profile?.focus_of_the_week || "Set a weekly focus in Profile"}
          </h2>
          <p className="text-sm text-foreground/80 mt-2">Win the first meal and the rest of the day becomes easier.</p>
        </div>
      </div>

      <SectionCard
        head={
          <div className="flex justify-between items-center gap-4 mb-3">
            <div>
              <SectionTitle>Today's Activity</SectionTitle>
              <p className="text-sm text-muted-foreground mt-1">Each activity type remains separate.</p>
            </div>
            <Pill>Today</Pill>
          </div>
        }
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <ActivityNode label="Movement Snacks" value={latest?.movement_snacks_completed ? "✓" : "—"} detail="Daily habit" accent="gold" />
          <ActivityNode label="Walks" value={latest?.steps != null ? `${(latest.steps / 1000).toFixed(1)}k` : "—"} detail="Steps today" accent="teal" />
          <ActivityNode label="Strength" value={latest?.strength_workout_completed ? "✓" : "—"} detail="Workout" accent="gold" />
          <ActivityNode label="Mobility" value={latest?.mobility_completed ? "✓" : "—"} detail="Daily habit" accent="teal" />
        </div>
      </SectionCard>
    </div>
  );
}