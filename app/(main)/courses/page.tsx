import Image from "next/image";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { Button } from "@/components/ui/button";
import { db } from "@/db/drizzle";
import { courses as coursesTable, user as userTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export default async function CoursesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  const courses = await db.query.courses.findMany({
    orderBy: (tbl, { asc }) => [asc(tbl.id)],
  });

  const activeCourseId = session
    ? (
        await db.query.user.findFirst({
          where: (tbl, { eq }) => eq(tbl.id, session.user.id),
        })
      )?.activeCourseId ?? null
    : null;

  return (
    <div className="mx-auto h-full w-full max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-neutral-800">Choose your course</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="flex flex-col items-center gap-3 rounded-xl border p-4">
            <Image
              src={course.imageSrc}
              alt={course.title}
              width={64}
              height={64}
              className="rounded-md border"
            />
            <div className="text-center">
              <p className="font-semibold text-neutral-800">{course.title}</p>
              {course.description && (
                <p className="text-xs text-muted-foreground">{course.description}</p>
              )}
            </div>

            <div className="mt-2 flex w-full flex-col gap-2">
              <form
                action={async () => {
                  "use server";
                  if (!session) {
                    redirect("/login");
                  }
                  await db
                    .update(userTable)
                    .set({ activeCourseId: course.id })
                    .where(eq(userTable.id, session.user.id));
                  redirect("/learn");
                }}
              >
                <Button
                  className="w-full"
                  variant={activeCourseId === course.id ? "secondary" : "primary"}
                  disabled={activeCourseId === course.id}
                >
                  {activeCourseId === course.id ? "Selected" : "Get Free Trial"}
                </Button>
              </form>

              <Button asChild variant="super" className="w-full">
                <Link href="/shop">Buy the Kit</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}