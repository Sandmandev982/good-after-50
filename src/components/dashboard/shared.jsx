import React from "react";
import { cn } from "@/lib/utils";

export function Pill({ children, variant = "gold", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold",
        variant === "gold"
          ? "text-chart-3 border border-primary/50 bg-primary/15"
          : "text-chart-4 border border-accent/45 bg-accent/20",
        className
      )}
    >
      {children}
    </span>
  );
}

export function SectionTitle({ children, className }) {
  return (
    <h2 className={cn("font-display text-2xl md:text-[26px] font-extrabold text-foreground", className)}>
      {children}
    </h2>
  );
}

export function MetricCard({ label, value, sub, subClass, valueClass }) {
  return (
    <div className="rounded-2xl p-4 bg-gradient-to-b from-secondary to-card border border-primary/35">
      <div className="text-sm font-bold text-muted-foreground">{label}</div>
      <div className={cn("text-[26px] leading-tight font-extrabold mt-2 text-foreground", valueClass)}>
        {value}
      </div>
      {sub != null && sub !== "" && (
        <div className={cn("text-sm mt-1 text-muted-foreground", subClass)}>{sub}</div>
      )}
    </div>
  );
}

export function SectionCard({ children, head, className }) {
  return (
    <div className={cn("rounded-2xl p-4 md:p-5 bg-card border border-border", className)}>
      {head}
      {children}
    </div>
  );
}

export function ProgressBar({ label, right, value, variant = "gold" }) {
  return (
    <div className="mt-4 first:mt-0">
      <div className="flex justify-between gap-3 mb-2 text-sm">
        <span className="font-semibold text-foreground">{label}</span>
        <span className="text-muted-foreground">{right}</span>
      </div>
      <div className="h-2.5 rounded-full bg-[#38332e] overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full",
            variant === "gold"
              ? "bg-gradient-to-r from-primary to-chart-3"
              : "bg-gradient-to-r from-accent to-chart-4"
          )}
          style={{ width: `${Math.min(Math.max(value || 0, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}

export function ActivityNode({ label, value, detail, accent = "gold" }) {
  return (
    <div className="rounded-2xl p-4 bg-[#202020] border border-border">
      <div className="text-sm text-muted-foreground">{label}</div>
      <strong
        className={cn(
          "block text-[26px] mt-2",
          accent === "gold" ? "text-chart-3" : "text-chart-4"
        )}
      >
        {value}
      </strong>
      <div className="text-sm mt-1 text-muted-foreground">{detail}</div>
    </div>
  );
}

export function MiniRing({ pct, value, label }) {
  const clamped = Math.min(Math.max(pct || 0, 0), 100);
  return (
    <div className="rounded-2xl p-4 bg-card border border-border flex flex-col items-center">
      <div
        className="w-[102px] h-[102px] rounded-full p-2"
        style={{ background: `conic-gradient(hsl(var(--primary)) 0 ${clamped}%, #38332e ${clamped}% 100%)` }}
      >
        <div className="w-full h-full rounded-full bg-card flex flex-col items-center justify-center">
          <strong className="text-lg text-foreground">{value}</strong>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      </div>
    </div>
  );
}

export const pct = (value, target) => (value == null ? 0 : Math.min(100, (value / target) * 100));
export const pctCap = (value, cap) => (value == null ? 0 : Math.min(100, (value / cap) * 100));
export const fmtRange = (value, target, unit) => `${value ?? 0} / ${target}${unit}`;
export const fmtCap = (value, cap, unit) => `${value ?? 0} / ${cap}${unit}`;