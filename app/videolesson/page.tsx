"use client";

import { Suspense, useState, useEffect } from "react";
import { VideoPlayer } from "./video-player";
import { useVideoLessonContext } from "./context";

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

function VideoLessonContent() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setTotalLessons, setCurrentLesson, challengeId, setHasLessons } = useVideoLessonContext();

  useEffect(() => {
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
          setHasLessons(true);
        } else {
          setHasLessons(false);
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
        setError("Failed to load video lessons");
        setLessons([]);
        setHasLessons(false);
      } finally {
        setLoading(false);
      }
    }

    if (challengeId) {
      fetchLessons();
    }
  }, [challengeId, setTotalLessons, setCurrentLesson]);

  return <VideoPlayer lessons={lessons} loading={loading} error={error} />;
}

export default function VideoLessonPage({ searchParams }: Props) {
  const { challengeId, setChallengeId } = useVideoLessonContext();

  // Set the challenge ID from search params if available
  useEffect(() => {
    async function handleSearchParams() {
      const params = await searchParams;
      if (params?.id && !challengeId) {
        const id = parseInt(params.id, 10);
        if (!isNaN(id)) {
          setChallengeId(id);
        }
      }
    }
    
    handleSearchParams();
  }, [searchParams, challengeId, setChallengeId]);

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading video lessons...</div>
      </div>
    }>
      <div className="flex items-center justify-center lg:h-full">
        <VideoLessonContent />
      </div>
    </Suspense>
  );
}