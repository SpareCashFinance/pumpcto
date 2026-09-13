import { hasMint, holderFeePercent, project } from "./config";
import { getRewardTape, type RewardReceiver } from "./rewards";

export type { RewardReceiver };

export type MarketStatus =
  | "awaiting_launch"
  | "awaiting_index"
  | "standard_mode"
  | "no_distribution"
  | "unavailable"
  | "live";

export type RewardEvent = {
  at: string | null;
  amount: number | null;
  symbol: string;
  signature: string | null;
  explorerUrl: string | null;
  holdersPaid: number | null;
};

export type MarketSnapshot = {
  status: MarketStatus;
  message: string;
  mint: string;
  rewardMint: string;
  rewardSymbol: string;
  mode: "reward" | "standard" | "";
  transferFeeBps: number | null;
  priceUsd: number | null;
  marketCapUsd: number | null;
  volume24hUsd: number | null;
  liquidityUsd: number | null;
  holders: number | null;
  totalDistributed: number | null;
  pendingDistributed: number | null;
  totalDistributedSymbol: string;
  payoutCount: number | null;
  lastDistribution: RewardEvent | null;
  nextRewardStatus: string;
  history: RewardEvent[];
  topReceivers: RewardReceiver[];
  updatedAt: string | null;
};

const DEXSCREENER = "https://api.dexscreener.com/latest/dex";
const FETCH_MS = 8_000;

function emptySnapshot(status: MarketStatus, message: string): MarketSnapshot {
  return {
    status,
    message,
    mint: project.mint,
    rewardMint: project.rewardMint,
    rewardSymbol: project.rewardAsset,
    mode: "",
    transferFeeBps: holderFeePercent * 100,
    priceUsd: null,
    marketCapUsd: null,
    volume24hUsd: null,
    liquidityUsd: null,
    holders: null,
    totalDistributed: null,
    pendingDistributed: null,
    totalDistributedSymbol: project.rewardAsset,
    payoutCount: null,
    lastDistribution: null,
    topReceivers: [],
    nextRewardStatus:
      status === "awaiting_launch" || status === "awaiting_index"
        ? "Awaiting launch"
        : "Unknown",
    history: [],
    updatedAt: null,
  };
}

function num(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function looksLikeMint(value: string) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value.trim());
}

type DexPair = {
  chainId?: string;
  pairAddress?: string;
  priceUsd?: unknown;
  marketCap?: unknown;
  fdv?: unknown;
  volume?: { h24?: unknown };
  liquidity?: { usd?: unknown };
  priceChange?: { h24?: unknown };
};

async function readDexPairs() {
  const pair = project.pair.trim();
  const mint = project.mint.trim();
  const url = pair
    ? `${DEXSCREENER}/pairs/solana/${encodeURIComponent(pair)}`
    : `${DEXSCREENER}/tokens/${encodeURIComponent(mint)}`;
  const response = await fetch(url, {
    next: { revalidate: 30 },
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(FETCH_MS),
  });
  const body = (await response.json().catch(() => null)) as { pairs?: DexPair[]; pair?: DexPair } | null;
  const pairs = body?.pairs ?? (body?.pair ? [body.pair] : []);
  const preferred =
    pairs.find((item) => item.pairAddress === pair) ??
    pairs.find((item) => item.chainId === "solana") ??
    pairs[0];
  return { ok: response.ok, status: response.status, pair: preferred ?? null };
}

export async function getMarketSnapshot(): Promise<MarketSnapshot> {
  if (!hasMint() || !looksLikeMint(project.mint)) {
    return emptySnapshot(
      "awaiting_launch",
      "Awaiting launch. Live market figures appear after the official $Pump mint is published.",
    );
  }

  try {
    const [{ ok, status, pair }, rewards] = await Promise.all([readDexPairs(), getRewardTape()]);

    if (status === 429) {
      return emptySnapshot(
        "unavailable",
        "Market data is rate-limiting reads. The terminal will retry on the next refresh.",
      );
    }

    if (!ok || !pair) {
      return emptySnapshot(
        "awaiting_index",
        "Mint is set. Waiting for DexScreener to index the PumpSwap pair.",
      );
    }

    const priceUsd = num(pair.priceUsd);
    const marketCapUsd = num(pair.marketCap) ?? num(pair.fdv);
    const volume24hUsd = num(pair.volume?.h24);
    const liquidityUsd = num(pair.liquidity?.usd);
    const live = priceUsd != null && priceUsd > 0;
    const paid = Boolean(rewards && rewards.payoutCount > 0);

    return {
      ...emptySnapshot(
        paid ? "live" : live ? "no_distribution" : "awaiting_index",
        paid
          ? `On-chain Holder Rewards. pump.fun instruction DistributeFeeToHolders pays PUMP from vault ${project.rewardVault.slice(0, 4)}…${project.rewardVault.slice(-4)}. Recent window covers the last ${rewards?.scanned ?? 0} vault transactions.`
          : live
            ? "Pair is live on PumpSwap. Waiting for the next DistributeFeeToHolders payout on-chain."
            : "Pair is listed. Waiting for a live price print.",
      ),
      status: paid ? "live" : live ? "no_distribution" : "awaiting_index",
      mode: "reward",
      transferFeeBps: holderFeePercent * 100,
      priceUsd,
      marketCapUsd,
      volume24hUsd,
      liquidityUsd,
      holders: rewards?.holdersPaid ?? null,
      totalDistributed: rewards?.totalDistributed ?? null,
      pendingDistributed: rewards?.pendingDistributed ?? null,
      payoutCount: rewards?.payoutCount ?? null,
      lastDistribution: rewards?.lastDistribution ?? null,
      history: rewards?.history ?? [],
      topReceivers: rewards?.topReceivers ?? [],
      nextRewardStatus: paid
        ? "Variable — cranked several times per hour"
        : live
          ? "Waiting on the next vault payout"
          : "Waiting on the first print",
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return emptySnapshot(
      "unavailable",
      "Live data unavailable. Refresh later or verify the mint on Solscan.",
    );
  }
}
