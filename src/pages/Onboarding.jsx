import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { useWeeklyFocus } from "@/hooks/useWeeklyFocus";
import { BASELINE_NUMBER_KEYS } from "@/components/BaselineNumberFields";
import ProgressSteps from "@/components/onboarding/ProgressSteps";
import StepWelcome from "@/components/onboarding/StepWelcome";
import StepWhatYouNeed from "@/components/onboarding/StepWhatYouNeed";
import StepCoachSharing from "@/components/onboarding/StepCoachSharing";
import StepBaseline from "@/components/onboarding/StepBaseline";
import StepFirstCheckIn from "@/components/onboarding/StepFirstCheckIn";

export default function Onboarding() {
  const { profile, loading, saveProfile } = useProfile();
  const { saveFocus: saveWeeklyFocus } = useWeeklyFocus();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [agreed, setAgreed] = useState(true);
  const [coachSharing, setCoachSharing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    height: "",
    height_unit: "in",
    starting_weight: "",
    starting_waist: "",
    ...Object.fromEntries(BASELINE_NUMBER_KEYS.map((k) => [k, ""])),
    focus_of_the_week: "",
  });

  // Only leave the walkthrough when a profile already existed the first time
  // this page loaded — never mid-walkthrough after the baseline step saves.
  const hadProfileOnLoad = useRef(null);

  useEffect(() => {
    if (loading || hadProfileOnLoad.current !== null) return;
    hadProfileOnLoad.current = Boolean(profile);
    if (profile) navigate("/", { replace: true });
  }, [loading, profile, navigate]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const decideSharing = (value) => {
    setCoachSharing(value);
    setAgreed(value);
    setStep(3);
  };

  async function saveBaseline(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        height: form.height ? Number(form.height) : undefined,
        height_unit: form.height_unit,
        starting_weight: form.starting_weight ? Number(form.starting_weight) : undefined,
        starting_waist: form.starting_waist ? Number(form.starting_waist) : undefined,
        ...Object.fromEntries(
          BASELINE_NUMBER_KEYS.map((k) => [k, form[k] ? Number(form[k]) : undefined])
        ),
        coach_sharing: coachSharing,
        coach_sharing_updated_at: new Date().toISOString(),
      };
      await saveProfile(data);
      if (form.focus_of_the_week) {
        await saveWeeklyFocus(form.focus_of_the_week);
      }
      toast({ title: "Profile created", description: "Welcome to Good After 50." });
      setStep(4);
    } catch (err) {
      toast({ title: "Could not save", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="theme-light min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="theme-light min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-6 pt-5">
        <div className="sticky top-0 z-10 -mx-4 mb-4 bg-background px-4 pb-3">
          <ProgressSteps current={step} />
        </div>

        <div className="flex flex-1 flex-col justify-center">
          {step === 0 && <StepWelcome onNext={() => setStep(1)} />}
          {step === 1 && (
            <StepWhatYouNeed onNext={() => setStep(2)} onBack={() => setStep(0)} />
          )}
          {step === 2 && (
            <StepCoachSharing
              agreed={agreed}
              onAgreedChange={setAgreed}
              onDecide={decideSharing}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <StepBaseline
              form={form}
              set={set}
              saving={saving}
              onSubmit={saveBaseline}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && <StepFirstCheckIn onStart={() => navigate("/log")} />}
        </div>
      </div>
    </div>
  );
}