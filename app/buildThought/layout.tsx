"use client";

import type { PropsWithChildren } from "react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { BuildThoughtFooter } from "./footer";
import { BuildThoughtHeader } from "./header";
import { ExitModal } from "@/components/modals/exit-modal";
import { BuildThoughtContext, type BuildThoughtContextType } from "./context";

function BuildThoughtContent({ children }: PropsWithChildren) {
  const [currentVideo, setCurrentVideo] = useState(1);
  const [totalVideos, setTotalVideos] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [challengeId, setChallengeId] = useState<number | null>(null);
  const [hasVideos, setHasVideos] = useState(true);
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

  const progress = totalVideos > 0 ? (currentVideo / totalVideos) * 100 : 0;

  const handlePrevious = () => {
    if (currentVideo > 1) {
      setCurrentVideo(currentVideo - 1);
    }
  };

  const handleNext = async () => {
    if (isLoading) return;

    if (currentVideo < totalVideos) {
      setCurrentVideo(currentVideo + 1);
    } else if (currentVideo === totalVideos) {
      if (!challengeId) {
        console.error('Cannot complete build thought: missing challengeId from context. Ensure /buildThought?challengeId=<challengeId> is used.');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch('/api/challenge-complete', {
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
        console.error("Error completing build thought:", error);
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
        <BuildThoughtHeader
          progress={progress}
          currentVideo={currentVideo}
          totalVideos={totalVideos}
        />

        <div className="flex-1 overflow-hidden">
          {children}
        </div>

        <BuildThoughtFooter
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoPrevious={currentVideo > 1}
          canGoNext={currentVideo < totalVideos || (currentVideo === totalVideos && !isLoading)}
          isLastVideo={currentVideo === totalVideos}
        />

        <ExitModal />
      </div>
    </BuildThoughtContext.Provider>
  );
}

const BuildThoughtLayout = ({ children }: PropsWithChildren) => {
  return (
    <Suspense fallback={
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <BuildThoughtContent>{children}</BuildThoughtContent>
    </Suspense>
  );
};

export default BuildThoughtLayout;
