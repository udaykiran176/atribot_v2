import {cache} from "react";
import {db} from "@/db/drizzle";
import { courses, userProgress, topics, challenges, videoLessons, userChallengeProgress, user, swipeCards, buildItThought, quizzes, interactiveGames } from "./schema";
import { eq, asc, desc, gt, sql, and } from "drizzle-orm";

type TopicWithChallenges = {
  id: number;
  title: string;
  description: string | null;
  imageSrc: string;
  order: number;
  challenges: Array<{
    id: number | null;
    type: string | null;
    title: string | null;
    description: string | null;
    order: number | null;
    content: string | null;
    isCompleted?: boolean | null;
  }>;
};

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

// Get interactive game by challenge ID (componentPath)
export const getInteractiveGameByChallengeId = cache(async (challengeId: number) => {
  try {
    const rows = await db
      .select()
      .from(interactiveGames)
      .where(eq(interactiveGames.challengeId, challengeId))
      .limit(1);
    return rows[0] ?? null as null | { id: number; challengeId: number; componentPath: string; createdAt: Date };
  } catch (error) {
    console.error("Error fetching interactive game by challengeId:", error);
    return null;
  }
});

// Get swipe cards by challenge ID
export const getSwipeCardsByChallengeId = cache(async (challengeId: number) => {
  try {
    const cards = await db
      .select()
      .from(swipeCards)
      .where(eq(swipeCards.challengeId, challengeId))
      .orderBy(asc(swipeCards.order));
    return cards;
  } catch (error) {
    console.error("Error fetching swipe cards by challengeId:", error);
    return [] as Array<{ id: number; challengeId: number; image: string; title: string; description: string | null; order: number }>;
  }
});

// Get build it thought videos by challenge ID
export const getBuildItThoughtByChallengeId = cache(async (challengeId: number) => {
  try {
    const videos = await db
      .select()
      .from(buildItThought)
      .where(eq(buildItThought.challengeId, challengeId))
      .orderBy(asc(buildItThought.order));
    return videos;
  } catch (error) {
    console.error("Error fetching build it thought videos by challengeId:", error);
    return [] as Array<{ id: number; challengeId: number; videoUrl: string; order: number; createdAt: Date }>;
  }
});

// Get quizzes by challenge ID
export const getQuizzesByChallengeId = cache(async (challengeId: number) => {
  try {
    const quizData = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.challengeId, challengeId))
      .orderBy(asc(quizzes.order));
    return quizData;
  } catch (error) {
    console.error("Error fetching quizzes by challengeId:", error);
    return [] as Array<{ id: number; challengeId: number; question: string; options: string; correctAnswer: number; order: number; createdAt: Date }>;
  }
});

// Get swipe cards for a given topic title
export const getSwipeCardsForTopic = cache(async (topicTitle: string) => {
  try {
    const rows = await db
      .select({
        cardId: swipeCards.id,
        image: swipeCards.image,
        title: swipeCards.title,
        description: swipeCards.description,
        order: swipeCards.order,
      })
      .from(topics)
      .where(eq(topics.title, topicTitle))
      .leftJoin(challenges, and(eq(challenges.topicId, topics.id), eq(challenges.type, "swipe_cards")))
      .leftJoin(swipeCards, eq(swipeCards.challengeId, challenges.id))
      .orderBy(asc(swipeCards.order));

    // filter out nulls if no swipe cards
    return rows.filter(r => r.cardId != null);
  } catch (error) {
    console.error("Error fetching swipe cards for topic:", error);
    return [] as Array<{ cardId: number; image: string; title: string; description: string | null; order: number }>;
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
export const getCourseTopicsWithChallenges = cache(async (courseId: number, userId?: string) => {
  try {
    // rows: one row per (topic x challenge)
    const rows = await db
      .select({
        topicId: topics.id,
        topicTitle: topics.title,
        topicDescription: topics.description,
        topicImageSrc: topics.imageSrc,
        topicOrder: topics.order,
        challengeId: challenges.id,
        challengeType: challenges.type,
        challengeTitle: challenges.title,
        challengeDescription: challenges.description,
        challengeOrder: challenges.order,
        challengeContent: challenges.content,
        challengeCompleted: userId ? userChallengeProgress.isCompleted : sql<boolean>`false`,
      })
      .from(topics)
      .where(eq(topics.courseId, courseId))
      .leftJoin(challenges, eq(challenges.topicId, topics.id))
      .leftJoin(
        userChallengeProgress,
        userId
          ? and(
              eq(userChallengeProgress.challengeId, challenges.id),
              eq(userChallengeProgress.userId, userId)
            )
          : eq(userChallengeProgress.challengeId, sql`NULL`) // noop when no user
      )
      .orderBy(asc(topics.order), asc(challenges.order));

    // group by topic
    const map = new Map<number, TopicWithChallenges>();

    for (const r of rows) {
      if (!map.has(r.topicId)) {
        map.set(r.topicId, {
          id: r.topicId,
          title: r.topicTitle,
          description: r.topicDescription ?? null,
          imageSrc: r.topicImageSrc,
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
          isCompleted: (r as any).challengeCompleted ?? false,
        });
      }
    }

    const result = Array.from(map.values()).sort((a, b) => a.order - b.order) as TopicWithChallenges[];
    return result;
  } catch (error) {
    console.error("Error fetching course topics/challenges:", error);
    return [] as any[];
  }
});

// Update user's active course
export const getVideoLessonsByChallengeId = cache(async (challengeId: number) => {
  try {
    const lessons = await db
      .select()
      .from(videoLessons)
      .where(eq(videoLessons.challengeId, challengeId))
      .orderBy(asc(videoLessons.order));
    
    return lessons;
  } catch (error) {
    console.error("Error fetching video lessons:", error);
    return [];
  }
});

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

// Leaderboard: top N users by points
export const getLeaderboardTop = cache(async (limit = 10) => {
  try {
    const rows = await db
      .select({
        userId: userProgress.userId,
        userName: sql<string>`coalesce(${user.childName}, ${userProgress.userName})`,
        userImageSrc: userProgress.userImageSrc,
        points: userProgress.points,
      })
      .from(userProgress)
      .leftJoin(user, eq(user.id, userProgress.userId))
      .orderBy(desc(userProgress.points))
      .limit(limit);
    return rows;
  } catch (error) {
    console.error("Error fetching leaderboard top:", error);
    return [] as Array<{userId: string; userName: string; userImageSrc: string; points: number}>;
  }
});

// Leaderboard: get a user's rank based on points (1-based)
export const getUserRank = cache(async (userId: string) => {
  try {
    const user = await db
      .select({
        userId: userProgress.userId,
        points: userProgress.points,
      })
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .then(r => r[0]);

    if (!user) return null;

    const higherCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(userProgress)
      .where(gt(userProgress.points, user.points))
      .then(r => (r[0]?.count ?? 0));

    return { rank: higherCount + 1, points: user.points } as { rank: number; points: number };
  } catch (error) {
    console.error("Error calculating user rank:", error);
    return null;
  }
});

// Mark challenge as completed for a user
export const markChallengeCompleted = async (userId: string, challengeId: number) => {
  try {
    await db
      .insert(userChallengeProgress)
      .values({
        userId,
        challengeId,
        isCompleted: true,
        completedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [userChallengeProgress.userId, userChallengeProgress.challengeId],
        set: {
          isCompleted: true,
          completedAt: new Date(),
        },
      });
    return true;
  } catch (error) {
    console.error("Error marking challenge as completed:", error);
    return false;
  }
};
