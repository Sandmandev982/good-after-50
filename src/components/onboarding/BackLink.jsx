import React from "react";

// Subtle backwards navigation used on the middle walkthrough steps.
export default function BackLink({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-auto block text-sm text-muted-foreground underline-offset-4 hover:underline"
    >
      Back
    </button>
  );
}