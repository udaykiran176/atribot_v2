import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { challenges, topics, courses } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const allChallenges = await db
      .select({
        id: challenges.id,
        topicId: challenges.topicId,
        type: challenges.type,
        title: challenges.title,
        description: challenges.description,
        content: challenges.content,
        order: challenges.order,
        topicTitle: topics.title,
        courseTitle: courses.title,
      })
      .from(challenges)
      .leftJoin(topics, eq(challenges.topicId, topics.id))
      .leftJoin(courses, eq(topics.courseId, courses.id))
      .orderBy(desc(challenges.id));

    return NextResponse.json(allChallenges);
  } catch (error) {
    console.error("Failed to fetch challenges:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenges" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topicId, type, title, description, content, order } = body;

    if (!topicId || !type || !title) {
      return NextResponse.json(
        { error: "Topic ID, type, and title are required" },
        { status: 400 }
      );
    }

    const [newChallenge] = await db
      .insert(challenges)
      .values({
        topicId: parseInt(topicId),
        type,
        title,
        description: description || null,
        content: content || null,
        order: order || 0,
      })
      .returning();

    return NextResponse.json(newChallenge, { status: 201 });
  } catch (error) {
    console.error("Failed to create challenge:", error);
    return NextResponse.json(
      { error: "Failed to create challenge" },
      { status: 500 }
    );
  }
}
