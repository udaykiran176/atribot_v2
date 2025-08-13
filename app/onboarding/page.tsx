import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";

export default async function OnboardingPage() {
  const headersList = headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    redirect("/login");
  }

  // Get user data from database to check onboarding status
  const userData = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  if (!userData) {
    redirect("/login");
  }

  // If onboarding is already completed, redirect to dashboard
  if (userData.onboardingCompleted) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen">
          
          <OnboardingForm userId={session.user.id} />
     </div>
  );
} 