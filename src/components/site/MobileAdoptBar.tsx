"use client";

import { AdoptButton } from "@/components/solana/AdoptButton";

export function MobileAdoptBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(134,239,172,0.12)] bg-[#050806]/92 px-3 pt-2 pb-[calc(0.65rem+env(safe-area-inset-bottom,0px))] backdrop-blur-xl md:hidden">
      <AdoptButton
        shine
        className="w-full"
        idleLabel="Connect wallet to buy"
        connectedLabel="Buy $Pump"
      />
    </div>
  );
}
