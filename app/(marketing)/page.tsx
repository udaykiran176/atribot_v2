"use client";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/server/users";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

export default function MarketingPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
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
    <div className="mx-auto flex w-full max-w-[988px] flex-1 flex-col items-center justify-center gap-2 p-4 lg:flex-row">
      <div className="relative mb-8 h-[240px] w-[240px] lg:mb-0 lg:h-[424px] lg:w-[424px]">
        <Image src="/hero_img.svg" alt="Hero" fill />
      </div>

      <div className="flex flex-col items-center gap-y-8">
        <h1 className="max-w-[480px] text-center text-xl font-bold text-neutral-600 lg:text-3xl">
          Learn, build, and master robotics with AtriBOT.
        </h1>

        <div className="flex w-full max-w-[330px] flex-col items-center gap-y-3">
          {loading ? (
            <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : currentUser ? (
            <Button size="lg" variant="secondary" className="w-full" asChild>
              <Link href="/learn">Continue Learning</Link>
            </Button>
          ) : (
            <>
            <Button size="lg" variant="primary" className="w-full" asChild>
              <Link href="/login">
                Get Started
              </Link>
            </Button>

            <Button size="lg" variant="primaryOutline" className="w-full" asChild>
              <Link href="/login">
                I already have an account
              </Link>
            </Button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
