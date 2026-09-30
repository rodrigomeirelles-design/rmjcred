"use client";

import { useEffect, useRef } from "react";
import { trackScrollDepth } from "@/lib/analytics";

/**
 * Hook que rastreia scroll depth automaticamente.
 * Dispara eventos nos marcos de 25%, 50%, 75% e 100%.
 * Usar uma vez por página (ex: dentro do AnalyticsProvider ou em pages específicas).
 */
export function useScrollTracking() {
  const firedMilestones = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      if (documentHeight <= windowHeight) return; // page doesn't scroll

      const scrollPercent = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100
      );

      const milestones = [25, 50, 75, 100] as const;
      for (const milestone of milestones) {
        if (
          scrollPercent >= milestone &&
          !firedMilestones.current.has(milestone)
        ) {
          firedMilestones.current.add(milestone);
          trackScrollDepth({ depth_percentage: milestone });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
}
