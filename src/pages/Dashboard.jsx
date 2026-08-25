import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  CartesianGrid, BarChart, Bar, LineChart, Line, Legend
} from "recharts";
import { Dumbbell, Apple, HeartPulse, Plus, TrendingUp, Moon } from "lucide-react";

export default function Dashboard() {
  const [exercise, setExercise] = useState([]);
  const [diet, setDiet] = useState([]);
  const [health, setHealth] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [ex, dt, hl] = await Promise.all([
          base44.entities.ExerciseLog.list("-date", 200),
          base44.entities.DietLog.list("-date", 200),
          base44.entities.HealthMetric.list("-date", 200),
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

  const last14 = [...Array(14)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().split("T")[0];
  });

  function sumByDate(items, date, key) {
    return items
      .filter((i) => i.date === date)
      .reduce((sum, i) => sum + (i[key] || 0), 0);
  }

  const exerciseSeries = last14.map((date) => ({
    date: date.slice(5),
    minutes: sumByDate(exercise, date, "duration_minutes"),
  }));

  const dietSeries = last14.map((date) => ({
    date: date.slice(5),
    calories: sumByDate(diet, date, "calories"),
  }));

  const healthSeries = health
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14)
    .map((h) => ({
      date: h.date.slice(5),
      weight: h.weight_kg,
      bp: h.blood_pressure_systolic ? `${h.blood_pressure_systolic}/${h.blood_pressure_diastolic || ""}` : null,
      systolic: h.blood_pressure_systolic,
      diastolic: h.blood_pressure_diastolic,
      sleep: h.sleep_hours,
    }));

  const today = new Date().toISOString().split("T")[0];
  const todayExerciseMin = sumByDate(exercise, today, "duration_minutes");
  const todayCalories = sumByDate(diet, today, "calories");
  const latestHealth = health.sort((a, b) => b.date.localeCompare(a.date))[0];

  const stats = [
    { label: "Exercise Today", value: `${todayExerciseMin} min`, icon: Dumbbell, color: "text-emerald-400" },
    { label: "Calories Today", value: `${todayCalories || 0}`, icon: Apple, color: "text-amber-400" },
    { label: "Latest Weight", value: latestHealth?.weight_kg ? `${latestHealth.weight_kg} kg` : "—", icon: TrendingUp, color: "text-sky-400" },
    { label: "Latest Sleep", value: latestHealth?.sleep_hours ? `${latestHealth.sleep_hours} h` : "—", icon: Moon, color: "text-violet-400" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const hasData = exercise.length || diet.length || health.length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-heading font-semibold">Dashboard</h2>
          <p className="text-muted-foreground text-sm mt-1">Your health at a glance — last 14 days.</p>
        </div>
        <Button asChild size="sm">
          <Link to="/log"><Plus size={16} className="mr-1" /> Log Entry</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-xl font-semibold mt-0.5">{s.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-muted ${s.color}`}>
                    <Icon size={18} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!hasData ? (
        <Card>
          <CardContent className="py-16 text-center">
            <HeartPulse className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-4">No entries yet. Start by logging your first exercise, meal, or health metric.</p>
            <Button asChild><Link to="/log">Log your first entry</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <ChartCard title="Exercise (minutes)">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={exerciseSeries}>
                <defs>
                  <linearGradient id="ex" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="minutes" stroke="hsl(var(--chart-1))" fill="url(#ex)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Calories Consumed">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dietSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="calories" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Weight Trend (kg)">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={healthSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={["auto", "auto"]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="weight" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Blood Pressure">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={healthSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="systolic" stroke="hsl(var(--chart-5))" strokeWidth={2} dot={{ r: 3 }} connectNulls name="Systolic" />
                <Line type="monotone" dataKey="diastolic" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={{ r: 3 }} connectNulls name="Diastolic" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
  color: "hsl(var(--card-foreground))",
};

function ChartCard({ title, children }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}