import type { PropsWithChildren } from "react";
import { Header } from "./header";
import { FeatureCards } from "@/components/marketing/feature-cards";
import VideoLessons from "@/components/marketing/video-lessons";
import SwipeLearn from "@/components/marketing/swipe-learn";  
import WiringGame from "@/components/marketing/Wiring-Game";
import CircuitsTogether from "@/components/marketing/Circuits-Together";
import MCQ from "@/components/marketing/mcq";

const MarketingLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {children}
        <FeatureCards />
        <VideoLessons />
        <SwipeLearn />
        <WiringGame />
        <CircuitsTogether />
        <MCQ />
      </main>
    </div>
  );
};

export default MarketingLayout;
