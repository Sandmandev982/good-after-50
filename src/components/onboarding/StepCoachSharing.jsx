import React, { useState } from "react";
import { Eye, PencilOff, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import BackLink from "./BackLink";

const POINTS = [
  { icon: Eye, text: "They can see what you log." },
  { icon: PencilOff, text: "They can't change it." },
  { icon: Users, text: "Only your coaches. No one else." },
];

export default function StepCoachSharing({ agreed, onAgreedChange, onDecide, onBack }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-heading font-semibold">
          Your coaches can see your numbers
        </h1>
        <p className="text-muted-foreground">
          Your Good After 50 coaches review your check-ins so they can work with you on your
          progress.
        </p>
      </div>

      <div className="space-y-3">
        {POINTS.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3">
            <Icon size={18} strokeWidth={2} className="shrink-0 text-primary" />
            <span>{text}</span>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
        <Checkbox
          id="coach-sharing-agree"
          checked={agreed}
          onCheckedChange={(v) => onAgreedChange(Boolean(v))}
          className="mt-0.5"
        />
        <label htmlFor="coach-sharing-agree" className="cursor-pointer text-sm">
          I agree to let my coaches see my numbers.
        </label>
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={() => (agreed ? onDecide(true) : setDialogOpen(true))}
      >
        I agree
      </Button>
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        className="mx-auto block text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        Not now
      </button>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <Users size={28} strokeWidth={2} className="text-primary" />
            <AlertDialogTitle>Keep your numbers private?</AlertDialogTitle>
            <AlertDialogDescription>
              Your coaches use your check-ins to track your progress and keep you accountable.
              Without access to your numbers, we can't provide that level of support.
            </AlertDialogDescription>
            <AlertDialogDescription>
              The choice is always yours. You can change it anytime in Profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => onDecide(true)}>
              Share with my coaches
            </AlertDialogAction>
            <AlertDialogCancel onClick={() => onDecide(false)}>Keep private</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BackLink onClick={onBack} />
    </div>
  );
}