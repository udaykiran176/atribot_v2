import { auth } from "@/lib/auth";
import { getAllCourses, getUserProgress } from "@/db/queries";
import { headers } from "next/headers";
import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import RedirectTo from "@/components/redirect-to";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KitCard } from "@/components/shop/kit-card";
import { ShoppingCart, Star, Package, Zap } from "lucide-react";

export default async function ShopPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return <RedirectTo href="/login" />;
  }

  const userProgress = await getUserProgress(session.user.id);
  const allCourses = await getAllCourses();

  if (!userProgress?.activeCourseId || !userProgress.activeCourse) {
    return <RedirectTo href="/courses" />;
  }

  // Filter courses that have kit information
  const coursesWithKits = allCourses.filter(course => 
    course.kitTitle && course.kitDescription && course.kitPrice
  );

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6 pb-12 lg:pb-0">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          streak={userProgress.streak}
          points={userProgress.points}
        />
        
        {/* Shop Info Card */}
        <Card className="w-full bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              SHOP BENEFITS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-purple-700">Free shipping on orders over $75</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-purple-700">Premium quality components</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-purple-700">Hands-on learning experience</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </StickyWrapper>
      
      <FeedWrapper>
        {/* Shop Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Course Kits Shop</h1>
          <p className="text-slate-600">
            Get the complete hardware kits for your courses and bring your learning to life!
          </p>
        </div>

        {/* Course Kit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coursesWithKits.map((course) => {
            const isActiveCourse = course.id === userProgress.activeCourseId;
            return (
              <KitCard 
                key={course.id}
                course={course}
                isActiveCourse={isActiveCourse}
              />
            );
          })}
        </div>

        {/* No Kits Available */}
        {coursesWithKits.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                No Kits Available
              </h3>
              <p className="text-slate-600">
                Course kits are being prepared. Check back soon!
              </p>
            </CardContent>
          </Card>
        )}
      </FeedWrapper>
    </div>
  );
}