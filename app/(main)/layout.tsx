import type { PropsWithChildren } from "react";

import { MobileHeader } from "@/components/mobile-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Sidebar } from "@/components/sidebar";

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <MobileHeader />
      <MobileBottomNav />
      <Sidebar className="hidden lg:flex" />
      <main className="h-full pt-[50px] pb-[70px] lg:pl-[256px] lg:pt-0 lg:pb-0">
        <div className="mx-auto h-full max-w-[1056px] pt-6">{children}</div>
      </main>
    </>
  );
};

export default MainLayout;
