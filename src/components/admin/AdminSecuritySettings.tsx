import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, UserCheck, Key, AlertTriangle, LogOut, FileCheck2, Cpu } from 'lucide-react';

interface AdminSecuritySettingsProps {
  adminUser: { id: string; name: string; role: string } | null;
  onLogout: () => void;
}

export const AdminSecuritySettings: React.FC<AdminSecuritySettingsProps> = ({
  adminUser,
  onLogout,
}) => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl space-y-1">
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <span>Security & Terminal Configuration</span>
        </h1>
        <p className="text-xs text-zinc-400">
          Cryptographic token parameters, administrative identities, and compliance settings for PATGOLITO.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Session Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Active Administrator Session</h2>
              <p className="text-[11px] text-zinc-400">Authenticated via Secure Gate</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-zinc-400">Admin Identity:</span>
              <span className="font-bold text-white">{adminUser?.name || 'Administrator'}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-zinc-400">Authorization Role:</span>
              <span className="font-mono text-emerald-400 uppercase font-semibold">SUPER_ADMIN</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-zinc-400">Token Algorithm:</span>
              <span className="font-mono text-zinc-300">HMAC-SHA256 (Server Signed)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-zinc-400">Session Window:</span>
              <span className="text-zinc-300">4 Hours Auto-Expiry</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/40 border border-red-800/60 text-red-300 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>End Active Session & Sign Out</span>
          </button>
        </div>

        {/* Gate Security Architecture */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-center">
              <Lock className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Stealth Gate Architecture</h2>
              <p className="text-[11px] text-zinc-400">Zero Public Exposure Principle</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-zinc-300">
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hidden Direct URL Gateway</span>
              </p>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                The operations portal is mounted exclusively on <code className="text-emerald-400 font-mono">/patowner</code> without any visible buttons, links, or navigation menus on the public website.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>Server-Side Hash Validation</span>
              </p>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Passwords are never shipped inside frontend bundles. Passwords are hash-verified in constant time on the backend to prevent timing side-channel attacks.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Brute-Force Rate Limiter</span>
              </p>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Automatic IP throttling triggers a 15-minute terminal lock after 5 failed password attempts, recorded directly to the audit log.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
