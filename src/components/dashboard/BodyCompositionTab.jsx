import React from "react";
import { round } from "@/lib/healthCalculations";
import { SectionCard, SectionTitle, MetricCard, MiniRing } from "./shared";

export default function BodyCompositionTab({ latest, profile }) {
  const v = (f) => (latest?.[f] != null ? latest[f] : "—");
  const height = profile?.height || latest?.height;
  const bmi = latest?.body_weight != null && height ? (latest.body_weight / (height * height)) * 703 : null;

  const rows = [
    { label: "Body fat percentage", value: latest?.body_fat_pct != null ? `${latest.body_fat_pct}%` : "—", purpose: "Estimated share of body weight stored as fat." },
    { label: "Subcutaneous fat", value: latest?.subcutaneous_fat_rating != null ? `${latest.subcutaneous_fat_rating}%` : "—", purpose: "Fat stored beneath the skin." },
    { label: "Skeletal muscle", value: latest?.skeletal_muscle_pct != null ? `${latest.skeletal_muscle_pct}%` : "—", purpose: "Estimated skeletal muscle percentage." },
    { label: "Muscle mass", value: latest?.muscle_mass != null ? `${latest.muscle_mass} lb` : "—", purpose: "Estimated total muscle mass." },
    { label: "Visceral fat level", value: v("visceral_fat_rating"), purpose: "Scale index of fat around internal organs." },
    { label: "Waist", value: latest?.waist_circumference != null ? `${latest.waist_circumference} in` : "—", purpose: "Circumference measured at the navel." },
  ];

  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard label="Weight" value={v("body_weight")} sub="lb" />
        <MetricCard label="BMI" value={bmi != null ? round(bmi, 1) : "—"} sub="Height and weight calculation" />
        <MetricCard label="Body Fat" value={latest?.body_fat_pct != null ? `${latest.body_fat_pct}%` : "—"} sub="Scale estimate" />
        <MetricCard label="Visceral Fat" value={v("visceral_fat_rating")} sub="Scale level or index" />
      </div>

      <SectionCard
        head={
          <div className="mb-3">
            <SectionTitle>Body Composition Details</SectionTitle>
            <p className="text-sm text-muted-foreground mt-1">A deeper view without crowding the main dashboard.</p>
          </div>
        }
      >
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-chart-3">
                <th className="py-3 px-2 font-extrabold">Measurement</th>
                <th className="py-3 px-2 font-extrabold">Current</th>
                <th className="py-3 px-2 font-extrabold">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-border">
                  <td className="py-3 px-2 text-foreground">{r.label}</td>
                  <td className="py-3 px-2 font-bold text-foreground whitespace-nowrap">{r.value}</td>
                  <td className="py-3 px-2 text-muted-foreground">{r.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <MiniRing pct={latest?.body_fat_pct ?? 0} value={latest?.body_fat_pct != null ? `${latest.body_fat_pct}%` : "—"} label="Body fat" />
        <MiniRing pct={latest?.skeletal_muscle_pct ?? 0} value={latest?.skeletal_muscle_pct != null ? `${latest.skeletal_muscle_pct}%` : "—"} label="Skeletal muscle" />
        <MiniRing pct={Math.min(((latest?.visceral_fat_rating ?? 0) / 30) * 100, 100)} value={v("visceral_fat_rating")} label="Visceral level" />
      </div>
    </div>
  );
}