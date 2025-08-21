"use client";

import type { PropsWithChildren } from "react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { BuildThoughtFooter } from "./footer";
import { BuildThoughtHeader } from "./header";
import { ExitModal } from "@/components/modals/exit-modal";
import { BuildThoughtContext } from "./context";

function BuildThoughtContent({ children }: PropsWithChildren) {
  const [currentVideo, setCurrentVideo] = useState(1);
  const [totalVideos, setTotalVideos] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [challengeId, setChallengeId] = useState<number | null>(null);
  const [hasVideos, setHasVideos] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("challengeId") || searchParams.get("id");
    if (id) setChallengeId(Number(id)); else setChallengeId(null);
  }, [searchParams]);

  // Auto-enter fullscreen on load
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (e) {
        console.warn("Auto fullscreen request (BuildThought) was blocked or failed", e);
      }
    };
    enterFullscreen();
  }, []);

  const progress = totalVideos > 0 ? (currentVideo / totalVideos) * 100 : 0;

  const handlePrevious = () => {
    if (currentVideo > 1) setCurrentVideo(currentVideo - 1);
  };

  const handleNext = async () => {
    if (isLoading) return;
    if (currentVideo < totalVideos) {
      setCurrentVideo(currentVideo + 1);
    } else if (currentVideo === totalVideos) {
      if (!challengeId) {
        console.error('Cannot complete: missing challengeId. Ensure /buildThought?challengeId=<id> is used.');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const r = await fetch('/api/challenge-complete', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ challengeId })
        });
        if (!r.ok) console.error('Failed to mark challenge complete');
        // Award 20 XP via completed page
        const params = new URLSearchParams({ xp: '20', challengeId: String(challengeId) });
        router.push(`/completed?${params.toString()}`);
      } catch (e) {
        console.error('Error completing BuildThought:', e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const contextValue = {
    currentVideo,
    totalVideos,
    setCurrentVideo,
    setTotalVideos,
    challengeId,
    setChallengeId,
    hasVideos,
    setHasVideos,
  };

  return (
    <BuildThoughtContext.Provider value={contextValue}>
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        <BuildThoughtHeader progress={progress} currentVideo={currentVideo} totalVideos={totalVideos} />
        <div className="flex-1 overflow-hidden">{children}</div>
        <BuildThoughtFooter
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoPrevious={currentVideo > 1}
          canGoNext={currentVideo < totalVideos || (currentVideo === totalVideos && !isLoading)}
          isLastVideo={currentVideo === totalVideos}
          isLoading={isLoading}
        />
        <ExitModal />
      </div>
    </BuildThoughtContext.Provider>
  );
}

const BuildThoughtLayout = ({ children }: PropsWithChildren) => {
  return (
    <Suspense fallback={<div className="h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
      <BuildThoughtContent>{children}</BuildThoughtContent>
    </Suspense>
  );
};

export default BuildThoughtLayout;
