"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

const CompletedPage = () => {
  const router = useRouter();
    const [progress, setProgress] = useState<{ points: number, streak: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // This is a client component, so we can't call server actions directly.
        // We need an API route to get user progress.
        const response = await fetch('/api/user-progress');
        if (response.ok) {
          const data = await response.json();
          setProgress(data);
        } else {
          console.error("Failed to fetch user progress");
          setProgress(null);
        }
      } catch (error) {
        console.error("Error fetching user progress:", error);
        setProgress(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  useEffect(() => {
    if (!loading && progress) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [loading, progress]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center p-6">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-green-600 mb-4">Congratulations!</h1>
        <p className="text-lg text-gray-700 mb-8">You've completed all the video lessons.</p>

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
