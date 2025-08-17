import { getAllCourses, getUserProgress } from "@/db/queries";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextLessonCard } from "./next-lesson-card";

const NextLesson = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return redirect("/login");
  }

  const coursesData = getAllCourses();
  const userProgressData = getUserProgress(session.user.id);

  const [courses, userProgress] = await Promise.all([coursesData, userProgressData]);

  if (!userProgress?.activeCourseId) {
    return null;
  }

  const activeCourseIndex = courses.findIndex(
    (course) => course.id === userProgress.activeCourseId
  );

  if (activeCourseIndex === -1) {
    return null; 
  }

  const nextCourse = courses[activeCourseIndex + 1];

  if (!nextCourse) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-neutral-700 mb-4">Next up</h2>
      <NextLessonCard
        id={nextCourse.id}
        title={nextCourse.title}
        imageSrc={nextCourse.imageSrc}
        activeCourseId={userProgress.activeCourseId}
      />
    </div>
  );
};

export default NextLesson;
