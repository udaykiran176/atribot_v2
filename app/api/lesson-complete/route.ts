import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ExtendedSession } from "@/lib/types";
import { userProgress, challenges, userChallengeProgress } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const POINTS_PER_LESSON = 20;

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    }) as ExtendedSession | null;

    if (!session?.user?.id) {
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
    const existingProgress = await db.query.userChallengeProgress.findFirst({
      where: and(
        eq(userChallengeProgress.userId, session.user.id),
        eq(userChallengeProgress.challengeId, challengeId),
        eq(userChallengeProgress.isCompleted, true)
      ),
    });

    // If already completed by this user, treat as practice — do NOT alter points/streak
    if (existingProgress) {
      return NextResponse.json(
        { status: 'practice', message: 'Already completed. No additional points awarded.' },
        { status: 200 }
      );
    }

    // Ensure user progress exists
    let userProgressData = await db.query.userProgress.findFirst({
      where: eq(userProgress.userId, session.user.id),
    });

    const now = new Date();

    if (!userProgressData) {
      await db.insert(userProgress).values({
        userId: session.user.id,
        userName: session.user.name || "User",
        userImageSrc: session.user.image || "/mascot.svg",
        points: POINTS_PER_LESSON,
        streak: 1,
        lastStreakUpdate: now,
      });

      // Record per-user completion
      await db.insert(userChallengeProgress).values({
        userId: session.user.id,
        challengeId,
        isCompleted: true,
        xpAwarded: true,
        completedAt: now,
      });

      return NextResponse.json({ status: 'completed', pointsAwarded: POINTS_PER_LESSON }, { status: 200 });
    }

    // Calculate streak
    const lastUpdate = userProgressData.lastStreakUpdate ? new Date(userProgressData.lastStreakUpdate) : null;
    let newStreak = userProgressData.streak;
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
      points: userProgressData.points + POINTS_PER_LESSON,
      streak: newStreak,
      lastStreakUpdate: now,
    }).where(eq(userProgress.userId, session.user.id));

    // Record per-user completion
    await db.insert(userChallengeProgress).values({
      userId: session.user.id,
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
