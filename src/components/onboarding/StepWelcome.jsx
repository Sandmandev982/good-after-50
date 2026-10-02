import React from "react";
import { Button } from "@/components/ui/button";

export default function StepWelcome({ onNext }) {
  return (
    <div className="space-y-8 text-center">
      <img
        src="/icon-512.png"
        alt="Good After 50"
        className="mx-auto h-20 w-20 rounded-2xl"
      />
      <div className="space-y-3">
        <p className="text-xs font-heading font-semibold uppercase tracking-[0.25em] text-primary">
          Good After 50
        </p>
        <h1 className="text-3xl font-heading font-semibold leading-tight sm:text-4xl">
          Strong. Sharp. Significant.
        </h1>
        <p className="text-lg text-muted-foreground">
          A few numbers each day. Over the weeks, you'll see how your health is moving.
        </p>
        <p className="text-sm text-muted-foreground">Takes a few minutes a day.</p>
      </div>
      <Button size="lg" className="w-full" onClick={onNext}>
        Get started
      </Button>
    </div>
  );
}