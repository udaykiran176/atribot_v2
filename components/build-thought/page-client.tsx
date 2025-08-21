"use client";

import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSound } from "@/components/SoundContext";

export type BuildThoughtVideo = {
  id: number;
  videoUrl: string;
  order: number;
};

export function BuildThoughtPageClient({ videos }: { videos: BuildThoughtVideo[] }) {
  const router = useRouter();
  const { playSound } = useSound();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreenState] = useState(false);
  const [buttonPressed, setButtonPressed] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const ordered = [...videos].sort((a, b) => a.order - b.order);

  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
        setIsFullscreenState(true);
      } catch (err) {
        // no-op
      }
    };

    const handleWakeLock = async () => {
      try {
        if ("wakeLock" in navigator && document.visibilityState === "visible") {
          await (navigator as any).wakeLock.request("screen");
        }
      } catch {}
    };

    enterFullscreen();
    handleWakeLock();

    const handleVisibilityChange = async () => {
      if (!document.hidden && !document.fullscreenElement) {
        await enterFullscreen();
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreenState(!!document.fullscreenElement);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange as any);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange as any);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange as any);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange as any);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange as any);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange as any);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handlePrevious();
      } else if (event.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  const handleButtonPress = (id: string) => {
    setButtonPressed(id);
    setTimeout(() => setButtonPressed(null), 150);
  };

  const exitFullscreenIfAny = async () => {
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
    } catch {}
  };

  const handleBack = async () => {
    handleButtonPress("back");
    playSound("click");
    await exitFullscreenIfAny();
    router.push("/learn");
  };

  const handleNext = async () => {
    handleButtonPress("next");
    playSound("click");
    if (currentSlide < ordered.length - 1) {
      setCurrentSlide((p) => p + 1);
    } else {
      await handleComplete();
    }
  };

  const handleComplete = async () => {
    if (isCompleting) return;
    try {
      setIsCompleting(true);
      // Extract challengeId from URL query (?challengeId=123)
      const params = new URLSearchParams(window.location.search);
      const challengeIdParam = params.get('challengeId');
      const challengeId = challengeIdParam ? parseInt(challengeIdParam, 10) : NaN;

      if (!challengeId || Number.isNaN(challengeId)) {
        console.error('Missing challenge id. Please open this from Learn page.');
        await exitFullscreenIfAny();
        router.push("/Level-1/1");
        return;
      }

      // Call API to award XP and mark completion
      const res = await fetch('/api/challenge-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId })
      });

      if (!res.ok) {
        throw new Error('Failed to complete challenge');
      }

      await exitFullscreenIfAny();
      // Navigate to completed page. API already awarded XP and updated streak.
      router.push(`/completed?challengeId=${challengeId}`);
    } catch (e) {
      console.error(e);
      await exitFullscreenIfAny();
      router.push("/Level-1/1");
    } finally {
      setIsCompleting(false);
    }
  };

  const handlePrevious = () => {
    handleButtonPress("previous");
    playSound("click");
    if (currentSlide > 0) setCurrentSlide((p) => p - 1);
  };

  const handleEnterFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        if ("orientation" in screen && (screen as any).orientation?.lock) {
          try {
            await (screen.orientation as any).lock("landscape");
          } catch {}
        }
      }
      setIsFullscreenState(true);
    } catch {}
  };

  return (
    <div className="min-h-screen min-w-screen bg-white flex flex-col overflow-hidden fixed inset-0">
      <style>{`
        .duolingo-button { font-weight: 700; border-radius: 12px; box-shadow: 0 4px 0 0 rgba(0,0,0,0.2); transition: all 0.1s ease; transform: translateY(0); border: 2px solid rgba(0,0,0,0.1); }
        .duolingo-button:hover { filter: brightness(1.05); }
        .duolingo-button:active, .duolingo-button.pressed { transform: translateY(4px); box-shadow: 0 0 0 0 rgba(0,0,0,0.2); }
        .duolingo-blue { background-color: #1cb0f6; color: white; }
        .duolingo-green { background-color: #58cc02; color: white; }
        .duolingo-red { background-color: #ff4b4b; color: white; }
        .duolingo-gray { background-color: #e5e5e5; color: #4b4b4b; }
        .duolingo-play { background-color: #1cb0f6; border-radius: 50%; box-shadow: 0 4px 0 0 rgba(0,0,0,0.2); transition: all 0.1s ease; }
        .duolingo-play:hover { filter: brightness(1.05); }
        .duolingo-play:active, .duolingo-play.pressed { transform: translateY(4px); box-shadow: 0 0 0 0 rgba(0,0,0,0.2); }
      `}</style>

      <div className="absolute top-4 left-4 z-30">
        {currentSlide === 0 ? (
          <button onClick={handleBack} className={`px-4 py-2.5 duolingo-button duolingo-blue flex items-center gap-1.5 ${buttonPressed === "back" ? "pressed" : ""}`}>
            <FaArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
        ) : (
          <button onClick={handlePrevious} className={`px-4 py-2.5 duolingo-button duolingo-blue flex items-center gap-1.5 ${buttonPressed === "previous" ? "pressed" : ""}`}>
            <FaArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>
        )}
      </div>

      {currentSlide < ordered.length - 1 ? (
        <button onClick={handleNext} className={`absolute top-4 right-4 z-30 px-4 py-2.5 duolingo-button duolingo-blue flex items-center gap-1.5 ${buttonPressed === "next" ? "pressed" : ""}`}>
          <span>Next</span>
          <FaArrowRight className="h-4 w-4" />
        </button>
      ) : (
        <button 
          onClick={handleNext} 
          disabled={isCompleting}
          className={`absolute top-4 right-4 z-30 px-4 py-2.5 duolingo-button duolingo-green flex items-center gap-1.5 ${buttonPressed === "next" ? "pressed" : ""} ${isCompleting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <FaCheck className="h-4 w-4" />
          <span>{isCompleting ? "Completing..." : "Complete"}</span>
        </button>
      )}

      <div className="flex-1 relative w-screen h-screen bg-white">
        {ordered.length > 0 ? (
          <video
            key={ordered[currentSlide]?.videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-screen h-screen object-contain"
            src={ordered[currentSlide]?.videoUrl}
            style={{ maxWidth: "100vw", maxHeight: "100vh", backgroundColor: "white" }}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="flex items-center justify-center w-full h-full text-sm text-gray-500">No videos found.</div>
        )}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {ordered.length > 0 ? `${currentSlide + 1} / ${ordered.length}` : "0 / 0"}
      </div>

      {!isFullscreen && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <button onClick={handleEnterFullscreen} className="px-6 py-3 duolingo-button duolingo-blue font-semibold text-white text-lg rounded-md shadow-lg hover:bg-blue-400 active:bg-blue-600 transition-colors">
            Click to Enter Fullscreen
          </button>
        </div>
      )}
    </div>
  );
}
