import React from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare,
  UserX,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  Activity,
  RotateCcw,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  Truck,
  Sparkles,
} from 'lucide-react';
import { AuditLogEntry } from '../../server/adminService';

interface AdminDashboardStats {
  reviews: {
    total: number;
    averageRating: number;
    starBreakdown: { 5: number; 4: number; 3: number; 2: number; 1: number };
    verifiedCount: number;
    totalHelpfulVotes: number;
  };
  deletionRequests: {
    total: number;
    pending: number;
    inReview: number;
    scheduledForPurge: number;
    completed: number;
    failed: number;
  };
  recentLogs: AuditLogEntry[];
  serverTime: string;
}

interface AdminDashboardProps {
  stats: AdminDashboardStats | null;
  isLoading: boolean;
  onRefresh: () => void;
  onNavigateTab: (tab: 'reviews' | 'deletions' | 'audit') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  isLoading,
  onRefresh,
  onNavigateTab,
}) => {
  if (isLoading && !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-zinc-900 rounded-xl w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-zinc-900 rounded-2xl border border-zinc-800" />
          ))}
        </div>
        <div className="h-64 bg-zinc-900 rounded-3xl border border-zinc-800" />
      </div>
    );
  }

  const reviewStats = stats?.reviews || {
    total: 0,
    averageRating: 5.0,
    starBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    verifiedCount: 0,
    totalHelpfulVotes: 0,
  };

  const deletionStats = stats?.deletionRequests || {
    total: 0,
    pending: 0,
    inReview: 0,
    scheduledForPurge: 0,
    completed: 0,
    failed: 0,
  };

  const recentLogs = stats?.recentLogs || [];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 p-6 rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Operations Overview</h1>
          </div>
          <p className="text-xs text-zinc-400">
            Real-time live telemetry connected to Cloud Firestore database <span className="font-mono text-emerald-400">ai-studio-patgolito</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 hover:text-white transition flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reviews */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => onNavigateTab('reviews')}
          className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl space-y-3 cursor-pointer hover:border-zinc-700 transition relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Customer Reviews</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">{reviewStats.total}</div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-white">{reviewStats.averageRating}</span>
              <span>average rating</span>
            </div>
          </div>
          <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500 group-hover:text-emerald-400 transition">
            <span>{reviewStats.verifiedCount} verified bookings</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* Pending Deletion Requests */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => onNavigateTab('deletions')}
          className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl space-y-3 cursor-pointer hover:border-zinc-700 transition relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Pending Deletions</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-amber-400">{deletionStats.pending}</div>
            <p className="text-xs text-zinc-400 mt-1">
              {deletionStats.inReview} currently in review
            </p>
          </div>
          <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500 group-hover:text-amber-400 transition">
            <span>Google Play statutory compliance</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* Completed Purges */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => onNavigateTab('deletions')}
          className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl space-y-3 cursor-pointer hover:border-zinc-700 transition relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Purged & Completed</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">{deletionStats.completed}</div>
            <p className="text-xs text-zinc-400 mt-1">
              PII successfully erased
            </p>
          </div>
          <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500 group-hover:text-emerald-400 transition">
            <span>{deletionStats.total} total requests captured</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* System Activity */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => onNavigateTab('audit')}
          className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl space-y-3 cursor-pointer hover:border-zinc-700 transition relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Audit Trail</span>
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">{recentLogs.length}</div>
            <p className="text-xs text-zinc-400 mt-1">
              Recorded operational events
            </p>
          </div>
          <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500 group-hover:text-white transition">
            <span>Tamper-evident log archive</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>
      </div>

      {/* Grid: Rating Breakdown & Deletion Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Breakdown Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Customer Satisfaction Score</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">Rating distribution across verified bookings</p>
            </div>
            <button
              onClick={() => onNavigateTab('reviews')}
              className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Reviews</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviewStats.starBreakdown[stars as 1 | 2 | 3 | 4 | 5] || 0;
              const percent = reviewStats.total > 0 ? Math.round((count / reviewStats.total) * 100) : 0;

              return (
                <div key={stars} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-medium flex items-center gap-1">
                      <span>{stars}</span>
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    </span>
                    <span className="text-zinc-400 font-mono">
                      {count} reviews ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-400">
            <span>Helpful feedback votes: <strong className="text-white">{reviewStats.totalHelpfulVotes}</strong></span>
            <span className="text-emerald-400 font-semibold">{Math.round((reviewStats.verifiedCount / Math.max(1, reviewStats.total)) * 100)}% verified</span>
          </div>
        </div>

        {/* Deletion Compliance Pipeline */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <UserX className="w-4 h-4 text-amber-400" />
                <span>Account Deletion Compliance Status</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">Statutory 30-day erasure pipeline per Google Play</p>
            </div>
            <button
              onClick={() => onNavigateTab('deletions')}
              className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Requests</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-2xl">
              <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Pending</span>
              </span>
              <p className="text-2xl font-black text-white mt-1">{deletionStats.pending}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Awaiting initial review</p>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-2xl">
              <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-zinc-400" />
                <span>In Review</span>
              </span>
              <p className="text-2xl font-black text-white mt-1">{deletionStats.inReview}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Under verification</p>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-2xl">
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completed</span>
              </span>
              <p className="text-2xl font-black text-white mt-1">{deletionStats.completed}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Permanently purged</p>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 text-xs text-zinc-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Statutory Compliance Notice</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Pursuant to Section 128 of the Companies Act 2013 and Rule 56 of CGST Rules 2017, commercial freight records and tax invoices are retained for legal audit, while personal profile, contact, and credential PII is completely erased.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Recent Administrative Actions</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Real-time audit records logged by active administrators</p>
          </div>
          <button
            onClick={() => onNavigateTab('audit')}
            className="text-xs font-semibold text-zinc-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
          >
            <span>Full Audit Log</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            No administrative events recorded yet in current cycle.
          </div>
        ) : (
          <div className="divide-y divide-zinc-900">
            {recentLogs.map((log) => (
              <div key={log.id || log.createdAt} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <div>
                    <span className="font-bold text-white">{log.adminUser}</span>
                    <span className="text-zinc-400 font-mono ml-2">[{log.action}]</span>
                    <p className="text-zinc-400 text-[11px] mt-0.5">{log.details}</p>
                  </div>
                </div>
                <div className="text-[11px] text-zinc-500 font-mono shrink-0 pl-5 sm:pl-0">
                  {new Date(log.createdAt).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
