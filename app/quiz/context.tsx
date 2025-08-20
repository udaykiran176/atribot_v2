"use client";

import { createContext, useContext } from "react";

export type QuizQuestion = {
  id: number;
  challengeId: number;
  question: string;
  options: string[];
  correctAnswer: number;
  order: number;
  createdAt: Date;
};

export type QuizContextType = {
  currentQuestion: number;
  totalQuestions: number;
  setCurrentQuestion: (question: number) => void;
  setTotalQuestions: (total: number) => void;
  challengeId: number | null;
  setChallengeId: (id: number | null) => void;
  questions: QuizQuestion[];
  setQuestions: (questions: QuizQuestion[]) => void;
  hasQuestions: boolean;
  setHasQuestions: (has: boolean) => void;
  score: number;
  setScore: (score: number) => void;
  answers: Record<number, number>;
  setAnswers: (answers: Record<number, number>) => void;
  selectedAnswer: number | null;
  setSelectedAnswer: (answer: number | null) => void;
};

export const QuizContext = createContext<QuizContextType | null>(null);

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuizContext must be used within QuizContext.Provider");
  }
  return context;
};

