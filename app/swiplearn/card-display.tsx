"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSwipeCardsContext } from "./context";
import Image from "next/image";

export function CardDisplay() {
  const router = useRouter();
  const { cards, currentCard, hasCards } = useSwipeCardsContext();
  const currentCardData = cards[currentCard - 1];

  const handleBackToChallenges = () => {
    router.push("/learn");
  };

  if (!hasCards || cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">No Cards Available</h2>
        <p className="text-gray-500 text-center max-w-md">
          There are no swipe cards available for this challenge yet.
        </p>
        <Button onClick={handleBackToChallenges} variant="outline">
          Back to Challenges
        </Button>
      </div>
    );
  }

  if (!currentCardData) {
    return (
      <div className="text-center text-gray-500">
        No card available
      </div>
    );
  }

  return (
    <>
    <div className="flex md:flex-row flex-col items-center justify-center h-full overflow-hidden">
      <div>
        <Image
            src={currentCardData.image}
            alt={currentCardData.title}
            width={500}
            height={500}
        />
      </div>
        <div>
            <h2 className="text-xl font-semibold text-gray-700">{currentCardData.title}</h2>
            <p className="text-gray-500 text-center max-w-md">
                {currentCardData.description}
            </p>
        </div>

    </div>
    </>
  );
}
