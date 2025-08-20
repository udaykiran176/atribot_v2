"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWindowSize } from "react-use";

import { SwipeLearnFooter } from "./footer";
import { SwipeLearnHeader } from "./header";
import { ExitModal } from "@/components/modals/exit-modal";
import { SwipeLearnContext } from "./context";

const SwipeLearnLayout = ({ children }: PropsWithChildren) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalCards, setTotalCards] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [challengeId, setChallengeId] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();
  const { width, height } = useWindowSize();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setChallengeId(Number(id));
    }
  }, [searchParams]);

  const progress = totalCards > 0 ? ((currentIndex + 1) / totalCards) * 100 : 0;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = async () => {
    if (isLoading) return;

    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (currentIndex === totalCards - 1) {
      if (!challengeId) {
        console.error('Cannot complete: missing challengeId.');
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch('/api/swipe-card-complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ challengeId }),
        });

        if (response.ok) {
          setShowConfetti(true);
          setTimeout(() => {
            router.push('/completed');
          }, 2000);
        } else {
          const msg = await response.text().catch(() => '');
          console.error("Failed to update progress", msg);
          // TODO: Show an error toast to the user
        }
      } catch (error) {
        console.error("Error completing challenge:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const contextValue = {
    currentIndex,
    totalCards,
    challengeId,
    setCurrentIndex,
    setTotalCards,
    setChallengeId,
  };

  return (
    <SwipeLearnContext.Provider value={contextValue}>
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        <SwipeLearnHeader
          progress={progress}
          currentCard={currentIndex + 1}
          totalCards={totalCards}
        />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
        <SwipeLearnFooter
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoPrevious={currentIndex > 0}
          canGoNext={currentIndex < totalCards}
          isLastCard={currentIndex === totalCards - 1 && totalCards > 0}
        />
        <ExitModal />
      </div>
    </SwipeLearnContext.Provider>
  );
};

export default SwipeLearnLayout;
