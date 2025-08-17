"use client";

import { Check, CircleHelp } from "lucide-react";
import { FaVideo,FaTools  } from "react-icons/fa";
import { MdSwipeLeft } from "react-icons/md";
import { FaQuestion } from "react-icons/fa";
import { IoGameController } from "react-icons/io5";



import { Button } from "@/components/ui/button";

type Challenge = {
  id: number;
  type: string;
  title: string | null;
  description: string | null;
  imageSrc: string | null;
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
  if (t.includes("video")) return FaVideo;
  if (t.includes("swipe") || t.includes("card")) return MdSwipeLeft;
  if (t.includes("game")) return IoGameController;
  if (t.includes("build")) return FaTools;
  if (t.includes("quiz") || t.includes("test")) return FaQuestion;
  return CircleHelp;
};

const getVariantForChallenge = (type?: string) => {
  const t = (type || "").toLowerCase();
  if (t.includes("video")) return "video";
  if (t.includes("game")) return "game";
  if (t.includes("build")) return "build";
  if (t.includes("quiz") || t.includes("test")) return "quiz";
  if (t.includes("swipe") || t.includes("card")) return "defaultChallenge";
  return "defaultChallenge";
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

  const base = `relative h-[70px] w-[70px] border-b-8 shadow-[0_8px_0_rgba(0,0,0,0.2),0_8px_0_var(--path-level-color)] 
    before:content-[''] before:absolute before:left-0 before:w-full before:z-[-1] before:bg-[linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.2)),linear-gradient(var(--path-level-color),var(--path-level-color))] 
    before:h-2 before:top-[28.5px] after:content-[''] after:absolute after:left-0 after:w-full after:z-[-1]`;

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
          {isCurrent ? (
            <div>
              <div className="absolute -top-10 left-0 z-10 animate-bounce rounded-xl border-2 bg-white px-3 py-2.5 font-bold uppercase tracking-wide text-blue-500">
                Start
                <div
                  className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 transform border-x-8 border-t-8 border-x-transparent"
                  aria-hidden
                />
              </div>
              <Button
                size="rounded"
                variant={getVariantForChallenge(challenge.type)}
                className={base}
              >
                {isCompleted ? (
                  <Check className="h-10 w-5 fill-primary-foreground text-primary-foreground fill-none stroke-[4]" />
                ) : (
                  <Icon className="w-10 h-10" />
                )}
              </Button>
            </div>
          ) : (
            <Button
              size="rounded"
              variant={getVariantForChallenge(challenge.type)}
              className={base}
            >
              {isCompleted ? (
                <Check className="h-10 w-10 fill-primary-foreground text-primary-foreground fill-none stroke-[4]" />
              ) : (
                <Icon className="w-10 h-10" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
