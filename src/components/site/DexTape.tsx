"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BorderBeam } from "@/components/ui/border-beam";
import { hasMint, project } from "@/lib/config";
import { shortenAddress } from "@/lib/format";
import { dexscreenerEmbedUrl, dexscreenerUrl } from "@/lib/links";

const WAIT_LINES = [
  "Awaiting official mint.",
  "No simulated candles.",
  "The tape stays dark until the contract is real.",
];

export function DexTape() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [line, setLine] = useState(0);
  const embed = dexscreenerEmbedUrl();
  const page = dexscreenerUrl();
  const live = Boolean(embed);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio > 0.2),
      { threshold: [0.2, 0.45] },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (live) return;
    const id = window.setInterval(() => {
      setLine((value) => (value + 1) % WAIT_LINES.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [live]);

  return (
    <div ref={stageRef} className="cardboard relative mt-6 overflow-hidden rounded-[32px] p-3 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-2 text-[11px] tracking-[0.2em] uppercase">
        <span>Board reel 02 · DexScreener</span>
        <span>{live ? `${project.ticker} · ${shortenAddress(project.mint)}` : "Signal locked"}</span>
      </div>

      <div className="tape-scanlines relative overflow-hidden rounded-[22px] bg-black shadow-[inset_0_0_0_1px_rgba(0,0,0,0.35)]">
        <BorderBeam colorFrom="#86efac" colorTo="#4ade80" size={140} duration={10} />
        <div className="relative min-h-[280px] w-full sm:min-h-[360px] lg:min-h-[400px]">
          {live && inView ? (
            <>
              {!loaded ? <ChartSkeleton /> : null}
              <iframe
                key={embed}
                src={embed}
                title={`${project.ticker} DexScreener chart`}
                loading="lazy"
                allow="clipboard-write"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setLoaded(true)}
                className={`absolute inset-0 h-full w-full border-0 bg-black transition-opacity duration-700 ${
                  loaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </>
          ) : live ? (
            <ChartSkeleton />
          ) : (
            <EmptyTape line={line} />
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,6,0.12),transparent_18%,transparent_82%,rgba(5,8,6,0.28))]" />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-2">
        <p className="text-[11px] leading-5 tracking-[0.08em] text-[var(--dim)]">
          {live
            ? "Live pair tape from DexScreener. Not a promise of price, volume, or rewards."
            : "This board lights the official DexScreener embed the moment the $Pump mint is published."}
        </p>
        {page ? (
          <a
            href={page}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] tracking-[0.18em] uppercase text-[var(--dim)] hover:text-[var(--orange)]"
          >
            Open DexScreener
          </a>
        ) : (
          <span className="text-[11px] tracking-[0.18em] uppercase text-[var(--dim)]/70">
            {hasMint() ? "Chart pair pending" : "Contract pending"}
          </span>
        )}
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[#050806]">
      <div className="absolute inset-6 overflow-hidden rounded-xl opacity-40">
        <div className="absolute inset-x-0 bottom-[18%] h-px bg-[var(--orange)]/50" />
        <svg className="h-full w-full" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
          <path
            d="M0 28 C12 26 14 18 22 20 C30 22 34 12 42 14 C50 16 54 8 62 11 C70 14 74 6 82 9 C90 12 94 7 100 8 L100 40 L0 40 Z"
            fill="rgba(134,239,172,0.16)"
          />
          <path
            d="M0 28 C12 26 14 18 22 20 C30 22 34 12 42 14 C50 16 54 8 62 11 C70 14 74 6 82 9 C90 12 94 7 100 8"
            fill="none"
            stroke="#86efac"
            strokeWidth="0.6"
          />
        </svg>
      </div>
      <p className="relative text-[11px] tracking-[0.22em] uppercase text-[var(--gold)]">
        Tuning the live tape…
      </p>
    </div>
  );
}

function EmptyTape({ line }: { line: number }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[#050806]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(134,239,172,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(134,239,172,0.12)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="relative max-w-md px-6 text-center">
        <p className="text-[11px] tracking-[0.28em] uppercase text-[var(--gold)]">No signal · Exhibit B</p>
        <p className="display mt-3 text-5xl text-white sm:text-6xl">The coin is off-tape.</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={WAIT_LINES[line]}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 text-sm leading-6 text-[var(--dim)]"
          >
            {WAIT_LINES[line]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
