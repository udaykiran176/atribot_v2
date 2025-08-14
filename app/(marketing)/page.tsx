import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/server/users";

export default async function MarketingPage() {
  const { currentUser } = await getCurrentUser();

  return (
    <div className="mx-auto flex w-full max-w-[988px] flex-1 flex-col items-center justify-center gap-10 p-8 lg:flex-row-reverse">
      <div className="flex flex-col items-center gap-y-4">
        <h1 className="max-w-[500px] text-center text-2xl font-bold text-neutral-600 lg:text-3xl">
          Learn, build, and master robotics with <span className="text-blue-500"> Atri</span>BOT.
        </h1>

        <div className="flex w-full max-w-[330px] flex-col items-center gap-y-3">
          {currentUser ? (
            <Button size="lg" variant="secondary" className="w-full" asChild>
              <Link href="/learn">Continue Learning</Link>
            </Button>
          ) : (
            <>
              <Button size="lg" variant="primary" className="w-full" asChild>
                <Link href="/login">Get Started</Link>
              </Button>

              <Button size="lg" variant="outline" className="w-full" asChild>
                <Link href="/login">I already have an account</Link>
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="relative w-full max-w-[400px] h-[300px] lg:h-[450px]">
        <Image src="/hero_img.svg" alt="Hero" fill />
      </div>
    </div>
  );
}
