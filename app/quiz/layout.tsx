"use client";

import type { PropsWithChildren } from "react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { QuizFooter } from "./footer";
import { QuizHeader } from "./header";
import { ExitModal } from "@/components/modals/exit-modal";
import { QuizContext, type QuizContextType, type QuizQuestion } from "./context";

function QuizContent({ children }: PropsWithChildren) {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [challengeId, setChallengeId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [hasQuestions, setHasQuestions] = useState(true);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("challengeId");
    if (id) {
      setChallengeId(Number(id));
    } else {
      setChallengeId(null);
    }
  }, [searchParams]);

  const progress = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] ?? null);
    }
  };

  const handleNext = async () => {
    if (isLoading) return;

    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1] ?? null);
    } else if (currentQuestion === totalQuestions) {
      // Calculate final score
      let finalScore = 0;
      questions.forEach((question, index) => {
        const userAnswer = answers[index + 1];
        if (userAnswer === question.correctAnswer) {
          finalScore += 10; // 10 XP per correct answer
        }
      });

      if (!challengeId) {
        console.error('Cannot complete quiz: missing challengeId from context.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch('/api/quiz-complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            challengeId, 
            score: finalScore,
            answers: answers,
            totalQuestions: totalQuestions
          }),
        });

        if (response.ok) {
          router.push(`/quiz/result?score=${finalScore}&total=${totalQuestions * 10}&challengeId=${challengeId}`);
        } else {
          const msg = await response.text().catch(() => '');
          console.error("Failed to update progress", msg);
        }
      } catch (error) {
        console.error("Error completing quiz:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const contextValue: QuizContextType = {
    currentQuestion,
    totalQuestions,
    setCurrentQuestion,
    setTotalQuestions,
    challengeId,
    setChallengeId,
    questions,
    setQuestions,
    hasQuestions,
    setHasQuestions,
    score,
    setScore,
    answers,
    setAnswers,
    selectedAnswer,
    setSelectedAnswer,
  };

  return (
    <QuizContext.Provider value={contextValue}>
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        <QuizHeader
          progress={progress}
          currentQuestion={currentQuestion}
          totalQuestions={totalQuestions}
        />

        <div className="flex-1 overflow-hidden">
          {children}
        </div>

        <QuizFooter
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoPrevious={currentQuestion > 1}
          canGoNext={currentQuestion < totalQuestions || (currentQuestion === totalQuestions && !isLoading)}
          isLastQuestion={currentQuestion === totalQuestions}
          selectedAnswer={selectedAnswer}
        />

        <ExitModal />
      </div>
    </QuizContext.Provider>
  );
}

const QuizLayout = ({ children }: PropsWithChildren) => {
  return (
    <Suspense fallback={
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <QuizContent>{children}</QuizContent>
    </Suspense>
  );
};

export default QuizLayout;
