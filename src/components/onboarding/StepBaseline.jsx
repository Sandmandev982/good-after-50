import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BaselineNumberFields from "@/components/BaselineNumberFields";
import BackLink from "./BackLink";

export default function StepBaseline({ form, set, saving, onSubmit, onBack }) {
  const unitLabel = form.height_unit === "in" ? "inches" : "cm";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-heading font-semibold">Your starting point</h1>
        <p className="text-muted-foreground">
          This is where your progress begins. You can update it later in Profile.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your baseline</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
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
                        : "bg-transparent text-foreground border-input hover:bg-accent hover:text-accent-foreground"
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
            <BaselineNumberFields form={form} set={set} className="grid grid-cols-2 gap-3" />
            <div className="space-y-1.5">
              <Label>Focus of the week</Label>
              <Input
                value={form.focus_of_the_week}
                onChange={(e) => set("focus_of_the_week", e.target.value)}
                placeholder="e.g. Walk 8k steps daily"
              />
            </div>
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Saving…" : "Next"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <BackLink onClick={onBack} />
    </div>
  );
}