"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { upsertUserProgress } from "@/actions/user-progress";

type NextLessonCardProps = {
  id: number;
  title: string;
  imageSrc: string;
  activeCourseId?: number;
};

export const NextLessonCard = ({
  id,
  title,
  imageSrc,
  activeCourseId,
}: NextLessonCardProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = async () => {
    if (pending) return;

    if (id === activeCourseId) {
      router.push("/learn");
      return;
    }

    startTransition(async () => {
      try {
        const result = await upsertUserProgress(id);
        if (result?.success) {
          router.push("/learn");
          router.refresh();
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Something went wrong.");
      }
    });
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex h-full min-h-[250px] w-full max-w-[220px] cursor-pointer flex-col items-center overflow-hidden rounded-xl border-2 border-b-4 p-3 transition-all hover:bg-black/5 active:border-b-2",
        pending && "pointer-events-none opacity-50"
      )}
    >
      <div className="relative mt-6 h-[140px] w-full">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          priority
        />
      </div>
      <p className="mt-4 text-center text-sm font-bold text-neutral-700 line-clamp-2">
        {title}
      </p>
    </div>
  );
};
