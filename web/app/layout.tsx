import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import { QuickExit } from "@/components/QuickExit";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "SafeStep",
  description: "Hold the record. See the pattern. Choose the next step.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body>
        <QuickExit />
        <div className="wash" aria-hidden="true">
          <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
        </div>
        {children}
      </body>
    </html>
  );
}
