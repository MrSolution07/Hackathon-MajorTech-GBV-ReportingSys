import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin · SafeStep",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{".orb{opacity:.28;filter:blur(56px)}"}</style>
      {children}
    </>
  );
}
