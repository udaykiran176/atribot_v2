import { Button } from "@/components/ui/button";
import { Trophy, Star, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

interface QuizResultPageProps {
  searchParams: {
    score?: string;
    total?: string;
    challengeId?: string;
  };
}

export default async function QuizResultPage({ searchParams }: QuizResultPageProps) {
  const score = parseInt(searchParams.score || "0");
  const total = parseInt(searchParams.total || "0");
  const challengeId = searchParams.challengeId;
  
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const correctAnswers = score / 10; // Each correct answer is worth 10 XP
  const totalQuestions = total / 10;

  // Determine result status
  let resultStatus = "Try Again";
  let resultColor = "text-red-600";
  let bgColor = "bg-red-50";
  let borderColor = "border-red-200";

  if (percentage >= 80) {
    resultStatus = "Excellent!";
    resultColor = "text-green-600";
    bgColor = "bg-green-50";
    borderColor = "border-green-200";
  } else if (percentage >= 60) {
    resultStatus = "Good Job!";
    resultColor = "text-yellow-600";
    bgColor = "bg-yellow-50";
    borderColor = "border-yellow-200";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h1>
          <p className="text-sm sm:text-base text-gray-600">Here are your results</p>
        </div>

        {/* Score Display */}
        <div className={`${bgColor} ${borderColor} border-2 rounded-xl p-4 sm:p-6 lg:p-8 mb-6`}>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
              {score} XP
            </div>
            <div className="text-base sm:text-lg lg:text-xl text-gray-600 mb-4">
              {correctAnswers} out of {totalQuestions} correct
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 lg:h-4 mb-4">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 sm:h-3 lg:h-4 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            
            <div className={`text-lg sm:text-xl lg:text-2xl font-semibold ${resultColor}`}>
              {percentage}% - {resultStatus}
            </div>
          </div>
        </div>

        {/* XP Breakdown */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-5 lg:p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center text-sm sm:text-base lg:text-lg">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 text-yellow-500" />
            XP Breakdown
          </h3>
          <div className="space-y-2 text-xs sm:text-sm lg:text-base">
            <div className="flex justify-between">
              <span className="text-gray-600">Correct Answers:</span>
              <span className="font-medium">{correctAnswers} × 10 XP = {score} XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Incorrect Answers:</span>
              <span className="font-medium">{totalQuestions - correctAnswers} × 0 XP = 0 XP</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total XP Earned:</span>
              <span className="text-green-600">{score} XP</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 sm:space-y-4">
          {challengeId && (
            <Link href={`/quiz?challengeId=${challengeId}`} className="block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg font-semibold rounded-xl transition-all duration-200 hover:shadow-lg">
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2" />
                Try Again
              </Button>
            </Link>
          )}
          
          <Link href="/dashboard" className="block">
            <Button variant="outline" className="w-full py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg font-semibold rounded-xl border-2 hover:bg-gray-50 transition-all duration-200 hover:shadow-md">
              <Home className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Motivational Message */}
        <div className="text-center mt-6 text-xs sm:text-sm lg:text-base text-gray-500">
          {percentage >= 80 && "🎉 Outstanding performance! Keep it up!"}
          {percentage >= 60 && percentage < 80 && "👍 Good work! Practice makes perfect!"}
          {percentage < 60 && "💪 Don't give up! Try again to improve your score!"}
        </div>
      </div>
    </div>
  );
}
