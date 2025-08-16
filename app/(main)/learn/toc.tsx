import TopicName from "./topic-name";
import ChallengeList from "./challenge-list";

import { Challenge, Topic } from "@/types/challenge";

type TocProps = {
  topics: Topic[];
  setRef: (topicId: number) => (el: HTMLDivElement | null) => void;
};

export default function Toc({ topics, setRef }: TocProps) {
  return (
    <div >
      {topics.map((t, i) => (
        <section 
          key={t.id}
          id={`topic-${t.id}`}
          data-topic-id={t.id}
          ref={setRef(t.id)}
          className="relative pt-10 -mt-16 pb-8" // Add padding to account for fixed header
        >
          <div className="relative">
            <header>
               <TopicName title={t.title} />
            </header>
            <div className="mt-4 px-4">
              <ChallengeList 
                challenges={t.challenges} 
                topicIndex={i} 
                topicImage={t.imageSrc} 
                topicTitle={t.title}
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
