"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CircularText } from "@/components/react-bits/CircularText";

type Trick = "idle" | "sit" | "stay" | "rollover" | "fetch" | "stack";

type MascotProps = {
  size?: "hero" | "stage";
  trick?: Trick;
  dropping?: boolean;
  stacked?: number;
};

const trickClass: Record<Trick, string> = {
  idle: "",
  sit: "translate-y-6",
  stay: "",
  rollover: "rotate-[360deg]",
  fetch: "-translate-x-8 -translate-y-3",
  stack: "translate-x-3",
};

export function Mascot({
  size = "hero",
  trick = "idle",
  dropping = false,
  stacked = 0,
}: MascotProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const ringId = `pump-ring-${useId().replace(/:/g, "")}`;
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const node = wrap.current?.closest("[data-mascot-stage]") ?? wrap.current;
    if (!node) return;

    const onMove = (event: Event) => {
      const pointer = event as PointerEvent;
      const box = node.getBoundingClientRect();
      const x = ((pointer.clientX - box.left) / box.width - 0.5) * 10;
      const y = ((pointer.clientY - box.top) / box.height - 0.5) * -8;
      setTilt({ x, y });
    };
    const reset = () => setTilt({ x: 0, y: 0 });

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", reset);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <div
      ref={wrap}
      className="relative mx-auto grid place-items-center"
      style={{ width: size === "hero" ? "min(100%, 520px)" : "min(100%, 380px)", aspectRatio: "1" }}
    >
      <CircularText
        pathId={ringId}
        text="A CTO • 3% TAX • PAID TO HOLDERS IN PUMP • $PUMP • PUMP.FUN"
        className="pointer-events-none absolute inset-0 text-[rgba(232,210,176,0.42)]"
      />
      <div
        className={`mascot-idle relative grid place-items-center transition-transform duration-500 ${trickClass[trick]}`}
        style={{
          width: "70%",
          transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        }}
      >
        <div className="absolute inset-[-8%] rounded-full bg-[radial-gradient(circle,rgba(247,147,26,0.28),transparent_68%)] blur-2xl" />
        <div className="relative z-10 grid aspect-square w-full place-items-center overflow-hidden rounded-full border border-[rgba(247,147,26,0.35)] bg-[#060a12]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mascot.jpg"
            alt="Pump community-takeover token mark"
            className="h-full w-full select-none object-cover"
          />
        </div>
        {dropping ? (
          <span className="coin-drop absolute left-1/2 top-[18%] z-20 grid h-10 w-10 place-items-center rounded-full bg-[#f7931a] text-sm font-black text-[#1a0f04] shadow-[0_0_24px_rgba(247,147,26,0.65)]">
            P
          </span>
        ) : null}
        {stacked > 0 ? (
          <div className="absolute right-[8%] bottom-[18%] z-20 flex flex-col-reverse items-center">
            {Array.from({ length: stacked }).map((_, index) => (
              <span
                key={index}
                className="mb-[-8px] grid h-8 w-8 place-items-center rounded-full bg-[#f7931a] text-[10px] font-black text-[#1a0f04] shadow-lg"
              >
                P
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
