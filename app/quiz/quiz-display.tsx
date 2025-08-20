"use client";

import { useState } from "react";
import { useQuizContext } from "./context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function QuizDisplay() {
  const { questions, currentQuestion, answers, setAnswers, selectedAnswer, setSelectedAnswer } = useQuizContext();

  const currentQuestionData = questions[currentQuestion - 1];

  if (!currentQuestionData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">No question data available</div>
      </div>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = { ...answers };
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            {currentQuestionData.question}
          </h2>
          <p className="text-gray-600 text-center">
            Select an answer and click Next
          </p>
        </div>

        {/* Answer Options */}
        <div className="space-y-4">
          {currentQuestionData.options.map((option, index) => {
            let buttonClass = "w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors";
            
            if (selectedAnswer === index) {
              buttonClass = "w-full p-4 text-left border-2 border-blue-500 bg-blue-50 rounded-lg";
            }

            return (
              <Button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={cn(buttonClass)}
                variant="ghost"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-4 text-sm font-semibold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-base">{option}</span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

