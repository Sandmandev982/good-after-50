import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { base44 } from "@/api/base44Client";
import { Dumbbell, Apple, HeartPulse } from "lucide-react";

const activityTypes = ["Walking", "Swimming", "Cycling", "Yoga", "Strength Training", "Stretching", "Water Aerobics", "Gardening", "Dancing", "Other"];
const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];
const moods = ["Great", "Good", "Okay", "Low", "Poor"];
const intensities = ["Light", "Moderate", "Vigorous"];

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function Log() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(null);

  async function save(entity, data, label) {
    setSaving(entity);
    try {
      await base44.entities[entity].create(data);
      toast({ title: `${label} saved`, description: "Your entry has been recorded." });
      return true;
    } catch (e) {
      toast({ title: "Could not save", description: e.message || "Please try again.", variant: "destructive" });
      return false;
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold">Log an Entry</h2>
        <p className="text-muted-foreground text-sm mt-1">Record today's exercise, meals, and health metrics.</p>
      </div>

      <Tabs defaultValue="exercise" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="exercise" className="gap-1.5"><Dumbbell size={15} /> Exercise</TabsTrigger>
          <TabsTrigger value="diet" className="gap-1.5"><Apple size={15} /> Diet</TabsTrigger>
          <TabsTrigger value="health" className="gap-1.5"><HeartPulse size={15} /> Health</TabsTrigger>
        </TabsList>

        <ExerciseForm onSave={save} saving={saving === "ExerciseLog"} />
        <DietForm onSave={save} saving={saving === "DietLog"} />
        <HealthForm onSave={save} saving={saving === "HealthMetric"} />
      </Tabs>
    </div>
  );
}

function ExerciseForm({ onSave, saving }) {
  const [form, setForm] = useState({
    date: todayStr(),
    activity_type: "Walking",
    duration_minutes: "",
    intensity: "Moderate",
    notes: "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    if (!form.duration_minutes) return;
    const ok = await onSave("ExerciseLog", { ...form, duration_minutes: Number(form.duration_minutes) }, "Exercise");
    if (ok) setForm({ date: todayStr(), activity_type: "Walking", duration_minutes: "", intensity: "Moderate", notes: "" });
  }

  return (
    <TabsContent value="exercise">
      <Card>
        <CardHeader><CardTitle className="text-base">Exercise Log</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date">
                <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required />
              </Field>
              <Field label="Activity">
                <Select value={form.activity_type} onValueChange={(v) => set("activity_type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{activityTypes.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Duration (minutes)">
                <Input type="number" min="1" value={form.duration_minutes} onChange={(e) => set("duration_minutes", e.target.value)} required />
              </Field>
              <Field label="Intensity">
                <Select value={form.intensity} onValueChange={(v) => set("intensity", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{intensities.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Notes">
              <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="How did it feel?" rows={2} />
            </Field>
            <Button type="submit" disabled={saving} className="w-full sm:w-auto">Save Exercise</Button>
          </form>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

function DietForm({ onSave, saving }) {
  const [form, setForm] = useState({
    date: todayStr(),
    meal_type: "Breakfast",
    food_items: "",
    calories: "",
    notes: "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    if (!form.food_items) return;
    const ok = await onSave("DietLog", { ...form, calories: form.calories ? Number(form.calories) : undefined }, "Diet");
    if (ok) setForm({ date: todayStr(), meal_type: "Breakfast", food_items: "", calories: "", notes: "" });
  }

  return (
    <TabsContent value="diet">
      <Card>
        <CardHeader><CardTitle className="text-base">Diet Log</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date">
                <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required />
              </Field>
              <Field label="Meal">
                <Select value={form.meal_type} onValueChange={(v) => set("meal_type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{mealTypes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Food & drinks">
              <Textarea value={form.food_items} onChange={(e) => set("food_items", e.target.value)} placeholder="e.g. Oatmeal with berries, black coffee" rows={2} required />
            </Field>
            <Field label="Calories (optional)">
              <Input type="number" min="0" value={form.calories} onChange={(e) => set("calories", e.target.value)} placeholder="Approximate" />
            </Field>
            <Button type="submit" disabled={saving} className="w-full sm:w-auto">Save Meal</Button>
          </form>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

function HealthForm({ onSave, saving }) {
  const [form, setForm] = useState({
    date: todayStr(),
    weight_kg: "",
    blood_pressure_systolic: "",
    blood_pressure_diastolic: "",
    heart_rate: "",
    sleep_hours: "",
    mood: "Good",
    notes: "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    const numeric = ["weight_kg", "blood_pressure_systolic", "blood_pressure_diastolic", "heart_rate", "sleep_hours"];
    const data = { date: form.date, mood: form.mood, notes: form.notes };
    numeric.forEach((k) => { if (form[k]) data[k] = Number(form[k]); });
    const ok = await onSave("HealthMetric", data, "Health metrics");
    if (ok) setForm({ date: todayStr(), weight_kg: "", blood_pressure_systolic: "", blood_pressure_diastolic: "", heart_rate: "", sleep_hours: "", mood: "Good", notes: "" });
  }

  return (
    <TabsContent value="health">
      <Card>
        <CardHeader><CardTitle className="text-base">Health Metrics</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date">
                <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required />
              </Field>
              <Field label="Weight (kg)">
                <Input type="number" step="0.1" min="0" value={form.weight_kg} onChange={(e) => set("weight_kg", e.target.value)} />
              </Field>
              <Field label="Systolic BP">
                <Input type="number" min="0" value={form.blood_pressure_systolic} onChange={(e) => set("blood_pressure_systolic", e.target.value)} />
              </Field>
              <Field label="Diastolic BP">
                <Input type="number" min="0" value={form.blood_pressure_diastolic} onChange={(e) => set("blood_pressure_diastolic", e.target.value)} />
              </Field>
              <Field label="Heart Rate (bpm)">
                <Input type="number" min="0" value={form.heart_rate} onChange={(e) => set("heart_rate", e.target.value)} />
              </Field>
              <Field label="Sleep (hours)">
                <Input type="number" step="0.1" min="0" value={form.sleep_hours} onChange={(e) => set("sleep_hours", e.target.value)} />
              </Field>
              <Field label="Mood">
                <Select value={form.mood} onValueChange={(v) => set("mood", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{moods.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Notes">
              <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Any symptoms or observations" rows={2} />
            </Field>
            <Button type="submit" disabled={saving} className="w-full sm:w-auto">Save Metrics</Button>
          </form>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}