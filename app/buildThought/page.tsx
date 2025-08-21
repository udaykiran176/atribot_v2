"use client";

import { Suspense, useState, useEffect } from "react";
import { BuildThoughtPlayer, type VideoItem } from "./video-player";
import { useContext } from "react";
import { BuildThoughtContext } from "./context";

type Props = { searchParams: Promise<{ id?: string }>; };

function BuildThoughtDataLoader() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ctx = useContext(BuildThoughtContext);

  useEffect(() => {
    async function fetchVideos() {
      if (!ctx?.challengeId || isNaN(ctx.challengeId)) {
        setError("Invalid challenge ID");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/build-it-thought?challengeId=${ctx.challengeId}`);
        if (!res.ok) throw new Error('Failed to fetch videos');
        const data = await res.json();
        setVideos(data || []);
        if (data && data.length > 0) {
          ctx.setTotalVideos(data.length);
          ctx.setCurrentVideo(1);
          ctx.setHasVideos(true);
        } else {
          ctx.setHasVideos(false);
        }
      } catch (e) {
        console.error('Error fetching BuildThought videos:', e);
        setError('Failed to load videos');
        setVideos([]);
        ctx?.setHasVideos(false);
      } finally {
        setLoading(false);
      }
    }
    if (ctx?.challengeId) fetchVideos();
  }, [ctx?.challengeId]);

  return <BuildThoughtPlayer videos={videos} loading={loading} error={error} />;
}

export default function BuildThoughtPage({ searchParams }: Props) {
  const ctx = useContext(BuildThoughtContext);

  useEffect(() => {
    async function setId() {
      const params = await searchParams;
      if (params?.id && !ctx?.challengeId) {
        const id = parseInt(params.id, 10);
        if (!isNaN(id)) ctx?.setChallengeId(id);
      }
    }
    setId();
  }, [searchParams, ctx?.challengeId]);

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="text-gray-500">Loading build-it-thought...</div></div>}>
      <div className="flex items-center justify-center lg:h-full">
        <BuildThoughtDataLoader />
      </div>
    </Suspense>
  );
}
