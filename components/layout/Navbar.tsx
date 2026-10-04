"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  Home,
  Dumbbell,
  Utensils,
  CalendarDays,
  User,
  LogOut,
} from "lucide-react";

const navItems = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Workout",
    href: "/exercises",
    icon: Dumbbell,
  },
  {
    name: "Nutrition",
    href: "/nutrition",
    icon: Utensils,
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: CalendarDays,
  },
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <>
      {/* Desktop Navbar */}
      <header className="hidden border-b border-white/10 bg-[#0B0B0B] lg:block">
        <div className="flex h-16 w-full items-center justify-between px-6 lg:px-8">
          
          {/* Logo */}
           <Link
          href="/dashboard"
          className="flex items-center gap-2 text-2xl font-black tracking-[-0.06em] text-[#C6FF00]"
        >
          <span className="text-xl">✣</span>
          FORGE
        </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#C6FF00]/10 text-[#C6FF00]"
                      : "text-white/50 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Profile */}
          <Link
  href="/profile"
  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5"
>
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C6FF00]/10 text-[#C6FF00]">
    <User className="h-4 w-4" />
  </div>

  <span className="text-sm font-medium text-white">
    {user?.username || user?.firstName || "User"}
  </span>
</Link>
        </div>
      </header>

      {/* Mobile Top Navbar */}
      <header className="border-b border-white/10 bg-[#0B0B0B] lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          
            <Link
          href="/dashboard"
          className="flex items-center gap-2 text-2xl font-black tracking-[-0.06em] text-[#C6FF00]"
        >
          <span className="text-xl">✣</span>
          FORGE
        </Link>

          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <User className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0B0B0B]/95 backdrop-blur-lg lg:hidden">
        <div className="grid h-16 grid-cols-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
                  isActive
                    ? "text-[#C6FF00]"
                    : "text-white/35 hover:text-white/70"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isActive ? "stroke-[2.5]" : ""
                  }`}
                />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}