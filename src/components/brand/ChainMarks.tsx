"use client";

import { NetworkSolana } from "@web3icons/react";
import { cn } from "@/lib/utils";

export function ChainMarks({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-[var(--dim)]", className)}>
      <span className="inline-flex items-center gap-1.5">
        <NetworkSolana variant="branded" size={16} />
        Solana
      </span>
      <span className="text-[var(--gold)]">/</span>
      <span className="inline-flex items-center gap-1.5">
        PUMP
      </span>
      <span className="text-[var(--gold)]">/</span>
      <span className="inline-flex items-center gap-1.5">
        pump.fun
      </span>
    </div>
  );
}
