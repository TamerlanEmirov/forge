import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function CTA() {
  return (
    <section className="border-t border-white/10 bg-[#0F172A] px-6 py-24">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-10 md:flex-row md:items-end">
        <div>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#C6FF00]">
            / 02 — START NOW
          </p>

          <h2 className="max-w-3xl text-5xl font-medium uppercase leading-[0.95] tracking-[-0.05em] text-white sm:text-7xl">
            Stop guessing.
            <span className="block text-[#C6FF00]">
              Start tracking.
            </span>
          </h2>
        </div>

        <Link
          href="/sign-up"
          className="group flex shrink-0 items-center gap-5 bg-[#C6FF00] px-7 py-5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black transition hover:bg-[#d4ff4d]"
        >
          Join Forge
          <ArrowUpRight
            size={16}
            className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </Link>
      </div>
    </section>
  );
}