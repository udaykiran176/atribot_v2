"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { upsertUserProgress } from "@/actions/user-progress";
import { courses, userProgress } from "@/db/schema";

import { Card } from "./card";

type ListProps = {
  courses: (typeof courses.$inferSelect)[];
  activeCourseId?: typeof userProgress.$inferSelect.activeCourseId;
};

export const List = ({ courses, activeCourseId }: ListProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = async (id: number) => {
    if (pending) return;

    if (id === activeCourseId) {
      router.push("/learn");
      return;
    }

    try {
      startTransition(async () => {
        try {
          const result = await upsertUserProgress(id);
          if (result?.success) {
            // Perform client-side navigation to ensure the page updates
            router.push("/learn");
            router.refresh(); // Force a refresh to get the latest data
          }
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Something went wrong.");
        }
      });
    } catch (error) {
      toast.error("Failed to start course selection. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 pt-6 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))]">
      {courses.map((course) => (
        <Card
          key={course.id}
          id={course.id}
          title={course.title}
          imageSrc={course.imageSrc}
          onClick={onClick}
          disabled={pending}
          isActive={course.id === activeCourseId}
        />
      ))}
    </div>
  );
};
