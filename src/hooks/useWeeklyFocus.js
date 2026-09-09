import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";

// Monday-based start of the current week as a local YYYY-MM-DD date string.
export function currentWeekStart(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay(); // 0 = Sun .. 6 = Sat
  const diff = day === 0 ? -6 : 1 - day; // shift back to Monday
  d.setDate(d.getDate() + diff);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

// Per-week historical Focus of the Week records. Saving always appends a new
// record for the current week rather than overwriting a single value.
export function useWeeklyFocus() {
  const [currentFocus, setCurrentFocus] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const weekStart = currentWeekStart();
      const items = await base44.entities.WeeklyFocus.filter(
        { week_start_date: weekStart },
        "-created_date",
        1
      );
      setCurrentFocus(items && items.length > 0 ? items[0].focus_text || "" : "");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveFocus = useCallback(
    async (focus_text) => {
      const saved = await base44.entities.WeeklyFocus.create({
        week_start_date: currentWeekStart(),
        focus_text: focus_text || undefined,
      });
      setCurrentFocus(focus_text || "");
      return saved;
    },
    []
  );

  return { currentFocus, loading, saveFocus, reload: load };
}