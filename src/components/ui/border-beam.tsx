"use client";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
  style?: React.CSSProperties;
  reverse?: boolean;
  initialOffset?: number;
  borderWidth?: number;
}

export const BorderBeam = ({
  className,
  delay = 0,
  duration = 6,
  colorFrom = "#86efac",
  colorTo = "#4ade80",
  style,
  reverse = false,
  borderWidth = 1,
}: BorderBeamProps) => {
  // #region agent log
  fetch("http://127.0.0.1:7447/ingest/7261716d-045c-4378-bc38-b41af16803cc", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "f3f691" },
    body: JSON.stringify({
      sessionId: "f3f691",
      runId: "post-fix",
      hypothesisId: "C",
      location: "border-beam.tsx:mount",
      message: "css border beam mounted",
      data: { duration, reverse },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] border-transparent mask-[linear-gradient(#000,#000),linear-gradient(#000,#000)] [mask-clip:padding-box,border-box] [mask-composite:exclude]"
      style={
        {
          borderWidth,
        } as React.CSSProperties
      }
      aria-hidden
    >
      <div
        className={cn("absolute inset-[-55%]", className)}
        style={{
          background: `conic-gradient(from 180deg, transparent 0 70%, ${colorFrom} 80%, ${colorTo} 88%, transparent 96%)`,
          animationName: "border-beam-spin",
          animationDuration: `${Math.max(1, duration)}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDirection: reverse ? "reverse" : "normal",
          animationDelay: `-${Math.max(0, delay)}s`,
          ...style,
        }}
      />
    </div>
  );
};
