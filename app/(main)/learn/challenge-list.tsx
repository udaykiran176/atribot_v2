import ChallengeButton from "./challenge-button";
import TopicImage from "./topic-image";
import { Challenge } from "@/types/challenge";

type ChallengeListProps = {
  challenges: Challenge[];
  topicIndex: number;
  topicImage: string;
  topicTitle: string;
};

const getStateForChallenges = (challenges: Challenge[]) => {
  const sorted = [...(challenges || [])]
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const firstIncompleteIdx = sorted.findIndex((c) => !c.isCompleted);
  const activeIdx = firstIncompleteIdx === -1 ? sorted.length - 1 : firstIncompleteIdx;
  return { sorted, activeIdx };
};

export default function ChallengeList({ challenges, topicIndex, topicImage, topicTitle }: ChallengeListProps) {
  const { sorted, activeIdx } = getStateForChallenges(challenges || []);

  const isImageRight = topicIndex % 2 !== 0;

  return (
    <div className="relative w-full max-w-4xl mx-auto py-2">
      <div className="w-full px-10">
        {sorted.map((c, idx) => {
          const isCompleted = Boolean(c.isCompleted);
          const isCurrent = !isCompleted && idx === activeIdx;
          const locked = !isCompleted && idx > activeIdx;

          const isRightTopic = topicIndex % 2 === 0;
          
          const cycleLength = 8;
          const cycleIndex = idx % cycleLength;
          let indentationLevel: number;
          if (cycleIndex <= 2) indentationLevel = cycleIndex;
          else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
          else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
          else indentationLevel = cycleIndex - 8;
          
          const rightPosition = isRightTopic 
            ? indentationLevel * 40
            : indentationLevel * -40;
            
          return (
            <div key={c.id} className="mb-4 w-full">
              <ChallengeButton
                challenge={c}
                index={idx}
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                locked={locked}
                rightPosition={rightPosition}
              />
            </div>
          );
        })}
      </div>

      {/* Topic Image absolutely positioned on the side */}
      <div className={`absolute top-1/2 -translate-y-1/2 ${isImageRight ? 'right-0' : 'left-0'}`}>
        <TopicImage 
          imageSrc={topicImage}
          title={topicTitle}
          size={100}
        />
      </div>
    </div>
  );
}
