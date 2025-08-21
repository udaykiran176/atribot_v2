"use client";

import { X, Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useExitModal } from "@/store/use-exit-modal";

type Props = {
  progress: number; // 0-100
  currentVideo: number;
  totalVideos: number;
};

export function BuildThoughtHeader({ progress, currentVideo, totalVideos }: Props) {
  const { open } = useExitModal();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else if (document.exitFullscreen) await document.exitFullscreen();
    } catch (e) {
      console.error("Fullscreen toggle failed (BuildThought)", e);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <button onClick={open} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <div className="flex-1 mx-6">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5 text-gray-600" /> : <Maximize2 className="w-5 h-5 text-gray-600" />}
          </button>
          <div className="text-xs font-medium text-gray-600">
            <p>Video <span className="font-semibold">{currentVideo}</span>/{totalVideos}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
