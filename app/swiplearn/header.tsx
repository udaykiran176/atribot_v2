"use client";

import { Progress } from "@/components/ui/progress";
import { useExitModal } from "@/store/use-exit-modal";
import { X } from "lucide-react";

type HeaderProps = {
  progress: number;
  currentCard: number;
  totalCards: number;
};

export const SwipeLearnHeader = ({ progress, currentCard, totalCards }: HeaderProps) => {
  const { open } = useExitModal();

  return (
    <header className="h-20 w-full border-b-2 border-slate-200 px-6 bg-white">
      <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
        <button
          onClick={open}
          className="text-slate-500 hover:opacity-75 transition"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="flex-1 mx-4">
          <Progress value={progress} className="h-3" />
        </div>
        <div className="text-slate-500 font-semibold">
          Card {currentCard} / {totalCards}
        </div>
      </div>
    </header>
  );
};
