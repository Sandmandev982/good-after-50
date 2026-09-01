import React from "react";
import { computeProgressSinceBaseline, round } from "@/lib/healthCalculations";
import { SectionCard, SectionTitle, MetricCard } from "./shared";

export default function TrendsTab({ checkins, profile }) {
  const deltas = computeProgressSinceBaseline(checkins, profile);

  if (!deltas) {
    return (
      <SectionCard className="text-center py-12">
        <p className="text-muted-foreground">Log 7 days of check-ins to unlock trend insights.</p>
      </SectionCard>
    );
  }

  const deltaText = (d) =>
    d.delta == null ? "No change" : `${d.delta > 0 ? "+" : ""}${round(d.delta, 1)}${d.unit}`;

  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {deltas.map((d) => (
          <MetricCard
            key={d.key}
            label={d.label}
            value={deltaText(d)}
            valueClass={d.favorable ? "text-chart-4" : "text-foreground"}
            sub={d.current != null && d.baseline != null ? `7-day ${round(d.current, 1)} vs ${round(d.baseline, 1)}` : " "}
          />
        ))}
      </div>

      <SectionCard
        head={
          <div className="mb-1">
            <SectionTitle>Progress Since Baseline</SectionTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Current 7-day average compared to your starting measurements.
            </p>
          </div>
        }
      >
        <div className="grid gap-3.5 md:grid-cols-2 mt-3">
          {deltas.map((d) => (
            <div key={d.key} className="rounded-2xl p-4 bg-[#202020] border border-border">
              <div className="text-sm font-bold text-muted-foreground">{d.label}</div>
              <div className="flex justify-between items-baseline gap-3 mt-1.5 text-sm">
                <span className="text-muted-foreground">
                  7-day avg: <b className="text-foreground">{d.current != null ? `${round(d.current, 1)}${d.unit}` : "—"}</b>
                </span>
                <span className="text-muted-foreground">
                  Baseline: <b className="text-foreground">{d.baseline != null ? `${round(d.baseline, 1)}${d.unit}` : "—"}</b>
                </span>
              </div>
              <div className={`text-sm font-bold mt-2 ${d.favorable ? "text-chart-4" : "text-foreground"}`}>
                {deltaText(d)}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}