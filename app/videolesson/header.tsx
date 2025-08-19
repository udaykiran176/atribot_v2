"use client";

import { X } from "lucide-react";
import { useExitModal } from "@/store/use-exit-modal";

type Props = {
  progress: number; // 0-100
  currentLesson: number;
  totalLessons: number;
};

export function VideoLessonHeader({ progress, currentLesson, totalLessons }: Props) {
  const { open } = useExitModal();

  const handleClose = () => {
    open();
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 mx-6">
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
           
          </div>
        </div>
        <div className="text-xs font-medium text-gray-600">
              {currentLesson}/{totalLessons}
            </div>
      </div>
    </div>
  );
}