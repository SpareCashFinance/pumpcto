import { hasMint, project } from "./config";
import { getMarketSnapshot, type MarketSnapshot } from "./market";

export type TapeQuote = {
  symbol: string;
  label: string;
  priceUsd: number | null;
  change24hPct: number | null;
  status: "live" | "awaiting_launch" | "unavailable";
};

export type PriceTapeSnapshot = {
  btc: TapeQuote;
  jrock: TapeQuote;
  token: TapeQuote;
  updatedAt: string;
};

const FETCH_MS = 8_000;
const PUMP_MINT = "pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn";

function num(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

async function dexScreenerUsd(mint: string, preferPair = "") {
  try {
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${encodeURIComponent(mint)}`,
      {
        headers: { accept: "application/json" },
        next: { revalidate: 30 },
        signal: AbortSignal.timeout(FETCH_MS),
      },
    );
    if (!response.ok) return null;
    const body = (await response.json()) as {
      pairs?: {
        pairAddress?: string;
        chainId?: string;
        priceUsd?: unknown;
        priceChange?: { h24?: unknown };
      }[];
    };
    const pairs = body.pairs ?? [];
    const pair =
      pairs.find((item) => item.pairAddress === preferPair) ??
      pairs.find((item) => item.chainId === "solana") ??
      pairs[0];
    const priceUsd = num(pair?.priceUsd);
    if (priceUsd == null || priceUsd <= 0) return null;
    return { priceUsd, change24hPct: num(pair?.priceChange?.h24) };
  } catch {
    return null;
  }
}

function emptyToken(status: TapeQuote["status"]): TapeQuote {
  return {
    symbol: project.ticker,
    label: project.name,
    priceUsd: null,
    change24hPct: null,
    status,
  };
}

export async function getPriceTape(market?: MarketSnapshot): Promise<PriceTapeSnapshot> {
  const snap = market ?? (await getMarketSnapshot());
  const minted = hasMint();

  const [pumpDex, tokenDex] = await Promise.all([
    dexScreenerUsd(project.rewardMint || PUMP_MINT),
    minted && snap.priceUsd == null
      ? dexScreenerUsd(project.mint, project.pair)
      : Promise.resolve(null),
  ]);

  let priceUsd = snap.priceUsd;
  let change24hPct: number | null = null;

  if (priceUsd == null && tokenDex) {
    priceUsd = tokenDex.priceUsd;
    change24hPct = tokenDex.change24hPct;
  }

  const token: TapeQuote =
    priceUsd != null && priceUsd > 0
      ? {
          symbol: project.ticker,
          label: project.name,
          priceUsd,
          change24hPct,
          status: "live",
        }
      : emptyToken(minted ? "unavailable" : "awaiting_launch");

  const pump: TapeQuote = pumpDex
    ? {
        symbol: "PUMP",
        label: "pump.fun",
        priceUsd: pumpDex.priceUsd,
        change24hPct: pumpDex.change24hPct,
        status: "live",
      }
    : {
        symbol: "PUMP",
        label: "pump.fun",
        priceUsd: null,
        change24hPct: null,
        status: "unavailable",
      };

  return {
    btc: pump,
    jrock: token,
    token,
    updatedAt: new Date().toISOString(),
  };
}
