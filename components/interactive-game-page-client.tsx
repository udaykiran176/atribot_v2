"use client";

import { FullscreenProvider } from "@/components/FullscreenContext";
import { SoundProvider } from "@/components/SoundContext";
import { InteractiveGameLoader } from "@/components/interactive-game-loader";

export function InteractiveGamePageClient({ componentPath }: { componentPath: string }) {
  return (
    <FullscreenProvider>
      <SoundProvider>
        <div className="h-full w-full">
          <InteractiveGameLoader componentPath={componentPath} />
        </div>
      </SoundProvider>
    </FullscreenProvider>
  );
}
