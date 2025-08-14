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
    console.log('Fetching user progress...');
    const userProgress = await getUserProgress().catch(error => {
      console.error('Error getting user progress:', error);
      return null;
    });
    
    console.log('User progress:', userProgress);
    
    // Check if we need to redirect
    if (!userProgress || !userProgress.activeCourse) {
      console.log('No user progress or active course found, will redirect to /courses');
      // Instead of redirecting, we'll show a message and a button to go to courses
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">No Active Course</h1>
          <p className="text-muted-foreground mb-6">
            Please select a course to continue learning.
          </p>
          <a 
            href="/courses" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Choose a Course
          </a>
        </div>
      );
    }

    console.log('Fetching additional data...');
    let units: any[] = [];
    let courseProgress: any = null;
    let lessonPercentage: number = 0;
    let userSubscription: any = null;

    try {
      [units, courseProgress, lessonPercentage, userSubscription] = await Promise.all([
        getUnits().catch(error => {
          console.error('Error getting units:', error);
          return [];
        }),
        getCourseProgress().catch(error => {
          console.error('Error getting course progress:', error);
          return null;
        }),
        getLessonPercentage().catch(error => {
          console.error('Error getting lesson percentage:', error);
          return 0;
        }),
        getUserSubscription().catch(error => {
          console.error('Error getting user subscription:', error);
          return null;
        }),
      ]);
    } catch (error) {
      console.error('Error in parallel data fetching:', error);
      // Continue with default values instead of redirecting to error
    }

    const activeCourse = userProgress.activeCourse;
    const isPro = !!userSubscription?.isActive;

    console.log('Course progress:', courseProgress);
    console.log('Active course ID:', userProgress.activeCourseId);

    // If no course progress but we have an active course, initialize it
    if (!courseProgress && userProgress.activeCourseId) {
      console.log('No course progress found, initializing...');
      // We'll continue rendering with empty course progress
      // The UI should handle this state appropriately
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
    // Instead of redirecting to /error, show a user-friendly message
    // This prevents the infinite redirect loop
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          We're having trouble loading your learning content. Please try again later.
        </p>
        <a 
          href="/courses" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Courses
        </a>
      </div>
    );
  }
};

export default LearnPage;
