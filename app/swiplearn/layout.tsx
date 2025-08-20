"use client";

import type { PropsWithChildren } from "react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { SwipeCardsFooter } from "./footer";
import { SwipeCardsHeader } from "./header";
import { ExitModal } from "@/components/modals/exit-modal";
import { SwipeCardsContext, type SwipeCardsContextType, type SwipeCard } from "./context";

function SwipeCardsContent({ children }: PropsWithChildren) {
  const [currentCard, setCurrentCard] = useState(1);
  const [totalCards, setTotalCards] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [challengeId, setChallengeId] = useState<number | null>(null);
  const [cards, setCards] = useState<SwipeCard[]>([]);
  const [hasCards, setHasCards] = useState(true);
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

  const progress = totalCards > 0 ? (currentCard / totalCards) * 100 : 0;

  const handlePrevious = () => {
    if (currentCard > 1) {
      setCurrentCard(currentCard - 1);
    }
  };

  const handleNext = async () => {
    if (isLoading) return;

    if (currentCard < totalCards) {
      setCurrentCard(currentCard + 1);
    } else if (currentCard === totalCards) {
      if (!challengeId) {
        console.error('Cannot complete cards: missing challengeId from context. Ensure /swiplearn?challengeId=<challengeId> is used.');
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
        }
      } catch (error) {
        console.error("Error completing cards:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const contextValue = {
    currentCard,
    totalCards,
    setCurrentCard,
    setTotalCards,
    challengeId,
    setChallengeId,
    cards,
    setCards,
    hasCards,
    setHasCards,
  };

  return (
    <SwipeCardsContext.Provider value={contextValue}>
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        <SwipeCardsHeader
          progress={progress}
          currentCard={currentCard}
          totalCards={totalCards}
        />

        <div className="flex-1 overflow-hidden">
          {children}
        </div>

        <SwipeCardsFooter
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoPrevious={currentCard > 1}
          canGoNext={currentCard < totalCards || (currentCard === totalCards && !isLoading)}
          isLastCard={currentCard === totalCards}
        />

        <ExitModal />
      </div>
    </SwipeCardsContext.Provider>
  );
}

const SwipeCardsLayout = ({ children }: PropsWithChildren) => {
  return (
    <Suspense fallback={
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <SwipeCardsContent>{children}</SwipeCardsContent>
    </Suspense>
  );
};

export default SwipeCardsLayout;
