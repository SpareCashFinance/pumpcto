import { project } from "./config";
import { explorerTxUrl } from "./links";
import type { RewardEvent } from "./market";

export type RewardReceiver = {
  wallet: string;
  amount: number;
};

export type RewardTape = {
  totalDistributed: number;
  pendingDistributed: number | null;
  payoutCount: number;
  holdersPaid: number;
  lastDistribution: RewardEvent | null;
  history: RewardEvent[];
  topReceivers: RewardReceiver[];
  scanned: number;
};

const SCAN = 20;
const RPC_TIMEOUT_MS = 8_000;

function rpcUrls() {
  const preferred = process.env.SOLANA_RPC_URL?.trim();
  return [
    preferred,
    "https://solana-rpc.publicnode.com",
    "https://api.mainnet-beta.solana.com",
  ].filter((url): url is string => Boolean(url));
}

function num(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

async function rpc<T>(url: string, method: string, params: unknown[]): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    signal: AbortSignal.timeout(RPC_TIMEOUT_MS),
    cache: "no-store",
  });
  const body = (await response.json()) as { result?: T; error?: { message?: string } };
  if (!response.ok || body.error) {
    throw new Error(body.error?.message || `RPC ${method} failed`);
  }
  return body.result as T;
}

async function rpcBatch<T>(url: string, calls: { method: string; params: unknown[] }[]): Promise<(T | null)[]> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(calls.map((call, id) => ({ jsonrpc: "2.0", id, ...call }))),
    signal: AbortSignal.timeout(RPC_TIMEOUT_MS),
    cache: "no-store",
  });
  const body = (await response.json()) as { id: number; result?: T; error?: unknown }[];
  if (!response.ok || !Array.isArray(body)) {
    throw new Error("RPC batch failed");
  }
  return [...body]
    .sort((a, b) => a.id - b.id)
    .map((item) => (item.error ? null : (item.result ?? null)));
}

type SigRow = { signature: string };
type ParsedTx = {
  blockTime?: number | null;
  meta?: {
    logMessages?: string[] | null;
    preTokenBalances?: TokenBal[];
    postTokenBalances?: TokenBal[];
  } | null;
  transaction?: {
    message?: {
      accountKeys?: { pubkey?: string }[] | string[];
    };
  };
};
type TokenBal = {
  accountIndex: number;
  mint: string;
  owner?: string;
  uiTokenAmount: { uiAmount?: number | null; uiAmountString?: string };
};

function keysOf(tx: ParsedTx) {
  return (tx.transaction?.message?.accountKeys ?? []).map((item) =>
    typeof item === "string" ? item : item.pubkey ?? "",
  );
}

function readTapeFrom(txs: (ParsedTx | null)[], sigs: SigRow[]): RewardTape {
  const receivers = new Map<string, number>();
  const history: RewardEvent[] = [];

  txs.forEach((tx, index) => {
    if (!tx) return;
    const keys = keysOf(tx);
    const logs = tx.meta?.logMessages ?? [];
    const isPayout =
      keys.includes(project.mint) &&
      keys.includes(project.rewardMint) &&
      logs.some((line) => line.includes("DistributeFeeToHolders"));
    if (!isPayout) return;

    const pre = tx.meta?.preTokenBalances ?? [];
    const post = tx.meta?.postTokenBalances ?? [];
    let paid = 0;
    let holders = 0;
    for (const after of post) {
      if (after.mint !== project.rewardMint) continue;
      const before = pre.find((item) => item.accountIndex === after.accountIndex);
      const delta =
        num(after.uiTokenAmount.uiAmountString ?? after.uiTokenAmount.uiAmount) -
        num(before?.uiTokenAmount.uiAmountString ?? before?.uiTokenAmount.uiAmount);
      if (after.owner === project.rewardVault && delta < 0) {
        paid += Math.abs(delta);
        continue;
      }
      if (after.owner && after.owner !== project.rewardVault && delta > 0) {
        holders += 1;
        receivers.set(after.owner, (receivers.get(after.owner) ?? 0) + delta);
      }
    }
    if (paid <= 0) return;
    const signature = sigs[index]?.signature ?? null;
    history.push({
      at: tx.blockTime ? new Date(tx.blockTime * 1000).toISOString() : null,
      amount: paid,
      symbol: project.rewardAsset,
      signature,
      explorerUrl: signature ? explorerTxUrl(signature) : null,
      holdersPaid: holders,
    });
  });

  history.sort((a, b) => (b.at ?? "").localeCompare(a.at ?? ""));
  return {
    totalDistributed: history.reduce((sum, row) => sum + (row.amount ?? 0), 0),
    pendingDistributed: null,
    payoutCount: history.length,
    holdersPaid: receivers.size,
    lastDistribution: history[0] ?? null,
    history: history.slice(0, 12),
    topReceivers: [...receivers.entries()]
      .map(([wallet, amount]) => ({ wallet, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8),
    scanned: sigs.length,
  };
}

async function scanAt(url: string): Promise<RewardTape> {
  const vault = project.rewardVaultAta || project.rewardVault;
  const sigs = await rpc<SigRow[]>(url, "getSignaturesForAddress", [vault, { limit: SCAN }]);
  if (!sigs.length) {
    return {
      totalDistributed: 0,
      pendingDistributed: null,
      payoutCount: 0,
      holdersPaid: 0,
      lastDistribution: null,
      history: [],
      topReceivers: [],
      scanned: 0,
    };
  }

  const txs = await rpcBatch<ParsedTx>(
    url,
    sigs.map((item) => ({
      method: "getTransaction",
      params: [item.signature, { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 }],
    })),
  );
  const tape = readTapeFrom(txs, sigs);

  try {
    const bal = await rpc<{ value?: { uiAmount?: number | null } }>(url, "getTokenAccountBalance", [
      project.rewardVaultAta,
    ]);
    tape.pendingDistributed = num(bal.value?.uiAmount);
  } catch {
    tape.pendingDistributed = null;
  }

  return tape;
}

export async function getRewardTape(): Promise<RewardTape | null> {
  if (!project.rewardVault || !project.rewardMint || !project.mint) return null;
  for (const url of rpcUrls()) {
    try {
      return await scanAt(url);
    } catch {
      /* try the next RPC */
    }
  }
  return null;
}
