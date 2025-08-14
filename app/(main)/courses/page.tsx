import { getAllCourses, getUserProgress } from "@/db/queries";
import { auth } from "@/lib/auth";
import { List } from "./list";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const CoursesPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const coursesData = getAllCourses();
  const userProgressData = getUserProgress(session.user.id);

  const [courses, userProgress] = await Promise.all([
    coursesData,
    userProgressData,
  ]);

  return (
    <div className="mx-auto h-full max-w-[912px] px-3">
      <h1 className="text-2xl font-bold text-neutral-700">Robotics Courses</h1>

      <List courses={courses} activeCourseId={userProgress?.activeCourseId} />
    </div>
  );
};

export default CoursesPage;
