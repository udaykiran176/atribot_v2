"use client";

import { Suspense, useState, useEffect } from "react";
import { QuizDisplay } from "./quiz-display"
import { useQuizContext, type QuizQuestion } from "./context"

type Props = {
  searchParams: Promise<{
    challengeId?: string;
  }>;
};

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

export default function QuizPage({ searchParams }: Props) {
  const { challengeId, setChallengeId } = useQuizContext();

  // Set the challenge ID from search params if available
  useEffect(() => {
    async function handleSearchParams() {
      const params = await searchParams;
      if (params?.challengeId && !challengeId) {
        const id = parseInt(params.challengeId, 10);
        if (!isNaN(id)) {
          setChallengeId(id);
        }
      }
    }
    
    handleSearchParams();
  }, [searchParams, challengeId, setChallengeId]);

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500 text-xl">Loading quiz...</div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}