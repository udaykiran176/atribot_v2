import Image from "next/image";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Progress } from "@/components/ui/progress";
import { UserProgress } from "@/components/user-progress";
import { QUESTS } from "@/constants";
import { getUserProgress, getUserSubscription } from "@/db/queries";

const QuestsPage = async () => {
  try {
    const [userProgress, userSubscription] = await Promise.all([
      getUserProgress(),
      getUserSubscription(),
    ]);

    if (!userProgress || !userProgress.activeCourse) {
      redirect("/courses");
    }

    const isPro = !!userSubscription?.isActive;
    
    // Ensure QUESTS is defined and is an array
    const quests = Array.isArray(QUESTS) ? QUESTS : [];

    return (
      <div className="flex flex-row-reverse gap-[48px] px-6">
        <StickyWrapper>
          <UserProgress
            activeCourse={userProgress.activeCourse}
            hearts={userProgress.hearts}
            points={userProgress.points}
            hasActiveSubscription={isPro}
          />
          {!isPro && <Promo />}
        </StickyWrapper>

        <FeedWrapper>
          <div className="flex w-full flex-col items-center">
            <Image src="/sidebar_icon/quests.png" alt="Quests" height={90} width={90} />

            <h1 className="my-6 text-center text-2xl font-bold text-neutral-800">
              Quests
            </h1>
            <p className="mb-6 text-center text-lg text-muted-foreground">
              Complete quests by earning points.
            </p>

            <ul className="w-full">
              {quests.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  No quests available at the moment.
                </div>
              ) : quests.map((quest) => {
                const progress = Math.min((userProgress.points / quest.value) * 100, 100);

                return (
                  <div
                    className="flex w-full items-center gap-x-4 border-t-2 p-4"
                    key={quest.title}
                  >
                    <Image
                      src="/points.svg"
                      alt="Points"
                      width={60}
                      height={60}
                    />

                    <div className="flex w-full flex-col gap-y-2">
                      <p className="text-xl font-bold text-neutral-700">
                        {quest.title}
                      </p>
                      <Progress value={progress} className="h-3" />
                    </div>
                  </div>
                );
              })}
            </ul>
          </div>
        </FeedWrapper>
      </div>
    );
  } catch (error) {
    console.error('Error in QuestsPage:', error);
    // Optionally redirect to an error page or show a user-friendly message
    redirect('/error');
  }
};

export default QuestsPage;
