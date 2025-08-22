import { auth } from "@/lib/auth";
import { getUserProgress, getUserById, getCourseCompletionPercentage } from "@/db/queries";
import { headers } from "next/headers";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { KitAds } from "@/components/kit-ads";
import { StreakCalendar } from "@/components/streak-calendar";
import { DailyQuests } from "@/components/daily-quests";
import RedirectTo from "@/components/redirect-to";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Zap, Flame, BookOpen, Target, Calendar } from "lucide-react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return <RedirectTo href="/login" />;
  }

  const userProgress = await getUserProgress(session.user.id);
  const userData = await getUserById(session.user.id);

  if (!userProgress?.activeCourseId || !userProgress.activeCourse) {
    return <RedirectTo href="/courses" />;
  }

  const completionPercentage = await getCourseCompletionPercentage(session.user.id, userProgress.activeCourseId);
  const greeting = getGreeting();
  const childName = userData?.childName || userData?.name || session.user.name || "Student";

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6 pb-12 lg:pb-0">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          streak={userProgress.streak}
          points={userProgress.points}
        />
        <KitAds activeCourse={userProgress.activeCourse} />
        <StreakCalendar 
          streak={userProgress.streak} 
          lastStreakUpdate={userProgress.lastStreakUpdate}
        />
        <DailyQuests 
          points={userProgress.points}
          streak={userProgress.streak}
        />
      </StickyWrapper>
      
      <FeedWrapper>
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                {greeting}, {childName}! 👋
              </h1>
              <p className="text-slate-600">
                Ready to continue your learning journey?
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                Active Course
              </CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-blue-800">
                  {userProgress.activeCourse.title}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">
                XP Points
              </CardTitle>
              <Zap className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-800">
                {userProgress.points}
              </div>
              <p className="text-xs text-orange-600">
                Keep learning to earn more!
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">
                Streak
              </CardTitle>
              <Flame className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800">
                {userProgress.streak} days
              </div>
              <p className="text-xs text-red-600">
                🔥 You're on fire!
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Progress
              </CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">
                {completionPercentage}%
              </div>
              <p className="text-xs text-green-600">
                Course completion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-full">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800">Continue Learning</h3>
                    <p className="text-xs text-blue-600">Pick up where you left off</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500 rounded-full">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-800">Take Quiz</h3>
                    <p className="text-xs text-purple-600">Test your knowledge</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-full">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800">View Progress</h3>
                    <p className="text-xs text-green-600">Check your achievements</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="p-2 bg-blue-500 rounded-full">
                  <Trophy className="h-3 w-3 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Completed "Introduction to Robotics"</p>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  +50 XP
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="p-2 bg-orange-500 rounded-full">
                  <Flame className="h-3 w-3 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Maintained {userProgress.streak}-day streak</p>
                  <p className="text-xs text-slate-500">Today</p>
                </div>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                  Streak!
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="p-2 bg-purple-500 rounded-full">
                  <Target className="h-3 w-3 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Completed daily quest</p>
                  <p className="text-xs text-slate-500">Yesterday</p>
                </div>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  Quest
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </FeedWrapper>
    </div>
  );
}