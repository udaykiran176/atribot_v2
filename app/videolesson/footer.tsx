"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLastLesson: boolean;
};

export function VideoLessonFooter({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  isLastLesson,
}: Props) {
  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Previous Button */}
        <Button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          variant="outline"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </Button>

        {/* Next Button */}
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          variant={isLastLesson ? "primary" : "primary"}
        >
          <span>{isLastLesson ? "Complete" : "Next"}</span>
          {!isLastLesson && <ChevronRight className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}