"use client";

import { createContext, useContext } from "react";

export type VideoLessonContextType = {
  currentLesson: number;
  totalLessons: number;
  setCurrentLesson: (lesson: number) => void;
  setTotalLessons: (total: number) => void;
  challengeId: number | null;
  setChallengeId: (id: number | null) => void;
};

export const VideoLessonContext = createContext<VideoLessonContextType | undefined>(undefined);

export const useVideoLessonContext = () => {
  const context = useContext(VideoLessonContext);
  if (!context) {
    throw new Error("useVideoLessonContext must be used within VideoLessonLayout");
    }
  return context;
};
