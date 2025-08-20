import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserProgress } from "@/db/queries";
import { headers } from "next/headers";

export async function GET(req: Request) {
  try {
    const { session, user } = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userProgress = await getUserProgress(user.id);

    return NextResponse.json(userProgress);
  } catch (error) {
    console.error("[USER_PROGRESS_GET_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
