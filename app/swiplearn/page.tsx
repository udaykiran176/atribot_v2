import { getSwipeCardsByChallengeId } from "@/db/queries";
import SwipeLearnClient from "./swipe-learn-client";

type Props = {
  searchParams?: { challengeId?: string };
};

export default async function SwipeLearnPage({ searchParams }: Props) {
  const challengeIdParam = searchParams?.challengeId ?? "";
  const challengeId = Number(challengeIdParam);
  const valid = Number.isFinite(challengeId) && challengeId > 0;

  if (!valid) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          Provide a valid challengeId in the URL, e.g. /swiplearn?challengeId=123
        </div>
      </div>
    );
  }

  const cards = await getSwipeCardsByChallengeId(challengeId);

  return <SwipeLearnClient initialCards={cards} challengeId={challengeId} />;
}
