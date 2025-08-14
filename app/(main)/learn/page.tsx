import { redirect } from "next/navigation";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import {
  getCourseProgress,
  getLessonPercentage,
  getUnits,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";

import { Header } from "./header";
import { Unit } from "./unit";

const LearnPage = async () => {
  try {
    // First, get user progress to check if we need to redirect
    const userProgress = await getUserProgress();
    
    // Redirect early if no user progress or active course
    if (!userProgress || !userProgress.activeCourse) {
      return redirect("/courses");
    }

    // Then fetch other data in parallel
    const [
      units,
      courseProgress,
      lessonPercentage,
      userSubscription,
    ] = await Promise.all([
      getUnits().catch(() => []),
      getCourseProgress(),
      getLessonPercentage().catch(() => 0),
      getUserSubscription(),
    ]);

    const activeCourse = userProgress.activeCourse;
    const isPro = !!userSubscription?.isActive;

    // If no course progress but we have an active course, redirect to courses
    if (!courseProgress && userProgress.activeCourseId) {
      return redirect('/courses');
    }

    return (
      <div className="flex flex-row-reverse gap-[48px] px-6">
        <StickyWrapper>
          <UserProgress
            activeCourse={activeCourse}
            hearts={userProgress.hearts}
            points={userProgress.points}
            hasActiveSubscription={isPro}
          />
          {!isPro && <Promo />}
          <Quests points={userProgress.points} />
        </StickyWrapper>
        
        <FeedWrapper>
          <Header title={activeCourse.title} />
          {!units || units.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No learning content available at the moment.</p>
            </div>
          ) : (
            units.map((unit) => (
              <div key={unit.id} className="mb-10">
                <Unit
                  id={unit.id}
                  order={unit.order}
                  description={unit.description || ''}
                  title={unit.title}
                  lessons={unit.lessons || []}
                  activeLesson={courseProgress?.activeLesson}
                  activeLessonPercentage={lessonPercentage}
                />
              </div>
            ))
          )}
        </FeedWrapper>
      </div>
    );
  } catch (error) {
    console.error('Error in LearnPage:', error);
    // Optionally redirect to an error page or show a user-friendly message
    redirect('/error');
  }
};

export default LearnPage;
