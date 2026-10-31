"use client";

import { useId, type ReactNode } from "react";
import { ErrorText } from "./ErrorText";

type Props = {
  label: string;
  hint?: string;
  error?: string;
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
};

export function Field({ label, hint, error, children }: Props) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-err` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {hint ? (
        <p className="hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {children({ id, describedBy, invalid: Boolean(error) })}
      {error ? <ErrorText id={errorId}>{error}</ErrorText> : null}
    </div>
  );
}
