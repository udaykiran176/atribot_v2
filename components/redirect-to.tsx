"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RedirectTo({ href }: { href: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(href);
  }, [href, router]);

  return (
    <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
      Redirecting...
      <a className="ml-2 underline" href={href}>
        Click here if not redirected
      </a>
    </div>
  );
}
