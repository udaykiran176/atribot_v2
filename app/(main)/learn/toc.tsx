import TopicName from "./topic-name";
import ChallengeList from "./challenge-list";

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

type TocProps = {
  topics: Topic[];
  setRef: (topicId: number) => (el: HTMLDivElement | null) => void;
};

export default function Toc({ topics, setRef }: TocProps) {
  return (
    <div className="mt-4 space-y-8">
      {topics.map((t, i) => (
        <div
          key={t.id}
          id={`topic-${t.id}`}
          data-topic-id={t.id}
          ref={setRef(t.id)}
        >
          <TopicName title={t.title} />
          <ChallengeList challenges={t.challenges} topicIndex={i} />
        </div>
      ))}
    </div>
  );
}
