import { NextRequest, NextResponse } from "next/server";
import { getSwipeCardsByChallengeId } from "@/db/queries";

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

    const cards = await getSwipeCardsByChallengeId(parseInt(challengeId));
    return NextResponse.json(cards);
  } catch (error) {
    console.error("Error fetching swipe cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch swipe cards" },
      { status: 500 }
    );
  }
}
