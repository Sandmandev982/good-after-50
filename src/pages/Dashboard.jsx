import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useProfile } from "@/hooks/useProfile";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { computeDailyScore } from "@/lib/healthCalculations";
import DailyScoreRing from "@/components/dashboard/DailyScoreRing";
import TodayTab from "@/components/dashboard/TodayTab";
import MetabolicTab from "@/components/dashboard/MetabolicTab";
import BodyCompositionTab from "@/components/dashboard/BodyCompositionTab";
import ActivityTab from "@/components/dashboard/ActivityTab";
import TrendsTab from "@/components/dashboard/TrendsTab";

const TAB_CLASS =
  "rounded-xl px-4 py-2.5 font-extrabold bg-secondary text-foreground border border-muted-foreground/40 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary";

export default function Dashboard() {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useProfile();

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const items = await base44.entities.DailyCheckIn.list("-date", 200);
        if (active) setCheckins(items || []);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const sorted = [...checkins].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1];
  const today = new Date().toISOString().slice(0, 10);
  const todaysCheckin = sorted.find((c) => c.date === today);
  const score = computeDailyScore(todaysCheckin || null);

  const hour = new Date().getHours();
  const tod = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-4">
      <section
        className="rounded-[26px] border border-primary/50 p-5 md:p-6"
        style={{
          background:
            "radial-gradient(circle at top right, hsl(var(--primary) / 0.22), transparent 34%), linear-gradient(145deg, #0e0e0e, #1c1c1c)",
        }}
      >
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div>
            <div className="font-heading uppercase tracking-[0.16em] text-sm font-extrabold text-chart-3">
              Good After 50
            </div>
            <div className="font-display text-2xl md:text-[28px] font-bold text-foreground mt-1.5">
              Strong. Sharp. Significant.
            </div>
          </div>
          <Button asChild>
            <Link to="/log">Daily check-in</Link>
          </Button>
        </div>

        <div className="flex justify-between items-end gap-4 flex-wrap mt-7">
          <div>
            <div className="text-sm text-muted-foreground">{dateStr}</div>
            <h1 className="font-display text-[26px] md:text-[29px] font-bold mt-1.5 text-foreground leading-tight">
              Good {tod}
            </h1>
            <p className="mt-2 text-foreground/90 max-w-md">
              See what changed, why it changed, and what to do next.
            </p>
          </div>
          <DailyScoreRing score={score} />
        </div>
      </section>

      <Tabs defaultValue="today">
        <TabsList className="flex flex-wrap gap-2 bg-transparent p-0 h-auto rounded-none">
          <TabsTrigger value="today" className={TAB_CLASS}>Today</TabsTrigger>
          <TabsTrigger value="metabolic" className={TAB_CLASS}>Metabolic</TabsTrigger>
          <TabsTrigger value="body" className={TAB_CLASS}>Body Composition</TabsTrigger>
          <TabsTrigger value="activity" className={TAB_CLASS}>Activity</TabsTrigger>
          <TabsTrigger value="trends" className={TAB_CLASS}>Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="mt-4">
          <TodayTab latest={latest} profile={profile} />
        </TabsContent>
        <TabsContent value="metabolic" className="mt-4">
          <MetabolicTab latest={latest} />
        </TabsContent>
        <TabsContent value="body" className="mt-4">
          <BodyCompositionTab latest={latest} profile={profile} />
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <ActivityTab checkins={sorted} />
        </TabsContent>
        <TabsContent value="trends" className="mt-4">
          <TrendsTab checkins={sorted} profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}