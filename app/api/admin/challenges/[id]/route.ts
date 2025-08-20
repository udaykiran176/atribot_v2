import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { challenges } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const challengeId = parseInt(params.id);
    const challenge = await db
      .select()
      .from(challenges)
      .where(eq(challenges.id, challengeId))
      .limit(1);

    if (challenge.length === 0) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(challenge[0]);
  } catch (error) {
    console.error("Failed to fetch challenge:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenge" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const challengeId = parseInt(params.id);
    const body = await request.json();
    const { topicId, type, title, description, content, order } = body;

    if (!topicId || !type || !title) {
      return NextResponse.json(
        { error: "Topic ID, type, and title are required" },
        { status: 400 }
      );
    }

    const [updatedChallenge] = await db
      .update(challenges)
      .set({
        topicId: parseInt(topicId),
        type,
        title,
        description: description || null,
        content: content || null,
        order: order || 0,
      })
      .where(eq(challenges.id, challengeId))
      .returning();

    if (!updatedChallenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedChallenge);
  } catch (error) {
    console.error("Failed to update challenge:", error);
    return NextResponse.json(
      { error: "Failed to update challenge" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const challengeId = parseInt(params.id);
    
    const [deletedChallenge] = await db
      .delete(challenges)
      .where(eq(challenges.id, challengeId))
      .returning();

    if (!deletedChallenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Challenge deleted successfully" });
  } catch (error) {
    console.error("Failed to delete challenge:", error);
    return NextResponse.json(
      { error: "Failed to delete challenge" },
      { status: 500 }
    );
  }
}
