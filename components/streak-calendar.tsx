"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";

type StreakCalendarProps = {
  streak: number;
  lastStreakUpdate?: Date | null;
};

export const StreakCalendar = ({ streak, lastStreakUpdate }: StreakCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();
  
  // Generate streak dates (last 'streak' days from today)
  const streakDates = new Set<string>();
  if (lastStreakUpdate) {
    const lastUpdate = new Date(lastStreakUpdate);
    for (let i = 0; i < streak; i++) {
      const date = new Date(lastUpdate);
      date.setDate(date.getDate() - i);
      streakDates.add(date.toDateString());
    }
  }
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames = ["Su", "M", "T", "W", "Th", "F", "Sa"];
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };
  
  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === currentMonth && 
           today.getFullYear() === currentYear;
  };
  
  const isStreakDay = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return streakDates.has(date.toDateString());
  };
  
  return (
    <div className="w-full rounded-xl border-2 border-slate-200 bg-gradient-to-br from-orange-50 to-yellow-50 p-4 shadow-sm">
      {/* Streak Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-full">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-orange-600">{streak} day streak</p>
            <p className="text-xs text-slate-600">Keep it up!</p>
          </div>
        </div>
      </div>
      
      {streak > 0 && (
        <div className="bg-orange-100 rounded-lg p-3 mb-4">
          <p className="text-xs text-orange-700 text-center">
            🔥 Do a lesson today to extend your streak!
          </p>
          <Button 
            size="sm" 
            className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white text-xs"
          >
            EXTEND STREAK
          </Button>
        </div>
      )}
      
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth('prev')}
          className="p-1 h-8 w-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <h3 className="font-semibold text-sm text-slate-700">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth('next')}
          className="p-1 h-8 w-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-slate-500 py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: startingDayOfWeek }, (_, i) => (
          <div key={`empty-${i}`} className="h-8"></div>
        ))}
        
        {/* Days of the month */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const todayClass = isToday(day) ? "bg-blue-500 text-white" : "";
          const streakClass = isStreakDay(day) ? "bg-orange-400 text-white" : "";
          const baseClass = "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium cursor-pointer hover:bg-slate-100";
          
          return (
            <div
              key={day}
              className={`${baseClass} ${streakClass || todayClass}`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};
