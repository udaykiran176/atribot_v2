import { getBuildItThoughtByChallengeId } from "@/db/queries";
import { BuildThoughtPageClient } from "@/components/build-thought/page-client";
import { SoundProvider } from "@/components/SoundContext";

type PageProps = {
  searchParams: Promise<{ challengeId?: string }>;
};

export default async function BuildThoughtPage({ searchParams }: PageProps) {
  const { challengeId } = await searchParams;

  if (!challengeId || isNaN(Number(challengeId))) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="text-lg font-semibold">Missing or invalid challengeId</p>
        <p className="text-sm text-muted-foreground mt-2">Pass a valid numeric challengeId in the URL query.</p>
      </div>
    );
  }

  const videos = await getBuildItThoughtByChallengeId(Number(challengeId));

  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="text-lg font-semibold">No build thought videos found</p>
        <p className="text-sm text-muted-foreground mt-2">No videos are mapped to this challenge.</p>
      </div>
    );
  }

  return (
    <SoundProvider>
      <BuildThoughtPageClient videos={videos} />
    </SoundProvider>
  );
}