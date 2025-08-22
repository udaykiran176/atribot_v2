import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Zap, Target, Trophy } from "lucide-react";

type DailyQuestsProps = { 
  points: number;
  streak: number;
  completedChallenges?: number;
};

// Daily quest types with different icons and rewards
const DAILY_QUESTS = [
  {
    id: "earn_xp",
    title: "Earn 30 XP",
    description: "Complete lessons to earn experience points",
    value: 30,
    reward: "50 points",
    icon: "/points.svg",
    type: "xp"
  },
  {
    id: "combo_bonus",
    title: "Earn 15 Combo Bonus XP", 
    description: "Get perfect scores on multiple lessons",
    value: 15,
    reward: "Combo streak",
    icon: "/streak.svg",
    type: "combo"
  },
  {
    id: "lesson_score",
    title: "Score 90% or higher in 5 lessons",
    description: "Achieve high scores to master concepts",
    value: 5,
    reward: "Achievement badge",
    icon: "/mascot.svg",
    type: "score"
  }
];

export const DailyQuests = ({ points, streak, completedChallenges = 0 }: DailyQuestsProps) => {
  const getQuestProgress = (quest: typeof DAILY_QUESTS[0]) => {
    switch (quest.type) {
      case "xp":
        return Math.min((points / quest.value) * 100, 100);
      case "combo":
        // Simulate combo progress based on streak
        return Math.min((streak * 3 / quest.value) * 100, 100);
      case "score":
        // Simulate lesson completion progress
        return Math.min((completedChallenges / quest.value) * 100, 100);
      default:
        return 0;
    }
  };

  const getProgressText = (quest: typeof DAILY_QUESTS[0]) => {
    const progress = getQuestProgress(quest);
    const current = Math.floor((progress / 100) * quest.value);
    return `${current} / ${quest.value}`;
  };

  const getQuestIcon = (quest: typeof DAILY_QUESTS[0]) => {
    switch (quest.type) {
      case "xp":
        return <Zap className="w-6 h-6 text-yellow-500" />;
      case "combo":
        return <Zap className="w-6 h-6 text-yellow-500" />;
      case "score":
        return <Target className="w-6 h-6 text-green-500" />;
      default:
        return <Trophy className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div className="w-full rounded-xl border-2 border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex w-full items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Daily Quests</h3>
        <Link href="/quests">
          <Button size="sm" variant="outline" className="text-xs px-3 py-1 h-7">
            VIEW ALL
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {DAILY_QUESTS.map((quest) => {
          const progress = getQuestProgress(quest);
          const isCompleted = progress >= 100;
          
          return (
            <div
              key={quest.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isCompleted ? 'bg-green-50 border border-green-200' : 'bg-slate-50'
              }`}
            >
              <div className={`p-2 rounded-full ${isCompleted ? 'bg-green-100' : 'bg-white'}`}>
                {getQuestIcon(quest)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className={`text-sm font-semibold ${isCompleted ? 'text-green-700' : 'text-slate-700'}`}>
                    {quest.title}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-500">
                      {getProgressText(quest)}
                    </span>
                    <Image 
                      src="/mascot.svg" 
                      alt="Reward" 
                      width={16} 
                      height={16}
                      className="opacity-70"
                    />
                  </div>
                </div>
                
                <Progress 
                  value={progress} 
                  className={`h-2 mb-1 ${isCompleted ? '[&>div]:bg-green-500' : ''}`}
                />
                
                {isCompleted && (
                  <div className="flex items-center gap-1 mt-1">
                    <Trophy className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">Quest Complete!</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-700 text-center">
          🎯 Complete all daily quests to earn bonus rewards!
        </p>
      </div>
    </div>
  );
};
