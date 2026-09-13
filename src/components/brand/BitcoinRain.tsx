"use client";

import { useMemo, useSyncExternalStore } from "react";

const PILLS = [
  { left: 2, size: 22, delay: 0, duration: 14, drift: 14, opacity: 0.42, spin: 1 },
  { left: 8, size: 30, delay: 1.6, duration: 17, drift: -12, opacity: 0.34, spin: -1 },
  { left: 14, size: 18, delay: 5.1, duration: 12, drift: 9, opacity: 0.3, spin: 1 },
  { left: 20, size: 26, delay: 3.2, duration: 16, drift: -8, opacity: 0.36, spin: -1 },
  { left: 26, size: 34, delay: 0.7, duration: 19, drift: 16, opacity: 0.4, spin: 1 },
  { left: 33, size: 20, delay: 7.4, duration: 13, drift: -11, opacity: 0.28, spin: -1 },
  { left: 39, size: 28, delay: 2.1, duration: 15, drift: 7, opacity: 0.38, spin: 1 },
  { left: 45, size: 16, delay: 8.8, duration: 11, drift: -6, opacity: 0.26, spin: -1 },
  { left: 51, size: 24, delay: 4.5, duration: 18, drift: 12, opacity: 0.33, spin: 1 },
  { left: 57, size: 32, delay: 1.2, duration: 20, drift: -15, opacity: 0.4, spin: -1 },
  { left: 63, size: 18, delay: 6.6, duration: 13, drift: 8, opacity: 0.29, spin: 1 },
  { left: 69, size: 26, delay: 3.9, duration: 16, drift: -10, opacity: 0.35, spin: -1 },
  { left: 75, size: 22, delay: 9.1, duration: 14, drift: 11, opacity: 0.31, spin: 1 },
  { left: 81, size: 30, delay: 0.4, duration: 18, drift: -9, opacity: 0.39, spin: -1 },
  { left: 87, size: 20, delay: 5.8, duration: 12, drift: 6, opacity: 0.27, spin: 1 },
  { left: 93, size: 28, delay: 2.6, duration: 17, drift: -13, opacity: 0.36, spin: -1 },
];

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function BitcoinRain() {
  return <PillRain />;
}

export function PillRain() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const reduce = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
  const pills = useMemo(() => PILLS, []);
  if (!mounted || reduce) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {pills.map((pill, index) => (
        <span
          key={index}
          className="bitcoin-rain absolute top-[-8%] block"
          style={{
            left: `${pill.left}%`,
            width: pill.size * 2,
            height: pill.size,
            opacity: pill.opacity,
            animationDelay: `${pill.delay}s`,
            animationDuration: `${pill.duration}s`,
            ["--drift" as string]: `${pill.drift}px`,
            ["--spin" as string]: `${pill.spin * 360}deg`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pill.svg" alt="" width={pill.size * 2} height={pill.size} className="h-full w-full" />
        </span>
      ))}
    </div>
  );
}
