"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { LogOut, Mail, User } from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!user) return null;

  return (
    <main className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
        <div>
          <p className="text-xs font-medium tracking-wider text-white/40">
            ACCOUNT
          </p>

          <h1 className="mt-1 text-3xl font-bold text-white">
            Profile
          </h1>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-[#151515] p-6 sm:p-8">
          {/* User */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C6FF00]/10 text-[#C6FF00]">
              <User className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                {user.username ||
                  user.firstName ||
                  "User"}
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Forge account
              </p>
            </div>
          </div>

          {/* Account info */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <Mail className="h-5 w-5 text-[#C6FF00]" />

              <div>
                <p className="text-xs text-white/35">
                  EMAIL
                </p>

                <p className="mt-1 text-sm text-white">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <button
              onClick={() =>
                signOut({
                  redirectUrl: "/",
                })
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-3.5 text-sm font-semibold text-white/60 transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}