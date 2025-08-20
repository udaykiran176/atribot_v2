import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import { ExitModal } from "@/components/modals/exit-modal";
import { HeartsModal } from "@/components/modals/hearts-modal";
import { PracticeModal } from "@/components/modals/practice-modal";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from '@vercel/analytics/next';

const font = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AtriBot",
  description: "AtriBot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.variable}`}>
        <SpeedInsights />
        <Analytics />
        {children}
        <Toaster />
        <ExitModal />
        <HeartsModal />
        <PracticeModal />
      </body>
    </html>
  );
}
