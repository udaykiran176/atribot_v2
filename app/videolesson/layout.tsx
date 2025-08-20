"use client";

import type { PropsWithChildren } from "react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { VideoLessonFooter } from "./footer";
import { VideoLessonHeader } from "./header";
import { ExitModal } from "@/components/modals/exit-modal";
import { VideoLessonContext, type VideoLessonContextType } from "./context";

function VideoLessonContent({ children }: PropsWithChildren) {
  const [currentLesson, setCurrentLesson] = useState(1);
  const [totalLessons, setTotalLessons] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [challengeId, setChallengeId] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("challengeId");
    if (id) {
      setChallengeId(Number(id));
    } else {
      setChallengeId(null);
    }
  }, [searchParams]);

  const progress = totalLessons > 0 ? (currentLesson / totalLessons) * 100 : 0;

  const handlePrevious = () => {
    if (currentLesson > 1) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  const handleNext = async () => {
    if (isLoading) return;

    if (currentLesson < totalLessons) {
      setCurrentLesson(currentLesson + 1);
    } else if (currentLesson === totalLessons) {
      if (!challengeId) {
        console.error('Cannot complete lesson: missing challengeId from context. Ensure /videolesson?id=<challengeId> is used.');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch('/api/lesson-complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ challengeId }),
        });

        if (response.ok) {
          router.push('/completed');
        } else {
          const msg = await response.text().catch(() => '');
          console.error("Failed to update progress", msg);
          // TODO: Show an error toast to the user
        }
      } catch (error) {
        console.error("Error completing lesson:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const contextValue = {
    currentLesson,
    totalLessons,
    setCurrentLesson,
    setTotalLessons,
    challengeId,
    setChallengeId,
  };

  return (
    <VideoLessonContext.Provider value={contextValue}>
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        <VideoLessonHeader
          progress={progress}
          currentLesson={currentLesson}
          totalLessons={totalLessons}
        />

        <div className="flex-1 overflow-hidden">
          {children}
        </div>

        <VideoLessonFooter
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoPrevious={currentLesson > 1}
          canGoNext={currentLesson < totalLessons || (currentLesson === totalLessons && !isLoading)}
          isLastLesson={currentLesson === totalLessons}
        />

        <ExitModal />
      </div>
    </VideoLessonContext.Provider>
  );
}

const VideoLessonLayout = ({ children }: PropsWithChildren) => {
  return (
    <Suspense fallback={
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <VideoLessonContent>{children}</VideoLessonContent>
    </Suspense>
  );
};

export default VideoLessonLayout;
