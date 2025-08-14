import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await auth.api.getSession({
      headers: request.headers as unknown as Headers
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user data including child information
    const userData = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    if (!userData) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      childName: userData.childName,
      childClass: userData.childClass,
      schoolname:userData.schoolname,
      childGender: userData.childGender,
      childDob: userData.childDob,
    });
  } catch (error) {
    console.error("Error fetching child info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 