import { hasMint, holderFeePercent, initialSupply, project } from "./config";

export type BurnStatus = "awaiting_launch" | "armed" | "live" | "unavailable";

export type BurnEvent = {
  at: string | null;
  amount: number | null;
  source: string;
  signature: string | null;
  explorerUrl: string | null;
};

export type BurnSnapshot = {
  status: BurnStatus;
  message: string;
  mint: string;
  symbol: string;
  initialSupply: number;
  circulatingSupply: number | null;
  plannedLaunchPct: number;
  plannedLaunchAmount: number;
  launchBurned: number;
  launchFiled: boolean;
  platformBurned: number;
  platformUsd: number | null;
  platformCount: number;
  otherBurned: number;
  totalBurned: number;
  burnedPct: number;
  lastBurnAt: string | null;
  recent: BurnEvent[];
  updatedAt: string;
};

export async function getBurnSnapshot(): Promise<BurnSnapshot> {
  const supply = initialSupply();
  return {
    status: hasMint() ? "live" : "awaiting_launch",
    message: hasMint()
      ? `No launch burn. The mechanic is a ${holderFeePercent}% trading fee paid back to eligible holders in PUMP.`
      : "Awaiting mint. The tax board stays dark until the contract is live.",
    mint: project.mint,
    symbol: project.ticker,
    initialSupply: supply,
    circulatingSupply: supply,
    plannedLaunchPct: holderFeePercent,
    plannedLaunchAmount: 0,
    launchBurned: 0,
    launchFiled: false,
    platformBurned: 0,
    platformUsd: null,
    platformCount: 0,
    otherBurned: 0,
    totalBurned: 0,
    burnedPct: holderFeePercent,
    lastBurnAt: null,
    recent: [],
    updatedAt: new Date().toISOString(),
  };
}
