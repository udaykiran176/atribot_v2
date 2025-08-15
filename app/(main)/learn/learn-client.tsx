"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import FixedHeader from "./fixed-header";
import Toc from "./toc";

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

  const [activeTopicId, setActiveTopicId] = useState<number>(sortedTopics[0]?.id || 0);

  const sectionRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  
  const setRef = (topicId: number) => (el: HTMLDivElement | null) => {
    if (el) {
      sectionRefs.current.set(topicId, el);
    } else {
      sectionRefs.current.delete(topicId);
    }
  };

  useEffect(() => {
    if (sectionRefs.current.size === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const topicId = parseInt(entry.target.getAttribute("data-topic-id") || "0", 10);
          
          // Simple logic: when a section becomes significantly visible (50%+), make it active
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveTopicId(topicId);
          }
        });
      },
      { 
        root: null, 
        rootMargin: "-25% 0px -25% 0px", // Trigger when section is well into viewport
        threshold: [0.5] // Only trigger when section is at least 50% visible
      }
    );

    // Observe all topic sections
    sectionRefs.current.forEach((element) => {
      observer.observe(element);
    });
    
    return () => {
      observer.disconnect();
    };
  }, [topics]);

  const currentTopic = sortedTopics.find(t => t.id === activeTopicId) ?? sortedTopics[0];

  return (
    <div className="w-full">
      <FixedHeader courseTitle={courseTitle} topicTitle={currentTopic?.title ?? ""}/>
      <Toc topics={sortedTopics} setRef={setRef} />
    </div>
  );
}
