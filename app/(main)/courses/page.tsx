import { getCourses, getUserProgress } from "@/db/queries";

import { List } from "./list";

const CoursesPage = async () => {
  try {
    const [courses, userProgress] = await Promise.all([
      getCourses().catch(() => []), // Return empty array if error
      getUserProgress(),
    ]);

    if (!courses || courses.length === 0) {
      return (
        <div className="mx-auto h-full max-w-[912px] px-3">
          <h1 className="text-2xl font-bold text-neutral-700">Robotics Courses</h1>
          <p className="mt-4 text-muted-foreground">No courses available at the moment. Please check back later.</p>
        </div>
      );
    }

    return (
      <div className="mx-auto h-full max-w-[912px] px-3">
        <h1 className="text-2xl font-bold text-neutral-700">Robotics Courses</h1>
        <List 
          courses={courses} 
          activeCourseId={userProgress?.activeCourseId} 
        />
      </div>
    );
  } catch (error) {
    console.error('Error in CoursesPage:', error);
    return (
      <div className="mx-auto h-full max-w-[912px] px-3">
        <h1 className="text-2xl font-bold text-neutral-700">Robotics Courses</h1>
        <p className="mt-4 text-muted-foreground">
          We're having trouble loading the courses. Please try again later.
        </p>
      </div>
    );
  }
};

export default CoursesPage;
