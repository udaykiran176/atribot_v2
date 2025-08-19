import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserProgress, getCourseTopicsWithChallenges } from "@/db/queries";
import { headers } from "next/headers";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import LearnClient from "./learn-client";
import { CertificateCard } from "./certificate-card";
import RedirectTo from "@/components/redirect-to";

export default async function LearnPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return <RedirectTo href="/login" />;
  }

  const userProgress = await getUserProgress(session.user.id);

  // If user has no active course, redirect to courses page
  if (!userProgress?.activeCourseId || !userProgress.activeCourse) {
    return <RedirectTo href="/courses" />;
  }

  const toc = await getCourseTopicsWithChallenges(userProgress.activeCourseId, session.user.id);
  return (
    <div className="flex flex-row-reverse gap-[48px] px-6 pb-12 lg:pb-0">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          //hearts={userProgress.hearts}
          streak={userProgress.streak}
          points={userProgress.points}
          // hasActiveSubscription={isPro}
        />
      </StickyWrapper>
      <FeedWrapper>
        <LearnClient courseTitle={userProgress.activeCourse.title} topics={toc as any} />
        {/*get get certificate card*/}
        <div>
          <CertificateCard />
        </div>
      </FeedWrapper>
    </div>
  );
}