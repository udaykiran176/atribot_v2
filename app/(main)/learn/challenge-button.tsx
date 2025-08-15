"use client";

import { PlayCircle, SquareStack, Gamepad2, Hammer, CircleHelp, Check } from "lucide-react";

type Challenge = {
  id: number;
  type: string;
  title: string | null;
  description: string | null;
  order: number | null;
  content: string | null;
  isCompleted?: boolean | null;
};

type ChallengeButtonProps = {
  challenge: Challenge;
  index: number;
  isCompleted: boolean;
  isCurrent: boolean;
  locked: boolean;
  rightPosition: number;
};

const typeIcon = (type?: string) => {
  const t = (type || "").toLowerCase();
  if (t.includes("video")) return PlayCircle;
  if (t.includes("swipe") || t.includes("card")) return SquareStack;
  if (t.includes("game")) return Gamepad2;
  if (t.includes("build")) return Hammer;
  if (t.includes("quiz") || t.includes("test")) return CircleHelp;
  return CircleHelp;
};

export default function ChallengeButton({
  challenge,
  index,
  isCompleted,
  isCurrent,
  locked,
  rightPosition,
}: ChallengeButtonProps) {
  const Icon = typeIcon(challenge.type);

  const base = "h-[70px] w-[70px] rounded-full border-b-10 flex items-center justify-center shadow-sm";
  const state = locked
    ? "bg-neutral-200 border-b-neutral-300 text-neutral-400"
    : isCompleted
    ? "bg-emerald-500 border-b-emerald-700 text-emerald-50"
    : "bg-blue-500 border-b-blue-700 text-blue-50";

  return (
    <div 
      key={challenge.id} 
      className="relative w-full select-none" 
      style={{ marginTop: isCurrent && index === 0 ? 60 : 0 }}
    >
      <div className="relative mx-auto flex w-full justify-center">
        <div 
          className="relative flex flex-col items-center" 
          style={{ transform: `translateX(${rightPosition}px)` }}
        >
          {isCurrent && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-xl border bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-600 shadow animate-bounce">
              Start
            </div>
          )}
          <div className={`${base} ${state}`} aria-disabled={locked}>
            {isCompleted ? (
              <Check className="h-10 w-10" />
            ) : (
              <Icon className="h-10 w-10" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
