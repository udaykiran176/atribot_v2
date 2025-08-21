"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  IoIosArrowForward, 
  IoIosArrowBack, 
  IoIosTrophy
} from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { useQuizContext } from "./context";

export function QuizDisplay() {
  const router = useRouter();
  const {
    questions,
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
    totalQuestions,
    challengeId,
  } = useQuizContext();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [buttonPressed, setButtonPressed] = useState<string | null>(null);

  // Initialize answers array when questions are loaded
  useEffect(() => {
    if (questions.length > 0 && answers.length === 0) {
      setAnswers(new Array(questions.length).fill(-1));
    }
  }, [questions, answers.length, setAnswers]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !showResults && !showStartScreen) {
      const timer = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0 && !showResults && !showStartScreen) {
      setShowResults(true);
    }
  }, [timeRemaining, showResults, showStartScreen, setTimeRemaining, setShowResults]);

  // Fullscreen effect
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        const isFullscreenSupported = () => {
          return !!(
            document.fullscreenEnabled ||
            (document as any).webkitFullscreenEnabled ||
            (document as any).mozFullScreenEnabled ||
            (document as any).msFullscreenEnabled
          );
        };

        const isFullscreen = () => {
          return !!(
            document.fullscreenElement ||
            (document as any).webkitFullscreenElement ||
            (document as any).mozFullScreenElement ||
            (document as any).msFullscreenElement
          );
        };

        const requestFullscreen = async (element: HTMLElement) => {
          if (element.requestFullscreen) {
            await element.requestFullscreen();
          } else if ((element as any).webkitRequestFullscreen) {
            await (element as any).webkitRequestFullscreen();
          } else if ((element as any).mozRequestFullScreen) {
            await (element as any).mozRequestFullScreen();
          } else if ((element as any).msRequestFullscreen) {
            await (element as any).msRequestFullscreen();
          }
        };

        if (isFullscreenSupported() && !isFullscreen()) {
          const element = document.documentElement;
          await requestFullscreen(element);
        }
      } catch (err) {
        console.log('Fullscreen request failed:', err);
      }
    };

    const timer = setTimeout(enterFullscreen, 100);
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleButtonPress = (buttonId: string) => {
    setButtonPressed(buttonId);
    setTimeout(() => setButtonPressed(null), 150);
  };

  const handleBack = async () => {
    handleButtonPress('back');
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      router.back();
    } catch (err) {
      console.log('Error exiting fullscreen:', err);
      router.back();
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    handleButtonPress('next');
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    handleButtonPress('previous');
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const handleStartQuiz = () => {
    handleButtonPress('start');
    setShowStartScreen(false);
    setTimeRemaining(300);
  };

  const handleTryAgain = () => {
    setAnswers(new Array(questions.length).fill(-1));
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setShowStartScreen(true);
    setTimeRemaining(300);
    setShowReview(false);
  };

  const handleClaimXP = () => {
    const correctAnswers = calculateScore();
    const xpEarned = correctAnswers * 10;
    // Navigate to completed page with XP data and challengeId
    router.push(`/completed?xp=${xpEarned}&correct=${correctAnswers}&total=${questions.length}&challengeId=${challengeId}`);
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">No questions available</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentOptions = typeof currentQuestion.options === 'string' 
    ? JSON.parse(currentQuestion.options) 
    : currentQuestion.options;

  const StartScreen = () => (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6">
      <h1 className="text-4xl font-bold text-gray-700 mb-4">Quiz Time!</h1>
      <h2 className="text-xl text-gray-700 mb-8">Test your knowledge with {questions.length} questions</h2>
      <button
        onClick={handleStartQuiz}
        className={`bg-blue-600 rounded-md text-white px-6 py-3 flex items-center justify-center font-bold gap-2 hover:bg-blue-700 transition-colors ${buttonPressed === 'start' ? 'transform translate-y-1' : ''}`}
      >
        <span>Start Quiz</span>
        <IoIosArrowForward className="h-5 w-5" />
      </button>
    </div>
  );

  const QuizContent = () => (
    <div className="h-screen flex flex-col bg-gray-50 overflow-auto">
      <style jsx>{`
        .duolingo-button {
          font-weight: 700;
          border-radius: 12px;
          box-shadow: 0 4px 0 0 rgba(0, 0, 0, 0.2);
          transition: all 0.1s ease;
          transform: translateY(0);
          border: 2px solid rgba(0, 0, 0, 0.1);
        }
        
        .duolingo-button:hover {
          filter: brightness(1.05);
        }
        
        .duolingo-button:active, .duolingo-button.pressed {
          transform: translateY(4px);
          box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
        }
        
        .duolingo-blue {
          background-color: #1cb0f6;
          color: white;
        }
        
        .duolingo-brand-blue {
          background-color: #1cb0f6;
          color: white;
        }

        .duolingo-green {
          background-color: #58cc02;
          color: white;
        }
        
        .duolingo-red {
          background-color: #ff4b4b;
          color: white;
        }

        .duolingo-gray {
          background-color: #e5e5e5;
          color: #4b4b4b;
        }

        .duolingo-option {
          background-color: white;
          border: 2px solid #e5e5e5;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .duolingo-option:hover {
          background-color: #f0f0f0;
          border-color: #c3c3c3;
        }

        .duolingo-option.selected-blue {
          background-color: #e0f7fa;
          border-color: #1cb0f6;
        }
      `}</style>

      {/* Header */}
      <div className="w-full bg-white py-4 px-6 shadow-sm flex items-center gap-4">
        <button onClick={handleBack} className="text-2xl">
          <IoArrowBack size={28} />
        </button>
        {/* Progress Bar */}
        <div className="flex-grow h-2.5 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        {/* Timer */}
        <div className="text-xl font-bold text-gray-700">
          {formatTime(timeRemaining)}
        </div>
      </div>

      <div className="flex-grow flex flex-col max-w-2xl mx-auto w-full py-8 px-6">
        <div className="flex-grow">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            {currentQuestion.question}
          </h2>
          
          <div className="flex flex-col gap-3">
            {currentOptions.map((option: string, index: number) => (
              <div
                key={index}
                className={`duolingo-option ${answers[currentQuestionIndex] === index ? 'selected-blue' : ''}`}
                onClick={() => handleAnswerSelect(index)}
              >
                <div className="font-bold text-gray-700 text-base">
                  {option}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 p-4 bg-white shadow-sm flex justify-between gap-4">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 duolingo-button duolingo-gray flex items-center gap-2 ${buttonPressed === 'previous' ? 'pressed' : ''}`}
          >
            <IoIosArrowBack className="h-4 w-4" />
            <span>Previous</span>
          </button>
          
          <button
            onClick={handleNextQuestion}
            disabled={answers[currentQuestionIndex] === -1}
            className={`px-6 py-3 duolingo-button ${answers[currentQuestionIndex] === -1 ? 'duolingo-gray' : 'duolingo-brand-blue'} flex items-center gap-2 ${buttonPressed === 'next' ? 'pressed' : ''}`}
          >
            <span>{currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next"}</span>
            {currentQuestionIndex === questions.length - 1 ? null : <IoIosArrowForward className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );

  const ResultsContent = () => {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-400 via-blue-400 to-teal-300 flex items-center justify-center overflow-auto">
        <style jsx>{`
          .result-card {
            background: #fff;
            border-radius: 20px;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
            padding: 32px 24px 24px 24px;
            max-width: 480px;
            width: 100%;
            margin: 20px;
            text-align: center;
          }
          .result-trophy {
            margin-bottom: 12px;
          }
          .result-title {
            font-size: 2rem;
            font-weight: 800;
            color: #222;
            margin-bottom: 0.5rem;
          }
          .result-desc {
            color: #555;
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
          }
          .result-progress-label {
            display: flex;
            justify-content: space-between;
            font-size: 0.95rem;
            color: #888;
            margin-bottom: 4px;
          }
          .result-progress-bar-bg {
            background: #e0e0e0;
            border-radius: 8px;
            height: 8px;
            width: 100%;
            margin-bottom: 24px;
          }
          .result-progress-bar {
            background: #1cb0f6;
            height: 8px;
            border-radius: 8px;
            transition: width 0.5s;
          }
          .result-stats-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 24px;
            gap: 12px;
          }
          .result-stat-box {
            flex: 1;
            background: #f6f8ff;
            border-radius: 12px;
            padding: 18px 0 10px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .result-stat-main {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1cb0f6;
          }
          .result-stat-label {
            font-size: 1rem;
            color: #888;
            margin-top: 4px;
          }
          .result-stat-green {
            color: #43c97f;
          }
          .result-stat-purple {
            color: #7f7fd5;
          }
          .review-btn {
            margin-top: 12px;
            background: #ff6b6b;
            color: #fff;
            font-weight: 700;
            font-size: 1.2rem;
            border: none;
            border-radius: 12px;
            padding: 14px 32px;
            cursor: pointer;
            transition: background 0.2s;
            box-shadow: 0 4px 0 0 rgba(0,0,0,0.08);
          }
          .review-btn:hover {
            background: #ff4b4b;
          }
          .review-answers {
            margin-top: 32px;
            text-align: left;
          }
          .review-q {
            margin-bottom: 18px;
            padding: 16px;
            border-radius: 10px;
            background: #f7faff;
            border: 1px solid #e0eaff;
          }
          .review-q-title {
            font-weight: 700;
            color: #222;
            margin-bottom: 6px;
          }
        `}</style>
        
        <div className="result-card">
          <div className="result-trophy">
            <IoIosTrophy size={56} color="#FFC107" />
          </div>
          <div className="result-title">Quiz Complete! 🎉</div>
          <div className="result-desc">
            You've successfully answered all {questions.length} questions
          </div>
          <div className="result-progress-label">
            <span>Progress</span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <div className="result-progress-bar-bg">
            <div
              className="result-progress-bar"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="result-stats-row">
            <div className="result-stat-box">
              <span className="result-stat-main" style={{ color: "#1cb0f6" }}>
                {questions.length}/{questions.length}
              </span>
              <span className="result-stat-label">Questions</span>
            </div>
            <div className="result-stat-box">
              <span className="result-stat-main result-stat-green">
                {score}
              </span>
              <span className="result-stat-label">Correct</span>
            </div>
            <div className="result-stat-box">
              <span className="result-stat-main result-stat-purple">
                {Math.round((score / questions.length) * 100)}%
              </span>
              <span className="result-stat-label">Score</span>
            </div>
          </div>
          <button
            className="review-btn"
            onClick={() => setShowReview(!showReview)}
          >
            {showReview ? "Hide Answers" : "Review the answer"}
          </button>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
            <button
              className="review-btn"
              style={{ background: '#1cb0f6' }}
              onClick={() => router.back()}
            >
              Back
            </button>
            <button
              className="review-btn"
              style={{ background: '#43c97f' }}
              onClick={handleClaimXP}
            >
              Claim XP ({calculateScore() * 10} XP)
            </button>
          </div>
          {showReview && (
            <div className="review-answers">
              {questions.map((q, idx) => {
                const questionOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
                return (
                  <div key={q.id} className="review-q" style={{
                    background: answers[idx] === q.correctAnswer ? "#e0f7fa" : "#ffdde1",
                    border: `2px solid ${answers[idx] === q.correctAnswer ? "#1cb0f6" : "#ff4b4b"}`
                  }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>
                      Q{idx + 1}: {q.question}
                    </div>
                    <div>
                      <span style={{ fontWeight: 600 }}>Your answer:</span>{" "}
                      {questionOptions[answers[idx]] ?? <span style={{ color: "#aaa" }}>No answer</span>}
                    </div>
                    <div>
                      <span style={{ fontWeight: 600 }}>Correct answer:</span>{" "}
                      {questionOptions[q.correctAnswer]}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {showStartScreen ? <StartScreen /> : showResults ? <ResultsContent /> : <QuizContent />}
    </motion.div>
  );
}
