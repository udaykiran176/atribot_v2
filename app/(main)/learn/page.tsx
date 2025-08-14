import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserProgress } from "@/db/queries";
import { headers } from "next/headers";

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

    // If we have the course data, display it
    if (userProgress.activeCourse) {
      return (
        <div className="flex flex-col p-6">
          <h1 className="text-2xl font-bold mb-4">
            Learning: {userProgress.activeCourse.title}
          </h1>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                {userProgress.activeCourse.imageSrc ? (
                  <img 
                    src={userProgress.activeCourse.imageSrc} 
                    alt={userProgress.activeCourse.title}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <span className="text-gray-500">📚</span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{userProgress.activeCourse.title}</h2>
                <p className="text-gray-600">In Progress</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // If we don't have course data but have an ID, show a loading state
    return (
      <div className="flex flex-col p-6">
        <h1 className="text-2xl font-bold mb-4">Loading your course...</h1>
      </div>
    );
    
  } catch (error) {
    console.error("Error in LearnPage:", error);
    return redirect("/courses");
  }
}