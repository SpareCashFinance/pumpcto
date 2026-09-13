import { project } from "@/lib/config";
import { pumpfunTokenUrl } from "@/lib/links";
import { HouseButton } from "@/components/ui/house-button";
import { CopyButton } from "./CopyButton";

export function OriginTape() {
  return (
    <div className="cardboard relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden rounded-[32px] p-5 sm:p-7">
      <div>
        <p className="kicker">Exhibit A · Community takeover</p>
        <h2 className="display mt-3 text-5xl text-white sm:text-6xl">
          Dev out.
          <span className="block text-[var(--orange)]">Holders in.</span>
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-6 text-[var(--dim)]">
          $Pump launched on pump.fun, paired to PUMP. The first wallet left. The
          community kept the coin. A 3% trading fee is meant to pay eligible
          holders in PUMP. Not a promise. Not a founder story.
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <CopyButton value={project.mint} label="Copy CA" emptyLabel="Mint pending" />
        <HouseButton href={pumpfunTokenUrl()} target="_blank">
          Open on pump.fun
        </HouseButton>
      </div>
    </div>
  );
}
