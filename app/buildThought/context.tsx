"use client";

import { createContext, useContext, useState, PropsWithChildren, Dispatch, SetStateAction } from "react";

export type BuildThoughtContextType = {
  currentVideo: number;
  totalVideos: number;
  setCurrentVideo: Dispatch<SetStateAction<number>>;
  setTotalVideos: Dispatch<SetStateAction<number>>;
  challengeId: number | null;
  setChallengeId: Dispatch<SetStateAction<number | null>>;
  hasVideos: boolean;
  setHasVideos: Dispatch<SetStateAction<boolean>>;
};

export const BuildThoughtContext = createContext<BuildThoughtContextType | undefined>(undefined);

export const useBuildThoughtContext = () => {
  const ctx = useContext(BuildThoughtContext);
  if (!ctx) throw new Error("useBuildThoughtContext must be used within BuildThoughtContext.Provider");
  return ctx;
};

export function BuildThoughtProvider({ children }: PropsWithChildren) {
  const [currentVideo, setCurrentVideo] = useState(1);
  const [totalVideos, setTotalVideos] = useState(1);
  const [challengeId, setChallengeId] = useState<number | null>(null);
  const [hasVideos, setHasVideos] = useState(true);

  return (
    <BuildThoughtContext.Provider value={{
      currentVideo,
      totalVideos,
      setCurrentVideo,
      setTotalVideos,
      challengeId,
      setChallengeId,
      hasVideos,
      setHasVideos,
    }}>
      {children}
    </BuildThoughtContext.Provider>
  );
}
