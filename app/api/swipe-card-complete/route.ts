import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ExtendedSession } from "@/lib/types";
import { userProgress, challenges, userChallengeProgress } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const POINTS_PER_CHALLENGE = 20;
const PRACTICE_POINTS = 5;

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

    const challenge = await db.query.challenges.findFirst({
      where: eq(challenges.id, challengeId),
    });

    if (!challenge) {
      return new NextResponse("Challenge not found", { status: 404 });
    }

    const existingProgress = await db.query.userChallengeProgress.findFirst({
      where: and(
        eq(userChallengeProgress.userId, session.user.id),
        eq(userChallengeProgress.challengeId, challengeId),
        eq(userChallengeProgress.isCompleted, true)
      ),
    });

    const now = new Date();

    if (existingProgress) {
      let userProgressData = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, session.user.id),
      });

      if (!userProgressData) {
         await db.insert(userProgress).values({
          userId: session.user.id,
          userName: session.user.name || "User",
          userImageSrc: session.user.image || "/mascot.svg",
          points: PRACTICE_POINTS,
          streak: 1,
          lastStreakUpdate: now,
        });
        return NextResponse.json({ status: 'practice', pointsAwarded: PRACTICE_POINTS }, { status: 200 });
      }

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

      await db.update(userProgress).set({
        points: userProgressData.points + PRACTICE_POINTS,
        streak: newStreak,
        lastStreakUpdate: now,
      }).where(eq(userProgress.userId, session.user.id));

      return NextResponse.json({ status: 'practice', pointsAwarded: PRACTICE_POINTS }, { status: 200 });
    }

    let userProgressData = await db.query.userProgress.findFirst({
      where: eq(userProgress.userId, session.user.id),
    });

    if (!userProgressData) {
      await db.insert(userProgress).values({
        userId: session.user.id,
        userName: session.user.name || "User",
        userImageSrc: session.user.image || "/mascot.svg",
        points: POINTS_PER_CHALLENGE,
        streak: 1,
        lastStreakUpdate: now,
      });
    } else {
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

      await db.update(userProgress).set({
        points: userProgressData.points + POINTS_PER_CHALLENGE,
        streak: newStreak,
        lastStreakUpdate: now,
      }).where(eq(userProgress.userId, session.user.id));
    }

    await db.insert(userChallengeProgress).values({
      userId: session.user.id,
      challengeId,
      isCompleted: true,
      xpAwarded: true,
      completedAt: now,
    });

    return NextResponse.json({ status: 'completed', pointsAwarded: POINTS_PER_CHALLENGE }, { status: 200 });
  } catch (error) {
    console.error("[SWIPE_CARD_COMPLETE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
