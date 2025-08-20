"use client";

import { Suspense, useState, useEffect } from "react";
import { CardDisplay } from "./card-display";
import { useSwipeCardsContext, type SwipeCard } from "./context";

type Props = {
  searchParams: Promise<{
    challengeId?: string;
  }>;
};

function SwipeCardsContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { 
    setTotalCards, 
    setCurrentCard, 
    challengeId, 
    setCards, 
    setHasCards 
  } = useSwipeCardsContext();

  useEffect(() => {
    async function fetchCards() {
      if (!challengeId || isNaN(challengeId)) {
        setError("Invalid challenge ID");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/swipe-cards?challengeId=${challengeId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch cards");
        }
        
        const fetchedCards: SwipeCard[] = await response.json();
        setCards(fetchedCards || []);
        
        // Update the layout context with actual card count
        if (fetchedCards && fetchedCards.length > 0) {
          setTotalCards(fetchedCards.length);
          setCurrentCard(1);
          setHasCards(true);
        } else {
          setHasCards(false);
        }
      } catch (error) {
        console.error("Error fetching cards:", error);
        setError("Failed to load swipe cards");
        setCards([]);
        setHasCards(false);
      } finally {
        setLoading(false);
      }
    }

    if (challengeId) {
      fetchCards();
    }
  }, [challengeId, setTotalCards, setCurrentCard, setCards, setHasCards]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading swipe cards...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return <CardDisplay />;
}

export default function SwipeLearnPage({ searchParams }: Props) {
  const { challengeId, setChallengeId } = useSwipeCardsContext();

  // Set the challenge ID from search params if available
  useEffect(() => {
    async function handleSearchParams() {
      const params = await searchParams;
      if (params?.challengeId && !challengeId) {
        const id = parseInt(params.challengeId, 10);
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
        <div className="text-gray-500">Loading swipe cards...</div>
      </div>
    }>
      <div className="flex items-center justify-center lg:h-full">
        <SwipeCardsContent />
      </div>
    </Suspense>
  );
}