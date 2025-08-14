import {cache} from "react";
import {db} from "@/db/drizzle";
import { courses, userProgress, topics, challenges } from "./schema";
import { eq, asc } from "drizzle-orm";

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

// Get topics with their 5 challenges for a course
export const getCourseTopicsWithChallenges = cache(async (courseId: number) => {
  try {
    // rows: one row per (topic x challenge)
    const rows = await db
      .select({
        topicId: topics.id,
        topicTitle: topics.title,
        topicDescription: topics.description,
        topicOrder: topics.order,
        challengeId: challenges.id,
        challengeType: challenges.type,
        challengeTitle: challenges.title,
        challengeDescription: challenges.description,
        challengeOrder: challenges.order,
        challengeContent: challenges.content,
      })
      .from(topics)
      .where(eq(topics.courseId, courseId))
      .leftJoin(challenges, eq(challenges.topicId, topics.id))
      .orderBy(asc(topics.order), asc(challenges.order));

    // group by topic
    const map = new Map<number, {
      id: number;
      title: string;
      description: string | null;
      order: number;
      challenges: Array<{
        id: number | null;
        type: string | null;
        title: string | null;
        description: string | null;
        order: number | null;
        content: string | null;
      }>;
    }>();

    for (const r of rows) {
      if (!map.has(r.topicId)) {
        map.set(r.topicId, {
          id: r.topicId,
          title: r.topicTitle,
          description: r.topicDescription ?? null,
          order: r.topicOrder,
          challenges: [],
        });
      }
      if (r.challengeId != null) {
        map.get(r.topicId)!.challenges.push({
          id: r.challengeId,
          type: r.challengeType,
          title: r.challengeTitle,
          description: r.challengeDescription,
          order: r.challengeOrder,
          content: r.challengeContent,
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Error fetching course topics/challenges:", error);
    return [] as any[];
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
