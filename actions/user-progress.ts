"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ExtendedSession } from "@/lib/types";

import { db } from "@/db/drizzle";
import { getUserProgress, getAllCourses } from "@/db/queries";
import { userProgress } from "@/db/schema";

export const upsertUserProgress = async (courseId: number) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  }) as ExtendedSession | null;

  if (!session?.user?.id) {
    throw new Error("Unauthorized. Please sign in to continue.");
  }

  // Get all courses to validate the courseId
  const allCourses = await getAllCourses();
  const courseExists = allCourses.some(course => course.id === courseId);
  
  if (!courseExists) {
    throw new Error("Course not found. Please select a valid course.");
  }

  const existingUserProgress = await getUserProgress(session.user.id);

  try {
    if (existingUserProgress) {
      // Update existing user progress
      await db
        .update(userProgress)
        .set({
          activeCourseId: courseId,
          userName: session.user.name || "User",
          userImageSrc: session.user.image || "/mascot.svg",
        })
        .where(eq(userProgress.userId, session.user.id));
    } else {
      // Create new user progress
      await db.insert(userProgress).values({
        userId: session.user.id,
        activeCourseId: courseId,
        userName: session.user.name || "User",
        userImageSrc: session.user.image || "/mascot.svg",
      });
    }

    // Revalidate relevant paths with layout
    revalidatePath("/courses", 'layout');
    revalidatePath("/learn", 'layout');
    
    // Return success state instead of redirecting
    return { success: true, courseId };
  } catch (error) {
    console.error("Error updating user progress:", error);
    throw new Error("Failed to update course selection. Please try again.");
  }
};

export const reduceHearts = async (challengeId: number) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  }) as ExtendedSession | null;

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Implementation for reducing hearts would go here
  // This is a placeholder for future implementation
  return { error: "Not implemented" };
};