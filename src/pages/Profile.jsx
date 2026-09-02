import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/hooks/useProfile";
import BaselineNumberFields, { BASELINE_NUMBER_KEYS } from "@/components/BaselineNumberFields";

export default function Profile() {
  const { profile, loading, saveProfile } = useProfile();
  const { toast } = useToast();
  const [form, setForm] = useState({
    height: "",
    height_unit: "in",
    starting_weight: "",
    starting_waist: "",
    ...Object.fromEntries(BASELINE_NUMBER_KEYS.map((k) => [k, ""])),
    focus_of_the_week: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        height: profile.height ?? "",
        height_unit: profile.height_unit ?? "in",
        starting_weight: profile.starting_weight ?? "",
        starting_waist: profile.starting_waist ?? "",
        ...Object.fromEntries(BASELINE_NUMBER_KEYS.map((k) => [k, profile[k] ?? ""])),
        focus_of_the_week: profile.focus_of_the_week ?? "",
      });
    }
  }, [profile]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        height: form.height ? Number(form.height) : undefined,
        height_unit: form.height_unit,
        starting_weight: form.starting_weight ? Number(form.starting_weight) : undefined,
        starting_waist: form.starting_waist ? Number(form.starting_waist) : undefined,
        ...Object.fromEntries(
          BASELINE_NUMBER_KEYS.map((k) => [k, form[k] ? Number(form[k]) : undefined])
        ),
        focus_of_the_week: form.focus_of_the_week || undefined,
      };
      await saveProfile(data);
      toast({ title: "Profile updated" });
    } catch (err) {
      toast({ title: "Could not save", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const unitLabel = form.height_unit === "in" ? "inches" : "cm";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold">Profile</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Your baseline measurements and weekly focus.
        </p>
      </div>
      <form onSubmit={submit} className="space-y-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Baseline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Height unit</Label>
              <div className="flex gap-2">
                {["in", "cm"].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => set("height_unit", u)}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium border transition-colors ${
                      form.height_unit === u
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-transparent text-foreground border-input hover:bg-accent"
                    }`}
                  >
                    {u === "in" ? "Inches" : "Centimeters"}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Height ({unitLabel})</Label>
                <Input
                  type="number"
                  step="any"
                  value={form.height}
                  onChange={(e) => set("height", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Starting weight</Label>
                <Input
                  type="number"
                  step="any"
                  value={form.starting_weight}
                  onChange={(e) => set("starting_weight", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Starting waist</Label>
                <Input
                  type="number"
                  step="any"
                  value={form.starting_waist}
                  onChange={(e) => set("starting_waist", e.target.value)}
                />
              </div>
            </div>
            <BaselineNumberFields form={form} set={set} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Focus of the week</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={form.focus_of_the_week}
              onChange={(e) => set("focus_of_the_week", e.target.value)}
              placeholder="What matters most this week"
            />
          </CardContent>
        </Card>
        <Button type="submit" disabled={saving} className="w-full sm:w-auto">
          {saving ? "Saving…" : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}