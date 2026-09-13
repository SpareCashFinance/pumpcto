import { DexTape } from "./DexTape";
import { Mascot } from "./Mascot";

export function ExhibitTape() {
  return (
    <section id="tape" className="section">
      <div className="mb-8 grid items-end gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="kicker">Exhibit B · The filing</p>
          <h2 className="display mt-3 max-w-3xl text-6xl text-white [word-spacing:0.16em] sm:text-8xl">
            Nobody is coming
            <span className="block text-[var(--orange)]">to save this coin.</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--dim)]">
            This is a community takeover. The desk next to the filing is the
            official Jupiter swap, not a promise from a team. Independent meme.
            No affiliation with pump.fun beyond using their public rails.
          </p>
        </div>
        <div className="relative">
          <div className="absolute left-2 top-2 z-20 hidden rotate-[-8deg] rounded bg-[#16a34a] px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-white shadow-lg lg:block">
            CTO
          </div>
          <Mascot size="stage" />
          <div className="cardboard mt-4 rounded-3xl p-5">
            <p className="text-[11px] tracking-[0.2em] uppercase">Community filing</p>
            <p className="serif mt-2 text-2xl">Hold $Pump. Get paid in PUMP.</p>
            <p className="mt-2 text-sm leading-6 text-[var(--dim)]">
              A 3% trading fee is routed toward eligible holders in the pump.fun
              token. That is the entire punchline.
            </p>
          </div>
        </div>
      </div>

      <DexTape />
    </section>
  );
}
