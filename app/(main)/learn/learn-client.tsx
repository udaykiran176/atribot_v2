"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import FixedHeader from "./fixed-header";
import Toc from "./toc";

type Challenge = {
  id: number;
  type: string;
  title: string | null;
  description: string | null;
  imageSrc: string;
  order: number | null;
  content: string | null;
  isCompleted?: boolean | null;
};

export type Topic = {
  id: number;
  title: string;
  description: string | null;
  imageSrc: string;
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

    const headerHeight = 64; // Height of the fixed header
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      
      ticking = true;
      requestAnimationFrame(() => {
        // Position just below the fixed header
        const scrollPosition = window.scrollY + headerHeight;

        // Choose the section whose top is closest to but not greater than scrollPosition
        let candidateId: number | null = null;
        let candidateTop = -Infinity;

        sectionRefs.current.forEach((section, topicId) => {
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top + window.scrollY; // absolute top

          // section has reached/passed the top threshold (below header)
          if (sectionTop <= scrollPosition && sectionTop > candidateTop) {
            candidateTop = sectionTop;
            candidateId = topicId;
          }
        });

        // Fallbacks
        if (candidateId == null && sortedTopics[0]) {
          // If nothing is above the top threshold, we're above the first section
          candidateId = sortedTopics[0].id;
        }

        // Update state without relying on potentially stale closure
        if (candidateId != null) {
          const nextId = candidateId;
          setActiveTopicId((prev) => (prev !== nextId ? nextId : prev));
        }
        
        ticking = false;
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        // Use the scroll handler to determine the active section
        handleScroll();
      },
      { 
        root: null, 
        rootMargin: '0px 0px -70% 0px',
        threshold: 0.1
      }
    );

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Observe all topic sections
    sectionRefs.current.forEach((element) => {
      observer.observe(element);
    });
    
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [topics]);

  const currentTopic = sortedTopics.find(t => t.id === activeTopicId) ?? sortedTopics[0];
  const currentTopicIndex = sortedTopics.findIndex(t => t.id === activeTopicId);

  return (
    <div className="w-full">
      <FixedHeader 
        courseTitle={courseTitle} 
        topicTitle={currentTopic?.title ?? ""} 
        topicIndex={currentTopicIndex >= 0 ? currentTopicIndex : 0}
      />
      <Toc topics={sortedTopics} setRef={setRef} />
    </div>
  );
}
