import Image from "next/image";
import { Button } from "@/components/ui/button";
import { courses } from "@/db/schema";

type KitAdsProps = {
  activeCourse: typeof courses.$inferSelect;
};

export const KitAds = ({ activeCourse }: KitAdsProps) => {
  // Parse kit features from JSON string, fallback to empty array
  const kitFeatures = activeCourse.kitFeatures 
    ? JSON.parse(activeCourse.kitFeatures) 
    : [];

  // Don't render if no kit data is available
  if (!activeCourse.kitTitle || !activeCourse.kitDescription) {
    return null;
  }

  return (
    <div className="w-full rounded-xl border-2 border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <Image
          src={activeCourse.kitImage || "/kit-default.svg"}
          alt={activeCourse.kitTitle || "Course Kit"}
          width={40}
          height={40}
          className="rounded-lg"
        />
        <div>
          <h3 className="font-bold text-slate-800 text-sm">{activeCourse.kitTitle}</h3>
          <p className="text-xs text-slate-600">{activeCourse.title}</p>
        </div>
      </div>
      
      <p className="text-xs text-slate-700 mb-3 leading-relaxed">
        {activeCourse.kitDescription}
      </p>
      
      <div className="space-y-1 mb-3">
        {kitFeatures.map((feature: string, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span className="text-xs text-slate-600">{feature}</span>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-green-600">{activeCourse.kitPrice || "Contact for pricing"}</span>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs">
          Buy Now
        </Button>
      </div>
    </div>
  );
};
