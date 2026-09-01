import React from "react";
import { computeGKI, computeDrBozRatio, round } from "@/lib/healthCalculations";
import { SectionCard, SectionTitle, MetricCard, ProgressBar, pctCap, fmtCap } from "./shared";

export default function MetabolicTab({ latest }) {
  const v = (f) => (latest?.[f] != null ? latest[f] : "—");
  const hasMet = latest?.fasting_glucose != null && latest?.blood_ketones;
  const gki = hasMet ? computeGKI(latest.fasting_glucose, latest.blood_ketones) : null;
  const drBoz = hasMet ? computeDrBozRatio(latest.fasting_glucose, latest.blood_ketones) : null;

  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard label="Glucose" value={v("fasting_glucose")} sub="mg/dL" />
        <MetricCard label="Ketones" value={v("blood_ketones")} sub="mmol/L" />
        <MetricCard label="GKI" value={gki != null ? round(gki, 1) : "—"} sub="Glucose mmol/L ÷ ketones" />
        <MetricCard label="Glucose-Ketone Ratio" value={drBoz != null ? round(drBoz, 0) : "—"} sub="Glucose mg/dL ÷ ketones" />
      </div>

      <div className="grid gap-3.5 md:grid-cols-2">
        <SectionCard head={<div className="mb-1"><SectionTitle>Metabolic Snapshot</SectionTitle></div>}>
          <ProgressBar label="Total carbohydrates" right={fmtCap(latest?.total_carbohydrates, 35, "g")} value={pctCap(latest?.total_carbohydrates, 35)} variant="teal" />
          <p className="text-sm text-muted-foreground mt-4">
            Glucose and ketones are shown as raw values. GKI and the glucose-ketone ratio are calculations, not medical assessments.
          </p>
        </SectionCard>

        <SectionCard head={<div className="mb-3"><SectionTitle>How to Read These Numbers</SectionTitle></div>}>
          <div className="rounded-2xl p-3.5 bg-[#202020] border border-border">
            <h3 className="font-display font-bold text-foreground">GKI</h3>
            <p className="text-sm text-muted-foreground mt-1">Converts glucose into mmol/L, then divides it by ketones.</p>
          </div>
          <div className="rounded-2xl p-3.5 bg-[#202020] border border-border mt-2.5">
            <h3 className="font-display font-bold text-chart-4">Glucose-Ketone Ratio</h3>
            <p className="text-sm text-muted-foreground mt-1">Divides glucose in mg/dL directly by ketones.</p>
          </div>
          <p className="text-sm text-muted-foreground mt-3">These values show metabolic context. They are not a medical diagnosis.</p>
        </SectionCard>
      </div>
    </div>
  );
}