import {cache} from "react";
import {db} from "@/db/drizzle";
import { courses, userProgress } from "./schema";
import { eq } from "drizzle-orm";

// Get all courses with React cache for deduplication
export const getAllCourses = cache(async () => {
  try {
    const allCourses = await db.select().from(courses);
    return allCourses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
});

// Get user progress with active course details
export const getUserProgress = cache(async (userId: string) => {
  try {
    const result = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .leftJoin(courses, eq(userProgress.activeCourseId, courses.id))
      .then(rows => rows[0]);
      
    if (!result) return null;
    
    return {
      ...result.user_progress,
      activeCourse: result.courses || null
    };
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return null;
  }
});

// Update user's active course
export const updateUserProgress = async (userId: string, courseId: number) => {
  try {
    await db
      .insert(userProgress)
      .values({ userId, activeCourseId: courseId })
      .onConflictDoUpdate({
        target: userProgress.userId,
        set: { activeCourseId: courseId, points: 0 }
      });
    return true;
  } catch (error) {
    console.error("Error updating user progress:", error);
    return false;
  }
};
