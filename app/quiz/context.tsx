"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface QuizQuestion {
  id: number;
  challengeId: number;
  question: string;
  options: string | string[];
  correctAnswer: number;
  order: number;
  createdAt: Date;
}

interface QuizContextType {
  challengeId: number | null;
  setChallengeId: (id: number) => void;
  currentQuestion: number;
  setCurrentQuestion: (question: number) => void;
  totalQuestions: number;
  setTotalQuestions: (total: number) => void;
  questions: QuizQuestion[];
  setQuestions: (questions: QuizQuestion[]) => void;
  hasQuestions: boolean;
  setHasQuestions: (has: boolean) => void;
  answers: number[];
  setAnswers: (answers: number[]) => void;
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  showStartScreen: boolean;
  setShowStartScreen: (show: boolean) => void;
  timeRemaining: number;
  setTimeRemaining: (time: number) => void;
  showReview: boolean;
  setShowReview: (show: boolean) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [challengeId, setChallengeId] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [hasQuestions, setHasQuestions] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [showReview, setShowReview] = useState(false);

  return (
    <QuizContext.Provider
      value={{
        challengeId,
        setChallengeId,
        currentQuestion,
        setCurrentQuestion,
        totalQuestions,
        setTotalQuestions,
        questions,
        setQuestions,
        hasQuestions,
        setHasQuestions,
        answers,
        setAnswers,
        showResults,
        setShowResults,
        showStartScreen,
        setShowStartScreen,
        timeRemaining,
        setTimeRemaining,
        showReview,
        setShowReview,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuizContext() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuizContext must be used within a QuizProvider");
  }
  return context;
}
