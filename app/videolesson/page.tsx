"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useVideoLessonContext } from "./layout";

type Props = {
  searchParams: Promise<{
    id?: string;
  }>;
};

type Lesson = {
  id: number;
  title: string;
  description: string | null;
  videoUrl: string;
  order?: number;
  duration?: string;
};

export default function VideoLessonPage({ searchParams }: Props) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setTotalLessons, setCurrentLesson, currentLesson, setChallengeId } = useVideoLessonContext();

  const resolvedSearchParams = use(searchParams);
  const challengeId = resolvedSearchParams?.id ? parseInt(resolvedSearchParams.id, 10) : null;

  useEffect(() => {
    // persist challengeId into context so footer/layout can complete with correct id
    if (challengeId && !isNaN(challengeId)) {
      setChallengeId(challengeId);
    } else {
      setChallengeId(null);
    }

    async function fetchLessons() {
      if (!challengeId || isNaN(challengeId)) {
        setError("Invalid challenge ID");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/video-lessons?challengeId=${challengeId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch lessons");
        }
        
        const fetchedLessons = await response.json();
        setLessons(fetchedLessons || []);
        
        // Update the layout context with actual lesson count
        if (fetchedLessons && fetchedLessons.length > 0) {
          setTotalLessons(fetchedLessons.length);
          setCurrentLesson(1);
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
        setError("Failed to load video lessons");
        setLessons([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLessons();
  }, [challengeId, setTotalLessons, setCurrentLesson, setChallengeId]);

  const handleBackToChallenges = () => {
    router.push("/learn");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading video lessons...</div>
      </div>
    );
  }

  if (!challengeId || isNaN(challengeId) || error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-gray-500">{error || "Invalid challenge ID"}</p>
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

  // Get current lesson based on currentLesson index
  const currentLessonData = lessons[currentLesson - 1];

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-4xl">
        {currentLessonData ? (
          <div >
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
            <div className="p-4 lg:hidden">
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
        ) : (
          <div className="text-center text-gray-500">
            No video lesson available
          </div>
        )}
      </div>
    </div>
  );
}