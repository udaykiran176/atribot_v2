"use client";

type Props = {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLastVideo: boolean;
  isLoading?: boolean;
};

export function BuildThoughtFooter({ onPrevious, onNext, canGoPrevious, canGoNext, isLastVideo, isLoading }: Props) {
  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={onNext}
          disabled={!canGoNext || isLoading}
          className={`px-4 py-2 rounded-md ${isLastVideo ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white disabled:opacity-50`}
        >
          {isLastVideo ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
}
