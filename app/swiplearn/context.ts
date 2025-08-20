import { createContext, useContext } from 'react';

export type SwipeLearnContextType = {
  currentIndex: number;
  totalCards: number;
  challengeId: number | null;
  setCurrentIndex: (index: number) => void;
  setTotalCards: (count: number) => void;
  setChallengeId: (id: number | null) => void;
};

export const SwipeLearnContext = createContext<SwipeLearnContextType | undefined>(
  undefined
);

export const useSwipeLearnContext = () => {
  const context = useContext(SwipeLearnContext);
  if (!context) {
    throw new Error(
      'useSwipeLearnContext must be used within a SwipeLearnContext.Provider'
    );
  }
  return context;
};
