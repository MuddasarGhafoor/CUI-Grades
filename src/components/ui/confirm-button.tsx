"use client";

import { useEffect, useState } from "react";
import { buttonClass } from "./button";

type ConfirmButtonProps = {
  label: string;
  confirmLabel: string;
  onConfirm: () => void;
  /**
   * ghost: plain text (default). outline: neutral bordered. danger: red bordered.
   * quiet / quiet-danger: small muted text for side actions; quiet-danger only turns red on hover.
   */
  variant?: "ghost" | "outline" | "danger" | "quiet" | "quiet-danger";
};

const QUIET_BASE = "inline-flex h-7 items-center rounded-md px-2 text-xs font-medium transition-colors";

const IDLE: Record<NonNullable<ConfirmButtonProps["variant"]>, string> = {
  ghost: buttonClass("ghost"),
  outline: buttonClass("secondary"),
  danger: `${buttonClass("danger")} border border-err/40`,
  // Written out in full (not on top of buttonClass) so no two text sizes or hover colours clash.
  quiet: `${QUIET_BASE} text-muted hover:bg-surface-2 hover:text-fg`,
  "quiet-danger": `${QUIET_BASE} text-muted hover:bg-err/10 hover:text-err`,
};

const QUIET = new Set(["quiet", "quiet-danger"]);

const ARMED = `${buttonClass("danger")} border border-err/60 bg-err/10`;
const ARMED_QUIET = `${QUIET_BASE} bg-err/10 text-err`;

/** First click arms the button, second click within 3 seconds confirms. No popup needed. */
export function ConfirmButton({ label, confirmLabel, onConfirm, variant = "ghost" }: ConfirmButtonProps) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(timer);
  }, [armed]);

  return (
    <button
      type="button"
      onClick={() => {
        if (armed) {
          setArmed(false);
          onConfirm();
        } else {
          setArmed(true);
        }
      }}
      onBlur={() => setArmed(false)}
      className={armed ? (QUIET.has(variant) ? ARMED_QUIET : ARMED) : IDLE[variant]}
    >
      {armed ? confirmLabel : label}
    </button>
  );
}
