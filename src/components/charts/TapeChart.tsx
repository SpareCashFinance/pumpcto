"use client";

import type { RewardEvent } from "@/lib/market";

function pointsFrom(history: RewardEvent[]) {
  const merged = new Map<number, number>();
  for (const row of history) {
    if (!row.at || row.amount == null || !Number.isFinite(row.amount)) continue;
    const time = Math.floor(new Date(row.at).getTime() / 1000);
    if (!Number.isFinite(time) || time <= 0) continue;
    merged.set(time, (merged.get(time) ?? 0) + row.amount);
  }
  return [...merged.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([time, value]) => ({ time, value }));
}

export function TapeChart({ history }: { history: RewardEvent[] }) {
  const points = pointsFrom(history);

  if (points.length < 2) {
    return (
      <div className="relative grid min-h-[220px] place-items-center rounded-2xl border border-dashed border-[rgba(134,239,172,0.16)] bg-[#050806]/40 text-center">
        <p className="max-w-xs text-sm text-[var(--dim)]">
          Trading tape locked. Verified PUMP distributions will plot here after the first payout — no simulated candles.
        </p>
      </div>
    );
  }

  const min = Math.min(...points.map((point) => point.value));
  const max = Math.max(...points.map((point) => point.value));
  const span = Math.max(max - min, 1);
  const coords = points.map((point, index) => {
    const x = (index / (points.length - 1)) * 100;
    const y = 36 - ((point.value - min) / span) * 28;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  const line = coords.join(" ");
  const area = `0,40 ${line} 100,40`;

  return (
    <div className="relative min-h-[220px]">
      <svg className="h-[220px] w-full" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
        <polygon points={area} fill="rgba(134,239,172,0.16)" />
        <polyline points={line} fill="none" stroke="#86efac" strokeWidth="0.7" />
      </svg>
    </div>
  );
}
