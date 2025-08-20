"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useSwipeLearnContext } from "./context";

// Define the type for a single swipe card
type SwipeCard = {
  id: number;
  image: string | null;
  title: string | null;
  description: string | null;
};

// Define the props for the client component
type SwipeLearnClientProps = {
  initialCards: SwipeCard[];
  challengeId: number;
};

export default function SwipeLearnClient({ initialCards, challengeId }: SwipeLearnClientProps) {
  const { currentIndex, setTotalCards, setChallengeId } = useSwipeLearnContext();

  useEffect(() => {
    setTotalCards(initialCards.length);
    setChallengeId(challengeId);
  }, [initialCards.length, challengeId, setTotalCards, setChallengeId]);

  if (initialCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">No Swipe Cards Available</h2>
        <p className="text-gray-500 text-center max-w-md">
          There are no swipe cards available for this challenge yet.
        </p>
      </div>
    );
  }

  const currentCard = initialCards[currentIndex];

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-4 md:p-8">
      {/* Main content area */}
      <div className="flex-grow flex flex-col md:flex-row gap-8 items-center">
        {/* Image Section (Left on Desktop, Top on Mobile) */}
        <div className="w-full md:w-1/2 flex justify-center">
          {currentCard.image ? (
            <Image
              src={currentCard.image}
              alt={currentCard.title || "Swipe card image"}
              width={500}
              height={500}
              className="rounded-lg object-contain shadow-lg"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">No Image</p>
            </div>
          )}
        </div>

        {/* Text Section (Right on Desktop, Bottom on Mobile) */}
        <div className="w-full md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold mb-4">{currentCard.title}</h1>
          <p className="text-lg text-muted-foreground flex-grow">
            {currentCard.description}
          </p>
        </div>
      </div>
    </div>
  );
}
