"use client";

import { useSyncExternalStore } from "react";

// Telas de celular/tablet em pé recebem o hero em sequência de quadros e ficam sem efeitos pesados
export const MOBILE_QUERY = "(max-width: 767px), (orientation: portrait) and (max-width: 1024px)";

export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const useIsMobile = () => useMediaQuery(MOBILE_QUERY, true);
