"use client";

import { useEffect, useRef, useState } from "react";

export function DoneeGlowSectionBoundary({ totalDonated }: { totalDonated: number }) {
  const lastScrollY = useRef(0);
  const [glow, setGlow] = useState(0.25);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;

      setGlow((currentGlow) => {
        const nextGlow = isScrollingDown ? currentGlow + 0.08 : currentGlow - 0.08;
        return Math.min(1, Math.max(0.18, nextGlow));
      });

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const topLightness = 78 - glow * 18;
  const middleLightness = 84 - glow * 12;
  const glowAlpha = 0.16 + glow * 0.34;

  return (
    <div
      className="relative left-1/2 z-10 mt-[12vw] h-[22vw] w-[40vw] -translate-x-1/2 rounded-t-full transition-[background,box-shadow] duration-500"
      style={{
        background: `linear-gradient(180deg, hsl(35 100% ${topLightness}%) 10%, hsl(34 100% ${middleLightness}%) 40%, #FFF4EC 90%)`,
        boxShadow: `0 -70px 120px rgba(255, 179, 71, ${glowAlpha})`,
      }}
    >
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9b5d12]">
          Total Donated
        </p>
        <p className="mt-2 text-5xl font-black text-[#1d2520]">
          ${totalDonated.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
