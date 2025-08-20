"use client";

import { Suspense, useState, useEffect } from "react";
import { VideoPlayer } from "./video-player";
import { useBuildThoughtContext } from "./context";

type Props = {
  searchParams: Promise<{
    id?: string;
  }>;
};

type BuildItThoughtVideo = {
  id: number;
  challengeId: number;
  videoUrl: string;
  order: number;
  createdAt: Date;
};

function BuildThoughtContent() {
  const [videos, setVideos] = useState<BuildItThoughtVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setTotalVideos, setCurrentVideo, challengeId, setHasVideos } = useBuildThoughtContext();

  useEffect(() => {
    async function fetchVideos() {
      if (!challengeId || isNaN(challengeId)) {
        setError("Invalid challenge ID");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/build-it-thought?challengeId=${challengeId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }
        
        const fetchedVideos = await response.json();
        setVideos(fetchedVideos || []);
        
        // Update the layout context with actual video count
        if (fetchedVideos && fetchedVideos.length > 0) {
          setTotalVideos(fetchedVideos.length);
          setCurrentVideo(1);
          setHasVideos(true);
        } else {
          setHasVideos(false);
        }
      } catch (error) {
        console.error("Error fetching build it thought videos:", error);
        setError("Failed to load build it thought videos");
        setVideos([]);
        setHasVideos(false);
      } finally {
        setLoading(false);
      }
    }

    if (challengeId) {
      fetchVideos();
    }
  }, [challengeId, setTotalVideos, setCurrentVideo]);

  return <VideoPlayer videos={videos} loading={loading} error={error} />;
}

export default function BuildThoughtPage({ searchParams }: Props) {
  const { challengeId, setChallengeId } = useBuildThoughtContext();

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
        <div className="text-gray-500">Loading build thought videos...</div>
      </div>
    }>
      <div className="flex items-center justify-center lg:h-full">
        <BuildThoughtContent />
      </div>
    </Suspense>
  );
}
