import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  CartesianGrid, BarChart, Bar
} from "recharts";
import { TrendingUp, Activity, Moon, HeartPulse, Plus, ClipboardList } from "lucide-react";

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
  color: "hsl(var(--card-foreground))",
};

export default function Dashboard() {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const items = await base44.entities.DailyCheckIn.list("-date", 200);
        setCheckins(items || []);
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

  const sorted = [...checkins].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1];

  const weightSeries = sorted.slice(-14).map((c) => ({
    date: c.date.slice(5),
    weight: c.body_weight,
  }));
  const stepsSeries = sorted.slice(-14).map((c) => ({
    date: c.date.slice(5),
    steps: c.steps,
  }));

  const stats = [
    { label: "Latest Weight", value: latest?.body_weight != null ? `${latest.body_weight}` : "—", icon: TrendingUp, color: "text-sky-400" },
    { label: "Latest BP", value: latest?.blood_pressure_systolic ? `${latest.blood_pressure_systolic}/${latest.blood_pressure_diastolic || ""}` : "—", icon: HeartPulse, color: "text-rose-400" },
    { label: "Latest Sleep", value: latest?.sleep_duration != null ? `${latest.sleep_duration} h` : "—", icon: Moon, color: "text-violet-400" },
    { label: "Latest Steps", value: latest?.steps != null ? `${latest.steps}` : "—", icon: Activity, color: "text-emerald-400" },
  ];

  const hasData = checkins.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-heading font-semibold">Dashboard</h2>
          <p className="text-muted-foreground text-sm mt-1">Your health at a glance — last 14 days.</p>
        </div>
        <Button asChild size="sm">
          <Link to="/log"><Plus size={16} className="mr-1" /> Check-In</Link>
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
            <ClipboardList className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-4">No check-ins yet. Start by logging your first daily entry.</p>
            <Button asChild><Link to="/log">Log your first check-in</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <ChartCard title="Weight Trend">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weightSeries}>
                <defs>
                  <linearGradient id="wt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={["auto", "auto"]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="weight" stroke="hsl(var(--chart-2))" fill="url(#wt)" strokeWidth={2} connectNulls />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Daily Steps">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stepsSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="steps" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </div>
  );
}

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