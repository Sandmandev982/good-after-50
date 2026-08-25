import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Dumbbell, Apple, HeartPulse, Trash2 } from "lucide-react";

export default function History() {
  const { toast } = useToast();
  const [tab, setTab] = useState("exercise");
  const [exercise, setExercise] = useState([]);
  const [diet, setDiet] = useState([]);
  const [health, setHealth] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [ex, dt, hl] = await Promise.all([
          base44.entities.ExerciseLog.list("-date", 100),
          base44.entities.DietLog.list("-date", 100),
          base44.entities.HealthMetric.list("-date", 100),
        ]);
        setExercise(ex);
        setDiet(dt);
        setHealth(hl);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function remove(entity, id, label, setter) {
    try {
      await base44.entities[entity].delete(id);
      setter((list) => list.filter((i) => i.id !== id));
      toast({ title: `${label} entry deleted` });
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

  const items = tab === "exercise" ? exercise : tab === "diet" ? diet : health;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-heading font-semibold">History</h2>
        <p className="text-muted-foreground text-sm mt-1">Review and manage your past entries.</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="exercise" className="gap-1.5"><Dumbbell size={15} /> Exercise</TabsTrigger>
          <TabsTrigger value="diet" className="gap-1.5"><Apple size={15} /> Diet</TabsTrigger>
          <TabsTrigger value="health" className="gap-1.5"><HeartPulse size={15} /> Health</TabsTrigger>
        </TabsList>
      </Tabs>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground text-sm">
            No {tab} entries yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {tab === "exercise" && (
                    <div>
                      <p className="font-medium">
                        {item.activity_type} · {item.duration_minutes} min
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.date} · {item.intensity} intensity
                      </p>
                      {item.notes && <p className="text-sm text-muted-foreground mt-1.5">{item.notes}</p>}
                    </div>
                  )}
                  {tab === "diet" && (
                    <div>
                      <p className="font-medium">{item.meal_type}{item.calories ? ` · ${item.calories} cal` : ""}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{item.food_items}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                    </div>
                  )}
                  {tab === "health" && (
                    <div className="space-y-0.5">
                      <p className="font-medium">{item.date}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-muted-foreground">
                        {item.weight_kg && <span>Weight: {item.weight_kg} kg</span>}
                        {item.blood_pressure_systolic && <span>BP: {item.blood_pressure_systolic}/{item.blood_pressure_diastolic}</span>}
                        {item.heart_rate && <span>HR: {item.heart_rate} bpm</span>}
                        {item.sleep_hours && <span>Sleep: {item.sleep_hours} h</span>}
                        {item.mood && <span>Mood: {item.mood}</span>}
                      </div>
                      {item.notes && <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => remove(tab === "exercise" ? "ExerciseLog" : tab === "diet" ? "DietLog" : "HealthMetric", item.id, tab === "exercise" ? "Exercise" : tab === "diet" ? "Diet" : "Health", tab === "exercise" ? setExercise : tab === "diet" ? setDiet : setHealth)}
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