"use client";

import { createContext, useContext } from "react";

export type SwipeCard = {
  id: number;
  title: string;
  description: string | null;
  image: string | null;
  order: number;
};

export type SwipeCardsContextType = {
  currentCard: number;
  totalCards: number;
  setCurrentCard: (card: number) => void;
  setTotalCards: (total: number) => void;
  challengeId: number | null;
  setChallengeId: (id: number | null) => void;
  cards: SwipeCard[];
  setCards: (cards: SwipeCard[]) => void;
  hasCards: boolean;
  setHasCards: (hasCards: boolean) => void;
};

export const SwipeCardsContext = createContext<SwipeCardsContextType | undefined>(undefined);

export const useSwipeCardsContext = () => {
  const context = useContext(SwipeCardsContext);
  if (!context) {
    throw new Error("useSwipeCardsContext must be used within SwipeCardsLayout");
  }
  return context;
};
