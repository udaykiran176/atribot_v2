import { NextRequest, NextResponse } from "next/server";
import { getBuildItThoughtByChallengeId } from "@/db/queries";

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

    const videos = await getBuildItThoughtByChallengeId(parseInt(challengeId));
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching build it thought videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch build it thought videos" },
      { status: 500 }
    );
  }
}
