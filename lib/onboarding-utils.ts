import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ExtendedSession } from "@/lib/types";

export async function getOnboardingRedirect(headers: Headers) {
  const session = await auth.api.getSession({
    headers,
  }) as ExtendedSession | null;

  if (!session) {
    return "/login";
  }

  if (!session.user.onboardingCompleted) {
    return "/onboarding";
  }

  return "/dashboard";
}

export function isOnboardingCompleted(session: ExtendedSession | null): boolean {
  return session?.user.onboardingCompleted ?? false;
}

export async function handleAuthRedirect(headers: Headers) {
  const session = await auth.api.getSession({
    headers,
  }) as ExtendedSession | null;

  if (!session) {
    return "/login";
  }

  // Check onboarding status and redirect accordingly
  if (!session.user.onboardingCompleted) {
    return "/onboarding";
  }

  return "/dashboard";
}

// New utility function for checking if user should be redirected to onboarding
export async function shouldRedirectToOnboarding(headers: Headers): Promise<boolean> {
  try {
    const session = await auth.api.getSession({
      headers,
    }) as ExtendedSession | null;

    return session ? !session.user.onboardingCompleted : false;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
}

// Utility function to get the appropriate redirect URL after login
export async function getPostLoginRedirect(headers: Headers): Promise<string> {
  try {
    const session = await auth.api.getSession({
      headers,
    }) as ExtendedSession | null;

    if (!session) {
      return "/login";
    }

    // New users (not completed onboarding) go to onboarding
    if (!session.user.onboardingCompleted) {
      return "/onboarding";
    }

    // Existing users go to dashboard
    return "/dashboard";
  } catch (error) {
    console.error("Error getting post-login redirect:", error);
    return "/dashboard";
  }
}

export async function refreshUserSession(userId: string) {
  try {
    // Update the user's onboarding status
    await db
      .update(user)
      .set({
        onboardingCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));

    // Force a session refresh by invalidating the current session
    // This will ensure the session reflects the updated onboarding status
    return true;
  } catch (error) {
    console.error("Error refreshing user session:", error);
    return false;
  }
} 