import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { topics, courses } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const allTopics = await db
      .select({
        id: topics.id,
        title: topics.title,
        description: topics.description,
        courseId: topics.courseId,
        imageSrc: topics.imageSrc,
        order: topics.order,
        course: {
          id: courses.id,
          title: courses.title,
        },
      })
      .from(topics)
      .leftJoin(courses, eq(topics.courseId, courses.id))
      .orderBy(desc(topics.id));

    return NextResponse.json(allTopics);
  } catch (error) {
    console.error("Failed to fetch topics:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, courseId, imageSrc, order } = body;

    if (!title || !courseId || !imageSrc) {
      return NextResponse.json(
        { error: "Title, course ID, and image source are required" },
        { status: 400 }
      );
    }

    const [newTopic] = await db
      .insert(topics)
      .values({
        title,
        description: description || null,
        courseId: parseInt(courseId),
        imageSrc,
        order: order || 0,
      })
      .returning();

    return NextResponse.json(newTopic, { status: 201 });
  } catch (error) {
    console.error("Failed to create topic:", error);
    return NextResponse.json(
      { error: "Failed to create topic" },
      { status: 500 }
    );
  }
}
