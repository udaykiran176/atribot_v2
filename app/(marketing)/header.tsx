"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserIcon, Loader } from "lucide-react";

import { getCurrentUser } from "@/server/users";
import Banner from "@/components/banner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  // Add other user properties as needed
};

export const Header = () => {
  const [hideBanner, setHideBanner] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { currentUser } = await getCurrentUser();
        setCurrentUser(currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <Banner hide={hideBanner} setHide={setHideBanner} />

      <header
        className={cn(
          "h-20 w-full border-b-2 border-slate-200 px-4",
          !hideBanner ? "mt-20 sm:mt-16 lg:mt-10" : "mt-0"
        )}
      >
        <div className="mx-auto flex h-full items-center justify-between lg:max-w-screen-lg">
          <Link href="/" className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
            <Image src="/atribot_logo.svg" alt="Mascot" height={40} width={40} />

            <h1 className="text-2xl font-extrabold tracking-wide text-blue-500">
              Atri<span className="text-black">BOT</span>
            </h1>
          </Link>

          <div className="flex items-center gap-4">
        {loading ? (
          <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : currentUser ? (
          <div className="flex items-center gap-4">
            <Link href="/profile">
                <Button>
                    <UserIcon className="size-4" /> Profile
                </Button>
            </Link>
          </div>
        ) : (
          <Link href="/login">
            <Button>
                Sign in
            </Button>
          </Link>
        )}
      </div>
        </div>
      </header>
    </>
  );
};
