import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { topics } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const topicId = parseInt(params.id);
    const topic = await db
      .select()
      .from(topics)
      .where(eq(topics.id, topicId))
      .limit(1);

    if (topic.length === 0) {
      return NextResponse.json(
        { error: "Topic not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(topic[0]);
  } catch (error) {
    console.error("Failed to fetch topic:", error);
    return NextResponse.json(
      { error: "Failed to fetch topic" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const topicId = parseInt(params.id);
    const body = await request.json();
    const { title, description, courseId, imageSrc, order } = body;

    if (!title || !courseId || !imageSrc) {
      return NextResponse.json(
        { error: "Title, course ID, and image source are required" },
        { status: 400 }
      );
    }

    const [updatedTopic] = await db
      .update(topics)
      .set({
        title,
        description: description || null,
        courseId: parseInt(courseId),
        imageSrc,
        order: order || 0,
      })
      .where(eq(topics.id, topicId))
      .returning();

    if (!updatedTopic) {
      return NextResponse.json(
        { error: "Topic not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTopic);
  } catch (error) {
    console.error("Failed to update topic:", error);
    return NextResponse.json(
      { error: "Failed to update topic" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const topicId = parseInt(params.id);
    
    const [deletedTopic] = await db
      .delete(topics)
      .where(eq(topics.id, topicId))
      .returning();

    if (!deletedTopic) {
      return NextResponse.json(
        { error: "Topic not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Topic deleted successfully" });
  } catch (error) {
    console.error("Failed to delete topic:", error);
    return NextResponse.json(
      { error: "Failed to delete topic" },
      { status: 500 }
    );
  }
}
