import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/hooks/useProfile";

export default function Onboarding() {
  const { profile, loading, saveProfile } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({
    height: "",
    height_unit: "in",
    starting_weight: "",
    starting_waist: "",
    focus_of_the_week: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && profile) navigate("/", { replace: true });
  }, [loading, profile, navigate]);

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
        focus_of_the_week: form.focus_of_the_week || undefined,
      };
      await saveProfile(data);
      toast({ title: "Profile created", description: "Welcome to Good After 50." });
      navigate("/", { replace: true });
    } catch (err) {
      toast({ title: "Could not save", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const unitLabel = form.height_unit === "in" ? "inches" : "cm";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-heading font-semibold">Welcome to Good After 50</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Let's set up your baseline so we can track your progress.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your baseline</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
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
              <div className="space-y-1.5">
                <Label>Height ({unitLabel})</Label>
                <Input
                  type="number"
                  step="any"
                  value={form.height}
                  onChange={(e) => set("height", e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Starting weight</Label>
                  <Input
                    type="number"
                    step="any"
                    value={form.starting_weight}
                    onChange={(e) => set("starting_weight", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Starting waist</Label>
                  <Input
                    type="number"
                    step="any"
                    value={form.starting_waist}
                    onChange={(e) => set("starting_waist", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Focus of the week</Label>
                <Input
                  value={form.focus_of_the_week}
                  onChange={(e) => set("focus_of_the_week", e.target.value)}
                  placeholder="e.g. Walk 8k steps daily"
                />
              </div>
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? "Saving…" : "Start tracking"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}