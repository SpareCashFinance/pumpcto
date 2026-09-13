import { holderFeePercent, project } from "@/lib/config";
import { explorerUrl, pumpfunTokenUrl } from "@/lib/links";
import { HouseButton } from "@/components/ui/house-button";
import type { BurnSnapshot } from "@/lib/burn";
import { CopyButton } from "./CopyButton";
import { BurnIncinerator } from "./BurnFlame";

export function BurnReceipt({ burn }: { burn: BurnSnapshot }) {
  return (
    <section id="tax" className="section">
      <p className="kicker">Exhibit C · Holder tax</p>
      <h2 className="display mt-3 max-w-4xl text-6xl text-white sm:text-8xl">
        {holderFeePercent}% of trades.
        <span className="block text-[var(--orange)]">Paid back in PUMP.</span>
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--dim)]">
        There is no launch incinerator on this coin. The punchline is a{" "}
        {holderFeePercent}% trading fee routed to eligible holders in PUMP, the
        pump.fun token. You hold {project.ticker}. Volume pays the pot. If volume
        dies, the pot goes quiet.
      </p>

      <div className="mt-8">
        <BurnIncinerator initial={burn} />
      </div>

      <div className="cardboard mt-8 rounded-[32px] p-3 sm:p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-2 text-[11px] tracking-[0.2em] uppercase">
          <span>Tax filing · community takeover</span>
          <span>Live mechanic</span>
        </div>

        <div className="relative overflow-hidden rounded-[22px] bg-[#050806] p-5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.35)] sm:p-8">
          <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(134,239,172,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(134,239,172,0.14)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="relative">
            <div className="flex flex-wrap gap-2">
              <span className="chip">CTO</span>
              <span className="chip">{holderFeePercent}% to holders in PUMP</span>
              <span className="chip">No launch burn</span>
            </div>
            <p className="kicker mt-6">How it pays</p>
            <p className="display mt-3 text-4xl text-white sm:text-6xl">Hold. Get PUMP.</p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--dim)]">
              Pump.fun Holder Rewards take {holderFeePercent}% of trading fees and
              send them to eligible self-custody holders in PUMP. Amounts follow
              live volume. This is not a yield, not a lockup, and not a promise.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <CopyButton value={project.mint} label="Copy CA" emptyLabel="Mint pending" />
              <HouseButton href={pumpfunTokenUrl()} target="_blank">
                Open on pump.fun
              </HouseButton>
              {explorerUrl() ? (
                <HouseButton href={explorerUrl()} target="_blank">
                  Solscan
                </HouseButton>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
