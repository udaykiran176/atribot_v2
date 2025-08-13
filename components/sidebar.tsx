
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/server/users";
import { SidebarItem } from "./sidebar-item";

type SidebarProps = {
  className?: string;
};

export const Sidebar = async ({ className }: SidebarProps) => {
  const { currentUser } = await getCurrentUser();

  return (
    <div
      className={cn(
        "left-0 top-0 flex h-full flex-col border-r-2 px-4 lg:fixed lg:w-[256px]",
        className
      )}
    >
      <Link href="/">
        <div className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
          <Image src="/atribot_logo.svg" alt="Mascot" height={40} width={40} />

          <h1 className="text-2xl font-extrabold tracking-wide text-blue-500">
            Atri<span className="text-black">BOT</span>
          </h1>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-y-2">
        <SidebarItem label="Dashboard" href="/dashboard" iconSrc="/sidebar_icon/dashboard.png" />
        <SidebarItem label="Learn" href="/learn" iconSrc="/sidebar_icon/learn.png" />
        <SidebarItem
          label="Leaderboard"
          href="/leaderboard"
          iconSrc="/sidebar_icon/leaderboard.png"
        />
        <SidebarItem label="Quests" href="/quests" iconSrc="/sidebar_icon/quests.png" />
        <SidebarItem label="Shop" href="/shop" iconSrc="/sidebar_icon/shop.png" />
        <SidebarItem 
          label="Profile" 
          href="/profile" 
          iconSrc={
            (currentUser?.childGender === 'female' ? "/sidebar_icon/girl.png" : "/sidebar_icon/boy.png")
          } 
        />
      </div>

    </div>
  );
};
