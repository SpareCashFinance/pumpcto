"use client";

import { RewardAnalytics } from "@/components/charts/RewardAnalytics";
import { TapeChart } from "@/components/charts/TapeChart";
import { SlotHeadline } from "@/components/motion/SlotHeadline";
import { BorderBeam } from "@/components/ui/border-beam";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { displayValue, holderFeePercent, project } from "@/lib/config";
import { formatAmount, formatCount, formatUsd, shortenAddress, timeAgo } from "@/lib/format";
import { explorerAccountUrl, explorerTxUrl, explorerUrl } from "@/lib/links";
import type { MarketSnapshot } from "@/lib/market";
import { useMarketSnapshot } from "@/lib/market-client";
import { HouseButton } from "@/components/ui/house-button";
import { CopyButton } from "./CopyButton";

const statusLabel: Record<MarketSnapshot["status"], string> = {
  awaiting_launch: "Awaiting launch",
  awaiting_index: "Waiting on pump.fun",
  standard_mode: "Standard launch",
  no_distribution: "No verified distribution yet",
  unavailable: "Live data unavailable",
  live: "Live tape",
};

export function RewardTerminal({ market: initial }: { market: MarketSnapshot }) {
  const market = useMarketSnapshot(initial);
  const tax =
    market.transferFeeBps != null
      ? `${(market.transferFeeBps / 100).toFixed(2)}%`
      : displayValue(project.transferFee, `${holderFeePercent}%`);
  const figures = [
    { label: `Recent ${market.totalDistributedSymbol} paid`, value: formatAmount(market.totalDistributed, 2), hint: "From the latest vault payouts on-chain" },
    { label: "Vault remaining", value: formatAmount(market.pendingDistributed, 2), hint: "PUMP still sitting in the reward vault" },
    { label: "Holders paid", value: formatCount(market.holders), hint: "Unique wallets in this scan window" },
    { label: "Payout batches", value: formatCount(market.payoutCount), hint: "DistributeFeeToHolders transactions" },
    { label: "24h volume", value: formatUsd(market.volume24hUsd), hint: "Official market only" },
    { label: "Market cap", value: formatUsd(market.marketCapUsd), hint: "Not a promise" },
    { label: "Liquidity", value: formatUsd(market.liquidityUsd), hint: displayValue(project.liquidityStatus, "To be confirmed") },
    { label: "Holder Rewards", value: tax, hint: "Of trades, paid to holders in PUMP" },
    { label: "Last payout", value: timeAgo(market.lastDistribution?.at) ?? "None yet", hint: market.nextRewardStatus },
  ];

  return (
    <section id="rewards" className="section">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">Live reward terminal</p>
          <h2 className="display mt-3 text-6xl text-white sm:text-8xl">
            The community books.
          </h2>
        </div>
        <Badge variant="secondary" className="rounded-full px-3 py-1 text-[11px] tracking-[0.16em] uppercase">
          {statusLabel[market.status]}
        </Badge>
      </div>

      <Card className="relative overflow-hidden border-[rgba(134,239,172,0.14)] bg-[#0a120e]/70 p-5 sm:p-8">
        <BorderBeam colorFrom="#86efac" colorTo="#4ade80" size={120} duration={9} />
        <p className="max-w-2xl text-sm leading-6 text-[var(--dim)]">{market.message}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {figures.map((row) => (
            <div key={row.label} className="rounded-2xl border border-[rgba(134,239,172,0.1)] bg-[#050806]/50 p-4">
              <p className="kicker">{row.label}</p>
              <p className="mt-2 font-mono text-2xl text-white">
                <SlotHeadline value={row.value ?? "—"} entrance={Boolean(row.value)} />
              </p>
              <p className="mt-1 text-xs text-[var(--dim)]">{row.hint}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="kicker mb-3">Distribution tape</p>
            <TapeChart history={market.history} />
          </div>
          <div>
            <p className="kicker mb-3">Top receivers</p>
            {market.topReceivers.length ? (
              <div className="space-y-2">
                {market.topReceivers.map((row) => (
                  <a
                    key={row.wallet}
                    href={explorerAccountUrl(row.wallet)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-[rgba(134,239,172,0.1)] bg-[#050806]/50 px-4 py-3 text-sm hover:border-[rgba(134,239,172,0.35)]"
                  >
                    <span className="font-mono text-white">{shortenAddress(row.wallet, 6)}</span>
                    <span className="font-mono text-[var(--orange)]">
                      +{formatAmount(row.amount, 1)} PUMP
                    </span>
                  </a>
                ))}
              </div>
            ) : (
              <RewardAnalytics history={market.history} />
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-[var(--dim)]">
          <span>Mint {shortenAddress(project.mint || "pending")}</span>
          <CopyButton value={project.mint} className="px-3 text-[11px]" />
          {explorerUrl() ? (
            <HouseButton className="px-3 text-[11px]" href={explorerUrl()} target="_blank">
              Solscan
            </HouseButton>
          ) : null}
          {explorerUrl(project.rewardMint) ? (
            <HouseButton className="px-3 text-[11px]" href={explorerUrl(project.rewardMint)} target="_blank">
              PUMP mint
            </HouseButton>
          ) : (
            <span>PUMP mint · To be confirmed</span>
          )}
          {project.rewardVault ? (
            <HouseButton className="px-3 text-[11px]" href={explorerAccountUrl(project.rewardVault)} target="_blank">
              Reward vault
            </HouseButton>
          ) : null}
          {market.lastDistribution?.signature ? (
            <HouseButton
              className="px-3 text-[11px]"
              href={explorerTxUrl(market.lastDistribution.signature)}
              target="_blank"
            >
              Last payout tx
            </HouseButton>
          ) : null}
        </div>
      </Card>
    </section>
  );
}
