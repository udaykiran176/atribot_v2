"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import FixedHeader from "./fixed-header";

type Challenge = {
  id: number;
  type: string;
  title: string | null;
  description: string | null;
  order: number | null;
  content: string | null;
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
            className="scroll-mt-24 rounded-xl border border-gray-200 p-6 shadow-sm bg-white min-h-[60vh]"
          >
            <h2 className="text-xl font-semibold mb-1">{t.title}</h2>
            {t.description && (
              <p className="text-gray-600 mb-4">{t.description}</p>
            )}

            <ol className="list-decimal ml-5 space-y-2">
              {t.challenges
                ?.slice()
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((c) => (
                  <li key={c.id} className="text-sm">
                    <span className="font-medium capitalize">{c.type?.replaceAll("_", " ")}</span>
                    {c.title ? ` — ${c.title}` : null}
                  </li>
                ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
