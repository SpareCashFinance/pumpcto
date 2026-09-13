import { copy } from "@/lib/config";

export function RiskDisclosure() {
  return (
    <section id="risk" className="section pt-0">
      <div className="rounded-[28px] border border-[rgba(134,239,172,0.14)] bg-[#07110c] p-6 sm:p-8">
        <p className="kicker">CTO · risk</p>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-[var(--dim)]">{copy.disclaimer}</p>
      </div>
    </section>
  );
}
