"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

const CompletedPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState<{ points: number, streak: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [xpClaimed, setXpClaimed] = useState(false);

  useEffect(() => {
    const fetchAndUpdateProgress = async () => {
      try {
        const xp = searchParams.get('xp');
        const correct = searchParams.get('correct');
        const total = searchParams.get('total');
        const challengeId = searchParams.get('challengeId');

        // If XP data is present, update user progress first
        if (xp && !xpClaimed) {
          const updateResponse = await fetch('/api/user-progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              xp: parseInt(xp),
              challengeId: challengeId ? parseInt(challengeId) : undefined
            }),
          });

          if (updateResponse.ok) {
            const updatedData = await updateResponse.json();
            setProgress(updatedData);
            setXpClaimed(true);
          } else {
            console.error("Failed to update user progress");
            // Fallback to fetching existing progress
            const response = await fetch('/api/user-progress');
            if (response.ok) {
              const data = await response.json();
              setProgress(data);
            }
          }
        } else {
          // No XP data, just fetch existing progress
          const response = await fetch('/api/user-progress');
          if (response.ok) {
            const data = await response.json();
            setProgress(data);
          } else {
            console.error("Failed to fetch user progress");
            setProgress(null);
          }
        }
      } catch (error) {
        console.error("Error handling user progress:", error);
        setProgress(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAndUpdateProgress();
  }, [searchParams, xpClaimed]);

  useEffect(() => {
    if (!loading && progress) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [loading, progress]);

  // Exit fullscreen when entering the completed page
  useEffect(() => {
    const exitFullscreen = async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else if ((document as any).webkitFullscreenElement) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozFullScreenElement) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msFullscreenElement) {
          await (document as any).msExitFullscreen();
        }
      } catch (err) {
        console.log('Error exiting fullscreen:', err);
      }
    };

    exitFullscreen();
  }, []);

  const xp = searchParams.get('xp');
  const correct = searchParams.get('correct');
  const total = searchParams.get('total');

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center p-6">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-green-600 mb-4">Congratulations!</h1>
        {xp ? (
          <div className="mb-8">
            <p className="text-lg text-gray-700 mb-2">Quiz completed successfully!</p>
            <p className="text-md text-gray-600">You got {correct} out of {total} questions correct</p>
            <p className="text-lg font-bold text-green-600">+{xp} XP earned!</p>
          </div>
        ) : (
          <p className="text-lg text-gray-700 mb-8">You've completed all the video lessons.</p>
        )}

        {loading ? (
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto animate-pulse"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-8 text-lg">
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <p className="text-gray-500">Points</p>
              <p className="font-bold text-2xl text-blue-500">{progress?.points ?? 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <p className="text-gray-500">Streak</p>
              <p className="font-bold text-2xl text-orange-500">{progress?.streak ?? 0} days</p>
            </div>
          </div>
        )}

        <Button onClick={() => router.push('/learn')} size="lg">
          Continue Learning
        </Button>
      </div>
    </div>
  );
};

export default CompletedPage;
