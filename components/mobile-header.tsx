
"use client";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/server/users';
import Image from 'next/image';
import Link from 'next/link';

const getPageTitle = (pathname: string) => {
  if (!pathname) return 'AtriBOT';
  
  const routes: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/learn': 'Learn',
    '/leaderboard': 'Leaderboard',
    '/quests': 'Quests',
    '/shop': 'Shop',
    '/profile': 'Profile',
  };

  // Find the matching route
  const matchedRoute = Object.entries(routes).find(([path]) => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  return matchedRoute ? matchedRoute[1] : 'AtriBOT';
};

export const MobileHeader = () => {
  const pathname = usePathname() || '/';
  const pageTitle = getPageTitle(pathname);
  const [childName, setChildName] = useState<string | null>(null);
  const [childGender, setChildGender] = useState<string | null>(null);
  const [childLevel, setChildLevel] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { currentUser } = await getCurrentUser();
        if (currentUser?.childName) {
          setChildName(currentUser.childName);
          setChildGender(currentUser.childGender);
          setChildLevel(currentUser.childLevel);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <nav className="fixed bg-white top-0 z-50 flex h-[50px] w-full items-center justify-between border-b  px-4 lg:hidden">
      <div> {/* current page title */}
        <h1 className="text-lg font-bold text-blue-500">{pageTitle}</h1>
      </div>
      <Link 
        href="/profile" 
        className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
      >
        <div className="flex flex-col items-left">
          {!isLoading && childName && (
            <span className="text-slate-700 font-medium text-sm">
              {childName}
            </span>
          )}
          {!isLoading && childLevel && (
            <span className="text-slate-500 text-xs">
              Level {childLevel}
            </span>
          )}
        </div>
        {childGender && (
          <Image
            src={childGender === 'female' ? "/sidebar_icon/girl.png" : "/sidebar_icon/boy.png"}
            alt={childGender === 'female' ? "Girl" : "Boy"}
            height={30}
            width={30}
            className="rounded-full border-1 border-blue-200"
          />
        )}
      </Link>
    </nav>
  );
};
