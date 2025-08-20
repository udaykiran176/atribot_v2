"use client";

import { createContext, useContext } from "react";

export type BuildThoughtContextType = {
  currentVideo: number;
  totalVideos: number;
  setCurrentVideo: (video: number) => void;
  setTotalVideos: (total: number) => void;
  challengeId: number | null;
  setChallengeId: (id: number | null) => void;
  hasVideos: boolean;
  setHasVideos: (hasVideos: boolean) => void;
};

export const BuildThoughtContext = createContext<BuildThoughtContextType | undefined>(undefined);

export const useBuildThoughtContext = () => {
  const context = useContext(BuildThoughtContext);
  if (!context) {
    throw new Error("useBuildThoughtContext must be used within BuildThoughtLayout");
  }
  return context;
};
