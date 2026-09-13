"use client";

import type { ReactNode } from "react";
import { BrandMark } from "@/components/brand/BrandMark";
import { project } from "@/lib/config";
import { formatPct, formatUsdPrice } from "@/lib/format";
import { usePriceTape } from "@/lib/tape-client";
import type { PriceTapeSnapshot, TapeQuote } from "@/lib/tape";

function QuoteCell({ quote, mark }: { quote: TapeQuote; mark: ReactNode }) {
  const price = formatUsdPrice(quote.priceUsd);
  const change = formatPct(quote.change24hPct);
  const up = (quote.change24hPct ?? 0) > 0;
  const down = (quote.change24hPct ?? 0) < 0;

  return (
    <span className="inline-flex items-center gap-2 px-5">
      {mark}
      <span className="tracking-[0.18em] text-[var(--gold)]">{quote.symbol}</span>
      {price ? (
        <span className="font-mono text-white">{price}</span>
      ) : (
        <span className="text-[var(--stone)]">
          {quote.status === "awaiting_launch" ? "awaiting launch" : "off tape"}
        </span>
      )}
      {change ? (
        <span className={up ? "text-[var(--orange)]" : down ? "text-[#ff8a8a]" : "text-[var(--dim)]"}>
          {change}
        </span>
      ) : null}
    </span>
  );
}

function TapeSequence({ tape }: { tape: PriceTapeSnapshot }) {
  return (
    <div className="flex shrink-0 items-center text-[11px] font-semibold uppercase">
      {[0, 1, 2].map((copy) => (
        <span key={copy} className="inline-flex items-center">
          <span className="px-5 tracking-[0.22em] text-[var(--orange)]">Live tape</span>
          <QuoteCell
            quote={tape.btc}
            mark={
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.assets.mark} alt="" width={22} height={11} className="inline-block h-3 w-6 align-[-0.15em]" />
            }
          />
          <span className="text-[var(--stone)]">•</span>
          <QuoteCell quote={tape.jrock} mark={<BrandMark size={16} />} />
          <span className="px-5 text-[var(--stone)]">•</span>
        </span>
      ))}
    </div>
  );
}

export function PriceTape({ initial }: { initial: PriceTapeSnapshot }) {
  const tape = usePriceTape(initial);

  return (
    <div className="price-tape overflow-hidden border-b border-[rgba(134,239,172,0.12)] bg-[#050806]/95">
      <div className="price-tape-track">
        <TapeSequence tape={tape} />
        <TapeSequence tape={tape} />
      </div>
    </div>
  );
}
