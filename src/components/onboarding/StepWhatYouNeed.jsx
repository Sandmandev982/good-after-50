import React from "react";
import { Weight, Gauge, Droplet, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";
import BackLink from "./BackLink";

const ITEMS = [
  {
    icon: Weight,
    title: "Bathroom scale",
    line: "A body-composition scale also gives body fat and muscle.",
  },
  { icon: Gauge, title: "Blood pressure cuff", line: "An at-home arm cuff works." },
  { icon: Droplet, title: "Glucose and ketone meter", line: "One meter that reads both." },
  { icon: Footprints, title: "Phone or step counter", line: "For steps and walking." },
];

export default function StepWhatYouNeed({ onNext, onBack }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-heading font-semibold">What you'll need</h1>
        <p className="text-muted-foreground">Have these nearby when you check in.</p>
      </div>
      <div className="space-y-3">
        {ITEMS.map(({ icon: Icon, title, line }) => (
          <div key={title} className="flex items-start gap-3 rounded-xl border bg-card p-4">
            <Icon size={22} strokeWidth={2} className="mt-0.5 shrink-0 text-primary" />
            <div className="space-y-0.5">
              <p className="font-medium">{title}</p>
              <p className="text-sm text-muted-foreground">{line}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Missing something? Start with what you have.
      </p>
      <Button size="lg" className="w-full" onClick={onNext}>
        Next
      </Button>
      <BackLink onClick={onBack} />
    </div>
  );
}