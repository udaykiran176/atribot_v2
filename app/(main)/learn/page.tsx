import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserProgress, getCourseTopicsWithChallenges } from "@/db/queries";
import { headers } from "next/headers";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import LearnClient from "./learn-client";



export default async function LearnPage() {
  
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session?.user?.id) {
      return redirect("/login");
    }

    const userProgress = await getUserProgress(session.user.id);
    
    // If user has no active course, redirect to courses page
    if (!userProgress?.activeCourseId) {
      return redirect("/courses");
    }

    // If we have the course data, display it along with topics/challenges JSON
    if (userProgress.activeCourse) {
      const toc = await getCourseTopicsWithChallenges(userProgress.activeCourseId);
      return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
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
          </FeedWrapper>
        </div>
      );
    }
  } catch (error) {
    console.error("Error in LearnPage:", error);
    return redirect("/courses");
  }
}