"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Course = {
  id: number;
  title: string;
  imageSrc: string;
  kitTitle: string | null;
  kitDescription: string | null;
  kitPrice: string | null;
  kitImage: string | null;
  kitFeatures: string | null;
};

type KitCardProps = {
  course: Course;
  isActiveCourse: boolean;
};

export const KitCard = ({ course, isActiveCourse }: KitCardProps) => {
  const kitFeatures = course.kitFeatures 
    ? JSON.parse(course.kitFeatures) 
    : [];

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 ${
        isActiveCourse ? 'ring-2 ring-blue-500 bg-blue-50/50' : 'hover:shadow-md'
      }`}
    >
      {isActiveCourse && (
        <Badge className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 z-10">
          Active Course
        </Badge>
      )}
      
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={course.kitImage || "/kit-default.png"}
              alt={course.kitTitle || "Course Kit"}
              width={48}
              height={48}
              className="rounded-lg border border-slate-200"
            />
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-slate-800">
                {course.kitTitle}
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                {course.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-green-600">
              {course.kitPrice}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-0">
        <p className="text-sm text-slate-700 line-clamp-2 h-10">
          {course.kitDescription}
        </p>
        
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-800">What's included:</h4>
          <div className="grid grid-cols-1 gap-1">
            {kitFeatures.slice(0, 3).map((feature: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-xs text-slate-600 truncate">{feature}</span>
              </div>
            ))}
            {kitFeatures.length > 3 && (
              <div className="text-xs text-slate-500">+{kitFeatures.length - 3} more items</div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <Link 
            href={`/shop/kits/${course.id}`} 
            className="text-xs font-medium text-blue-600 hover:underline flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            View Details <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
          <Button size="sm" className="gap-2" onClick={(e) => e.stopPropagation()}>
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
