import type { ReactNode } from "react";

export function ErrorIcon() {
  return (
    <svg className="err-icon" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 6v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="14" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function ErrorText({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p className="err" id={id} role="alert">
      <ErrorIcon />
      <span>{children}</span>
    </p>
  );
}
