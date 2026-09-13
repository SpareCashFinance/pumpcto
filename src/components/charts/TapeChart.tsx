"use client";

import { useEffect, useRef } from "react";
import { AreaSeries, ColorType, createChart } from "lightweight-charts";
import type { RewardEvent } from "@/lib/market";

export function TapeChart({ history }: { history: RewardEvent[] }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = host.current;
    if (!node) return;

    // #region agent log
    fetch("http://127.0.0.1:7447/ingest/7261716d-045c-4378-bc38-b41af16803cc", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "f3f691" },
      body: JSON.stringify({
        sessionId: "f3f691",
        runId: "pre-fix",
        hypothesisId: "D",
        location: "TapeChart.tsx:createChart",
        message: "creating lightweight chart",
        data: { width: node.clientWidth, history: history.length },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    const chart = createChart(node, {
      height: 220,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#b8b3a8",
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "rgba(134,239,172,0.06)" },
        horzLines: { color: "rgba(134,239,172,0.06)" },
      },
      rightPriceScale: { borderColor: "rgba(134,239,172,0.12)" },
      timeScale: { borderColor: "rgba(134,239,172,0.12)", timeVisible: true },
      crosshair: { vertLine: { color: "rgba(134,239,172,0.45)" } },
    });

    const series = chart.addSeries(AreaSeries, {
      lineColor: "#86efac",
      topColor: "rgba(134,239,172,0.28)",
      bottomColor: "rgba(134,239,172,0.02)",
      lineWidth: 2,
    });

    const merged = new Map<number, number>();
    for (const row of history) {
      if (!row.at || row.amount == null || !Number.isFinite(row.amount)) continue;
      const time = Math.floor(new Date(row.at).getTime() / 1000);
      if (!Number.isFinite(time) || time <= 0) continue;
      merged.set(time, (merged.get(time) ?? 0) + row.amount);
    }
    const points = [...merged.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([time, value]) => ({ time: time as never, value }));

    // #region agent log
    fetch("http://127.0.0.1:7447/ingest/7261716d-045c-4378-bc38-b41af16803cc", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "f3f691" },
      body: JSON.stringify({
        sessionId: "f3f691",
        runId: "post-fix",
        hypothesisId: "D",
        location: "TapeChart.tsx:points",
        message: "sanitized chart points",
        data: { raw: history.length, unique: points.length },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    try {
      if (points.length > 0) series.setData(points);
      chart.timeScale().fitContent();
    } catch (error) {
      // #region agent log
      fetch("http://127.0.0.1:7447/ingest/7261716d-045c-4378-bc38-b41af16803cc", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "f3f691" },
        body: JSON.stringify({
          sessionId: "f3f691",
          runId: "post-fix",
          hypothesisId: "D",
          location: "TapeChart.tsx:setData",
          message: "chart setData failed",
          data: { error: String(error) },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
    }

    const resize = () => chart.applyOptions({ width: node.clientWidth });
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(node);

    return () => {
      observer.disconnect();
      chart.remove();
    };
  }, [history]);

  const empty = history.filter((row) => row.at && row.amount != null).length < 2;

  return (
    <div className="relative min-h-[220px]">
      <div ref={host} className="h-[220px] w-full" />
      {empty ? (
        <div className="absolute inset-0 grid place-items-center rounded-2xl border border-dashed border-[rgba(134,239,172,0.16)] bg-[#050806]/40 text-center">
          <p className="max-w-xs text-sm text-[var(--dim)]">
            Trading tape locked. Verified PUMP distributions will plot here after the first payout — no simulated candles.
          </p>
        </div>
      ) : null}
    </div>
  );
}
