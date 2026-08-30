import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { base44 } from "@/api/base44Client";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

const numericFields = [
  { key: "body_weight", label: "Body weight", group: "Body" },
  { key: "height", label: "Height", group: "Body" },
  { key: "waist_circumference", label: "Waist circumference", group: "Body" },
  { key: "body_fat_pct", label: "Body-fat %", group: "Body" },
  { key: "subcutaneous_fat_rating", label: "Subcutaneous-fat rating", group: "Body" },
  { key: "visceral_fat_rating", label: "Visceral-fat rating", group: "Body" },
  { key: "skeletal_muscle_pct", label: "Skeletal-muscle %", group: "Body" },
  { key: "muscle_mass", label: "Muscle mass", group: "Body" },
  { key: "blood_pressure_systolic", label: "Blood pressure (systolic)", group: "Metabolic" },
  { key: "blood_pressure_diastolic", label: "Blood pressure (diastolic)", group: "Metabolic" },
  { key: "resting_heart_rate", label: "Resting heart rate", group: "Metabolic" },
  { key: "fasting_glucose", label: "Fasting glucose", group: "Metabolic" },
  { key: "blood_ketones", label: "Blood ketones", group: "Metabolic" },
  { key: "total_carbohydrates", label: "Total carbohydrates", group: "Nutrition" },
  { key: "protein", label: "Protein", group: "Nutrition" },
  { key: "fat", label: "Fat", group: "Nutrition" },
  { key: "steps", label: "Steps", group: "Activity" },
  { key: "walking_distance", label: "Walking distance", group: "Activity" },
  { key: "walking_duration", label: "Walking duration", group: "Activity" },
  { key: "sleep_duration", label: "Sleep duration", group: "Recovery" },
  { key: "energy_rating", label: "Energy rating", group: "Recovery" },
];

const flagFields = [
  { key: "strength_workout_completed", label: "Strength workout completed", group: "Activity" },
  { key: "movement_snacks_completed", label: "Movement Snacks completed", group: "Activity" },
  { key: "mobility_completed", label: "Mobility completed", group: "Activity" },
];

const groups = [
  { id: "Body", title: "Body Composition" },
  { id: "Metabolic", title: "Metabolic" },
  { id: "Nutrition", title: "Nutrition" },
  { id: "Activity", title: "Activity" },
  { id: "Recovery", title: "Recovery" },
];

function buildInitial() {
  const state = { date: todayStr(), notes: "" };
  numericFields.forEach((f) => (state[f.key] = ""));
  flagFields.forEach((f) => (state[f.key] = false));
  return state;
}

export default function Log() {
  const { toast } = useToast();
  const [form, setForm] = useState(buildInitial);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    if (!form.date) return;
    setSaving(true);
    const data = { date: form.date, notes: form.notes || undefined };
    numericFields.forEach((f) => {
      if (form[f.key] !== "" && form[f.key] !== null && form[f.key] !== undefined) {
        data[f.key] = Number(form[f.key]);
      }
    });
    flagFields.forEach((f) => {
      data[f.key] = Boolean(form[f.key]);
    });
    try {
      await base44.entities.DailyCheckIn.create(data);
      toast({ title: "Check-in saved", description: "Your daily entry has been recorded." });
      setForm(buildInitial());
    } catch (e) {
      toast({ title: "Could not save", description: e.message || "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold">Daily Check-In</h2>
        <p className="text-muted-foreground text-sm mt-1">Log today's measurements. Leave any field blank if you didn't track it.</p>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <Card>
          <CardContent className="p-4">
            <div className="max-w-xs">
              <Label className="text-xs text-muted-foreground">Date</Label>
              <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required className="mt-1.5" />
            </div>
          </CardContent>
        </Card>

        {groups.map((g) => {
          const nums = numericFields.filter((f) => f.group === g.id);
          const flags = flagFields.filter((f) => f.group === g.id);
          return (
            <Card key={g.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{g.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {nums.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {nums.map((f) => (
                      <div key={f.key} className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">{f.label}</Label>
                        <Input
                          type="number"
                          step="any"
                          value={form[f.key]}
                          onChange={(e) => set(f.key, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {flags.length > 0 && (
                  <div className="space-y-2.5">
                    {flags.map((f) => (
                      <label key={f.key} className="flex items-center gap-2.5 cursor-pointer select-none">
                        <Checkbox
                          checked={form[f.key]}
                          onCheckedChange={(v) => set(f.key, v === true)}
                        />
                        <span className="text-sm">{f.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Anything worth remembering about today"
              rows={3}
            />
          </CardContent>
        </Card>

        <Button type="submit" disabled={saving} className="w-full sm:w-auto">
          {saving ? "Saving…" : "Save Check-In"}
        </Button>
      </form>
    </div>
  );
}