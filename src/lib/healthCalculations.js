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