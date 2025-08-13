import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    console.log("Auth callback triggered");
    
    const session = await auth.api.getSession({
      headers: request.headers as unknown as Headers
    });

    if (!session) {
      console.log("No session found, redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    console.log("Session found for user:", session.user.id);

    // Get the user's onboarding status from the database
    const userData = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    if (!userData) {
      console.log("User not found in database, redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    console.log("User found, onboarding status:", userData.onboardingCompleted);

    // Check onboarding status and redirect accordingly
    if (!userData.onboardingCompleted) {
      console.log("User not onboarded, redirecting to onboarding");
      return NextResponse.redirect(new URL("/onboarding", request.url));
    } else {
      console.log("User onboarded, redirecting to dashboard");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } catch (error) {
    console.error("Error in auth callback:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
} 