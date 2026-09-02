import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const BASELINE_NUMBER_KEYS = [
  "starting_body_fat_pct",
  "starting_subcutaneous_fat",
  "starting_muscle_mass",
  "starting_protein_intake",
  "hydration_fluid_oz_per_day",
  "hydration_glasses_per_day",
];

const FIELDS = [
  { key: "starting_body_fat_pct", label: "Body fat (%)" },
  { key: "starting_subcutaneous_fat", label: "Subcutaneous fat (rating)" },
  { key: "starting_muscle_mass", label: "Muscle mass (lbs)" },
  { key: "starting_protein_intake", label: "Protein intake (g)" },
  { key: "hydration_fluid_oz_per_day", label: "Hydration (fl oz/day)" },
  { key: "hydration_glasses_per_day", label: "Hydration (glasses/bottles per day)" },
];

// Optional baseline number inputs, shared by Profile and Onboarding.
export default function BaselineNumberFields({ form, set, className = "grid grid-cols-1 sm:grid-cols-3 gap-4" }) {
  return (
    <div className={className}>
      {FIELDS.map((f) => (
        <div key={f.key} className="space-y-1.5">
          <Label>{f.label}</Label>
          <Input
            type="number"
            step="any"
            value={form[f.key]}
            onChange={(e) => set(f.key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}