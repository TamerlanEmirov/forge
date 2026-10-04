import { Navbar } from "@/components/layout/Navbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <Navbar />

      <main className="min-w-0 pb-20 lg:pb-0">
        {children}
      </main>
    </div>
  );
}