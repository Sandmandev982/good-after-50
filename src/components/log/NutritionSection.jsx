import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProgressBar } from "@/components/dashboard/shared";
import { PROTEIN_TARGET_G, CARB_LIMIT_G } from "@/lib/nutritionTargets";

export const MEAL_FIELDS = [
  { key: "breakfast_protein" },
  { key: "breakfast_fat" },
  { key: "breakfast_carbs" },
  { key: "lunch_protein" },
  { key: "lunch_fat" },
  { key: "lunch_carbs" },
  { key: "dinner_protein" },
  { key: "dinner_fat" },
  { key: "dinner_carbs" },
];

export const TOTAL_KEYS = ["protein", "fat", "total_carbohydrates"];

const MEALS = [
  { name: "Breakfast", prefix: "breakfast" },
  { name: "Lunch", prefix: "lunch" },
  { name: "Dinner", prefix: "dinner" },
];

const MACROS = [
  { key: "protein", label: "Protein" },
  { key: "fat", label: "Fat" },
  { key: "carbs", label: "Carbs" },
];

function toNum(v) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

export function hasAnyMealValues(form) {
  return MEAL_FIELDS.some((f) => toNum(form[f.key]) > 0);
}

export default function NutritionSection({ form, set }) {
  const sum = (macro) =>
    MEALS.reduce((acc, meal) => acc + toNum(form[`${meal.prefix}_${macro}`]), 0);

  const proteinTotal = sum("protein");
  const fatTotal = sum("fat");
  const carbTotal = sum("carbs");
  const showManualTotals = !hasAnyMealValues(form);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Nutrition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-2xl p-4 bg-[#202020] border border-border">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">Daily Totals</div>
          <ProgressBar
            label="Protein"
            right={`${proteinTotal} / ${PROTEIN_TARGET_G}g`}
            value={(proteinTotal / PROTEIN_TARGET_G) * 100}
          />
          <ProgressBar
            label="Carbs"
            right={`${carbTotal} / ${CARB_LIMIT_G}g`}
            value={(carbTotal / CARB_LIMIT_G) * 100}
            variant="teal"
          />
          <div className="flex justify-between gap-3 text-sm pt-4">
            <span className="font-semibold text-foreground">Fat</span>
            <span className="text-muted-foreground">{fatTotal}g</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {MEALS.map((meal) => (
            <div key={meal.name} className="rounded-2xl p-4 bg-[#202020] border border-border">
              <div className="text-sm font-bold text-foreground mb-3">{meal.name}</div>
              <div className="space-y-3">
                {MACROS.map((m) => {
                  const k = `${meal.prefix}_${m.key}`;
                  return (
                    <div key={k} className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">{m.label}</Label>
                      <Input
                        type="number"
                        step="any"
                        value={form[k] ?? ""}
                        onChange={(e) => set(k, e.target.value)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {showManualTotals && (
          <div>
            <p className="text-xs text-muted-foreground/80 mb-3">
              No meal entries yet — enter daily totals directly, or fill in any meal above to auto-calculate.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {TOTAL_KEYS.map((k) => (
                <div key={k} className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    {k === "total_carbohydrates" ? "Total carbs" : k.charAt(0).toUpperCase() + k.slice(1)}
                  </Label>
                  <Input
                    type="number"
                    step="any"
                    value={form[k] ?? ""}
                    onChange={(e) => set(k, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}