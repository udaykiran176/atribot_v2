import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await auth.api.getSession({
      headers: request.headers as unknown as Headers
    });

    if (!session) {
      return NextResponse.json(
        { error: "No session found" },
        { status: 401 }
      );
    }

    // Force a session refresh by calling the session endpoint
    const response = await fetch(`${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}/api/auth/session`, {
      method: 'GET',
      headers: request.headers as unknown as Headers
    });

    if (!response.ok) {
      throw new Error('Failed to refresh session');
    }

    return NextResponse.json(
      { message: "Session refreshed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error refreshing session:", error);
    return NextResponse.json(
      { error: "Failed to refresh session" },
      { status: 500 }
    );
  }
} 