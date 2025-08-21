import { getInteractiveGameByChallengeId } from "@/db/queries";
import { InteractiveGamePageClient } from "@/components/interactive-game-page-client";

type PageProps = {
  searchParams: Promise<{ challengeId?: string }>;
};

export default async function InteractiveGamePage({ searchParams }: PageProps) {
  const { challengeId } = await searchParams;

  if (!challengeId || isNaN(Number(challengeId))) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="text-lg font-semibold">Missing or invalid challengeId</p>
        <p className="text-sm text-muted-foreground mt-2">Pass a valid numeric challengeId in the URL query.</p>
      </div>
    );
  }

  const game = await getInteractiveGameByChallengeId(Number(challengeId));

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="text-lg font-semibold">Interactive game not found</p>
        <p className="text-sm text-muted-foreground mt-2">No game is mapped to this challenge.</p>
      </div>
    );
  }

  return (
    <InteractiveGamePageClient componentPath={game.componentPath} />
  );
}
