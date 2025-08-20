import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ExtendedSession } from "@/lib/types";

/**
 * Fetches the current session with proper error handling
 */
async function getSession(headers: Headers): Promise<ExtendedSession | null> {
  try {
    const session = await auth.api.getSession({ headers });
    return session as unknown as ExtendedSession | null;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}

/**
 * Gets the appropriate redirect URL based on session and onboarding status
 */
function getRedirectUrl(session: ExtendedSession | null): string {
  if (!session) {
    return "/login";
  }
  return session.user.onboardingCompleted ? "/dashboard" : "/onboarding";
}

export async function getOnboardingRedirect(headers: Headers) {
  const session = await getSession(headers);
  return getRedirectUrl(session);
}

export function isOnboardingCompleted(session: ExtendedSession | null): boolean {
  return session?.user.onboardingCompleted ?? false;
}

export async function handleAuthRedirect(headers: Headers) {
  const session = await getSession(headers);
  return getRedirectUrl(session);
}

export async function shouldRedirectToOnboarding(headers: Headers): Promise<boolean> {
  const session = await getSession(headers);
  return session ? !session.user.onboardingCompleted : false;
}

export async function getPostLoginRedirect(headers: Headers): Promise<string> {
  const session = await getSession(headers);
  return getRedirectUrl(session);
}

export async function refreshUserSession(userId: string): Promise<boolean> {
  try {
    await db
      .update(user)
      .set({
        onboardingCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));
    return true;
  } catch (error) {
    console.error("Error refreshing user session:", error);
    return false;
  }
} 