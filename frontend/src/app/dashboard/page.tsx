"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user, logout, logoutAll } = useAuth();
  const [status, setStatus] = useState("");
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [loadingLogoutAll, setLoadingLogoutAll] = useState(false);

  const handleLogout = async () => {
    setStatus("");
    setLoadingLogout(true);

    try {
      await logout();
    } catch {
      setStatus("Logout failed");
    } finally {
      setLoadingLogout(false);
    }
  };

  const handleLogoutAll = async () => {
    setStatus("");
    setLoadingLogoutAll(true);

    try {
      await logoutAll();
    } catch {
      setStatus("Logout from all devices failed");
    } finally {
      setLoadingLogoutAll(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-12">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-amber-400">Dashboard</p>
              <h1 className="mt-3 text-3xl font-bold text-white">Welcome back</h1>
            </div>
            <div className="rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-200">
              Authenticated
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
              <h2 className="text-lg font-semibold text-white">User profile</h2>
              <div className="mt-6 space-y-4 text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400">Username</span>
                  <span className="font-medium text-white">{user?.username ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400">Email</span>
                  <span className="font-medium text-white">{user?.email ?? user?.useremail ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between pb-2">
                  <span className="text-slate-400">Verification</span>
                  <span className="font-medium text-emerald-400">
                    {user?.verified === true ? "Verified" : "Pending"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loadingLogout}
                className="w-full rounded-xl border border-red-500/60 bg-red-500/10 px-4 py-3 font-semibold text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingLogout ? "Logging out..." : "Logout from this device"}
              </button>

              <button
                type="button"
                onClick={handleLogoutAll}
                disabled={loadingLogoutAll}
                className="w-full rounded-xl border border-orange-500/60 bg-orange-500/10 px-4 py-3 font-semibold text-orange-200 transition hover:bg-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingLogoutAll ? "Logging out everywhere..." : "Logout from all devices"}
              </button>
            </div>
          </div>

          {status ? (
            <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-200">
              {status}
            </div>
          ) : null}
        </div>
      </main>
    </ProtectedRoute>
  );
}
