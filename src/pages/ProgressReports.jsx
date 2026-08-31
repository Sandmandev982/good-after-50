import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { computeGKI, computeDrBozRatio } from "@/lib/healthCalculations";

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
  color: "hsl(var(--card-foreground))",
};

function round1(n) {
  if (n == null) return null;
  return Math.round(n * 10) / 10;
}

export default function ProgressReports() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const items = await base44.entities.DailyCheckIn.list("-date", 365);
        const sorted = [...(items || [])].sort((a, b) => a.date.localeCompare(b.date));
        const rows = sorted.map((c) => ({
          date: c.date.slice(5),
          weight: c.body_weight,
          waist: c.waist_circumference,
          body_fat: c.body_fat_pct,
          systolic: c.blood_pressure_systolic,
          diastolic: c.blood_pressure_diastolic,
          rhr: c.resting_heart_rate,
          glucose: c.fasting_glucose,
          ketones: c.blood_ketones,
          steps: c.steps,
          sleep: c.sleep_duration,
          gki: round1(computeGKI(c.fasting_glucose, c.blood_ketones)),
          drBoz: round1(computeDrBozRatio(c.fasting_glucose, c.blood_ketones)),
        }));
        setData(rows);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const hasAny = (key) => data.some((d) => d[key] != null);

  const metrics = [
    { title: "Weight", key: "weight", color: "hsl(var(--chart-2))" },
    { title: "Waist", key: "waist", color: "hsl(var(--chart-3))" },
    { title: "Body Fat %", key: "body_fat", color: "hsl(var(--chart-4))" },
    { title: "Resting Heart Rate", key: "rhr", color: "hsl(var(--chart-5))" },
    { title: "Fasting Glucose", key: "glucose", color: "hsl(var(--chart-2))" },
    { title: "Blood Ketones", key: "ketones", color: "hsl(var(--chart-3))" },
    { title: "Steps", key: "steps", color: "hsl(var(--chart-1))" },
    { title: "Sleep (h)", key: "sleep", color: "hsl(var(--chart-4))" },
    { title: "GKI", key: "gki", color: "hsl(var(--chart-5))" },
    { title: "Dr. Boz Ratio", key: "drBoz", color: "hsl(var(--chart-1))" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold">Progress Reports</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Long-term trends across your key health markers.
        </p>
      </div>

      {data.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              No check-ins to chart yet. Log a few entries to see your progress.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Blood Pressure
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasAny("systolic") || hasAny("diastolic") ? (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={["auto", "auto"]} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="systolic" name="Systolic" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.15} strokeWidth={2} connectNulls />
                    <Area type="monotone" dataKey="diastolic" name="Diastolic" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.15} strokeWidth={2} connectNulls />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-sm py-8 text-center">
                  No blood pressure data yet.
                </p>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {metrics.map((m) => (
              <Card key={m.key}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {m.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {hasAny(m.key) ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={data}>
                        <defs>
                          <linearGradient id={`grad-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={m.color} stopOpacity={0.35} />
                            <stop offset="95%" stopColor={m.color} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={["auto", "auto"]} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area
                          type="monotone"
                          dataKey={m.key}
                          stroke={m.color}
                          fill={`url(#grad-${m.key})`}
                          strokeWidth={2}
                          connectNulls
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground text-sm py-8 text-center">
                      No {m.title.toLowerCase()} data yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}