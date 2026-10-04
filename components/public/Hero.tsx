import Link from "next/link";
import { ArrowRight, Activity } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-[720px] items-center overflow-hidden bg-[#0A0A0A] pt-16">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2200&q=85')",
        }}
      />

      {/* Dark overlays */}
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/30 via-[#0A0A0A]/65 to-[#0A0A0A]" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:80px_80px]" />

      <div className="relative z-10 mx-auto w-full max-w-[1100px] px-6 text-center">
        {/* Status */}
        <div className="mb-7 inline-flex items-center gap-2 border border-[#C6FF00]/30 bg-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#C6FF00]">
          <Activity size={11} />
          New Data Engine Live
        </div>

        {/* Heading */}
        <h1 className="mx-auto max-w-5xl text-5xl font-medium uppercase leading-[0.95] tracking-[-0.05em] text-white sm:text-7xl lg:text-[92px]">
          Forge Your
          <span className="block text-[#C6FF00]">
            Ultimate Performance
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-8 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
          Precision long-term fitness tracking for athletes who demand data,
          not guesswork. Analyze metrics, visualize progress, and optimize
          every workout.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/sign-up"
            className="group flex items-center justify-center gap-3 bg-[#C6FF00] px-8 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-black transition hover:bg-[#d4ff4d]"
          >
            Get Started Free
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="#platform"
            className="border border-white/15 bg-black/20 px-8 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white transition hover:border-[#C6FF00]/50 hover:text-[#C6FF00]"
          >
            View Platform
          </Link>
        </div>
      </div>

      {/* Bottom metrics */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
          <Metric value="24/7" label="Performance Data" />
          <Metric value="100%" label="Workout Control" />
          <Metric value="∞" label="Progress History" />
          <Metric value="01" label="Platform" />
        </div>
      </div>
    </section>
  );
}

function Metric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="px-5 py-4">
      <p className="font-mono text-lg font-bold text-[#C6FF00]">
        {value}
      </p>
      <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.15em] text-white/40">
        {label}
      </p>
    </div>
  );
}