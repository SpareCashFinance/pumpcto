export const project = {
  name: "Pump",
  ticker: "$Pump",
  tickerBare: "Pump",
  coreLine: "A CTO. A 3% tax. Paid back to holders in PUMP.",
  quote: "Dev left. Community stayed. Holders get paid in PUMP.",
  network: "Solana",
  launchpad: "pump.fun",
  launchpadName: "pump.fun",
  rewardAsset: "PUMP",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://pumpcto.vercel.app",
  mint:
    process.env.NEXT_PUBLIC_TOKEN_MINT?.trim() ||
    "BXfQckZtKu4oA3s5d8qmTHkkkVcULv9JyzKwD2YPpump",
  rewardMint:
    process.env.NEXT_PUBLIC_REWARD_MINT?.trim() ||
    "pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn",
  pair:
    process.env.NEXT_PUBLIC_DEXSCREENER_PAIR?.trim() ||
    "EQLRoZk2hfjy9CTzdWkXcX8m8TcNW5FCfGc6GNoeUfGH",
  totalSupply: process.env.NEXT_PUBLIC_TOTAL_SUPPLY ?? "1B",
  burnPercent: 0,
  burnTx: "",
  transferFee: "3% of trades to holders in PUMP",
  eligibility: "Self-custody holders. Pump.fun Holder Rewards.",
  liquidityStatus: "PumpSwap canonical pool",
  authorityStatus: "Mint and freeze authority disabled",
  shareText: "CTO. 3% tax. Paid to holders in PUMP. $Pump",
} as const;

export const holderFeePercent = Number(process.env.NEXT_PUBLIC_HOLDER_FEE_PERCENT || 3) || 3;

export const copy = {
  heroKicker: "Community takeover. Official market on pump.fun.",
  story: [
    {
      stamp: "01",
      title: "The first wallet walked.",
      body: "This is a CTO. The original deployer is out. The community kept the chart, the chat, and the coin.",
    },
    {
      stamp: "02",
      title: "The tax stayed.",
      body: `${holderFeePercent}% of trading fees is routed to holders in PUMP, the pump.fun token. You hold $Pump. You get paid in the house chip.`,
    },
    {
      stamp: "03",
      title: "Nobody is coming to save it.",
      body: "No founder fairy tale. No promised yield. Volume pays holders. If volume dies, the tape goes quiet.",
    },
  ],
  steps: [
    {
      n: "01",
      title: "Buy $Pump",
      body: "Connect a Solana wallet and swap SOL, USDC, or PUMP into $Pump through the Jupiter desk.",
    },
    {
      n: "02",
      title: "Hold it",
      body: "Keep an eligible balance in a supported self-custody wallet. This is not a brokerage account.",
    },
    {
      n: "03",
      title: "Get paid in PUMP",
      body: `${holderFeePercent}% of trading fees is meant to go to eligible holders in PUMP through pump.fun Holder Rewards. Amounts follow live volume.`,
    },
  ],
  caveats: [
    "This is a community takeover. There is no original-developer roadmap.",
    "Rewards depend on actual trading activity.",
    "Amounts and timing can vary.",
    "Rewards may be small or zero.",
    "Eligibility and distribution rules are controlled by the live pump.fun Holder Rewards implementation.",
    "Verify the mint, the pair, and payouts on-chain.",
    `${holderFeePercent}% of trading fees is planned to go to eligible holders in PUMP. That is not a yield.`,
    "A smaller float or a louder CTO does not guarantee larger or faster payouts.",
  ],
  disclaimer:
    "Pump ($Pump) is a community-takeover memecoin created for entertainment. It is not affiliated with, sponsored by, or endorsed by pump.fun, Pump.fun Inc, or the PUMP token issuer beyond using their public market and reward rails. Holder rewards are variable, depend on platform activity, and are not guaranteed. Cryptocurrency is highly speculative and may lose all value.",
} as const;

export function displayValue(value: string, fallback = "To be confirmed") {
  return value.trim() ? value : fallback;
}

export function hasMint() {
  return project.mint.trim().length > 0;
}

export function hasBurnTx() {
  return project.burnTx.length > 0;
}

const DEFAULT_LAUNCH_SUPPLY = 1_000_000_000;

export function initialSupply() {
  const raw = project.totalSupply.trim().replace(/,/g, "").toUpperCase();
  if (!raw) return DEFAULT_LAUNCH_SUPPLY;
  const match = raw.match(/^([0-9]*\.?[0-9]+)\s*([KMB])?$/);
  if (!match) {
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_LAUNCH_SUPPLY;
  }
  const n = Number(match[1]);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_LAUNCH_SUPPLY;
  const unit = match[2];
  return n * (unit === "B" ? 1e9 : unit === "M" ? 1e6 : unit === "K" ? 1e3 : 1);
}

export function plannedLaunchBurn() {
  return (initialSupply() * project.burnPercent) / 100;
}
