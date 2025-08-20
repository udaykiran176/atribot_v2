import { NextRequest, NextResponse } from "next/server";
import { getQuizzesByChallengeId } from "@/db/queries";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get("challengeId");

    if (!challengeId) {
      return NextResponse.json(
        { error: "Challenge ID is required" },
        { status: 400 }
      );
    }

    const challengeIdNum = parseInt(challengeId, 10);
    if (isNaN(challengeIdNum)) {
      return NextResponse.json(
        { error: "Invalid challenge ID" },
        { status: 400 }
      );
    }

    const questions = await getQuizzesByChallengeId(challengeIdNum);

    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: "No quiz questions found for this challenge" },
        { status: 404 }
      );
    }

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
