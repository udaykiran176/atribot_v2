"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

// Whitelist of allowed interactive game components
// Map DB componentPath -> dynamic import
const GAME_IMPORTS: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
  "games/basic_led_circuit": () => import("@/games/basic_led_circuit"),
  
};

export function InteractiveGameLoader({ componentPath }: { componentPath: string }) {
  const importer = GAME_IMPORTS[componentPath];

  const Game = useMemo(() => {
    if (!importer) return null;
    return dynamic(importer, { ssr: false, loading: () => <div>Loading game…</div> });
  }, [importer]);

  if (!importer || !Game) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center">
        <div>
          <p className="text-lg font-semibold">Interactive game not available</p>
          <p className="text-sm text-muted-foreground mt-2">Unknown component path: {componentPath}</p>
        </div>
      </div>
    );
  }

  return <Game />;
}
