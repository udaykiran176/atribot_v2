import { headers } from "next/headers";
import { auth } from "./auth";

export const getIsAdmin = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    
    if (!session?.user?.email) return false;
    
    return adminEmails.includes(session.user.email);
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};
