import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { userProgress, challenges, userChallengeProgress } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const POINTS_PER_LESSON = 20;
const PRACTICE_POINTS = 5;

export async function POST(req: Request) {
  try {
    const { session, user } = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json().catch(() => null) as { challengeId?: number } | null;
    const challengeId = body?.challengeId;
    if (!challengeId || typeof challengeId !== 'number') {
      return new NextResponse("Invalid challengeId", { status: 400 });
    }

    // Ensure the challenge exists
    const challenge = await db.query.challenges.findFirst({
      where: eq(challenges.id, challengeId),
    });

    if (!challenge) {
      return new NextResponse("Challenge not found", { status: 404 });
    }

    // Check per-user completion
    const existingChallengeProgress = await db.query.userChallengeProgress.findFirst({
      where: and(
        eq(userChallengeProgress.userId, user.id),
        eq(userChallengeProgress.challengeId, challengeId),
        eq(userChallengeProgress.isCompleted, true)
      ),
    });

    // If already completed by this user, treat as practice — award small XP and update streak
    if (existingChallengeProgress) {
      // Ensure user progress exists
      let currentUserProgress = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, user.id),
      });

      const now = new Date();

      if (!currentUserProgress) {
        await db.insert(userProgress).values({
          userId: user.id,
          userName: user.name || "User",
          userImageSrc: user.image || "/mascot.svg",
          points: PRACTICE_POINTS,
          streak: 1,
          lastStreakUpdate: now,
        });

        return NextResponse.json({ status: 'practice', pointsAwarded: PRACTICE_POINTS }, { status: 200 });
      }

      // Calculate streak (same logic as first-time completion)
      const lastUpdate = currentUserProgress.lastStreakUpdate ? new Date(currentUserProgress.lastStreakUpdate) : null;
      let newStreak = currentUserProgress.streak;
      if (lastUpdate) {
        const diffTime = Math.abs(now.getTime() - lastUpdate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 1) {
          newStreak = 1;
        } else if (now.getDate() !== lastUpdate.getDate()) {
          newStreak += 1;
        }
      } else {
        newStreak = 1;
      }

      await db.update(userProgress).set({
        points: currentUserProgress.points + PRACTICE_POINTS,
        streak: newStreak,
        lastStreakUpdate: now,
      }).where(eq(userProgress.userId, user.id));

      return NextResponse.json({ status: 'practice', pointsAwarded: PRACTICE_POINTS }, { status: 200 });
    }

    // Ensure user progress exists
    let currentUserProgress = await db.query.userProgress.findFirst({
      where: eq(userProgress.userId, user.id),
    });

    const now = new Date();

    if (!currentUserProgress) {
      await db.insert(userProgress).values({
        userId: user.id,
        userName: user.name || "User",
        userImageSrc: user.image || "/mascot.svg",
        points: POINTS_PER_LESSON,
        streak: 1,
        lastStreakUpdate: now,
      });

      // Record per-user completion
      await db.insert(userChallengeProgress).values({
        userId: user.id,
        challengeId,
        isCompleted: true,
        xpAwarded: true,
        completedAt: now,
      });

      return NextResponse.json({ status: 'completed', pointsAwarded: POINTS_PER_LESSON }, { status: 200 });
    }

    // Calculate streak
    const lastUpdate = currentUserProgress.lastStreakUpdate ? new Date(currentUserProgress.lastStreakUpdate) : null;
    let newStreak = currentUserProgress.streak;
    if (lastUpdate) {
      const diffTime = Math.abs(now.getTime() - lastUpdate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        newStreak = 1;
      } else if (now.getDate() !== lastUpdate.getDate()) {
        newStreak += 1;
      }
    } else {
      newStreak = 1;
    }

    // Award points and update streak for first-time completion only
    await db.update(userProgress).set({
      points: currentUserProgress.points + POINTS_PER_LESSON,
      streak: newStreak,
      lastStreakUpdate: now,
    }).where(eq(userProgress.userId, user.id));

    // Record per-user completion
    await db.insert(userChallengeProgress).values({
      userId: user.id,
      challengeId,
      isCompleted: true,
      xpAwarded: true,
      completedAt: now,
    });

    return NextResponse.json({ status: 'completed', pointsAwarded: POINTS_PER_LESSON }, { status: 200 });
  } catch (error) {
    console.error("[LESSON_COMPLETE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
