"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      router.replace(user ? "/dashboard" : "/login");
    }
  }, [loading, router, user]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center shadow-2xl shadow-blue-950/30">
        <p className="text-sm uppercase tracking-[0.28em] text-sky-400">Authentication</p>
        <h1 className="mt-4 text-2xl font-semibold text-white">Loading your session…</h1>
      </div>
    </main>
  );
}
