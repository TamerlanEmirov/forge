import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0A0A0A]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-black tracking-[-0.06em] text-[#C6FF00]"
        >
          <span className="text-xl">✣</span>
          FORGE
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-white/70 transition hover:text-white sm:block"
          >
            Login
          </Link>

          <Link
            href="/sign-up"
            className="group flex items-center gap-2 bg-[#C6FF00] px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black transition hover:bg-[#d4ff4d]"
          >
            Join Now
            <ArrowUpRight
              size={13}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}