import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { courses } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allCourses = await db.select().from(courses).orderBy(desc(courses.id));
    return NextResponse.json(allCourses);
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, imageSrc, order } = body;

    if (!title || !imageSrc) {
      return NextResponse.json(
        { error: "Title and image source are required" },
        { status: 400 }
      );
    }

    const [newCourse] = await db
      .insert(courses)
      .values({
        title,
        imageSrc,
        order: order || 0,
      })
      .returning();

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error("Failed to create course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
