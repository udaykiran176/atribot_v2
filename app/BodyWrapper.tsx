"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { ExitModal } from "@/components/modals/exit-modal";
import { HeartsModal } from "@/components/modals/hearts-modal";
import { PracticeModal } from "@/components/modals/practice-modal";

export function BodyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <body suppressHydrationWarning>
      <SpeedInsights />
      <Analytics />
      {children}
      <Toaster />
      <ExitModal />
      <HeartsModal />
      <PracticeModal />
    </body>
  );
}
