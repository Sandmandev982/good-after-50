import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";

// Loads the current user's single Profile record (RLS scopes to own records).
// A user has at most one Profile: create if none, update if it exists.
export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const items = await base44.entities.Profile.list("-created_date", 1);
      setProfile(items && items.length > 0 ? items[0] : null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveProfile = useCallback(
    async (data) => {
      let saved;
      if (profile?.id) {
        saved = await base44.entities.Profile.update(profile.id, data);
      } else {
        saved = await base44.entities.Profile.create(data);
      }
      setProfile(saved);
      return saved;
    },
    [profile]
  );

  return { profile, loading, saveProfile, reload: load };
}