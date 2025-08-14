import { getAllCourses } from "@/db/queries";

export default async function CoursesPage() {
  const courses = await getAllCourses();
  
  return (
    <div className="flex flex-col p-6">
      <h1 className="text-2xl font-bold mb-4">Robotics Courses</h1>
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
        {JSON.stringify(courses, null, 2)}
      </pre>
    </div>
  );
}