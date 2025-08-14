import Link from "next/link";
import { headers } from "next/headers";

import { Button } from "@/components/ui/button";
import { db } from "@/db/drizzle";
import { auth } from "@/lib/auth";

const LearnPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  // If no session, show CTA to choose a course
  if (!session) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-lg font-semibold">You don\'t have a free trial or active course.</p>
        <p className="text-muted-foreground">Please choose a course to start learning.</p>
        <Button asChild>
          <Link href="/courses">Go to Courses</Link>
        </Button>
      </div>
    );
  }

  // Load user to check kitUnlocked flag and active course
  const currentUser = await db.query.user.findFirst({
    where: (tbl, { eq }) => eq(tbl.id, session.user.id),
  });

  // If no active course is selected, ask user to choose one
  if (!currentUser?.activeCourseId) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-lg font-semibold">no active couse is found place select the couse give the button bellow</p>
        <Button asChild>
          <Link href="/courses">Go to Courses</Link>
        </Button>
      </div>
    );
  }

  // If user has selected an active course, show content for that course only
  const courseFilterId = currentUser?.activeCourseId ?? null;

  // Fetch courses (filtered to active one if present) with topics and challenges
  const allCourses = await db.query.courses.findMany({
    ...(courseFilterId ? { where: (tbl, { eq }) => eq(tbl.id, courseFilterId) } : {}),
    with: {
      topics: {
        with: {
          challenges: true,
        },
      },
    },
    orderBy: (tbl, { asc }) => [asc(tbl.id)],
  });

  // Apply access rules
  const accessibleCourses = (allCourses || [])
    .map((course) => {
      const visibleTopics = (course.topics || []).filter((t) => currentUser?.kitUnlocked || t.freeTrial);
      return { ...course, topics: visibleTopics };
    })
    .filter((course) => course.topics.length > 0);

  const hasAnyContent = accessibleCourses.length > 0;

  if (!hasAnyContent) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-lg font-semibold">You don\'t have a free trial or active course.</p>
        <p className="text-muted-foreground">Please choose a course to start learning.</p>
        <Button asChild>
          <Link href="/courses">Go to Courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto h-full w-full max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-neutral-800">Learn</h1>

      <div className="space-y-8">
        {accessibleCourses.map((course) => (
          <div key={course.id} className="rounded-xl border p-4">
            <h2 className="text-xl font-semibold text-neutral-800">{course.title}</h2>
            {course.description && (
              <p className="text-sm text-muted-foreground">{course.description}</p>
            )}

            <div className="mt-4 space-y-4">
              {course.topics.map((topic) => (
                <div key={topic.id} className="rounded-lg border p-4">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-semibold text-neutral-800">{topic.title}</h3>
                    {!currentUser?.kitUnlocked && topic.freeTrial && (
                      <span className="text-xs font-medium text-blue-600">Free trial</span>
                    )}
                  </div>
                  {topic.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{topic.description}</p>
                  )}

                  <ul className="mt-3 space-y-2">
                    {topic.challenges.map((ch) => (
                      <li key={ch.id} className="flex items-center justify-between rounded-md bg-gray-50 p-3">
                        <div>
                          <p className="font-medium text-neutral-800">{ch.title}</p>
                          <p className="text-xs uppercase text-muted-foreground">{ch.type}</p>
                        </div>
                        <span className="text-xs font-semibold text-lime-700">{ch.xp} XP</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearnPage;