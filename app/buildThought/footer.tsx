"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBuildThoughtContext } from "./context";

type Props = {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLastVideo: boolean;
};

export function BuildThoughtFooter({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  isLastVideo,
}: Props) {
  const { hasVideos } = useBuildThoughtContext();

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Previous Button */}
        <Button
          onClick={onPrevious}
          disabled={!canGoPrevious || !hasVideos}
          variant="outline"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </Button>

        {/* Next Button */}
        <Button
          onClick={onNext}
          disabled={!canGoNext || !hasVideos}
          variant={isLastVideo ? "primary" : "primary"}
        >
          <span>{isLastVideo ? "Complete" : "Next"}</span>
          {!isLastVideo && <ChevronRight className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}
