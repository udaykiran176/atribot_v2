"use server";

import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export const getCurrentUser = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });  

    if (!session) {
        return { currentUser: null };
    }

    const currentUser = await db.query.user.findFirst({
        where: eq(user.id, session.user.id),
    });

    if (!currentUser) {
        return { currentUser: null };
    }

    return {
        ...session,
        currentUser
    }
}
