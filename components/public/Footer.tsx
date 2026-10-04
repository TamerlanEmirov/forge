import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0A0A0A] px-6 py-8">
      <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <Link
          href="/"
          className="text-xl font-black tracking-[-0.06em] text-[#C6FF00]"
        >
          ✣ FORGE
        </Link>

        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/25">
          Built for consistency. Designed for performance.
        </p>

        <p className="font-mono text-[9px] text-white/25">
          © {new Date().getFullYear()} FORGE
        </p>
      </div>
    </footer>
  );
}