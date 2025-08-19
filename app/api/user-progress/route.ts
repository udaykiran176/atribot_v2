import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserProgress } from "@/db/queries";
import { ExtendedSession } from "@/lib/types";
import { headers } from "next/headers";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    }) as ExtendedSession | null;

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userProgress = await getUserProgress(session.user.id);

    return NextResponse.json(userProgress);
  } catch (error) {
    console.error("[USER_PROGRESS_GET_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
