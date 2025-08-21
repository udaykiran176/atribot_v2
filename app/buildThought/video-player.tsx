"use client";

import { useBuildThoughtContext } from "./context";

export type VideoItem = {
  id: number;
  videoUrl: string;
  order?: number;
};

type Props = {
  videos: VideoItem[];
  loading: boolean;
  error: string | null;
};

export function BuildThoughtPlayer({ videos, loading, error }: Props) {
  const { currentVideo } = useBuildThoughtContext();

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <div className="text-gray-500">Loading videos...</div>
    </div>
  );

  if (error) return (
    <div className="h-full flex items-center justify-center">
      <div className="text-red-500">{error}</div>
    </div>
  );

  if (!videos || videos.length === 0) return (
    <div className="h-full flex items-center justify-center">
      <div className="text-gray-500">No videos available.</div>
    </div>
  );

  const current = videos[currentVideo - 1];

  return (
    <div className="w-full h-full bg-white flex items-center justify-center">
      <video
        key={current?.id}
        className="w-full h-full object-contain bg-black"
        src={current?.videoUrl}
        autoPlay
        muted
        loop
        controls
        playsInline
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
