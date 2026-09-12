"use client";

import { NetworkSolana } from "@web3icons/react";
import { Card } from "@/components/ui/card";
import { displayValue, holderFeePercent, project } from "@/lib/config";
import { explorerUrl, pumpfunTokenUrl } from "@/lib/links";
import { HouseButton } from "@/components/ui/house-button";
import { CopyButton } from "./CopyButton";

const rows = [
  { label: "Name", value: project.name },
  { label: "Ticker", value: project.ticker },
  { label: "Network", value: project.network, icon: <NetworkSolana variant="branded" size={16} /> },
  { label: "Launchpad", value: project.launchpad },
  { label: "Narrative", value: "Community takeover (CTO)" },
  { label: "Reward asset", value: `${project.rewardAsset} · pump.fun token` },
  { label: "Contract", value: displayValue(project.mint) },
  { label: "Total supply", value: displayValue(project.totalSupply) },
  { label: "Launch burn", value: "None" },
  {
    label: "Holder rewards",
    value: displayValue(project.transferFee, `${holderFeePercent}% of trades to holders in PUMP`),
  },
  { label: "Holder eligibility", value: displayValue(project.eligibility) },
  { label: "Liquidity", value: displayValue(project.liquidityStatus) },
  { label: "Authority", value: displayValue(project.authorityStatus) },
];

export function TokenDetails() {
  return (
    <section id="tokenomics" className="section">
      <p className="kicker">The filing</p>
      <h2 className="display mt-3 text-6xl text-white sm:text-8xl">Facts, not folklore.</h2>
      <Card className="mt-8 overflow-hidden border-[rgba(232,210,176,0.14)] bg-[#0c1320]/70">
        <dl className="divide-y divide-[rgba(232,210,176,0.08)]">
          {rows.map((row) => (
            <div key={row.label} className="grid gap-2 px-5 py-4 sm:grid-cols-[200px_1fr] sm:items-center">
              <dt className="text-xs tracking-[0.16em] uppercase text-[var(--gold)]">{row.label}</dt>
              <dd className="flex flex-wrap items-center gap-2 font-mono text-sm text-white sm:text-base">
                {row.icon}
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-3 border-t border-[rgba(232,210,176,0.08)] p-5">
          <CopyButton value={project.mint} />
          <HouseButton variant="primary" href="#adopt">
            Buy $Pump
          </HouseButton>
          <HouseButton href={pumpfunTokenUrl()} target="_blank">
            pump.fun
          </HouseButton>
          {explorerUrl() ? (
            <HouseButton href={explorerUrl()} target="_blank">
              Solscan
            </HouseButton>
          ) : null}
          <HouseButton href="#tax">Tax filing</HouseButton>
        </div>
      </Card>
    </section>
  );
}
