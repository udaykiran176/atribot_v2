"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuizContext } from "./context";

type Props = {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
  selectedAnswer: number | null;
};

export function QuizFooter({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  isLastQuestion,
  selectedAnswer,
}: Props) {
  const { hasQuestions } = useQuizContext();

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Previous Button */}
        <Button
          onClick={onPrevious}
          disabled={!canGoPrevious || !hasQuestions}
          variant="outline"
          className="py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base font-semibold rounded-xl border-2 hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Previous</span>
        </Button>

        {/* Next Button */}
        <Button
          onClick={onNext}
          disabled={!canGoNext || !hasQuestions || selectedAnswer === null}
          variant={isLastQuestion ? "primary" : "primary"}
          className={`py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base font-semibold rounded-xl transition-all duration-200 hover:shadow-lg ${
            selectedAnswer === null 
              ? "opacity-50 cursor-not-allowed" 
              : isLastQuestion 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <span>{isLastQuestion ? "Complete Quiz" : "Next"}</span>
          {!isLastQuestion && <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />}
        </Button>
      </div>
    </div>
  );
}
