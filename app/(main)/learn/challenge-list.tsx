import ChallengeButton from "./challenge-button";

type Challenge = {
  id: number;
  type: string;
  title: string | null;
  description: string | null;
  order: number | null;
  content: string | null;
  isCompleted?: boolean | null;
};

type ChallengeListProps = {
  challenges: Challenge[];
  topicIndex: number;
};

const getStateForChallenges = (challenges: Challenge[]) => {
  const sorted = [...(challenges || [])]
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const firstIncompleteIdx = sorted.findIndex((c) => !c.isCompleted);
  const activeIdx = firstIncompleteIdx === -1 ? sorted.length - 1 : firstIncompleteIdx;
  return { sorted, activeIdx };
};

export default function ChallengeList({ challenges, topicIndex }: ChallengeListProps) {
  const { sorted, activeIdx } = getStateForChallenges(challenges || []);

  return (
    <div className="flex flex-col items-center gap-6 py-4 relative w-full ">
      {sorted.map((c, idx) => {
        const isCompleted = Boolean(c.isCompleted);
        const isCurrent = !isCompleted && idx === activeIdx;
        const locked = !isCompleted && idx > activeIdx;

        // Topic-based alternating positioning
        const isRightTopic = topicIndex % 2 === 0; // Even topics (0, 2, 4...) use right, odd topics (1, 3, 5...) use left
        
        // Duolingo-like staggered indentation cycle within each topic
        const cycleLength = 8;
        const cycleIndex = idx % cycleLength;
        let indentationLevel: number;
        if (cycleIndex <= 2) indentationLevel = cycleIndex;
        else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
        else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
        else indentationLevel = cycleIndex - 8;
        
        // Apply positioning based on topic index
        const rightPosition = isRightTopic 
          ? indentationLevel * 40  // Right positioning for even topics
          : indentationLevel * -40; // Left positioning for odd topics
        return (
        
            <ChallengeButton
              key={c.id}
              challenge={c}
              index={idx}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              locked={locked}
              rightPosition={rightPosition}
            />
         
        );
      })}
    </div>
  );
}
