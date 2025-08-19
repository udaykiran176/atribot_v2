import { NextRequest, NextResponse } from "next/server";
import { getVideoLessonsByChallengeId } from "@/db/queries";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get("challengeId");

    if (!challengeId || isNaN(parseInt(challengeId))) {
      return NextResponse.json(
        { error: "Invalid challenge ID" },
        { status: 400 }
      );
    }

    const lessons = await getVideoLessonsByChallengeId(parseInt(challengeId));
    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Error fetching video lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch video lessons" },
      { status: 500 }
    );
  }
}
