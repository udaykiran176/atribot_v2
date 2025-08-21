"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useVideoLessonContext } from "./context";

type Lesson = {
  id: number;
  title: string;
  description: string | null;
  videoUrl: string;
  order?: number;
  duration?: string;
};

export function VideoPlayer({ lessons, loading, error }: { lessons: Lesson[]; loading: boolean; error: string | null }) {
  const router = useRouter();
  const { currentLesson } = useVideoLessonContext();
  const currentLessonData = lessons[currentLesson - 1];

  const handleBackToChallenges = () => {
    router.push("/learn");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-gray-500">Loading video lessons...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-gray-500">{error}</p>
        <Button onClick={handleBackToChallenges} variant="outline">
          Back to Challenges
        </Button>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">No Video Lessons Available</h2>
        <p className="text-gray-500 text-center max-w-md">
          There are no video lessons available for this challenge yet.
        </p>
        <Button onClick={handleBackToChallenges} variant="outline">
          Back to Challenges
        </Button>
      </div>
    );
  }

  if (!currentLessonData) {
    return (
      <div className="text-center text-gray-500">
        No video lesson available
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <div>
        {/* Video Player */}
        <div className="relative aspect-video bg-black">
          <video
            key={currentLessonData.id}
            className="w-full h-full"
            controls
            autoPlay
            src={currentLessonData.videoUrl}
          >
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* Video Info */}
        <div className="p-4 ">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {currentLessonData.title}
            </h2>
          </div>
          
          {currentLessonData.description && (
            <p className="text-gray-600 leading-relaxed">
              {currentLessonData.description}
            </p>
          )}
          
          {currentLessonData.duration && (
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="mr-2">⏱️</span>
              <span>Duration: {currentLessonData.duration}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
