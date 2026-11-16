"use client";

import { useEffect, useState } from "react";
import { buttonClass } from "./button";

type ConfirmButtonProps = {
  label: string;
  confirmLabel: string;
  onConfirm: () => void;
};

/** First click arms the button, second click within 3 seconds confirms. No popup needed. */
export function ConfirmButton({ label, confirmLabel, onConfirm }: ConfirmButtonProps) {
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
      className={`${buttonClass(armed ? "danger" : "ghost", "sm")} ${armed ? "bg-err/10" : ""}`}
    >
      {armed ? confirmLabel : label}
    </button>
  );
}
