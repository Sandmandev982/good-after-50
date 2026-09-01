// Display-time metabolic calculations.
// GKI and Dr. Boz Ratio are shown as RAW numbers only — no severity bands,
// labels, or color-coding. Banding/labeling requires separate sign-off.

export function computeGKI(glucose, ketones) {
  if (glucose == null || ketones == null || ketones === 0) return null;
  return glucose / ketones / 18;
}

export function computeDrBozRatio(glucose, ketones) {
  if (glucose == null || ketones == null || ketones === 0) return null;
  return glucose / ketones;
}

// Returns { gki, drBoz } for a check-in, or null when inputs are missing/invalid.
export function metabolicNumbers(checkin) {
  if (!checkin) return null;
  const g = checkin.fasting_glucose;
  const k = checkin.blood_ketones;
  if (g == null || k == null || k === 0) return null;
  return {
    gki: computeGKI(g, k),
    drBoz: computeDrBozRatio(g, k),
  };
}

export function round(n, digits = 1) {
  if (n == null || Number.isNaN(n)) return null;
  const f = Math.pow(10, digits);
  return Math.round(n * f) / f;
}

// Daily "Check-In Completion" score: percentage of mandatory daily-essential
// fields that are filled in today's check-in. Modeled as an Apple-style
// accountability ring, NOT a health score. 0 logged => 0%.
export const MANDATORY_CHECKIN_FIELDS = [
  "body_weight",
  "blood_pressure_systolic",
  "blood_pressure_diastolic",
  "resting_heart_rate",
  "fasting_glucose",
  "blood_ketones",
  "total_carbohydrates",
  "protein",
  "steps",
  "sleep_duration",
  "energy_rating",
  "strength_workout_completed",
  "movement_snacks_completed",
  "mobility_completed",
];

export function computeDailyScore(checkin) {
  if (!checkin) return 0;
  const filled = MANDATORY_CHECKIN_FIELDS.filter((f) => checkin[f] != null).length;
  return Math.round((filled / MANDATORY_CHECKIN_FIELDS.length) * 100);
}

// Progress Since Baseline: current 7-day average vs. baseline.
// Returns null when fewer than 7 check-ins exist (caller shows a placeholder).
export function computeProgressSinceBaseline(checkins, profile) {
  if (!checkins || checkins.length < 7) return null;
  const sorted = [...checkins].sort((a, b) => a.date.localeCompare(b.date));
  const last7 = sorted.slice(-7);
  const earliest = sorted[0];

  const avg = (field) => {
    const vals = last7.map((c) => c[field]).filter((v) => v != null);
    if (!vals.length) return null;
    return vals.reduce((s, v) => s + v, 0) / vals.length;
  };

  const metrics = [
    { key: "weight", label: "Weight", unit: " lb", field: "body_weight", profileField: "starting_weight", lowerIsBetter: true },
    { key: "waist", label: "Waist", unit: " in", field: "waist_circumference", profileField: "starting_waist", lowerIsBetter: true },
    { key: "bodyfat", label: "Body Fat", unit: "%", field: "body_fat_pct", profileField: null, lowerIsBetter: true },
    { key: "visceral", label: "Visceral Fat", unit: "", field: "visceral_fat_rating", profileField: null, lowerIsBetter: true },
  ];

  return metrics.map((m) => {
    const current = avg(m.field);
    const baseline =
      m.profileField && profile?.[m.profileField] != null
        ? profile[m.profileField]
        : earliest?.[m.field] != null
        ? earliest[m.field]
        : null;
    const delta = current != null && baseline != null ? current - baseline : null;
    const favorable = delta != null ? (m.lowerIsBetter ? delta < 0 : delta > 0) : null;
    return { ...m, current, baseline, delta, favorable };
  });
}