import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, ClipboardList } from "lucide-react";
import { metabolicNumbers, round } from "@/lib/healthCalculations";

const summaryFields = [
  { key: "body_weight", label: "Weight" },
  { key: "waist_circumference", label: "Waist" },
  { key: "blood_pressure_systolic", label: "BP" },
  { key: "resting_heart_rate", label: "RHR" },
  { key: "fasting_glucose", label: "Glucose" },
  { key: "blood_ketones", label: "Ketones" },
  { key: "total_carbohydrates", label: "Carbs" },
  { key: "protein", label: "Protein" },
  { key: "fat", label: "Fat" },
  { key: "steps", label: "Steps" },
  { key: "sleep_duration", label: "Sleep" },
  { key: "energy_rating", label: "Energy" },
];

const flagFields = [
  { key: "strength_workout_completed", label: "Strength" },
  { key: "movement_snacks_completed", label: "Snacks" },
  { key: "mobility_completed", label: "Mobility" },
];

export default function History() {
  const { toast } = useToast();
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const items = await base44.entities.DailyCheckIn.list("-date", 100);
        setCheckins(items || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function remove(id) {
    try {
      await base44.entities.DailyCheckIn.delete(id);
      setCheckins((list) => list.filter((i) => i.id !== id));
      toast({ title: "Check-in deleted" });
    } catch (e) {
      toast({ title: "Could not delete", description: e.message, variant: "destructive" });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-heading font-semibold">History</h2>
        <p className="text-muted-foreground text-sm mt-1">Review and manage your past check-ins.</p>
      </div>

      {checkins.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">No check-ins yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {checkins.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.date}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-muted-foreground mt-1">
                    {summaryFields.map((f) => {
                      const v = item[f.key];
                      if (v == null || v === "") return null;
                      const display = f.key === "blood_pressure_systolic"
                        ? `BP: ${v}/${item.blood_pressure_diastolic || ""}`
                        : `${f.label}: ${v}`;
                      return <span key={f.key}>{display}</span>;
                    })}
                  </div>
                  {(() => {
                    const m = metabolicNumbers(item);
                    if (!m) return null;
                    return (
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-muted-foreground mt-0.5">
                        <span>GKI: {round(m.gki, 1)}</span>
                        <span>Dr. Boz: {round(m.drBoz, 1)}</span>
                      </div>
                    );
                  })()}
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-muted-foreground mt-0.5">
                    {flagFields.map((f) => (
                      item[f.key] ? <span key={f.key} className="text-primary">{f.label} ✓</span> : null
                    ))}
                  </div>
                  {item.notes && <p className="text-sm text-muted-foreground mt-1.5">{item.notes}</p>}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => remove(item.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}