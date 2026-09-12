import { hasMint, project } from "@/lib/config";
import { WSOL_MINT } from "@/lib/solana";

export const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
export const USDT_MINT = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";

export type SwapToken = {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  icon?: string;
  verified?: boolean;
};

export const SOL_TOKEN: SwapToken = {
  mint: WSOL_MINT,
  symbol: "SOL",
  name: "Solana",
  decimals: 9,
  verified: true,
};

export const USDC_TOKEN: SwapToken = {
  mint: USDC_MINT,
  symbol: "USDC",
  name: "USD Coin",
  decimals: 6,
  verified: true,
};

export const USDT_TOKEN: SwapToken = {
  mint: USDT_MINT,
  symbol: "USDT",
  name: "Tether USD",
  decimals: 6,
  verified: true,
};

const DEAD_SOL_ICON =
  "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png";
const LIVE_SOL_ICON =
  "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png";

/** Tokens API v2 may return ipfs://, a blank icon, or the retired SOL token-list URL. */
export function normalizeTokenIcon(icon?: string | null) {
  const raw = icon?.trim();
  if (!raw) return undefined;
  if (raw === DEAD_SOL_ICON) return LIVE_SOL_ICON;
  if (raw.startsWith("ipfs://")) return `https://ipfs.io/ipfs/${raw.slice("ipfs://".length)}`;
  return raw;
}

export const PINNED_PAY_TOKENS = [SOL_TOKEN, USDC_TOKEN] as const;

export const PUMP_TOKEN: SwapToken = {
  mint: "pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn",
  symbol: "PUMP",
  name: "Pump",
  decimals: 6,
  verified: true,
};

export function pinnedReceiveTokens(): SwapToken[] {
  const coin = hasMint() ? [projectToken()] : [];
  const seen = new Set<string>();
  return [...coin, PUMP_TOKEN, USDC_TOKEN, SOL_TOKEN].filter((token) => {
    if (seen.has(token.mint)) return false;
    seen.add(token.mint);
    return true;
  });
}

export function projectDecimals() {
  return Number(process.env.NEXT_PUBLIC_TOKEN_DECIMALS || 6) || 6;
}

export function projectToken(): SwapToken {
  return {
    mint: project.mint,
    symbol: project.tickerBare,
    name: project.name,
    decimals: projectDecimals(),
    icon: "/mascot.jpg",
    verified: true,
  };
}

export function jrockDecimals() {
  return projectDecimals();
}

export function jrockToken(): SwapToken {
  return projectToken();
}

export function adoptOutputToken(): SwapToken {
  return hasMint() ? projectToken() : USDC_TOKEN;
}

export function looksLikeMint(value: string) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value.trim());
}

export function toRawAmount(amount: string, decimals: number) {
  const clean = amount.trim().replace(/,/g, "");
  if (!clean || clean === ".") return "";
  const [whole = "0", frac = ""] = clean.split(".");
  if (!/^\d+$/.test(whole) || (frac && !/^\d+$/.test(frac))) return "";
  const padded = `${frac}${"0".repeat(decimals)}`.slice(0, decimals);
  const raw = `${whole}${padded}`.replace(/^0+/, "") || "0";
  return raw === "0" ? "" : raw;
}

export function fromRawAmount(raw: string | undefined, decimals: number) {
  if (!raw) return null;
  const n = Number(raw) / 10 ** decimals;
  return Number.isFinite(n) ? n : null;
}

export function defaultPayAmount(token: SwapToken) {
  if (token.mint === WSOL_MINT) return "0.25";
  if (token.mint === USDC_MINT || token.mint === USDT_MINT) return "10";
  return "1";
}

export function payPresets(token: SwapToken) {
  if (token.mint === WSOL_MINT) return [0.1, 0.25, 0.5, 1];
  if (token.mint === USDC_MINT || token.mint === USDT_MINT) return [5, 10, 25, 50];
  return [1, 10, 50, 100];
}

export function formatPreset(value: number, token: SwapToken) {
  if (token.mint === WSOL_MINT) return `${value} SOL`;
  return `${value} ${token.symbol}`;
}
