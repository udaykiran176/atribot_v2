"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useBuildThoughtContext } from "./context";
import { useEffect, useRef } from "react";

type BuildItThoughtVideo = {
  id: number;
  challengeId: number;
  videoUrl: string;
  order: number;
  createdAt: Date;
};

export function VideoPlayer({ videos, loading, error }: { videos: BuildItThoughtVideo[]; loading: boolean; error: string | null }) {
  const router = useRouter();
  const { currentVideo } = useBuildThoughtContext();
  const currentVideoData = videos[currentVideo - 1];
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleBackToChallenges = () => {
    router.push("/learn");
  };

  // Force video to play on mobile devices
  useEffect(() => {
    if (videoRef.current && currentVideoData) {
      const video = videoRef.current;
      
      const playVideo = async () => {
        try {
          // Reset video source to force reload
          video.load();
          
          // Wait a bit for the video to load
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Attempt to play
          await video.play();
        } catch (error) {
          console.log("Video autoplay failed:", error);
          // On mobile, user interaction might be required
        }
      };

      playVideo();
    }
  }, [currentVideoData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-gray-500">Loading build thought videos...</div>
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

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">No Build Thought Videos Available</h2>
        <p className="text-gray-500 text-center max-w-md">
          There are no build thought videos available for this challenge yet.
        </p>
        <Button onClick={handleBackToChallenges} variant="outline">
          Back to Challenges
        </Button>
      </div>
    );
  }

  if (!currentVideoData) {
    return (
      <div className="text-center text-gray-500">
        No build thought video available
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <div>
        {/* Video Player */}
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            key={currentVideoData.id}
            className="w-full h-full"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            controls={false}
            webkit-playsinline="true"
            x5-video-player-type="h5"
            x5-video-player-fullscreen="true"
            x5-video-orientation="portraint"
            poster=""
            src={currentVideoData.videoUrl}
            onLoadStart={() => console.log('Video load started')}
            onCanPlay={() => console.log('Video can play')}
            onError={(e) => console.error('Video error:', e)}
          >
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* Video Info */}
        <div className="p-4 lg:hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Step {currentVideoData.order}
            </h2>
          </div>
        
        </div>
      </div>
    </div>
  );
}
