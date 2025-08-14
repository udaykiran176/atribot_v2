"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PlayCircle, SquareStack, Gamepad2, Hammer, CircleHelp, Check } from "lucide-react";
import FixedHeader from "./fixed-header";

type Challenge = {
  id: number;
  type: string;
  title: string | null;
  description: string | null;
  order: number | null;
  content: string | null;
  isCompleted?: boolean | null;
};

export type Topic = {
  id: number;
  title: string;
  description: string | null;
  order: number;
  challenges: Challenge[];
};

type Props = {
  courseTitle: string;
  topics: Topic[];
};

export default function LearnClient({ courseTitle, topics }: Props) {
  const sortedTopics = useMemo(
    () => [...topics].sort((a, b) => a.order - b.order),
    [topics]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const sectionRefs = useRef<HTMLDivElement[]>([]);
  sectionRefs.current = [];
  const setRef = (el: HTMLDivElement | null) => {
    if (el && !sectionRefs.current.includes(el)) sectionRefs.current.push(el);
  };

  useEffect(() => {
    if (!sectionRefs.current.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idxAttr = visible.target.getAttribute("data-topic-index");
        if (!idxAttr) return;
        const idx = parseInt(idxAttr, 10);
        if (!Number.isNaN(idx)) setActiveIndex(idx);
      },
      { root: null, rootMargin: "0px 0px -30% 0px", threshold: [0.2, 0.35, 0.5, 0.65, 0.8] }
    );

    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [topics]);

  const currentTopic = sortedTopics[activeIndex] ?? sortedTopics[0];

  const typeIcon = (type?: string) => {
    const t = (type || "").toLowerCase();
    if (t.includes("video")) return PlayCircle;
    if (t.includes("swipe") || t.includes("card")) return SquareStack;
    if (t.includes("game")) return Gamepad2;
    if (t.includes("build")) return Hammer;
    if (t.includes("quiz") || t.includes("test")) return CircleHelp;
    return CircleHelp;
  };

  const getStateForChallenges = (challenges: Challenge[]) => {
    const sorted = [...(challenges || [])]
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const firstIncompleteIdx = sorted.findIndex((c) => !c.isCompleted);
    const activeIdx = firstIncompleteIdx === -1 ? sorted.length - 1 : firstIncompleteIdx;
    return { sorted, activeIdx };
  };

  return (
    <div className="w-full">
      <FixedHeader
        courseTitle={courseTitle}
        topicTitle={currentTopic?.title ?? ""}
      />

      <div className="mt-4 space-y-8">
        {sortedTopics.map((t, i) => (
          <div
            key={t.id}
            id={`topic-${t.id}`}
            data-topic-index={i}
            ref={setRef}
          >
            <div className="flex items-center gap-3 my-2 text-gray-400">
              <span className="h-px bg-gray-200 flex-1"></span>
              <h2 className="text-sm font-semibold tracking-wide uppercase whitespace-nowrap text-gray-400">
                {t.title}
              </h2>
              <span className="h-px bg-gray-200 flex-1"></span>
            </div>

            {(() => {
              const { sorted, activeIdx } = getStateForChallenges(t.challenges || []);
              return (
                <div className="flex flex-col items-center gap-6 py-4 relative w-full">
                  {sorted.map((c, idx) => {
                    const Icon = typeIcon(c.type);
                    const isCompleted = Boolean(c.isCompleted);
                    const isCurrent = !isCompleted && idx === activeIdx;
                    const locked = !isCompleted && idx > activeIdx;

                    // Duolingo-like staggered indentation cycle
                    const cycleLength = 8;
                    const cycleIndex = idx % cycleLength;
                    let indentationLevel: number;
                    if (cycleIndex <= 2) indentationLevel = cycleIndex;
                    else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
                    else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
                    else indentationLevel = cycleIndex - 8;
                    const rightPosition = indentationLevel * 40; // px

                    const base = "h-[70px] w-[70px] rounded-full border-b-8 flex items-center justify-center shadow-sm";
                    const state = locked
                      ? "bg-neutral-200 border-b-neutral-300 text-neutral-400"
                      : isCompleted
                      ? "bg-emerald-500 border-b-emerald-700 text-emerald-50"
                      : "bg-blue-500 border-b-blue-700 text-blue-50";

                    return (
                      <div key={c.id} className="relative w-full select-none" style={{ marginTop: isCurrent && idx === 0 ? 60 : 0 }}>
                        <div className="relative mx-auto flex w-full justify-center">
                          <div className="relative flex flex-col items-center" style={{ transform: `translateX(${rightPosition}px)` }}>
                            {isCurrent && (
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-xl border bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-600 shadow animate-bounce">
                                Start
                              </div>
                            )}
                            <div className={`${base} ${state}`} aria-disabled={locked}>
                              {isCompleted ? (
                                <Check className="h-10 w-10" />
                              ) : (
                                <Icon className="h-10 w-10" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  );
}
