"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeCardsContext } from "./context";

type Props = {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLastCard: boolean;
};

export function SwipeCardsFooter({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  isLastCard,
}: Props) {
  const { hasCards } = useSwipeCardsContext();

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Previous Button */}
        <Button
          onClick={onPrevious}
          disabled={!canGoPrevious || !hasCards}
          variant="outline"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </Button>

        {/* Next Button */}
        <Button
          onClick={onNext}
          disabled={!canGoNext || !hasCards}
          variant={isLastCard ? "primary" : "primary"}
        >
          <span>{isLastCard ? "Complete" : "Next"}</span>
          {!isLastCard && <ChevronRight className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}
