import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { refreshUserSession } from "@/lib/onboarding-utils";

export async function POST(request: NextRequest) {
  try {
    console.log("Onboarding API called");
    
    // Verify user is authenticated
    const session = await auth.api.getSession({
      headers: request.headers as unknown as Headers
    });

    if (!session) {
      console.log("No session found");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Session found for user:", session.user.id);

    const body = await request.json();
    console.log("Request body:", body);
    
    const {
      childName,
      childDob,
      childGender,
      childClass,
      schoolname,
      phoneNumber,
    } = body;

    // Validate required fields
    if (!childName || !childDob || !childGender || !childClass || !schoolname || !phoneNumber) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(childDob)) {
      console.log("Invalid date format");
      return NextResponse.json(
        { error: "Please enter a valid date in YYYY-MM-DD format" },
        { status: 400 }
      );
    }

    // Validate date is reasonable (not too far in past or future)
    const inputDate = new Date(childDob);
    const minDate = new Date('1900-01-01');
    const maxDate = new Date('2030-12-31');
    
    if (inputDate < minDate || inputDate > maxDate) {
      console.log("Date out of range");
      return NextResponse.json(
        { error: "Please enter a valid date between 1900 and 2030" },
        { status: 400 }
      );
    }

    // Basic phone number validation - more flexible
    const cleanPhone = phoneNumber.replace(/\s/g, '').replace(/[\(\)\-]/g, '');
    const phoneRegex = /^[\+]?[1-9][\d]{7,15}$/;
    if (!phoneRegex.test(cleanPhone)) {
      console.log("Invalid phone number");
      return NextResponse.json(
        { error: "Please enter a valid phone number (minimum 8 digits)" },
        { status: 400 }
      );
    }

    console.log("All validations passed, updating database");

    // Create a properly formatted date for the database
    const formattedDate = new Date(childDob + 'T00:00:00.000Z');

    // Update user record with onboarding data
    await db
      .update(user)
      .set({
        childName,
        childDob: formattedDate,
        childGender,
        childClass: parseInt(childClass),
        schoolname,
        phoneNumber: phoneNumber,
        onboardingCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id));

    console.log("Database updated successfully");

    // Refresh the user session to reflect the updated onboarding status
    await refreshUserSession(session.user.id);

    console.log("Session refreshed, returning success");

    return NextResponse.json(
      { message: "Onboarding completed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in onboarding API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 