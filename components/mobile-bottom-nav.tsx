"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MobileNavItemProps = {
  label: string;
  iconSrc: string;
  href: string;
  isActive: boolean;
};

const MobileNavItem = ({ label, iconSrc, href, isActive }: MobileNavItemProps) => {
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${
        isActive ? 'text-green-500' : 'text-gray-600 hover:text-green-500'
      }`}
    >
      <Image
        src={iconSrc}
        alt={label}
        height={24}
        width={24}
        className={`mb-1 ${isActive ? 'opacity-100' : 'opacity-70'}`}
      />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
};

type MobileBottomNavProps = {
  userGender?: string;
};

export const MobileBottomNav = ({ userGender }: MobileBottomNavProps) => {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", iconSrc: "/sidebar_icon/dashboard.png" },
    { label: "Learn", href: "/learn", iconSrc: "/sidebar_icon/learn.png" },
    { label: "Leaderboard", href: "/leaderboard", iconSrc: "/sidebar_icon/leaderboard.png" },
    { label: "Quests", href: "/quests", iconSrc: "/sidebar_icon/quests.png" },
    { label: "Shop", href: "/shop", iconSrc: "/sidebar_icon/shop.png" },
    { 
      label: "Profile", 
      href: "/profile", 
      iconSrc: userGender === 'female' ? "/sidebar_icon/girl.png" : "/sidebar_icon/boy.png"
    },
  ];

  return (
    <nav className="fixed bottom-0 z-50 flex h-[70px] w-full items-center border-t bg-white lg:hidden">
      {navItems.map((item) => (
        <MobileNavItem
          key={item.href}
          label={item.label}
          iconSrc={item.iconSrc}
          href={item.href}
          isActive={pathname === item.href}
        />
      ))}
    </nav>
  );
};
