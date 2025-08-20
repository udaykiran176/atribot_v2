"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useVideoLessonContext } from "./context";

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
  const { hasLessons } = useVideoLessonContext();

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Previous Button */}
        <Button
          onClick={onPrevious}
          disabled={!canGoPrevious || !hasLessons}
          variant="outline"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </Button>

        {/* Next Button */}
        <Button
          onClick={onNext}
          disabled={!canGoNext || !hasLessons}
          variant={isLastLesson ? "primary" : "primary"}
        >
          <span>{isLastLesson ? "Complete" : "Next"}</span>
          {!isLastLesson && <ChevronRight className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}