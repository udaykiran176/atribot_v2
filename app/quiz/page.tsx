"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { QuizDisplay } from "./quiz-display"
import { useQuizContext, type QuizQuestion } from "./context"

function QuizContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { 
    setTotalQuestions, 
    setCurrentQuestion, 
    challengeId, 
    setQuestions, 
    setHasQuestions,
    setAnswers
  } = useQuizContext();

  useEffect(() => {
    async function fetchQuestions() {
      if (!challengeId || isNaN(challengeId)) {
        setError("Invalid challenge ID");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/quiz-questions?challengeId=${challengeId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("No quiz available for this topic");
          } else {
            setError("Failed to load quiz questions");
          }
          setLoading(false);
          return;
        }
        
        const fetchedQuestions: QuizQuestion[] = await response.json();
        
        // Parse options from JSON strings
        const parsedQuestions = fetchedQuestions.map(q => ({
          ...q,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
        }));
        
        setQuestions(parsedQuestions || []);
        
        // Initialize answers array
        if (parsedQuestions && parsedQuestions.length > 0) {
          setAnswers(new Array(parsedQuestions.length).fill(-1));
          setTotalQuestions(parsedQuestions.length);
          setCurrentQuestion(1);
          setHasQuestions(true);
        } else {
          setHasQuestions(false);
        }
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
        setError("Failed to load quiz questions");
        setQuestions([]);
        setHasQuestions(false);
      } finally {
        setLoading(false);
      }
    }

    if (challengeId) {
      fetchQuestions();
    }
  }, [challengeId, setTotalQuestions, setCurrentQuestion, setQuestions, setHasQuestions, setAnswers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500 text-xl">Loading quiz questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return <QuizDisplay />;
}

function QuizPageInner() {
  const { challengeId, setChallengeId } = useQuizContext();
  const params = useSearchParams();

  // Set the challenge ID from search params if available
  useEffect(() => {
    const cid = params.get("challengeId");
    if (cid && !challengeId) {
      const id = parseInt(cid, 10);
      if (!isNaN(id)) {
        setChallengeId(id);
      }
    }
  }, [params, challengeId, setChallengeId]);

  return <QuizContent />;
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500 text-xl">Loading quiz...</div>
      </div>
    }>
      <QuizPageInner />
    </Suspense>
  );
}