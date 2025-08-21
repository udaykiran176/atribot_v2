import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserProgress, markChallengeCompleted } from "@/db/queries";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { session, user } = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userProgress = await getUserProgress(user.id);

    return NextResponse.json(userProgress);
  } catch (error) {
    console.error("[USER_PROGRESS_GET_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { session, user } = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { xp, challengeId } = await req.json();

    if (!xp || typeof xp !== 'number') {
      return new NextResponse("Invalid XP value", { status: 400 });
    }

    // Get current progress
    const currentProgress = await getUserProgress(user.id);
    
    // Update points and streak
    const newPoints = (currentProgress?.points || 0) + xp;
    const newStreak = (currentProgress?.streak || 0) + 1; // Increment streak for completing quiz

    // Mark challenge as completed if challengeId is provided
    if (challengeId && typeof challengeId === 'number') {
      await markChallengeCompleted(user.id, challengeId);
    }

    // Update or insert user progress
    await db
      .insert(userProgress)
      .values({
        userId: user.id,
        points: newPoints,
        streak: newStreak,
      })
      .onConflictDoUpdate({
        target: userProgress.userId,
        set: {
          points: newPoints,
          streak: newStreak,
        },
      });

    return NextResponse.json({ points: newPoints, streak: newStreak });
  } catch (error) {
    console.error("[USER_PROGRESS_POST_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
