import { auth } from "@/lib/auth";
import { getUserProgress } from "@/db/queries";
import { headers } from "next/headers";
import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import RedirectTo from "@/components/redirect-to";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Zap, Target, Trophy, Calendar } from "lucide-react";
import Image from "next/image";

function getMonthName() {
  return new Date().toLocaleString('default', { month: 'long' }).toUpperCase();
}

function getDaysInMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

function getCurrentDay() {
  return new Date().getDate();
}

export default async function QuestsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return <RedirectTo href="/login" />;
  }

  const userProgress = await getUserProgress(session.user.id);

  if (!userProgress?.activeCourseId || !userProgress.activeCourse) {
    return <RedirectTo href="/courses" />;
  }

  const monthName = getMonthName();
  const daysInMonth = getDaysInMonth();
  const currentDay = getCurrentDay();
  const monthlyProgress = Math.min((currentDay / daysInMonth) * 100, 100);

  // Calculate daily quest progress based on user data
  const dailyXpTarget = 30;
  const dailyXpProgress = Math.min(userProgress.points % 100, dailyXpTarget); // Reset daily
  
  const comboTarget = 15;
  const comboProgress = Math.min(userProgress.streak * 2, comboTarget);
  
  const lessonTarget = 5;
  const lessonProgress = Math.min(Math.floor(userProgress.points / 50), lessonTarget);

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6 pb-12 lg:pb-0">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          streak={userProgress.streak}
          points={userProgress.points}
        />
        
        {/* Monthly Badges Section */}
        <Card className="w-full bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              MONTHLY BADGES
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src="/badge-gold.svg"
                  alt="Monthly Badge"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 text-sm">Earn your first badge!</h3>
                <p className="text-xs text-blue-600 leading-relaxed">
                  Complete each month's challenge to earn exclusive badges.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </StickyWrapper>
      
      <FeedWrapper>
        {/* Monthly Challenge */}
        <Card className="mb-8 bg-gradient-to-br from-red-400 to-red-500 text-white border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                {monthName}
              </span>
              <div className="flex items-center gap-1 text-white/80">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{daysInMonth - currentDay} DAYS</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold mt-2">Lin's Speedy Ride</h1>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-700 font-medium">Complete 30 quests</span>
                <div className="flex items-center gap-2">
                  <Image
                    src={userProgress.userImageSrc}
                    alt="User"
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-white"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={monthlyProgress} className="flex-1 h-3" />
                <span className="text-slate-600 text-sm font-medium">
                  {currentDay} / 30
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Quests */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-800">Daily Quests</h2>
            <div className="flex items-center gap-2 text-orange-600">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">13 HOURS</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Earn 30 XP Quest */}
            <Card className="border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-1">Earn 30 XP</h3>
                    <div className="flex items-center gap-3">
                      <Progress value={(dailyXpProgress / dailyXpTarget) * 100} className="flex-1 h-2" />
                      <span className="text-slate-600 text-sm font-medium">
                        {dailyXpProgress} / {dailyXpTarget}
                      </span>
                      <Image
                        src={userProgress.userImageSrc}
                        alt="User"
                        width={24}
                        height={24}
                        className="rounded-full border border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Combo Bonus Quest */}
            <Card className="border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-1">Earn 15 Combo Bonus XP</h3>
                    <div className="flex items-center gap-3">
                      <Progress value={(comboProgress / comboTarget) * 100} className="flex-1 h-2" />
                      <span className="text-slate-600 text-sm font-medium">
                        {comboProgress} / {comboTarget}
                      </span>
                      <Image
                        src={userProgress.userImageSrc}
                        alt="User"
                        width={24}
                        height={24}
                        className="rounded-full border border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lesson Score Quest */}
            <Card className="border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-1">Score 90% or higher in 5 lessons</h3>
                    <div className="flex items-center gap-3">
                      <Progress value={(lessonProgress / lessonTarget) * 100} className="flex-1 h-2" />
                      <span className="text-slate-600 text-sm font-medium">
                        {lessonProgress} / {lessonTarget}
                      </span>
                      <Image
                        src={userProgress.userImageSrc}
                        alt="User"
                        width={24}
                        height={24}
                        className="rounded-full border border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </FeedWrapper>
    </div>
  );
}