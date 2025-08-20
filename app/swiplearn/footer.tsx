"use client";

import { Button } from "@/components/ui/button";

type FooterProps = {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLastCard: boolean;
};

export const SwipeLearnFooter = ({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  isLastCard,
}: FooterProps) => {
  return (
    <footer className="h-20 border-t-2 border-slate-200 px-6 bg-white">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between h-full">
        <Button
          variant="ghost"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="text-slate-500"
        >
          Previous
        </Button>
        <Button onClick={onNext} disabled={!canGoNext} size="lg">
          {isLastCard ? "Complete" : "Next"}
        </Button>
      </div>
    </footer>
  );
};
