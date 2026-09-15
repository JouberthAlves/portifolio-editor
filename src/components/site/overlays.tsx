"use client";

import dynamic from "next/dynamic";
import { useIsMobile } from "@/lib/use-media";

const Noise = dynamic(() => import("@/components/Noise"), { ssr: false });
const TargetCursor = dynamic(() => import("@/components/TargetCursor"), { ssr: false });

// Grão de filme sobre o site inteiro + cursor em forma de marcação de foco.
// No celular os dois saem: o grão redesenha um canvas de tela cheia a cada frame e o cursor não existe no toque.
export function Overlays() {
  const isMobile = useIsMobile();
  if (isMobile) return null;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[60] opacity-70 mix-blend-overlay" aria-hidden>
        <Noise patternSize={250} patternScaleX={2} patternScaleY={2} patternRefreshInterval={3} patternAlpha={22} />
      </div>
      <TargetCursor spinDuration={3} hideDefaultCursor parallaxOn cursorColor="#ecebe6" cursorColorOnTarget="#ff3b30" />
    </>
  );
}
