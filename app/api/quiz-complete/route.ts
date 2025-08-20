import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { userChallengeProgress, userProgress } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { challengeId, score, answers, totalQuestions } = body;

    if (!challengeId || score === undefined) {
      return NextResponse.json(
        { error: "Challenge ID and score are required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Check if user has already completed this challenge
    const existingProgress = await db
      .select()
      .from(userChallengeProgress)
      .where(
        sql`${userChallengeProgress.userId} = ${userId} AND ${userChallengeProgress.challengeId} = ${challengeId}`
      )
      .limit(1);

    if (existingProgress.length > 0) {
      // Update existing progress
      await db
        .update(userChallengeProgress)
        .set({
          isCompleted: true,
          xpAwarded: true,
          completedAt: new Date(),
        })
        .where(
          sql`${userChallengeProgress.userId} = ${userId} AND ${userChallengeProgress.challengeId} = ${challengeId}`
        );
    } else {
      // Create new progress record
      await db.insert(userChallengeProgress).values({
        userId,
        challengeId,
        isCompleted: true,
        xpAwarded: true,
        completedAt: new Date(),
      });
    }

    // Update user's total points with the earned XP
    await db
      .update(userProgress)
      .set({
        points: sql`${userProgress.points} + ${score}`,
      })
      .where(eq(userProgress.userId, userId));

    return NextResponse.json({
      success: true,
      xpEarned: score,
      message: "Quiz completed successfully!",
    });
  } catch (error) {
    console.error("Error completing quiz:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
