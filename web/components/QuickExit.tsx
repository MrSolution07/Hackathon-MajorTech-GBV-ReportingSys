"use client";

import { useEffect } from "react";
import { leaveSite, safetyLink } from "@/lib/copy";

export function QuickExit() {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      window.location.replace(leaveSite.href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="safety-bar">
      <a className="ghost bar-link" href={safetyLink.href}>
        {safetyLink.label}
      </a>
      <a
        className="leave bar-link"
        href={leaveSite.href}
        onClick={(event) => {
          event.preventDefault();
          window.location.replace(leaveSite.href);
        }}
      >
        {leaveSite.label}
      </a>
    </div>
  );
}
