import React from "react";
import { Button } from "@/components/ui/button";
import { metricIcons, METRIC_ICON_SIZE, METRIC_ICON_STROKE } from "@/lib/metricIcons";

const ROWS = [
  { key: "body_weight", label: "Weight", unit: "lb" },
  { key: "blood_pressure_systolic", label: "Blood pressure", unit: "mmHg" },
  { key: "fasting_glucose", label: "Fasting glucose", unit: "mg/dL" },
  { key: "blood_ketones", label: "Blood ketones", unit: "mmol/L" },
];

export default function StepFirstCheckIn({ onStart }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-heading font-semibold">Log your first day</h1>
        <p className="text-muted-foreground">
          Your dashboard fills in as you log. Start with what you measured today.
        </p>
      </div>

      <div className="space-y-3">
        {ROWS.map(({ key, label, unit }) => {
          const Icon = metricIcons[key];
          return (
            <div key={key} className="flex items-center gap-3 rounded-xl border bg-card p-4">
              {Icon && (
                <Icon size={METRIC_ICON_SIZE} strokeWidth={METRIC_ICON_STROKE} className="shrink-0" />
              )}
              <span className="flex-1">{label}</span>
              <span className="text-sm text-muted-foreground">{unit}</span>
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        You can add the rest any time today.
      </p>
      <Button size="lg" className="w-full" onClick={onStart}>
        Start my first check-in
      </Button>
    </div>
  );
}