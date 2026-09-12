"use client";

import { useSyncExternalStore } from "react";
import NumberFlow from "@number-flow/react";
import { formatCompact } from "@/lib/format";
import { useBurnSnapshot } from "@/lib/burn-client";
import type { BurnSnapshot } from "@/lib/burn";
import { project } from "@/lib/config";

function heatFor(burn: BurnSnapshot) {
  if (burn.totalBurned <= 0) return "armed";
  if (burn.burnedPct >= 50 || burn.launchBurned > 0) return "roaring";
  return "lit";
}

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function FireMark({ heat, size = "sm" }: { heat: ReturnType<typeof heatFor>; size?: "sm" | "lg" }) {
  const reduce = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const px = size === "lg" ? 56 : 26;

  return (
    <span className={`burn-fire burn-fire-${heat} ${size === "lg" ? "burn-fire-lg" : ""}`} aria-hidden>
      <span className="burn-fire-glow" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={reduce ? "/media/burn-fire-still.png" : "/media/burn-fire.gif"}
        alt=""
        width={px}
        height={px}
        className="burn-fire-gif"
      />
    </span>
  );
}

export function BurnRibbon({ initial }: { initial: BurnSnapshot }) {
  const burn = useBurnSnapshot(initial);
  const heat = heatFor(burn);
  const pct = Math.max(0, Math.min(100, burn.burnedPct));

  return (
    <a
      href="/#tax"
      className="burn-ribbon"
      data-heat={heat}
      aria-label={`${project.ticker} holder tax is ${pct.toFixed(0)} percent paid in PUMP`}
    >
      <FireMark heat={heat} />
      <span className="min-w-0">
        <span className="flex items-baseline gap-1.5">
          <span className="font-mono text-[13px] font-semibold tabular-nums text-white sm:text-sm">
            <NumberFlow value={pct} format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
            <span className="text-[var(--orange)]">%</span>
          </span>
          <span className="hidden text-[10px] tracking-[0.16em] uppercase text-[var(--gold)] sm:inline">
            tax to holders
          </span>
        </span>
        <span className="block text-[10px] leading-none text-[var(--stone)] sm:hidden">
          {`${burn.plannedLaunchPct}% PUMP`}
        </span>
      </span>
      <span className="burn-track" aria-hidden>
        <span className="burn-track-fill" style={{ width: `${pct}%` }} />
        <span
          className="burn-track-mark"
          style={{ left: `${burn.plannedLaunchPct}%` }}
          title={`${burn.plannedLaunchPct}% holder tax`}
        />
      </span>
      <span className="hidden min-w-0 items-center gap-3 text-[10px] font-semibold tracking-[0.14em] uppercase sm:flex">
        <span className="text-[var(--orange-2)]">{`${burn.plannedLaunchPct}% to holders in PUMP`}</span>
        <span className="hidden text-[var(--stone)] lg:inline">
          CTO
          <span className="mx-1.5 text-[var(--graphite)]">·</span>
          No launch burn
        </span>
      </span>
    </a>
  );
}

export function BurnIncinerator({ initial }: { initial: BurnSnapshot }) {
  const burn = useBurnSnapshot(initial);
  const heat = heatFor(burn);
  const pct = Math.max(0, Math.min(100, burn.burnedPct));
  const remaining = formatCompact(
    burn.circulatingSupply ?? Math.max(0, burn.initialSupply - burn.totalBurned),
  );

  return (
    <div className="burn-incinerator" data-heat={heat}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <FireMark heat={heat} size="lg" />
          <div>
            <p className="kicker">Holder tax</p>
            <p className="display mt-1 text-5xl text-white sm:text-6xl">
              <NumberFlow value={pct} format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
              <span className="text-[var(--orange)]">%</span>
            </p>
          </div>
        </div>
        <p className="max-w-sm text-sm leading-6 text-[var(--dim)]">{burn.message}</p>
      </div>

      <div className="burn-track burn-track-lg mt-5" aria-hidden>
        <span className="burn-track-fill" style={{ width: `${pct}%` }} />
        <span className="burn-track-mark" style={{ left: `${burn.plannedLaunchPct}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-[10px] tracking-[0.16em] uppercase text-[var(--stone)]">
        <span>0%</span>
        <span className="text-[var(--orange)]">{burn.plannedLaunchPct}% tax</span>
        <span>100%</span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="kicker">Holder tax</p>
          <p className="mt-2 font-mono text-2xl text-white">{`${burn.plannedLaunchPct}%`}</p>
          <p className="mt-1 text-xs text-[var(--dim)]">Of trades, paid to eligible holders in PUMP</p>
        </div>
        <div>
          <p className="kicker">Launch burn</p>
          <p className="mt-2 font-mono text-2xl text-white">None</p>
          <p className="mt-1 text-xs text-[var(--dim)]">This CTO keeps the float. The tax is the mechanic.</p>
        </div>
        <div>
          <p className="kicker">Circulating</p>
          <p className="mt-2 font-mono text-2xl text-white">{remaining ?? "—"}</p>
          <p className="mt-1 text-xs text-[var(--dim)]">
            {`of ${formatCompact(burn.initialSupply)} minted`}
          </p>
        </div>
      </div>
    </div>
  );
}
