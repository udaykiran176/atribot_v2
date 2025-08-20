"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useExitModal } from "@/store/use-exit-modal";

type Props = {
  progress: number;
  currentCard: number;
  totalCards: number;
};

export function SwipeCardsHeader({ progress, currentCard, totalCards }: Props) {
  const { open } = useExitModal();

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Exit Button */}
        <Button
          onClick={open}
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Progress Section */}
        <div className="flex-1 mx-6">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card Counter */}
        <div className="text-xs font-medium text-gray-600">
          <p>Card <span className="font-semibold">{currentCard}</span>/{totalCards}</p>
        </div>
      </div>
    </div>
  );
}
