import { Connection, PublicKey } from "@solana/web3.js";
import { project } from "./config";
import { explorerTxUrl } from "./links";
import { serverSolanaRpcUrl } from "./solana";
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

const SCAN = 40;

function rpcUrl() {
  return process.env.SOLANA_RPC_URL?.trim() || "https://solana-rpc.publicnode.com" || serverSolanaRpcUrl();
}

function accountKey(value: { pubkey?: { toBase58?: () => string } } | string) {
  if (typeof value === "string") return value;
  return value.pubkey?.toBase58?.() ?? "";
}

function num(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

export async function getRewardTape(): Promise<RewardTape | null> {
  if (!project.rewardVault || !project.rewardMint || !project.mint) return null;

  try {
    const connection = new Connection(rpcUrl(), {
      commitment: "confirmed",
      disableRetryOnRateLimit: false,
    });
    const vault = new PublicKey(project.rewardVaultAta || project.rewardVault);
    const sigs = await connection.getSignaturesForAddress(vault, { limit: SCAN });
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

    const txs = await connection.getParsedTransactions(
      sigs.map((item) => item.signature),
      { maxSupportedTransactionVersion: 0 },
    );

    const receivers = new Map<string, number>();
    const history: RewardEvent[] = [];
    let pending: number | null = null;

    try {
      const ata = new PublicKey(project.rewardVaultAta);
      const bal = await connection.getTokenAccountBalance(ata);
      pending = num(bal.value.uiAmount);
    } catch {
      pending = null;
    }

    txs.forEach((tx, index) => {
      if (!tx) return;
      const keys = tx.transaction.message.accountKeys.map(accountKey);
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
    const totalDistributed = history.reduce((sum, row) => sum + (row.amount ?? 0), 0);
    const uniqueHolders = receivers.size;
    const topReceivers = [...receivers.entries()]
      .map(([wallet, amount]) => ({ wallet, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);

    return {
      totalDistributed,
      pendingDistributed: pending,
      payoutCount: history.length,
      holdersPaid: uniqueHolders,
      lastDistribution: history[0] ?? null,
      history: history.slice(0, 12),
      topReceivers,
      scanned: sigs.length,
    };
  } catch {
    return null;
  }
}
