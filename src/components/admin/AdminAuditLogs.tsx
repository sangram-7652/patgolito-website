import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  RotateCcw,
  Search,
  Filter,
  ShieldCheck,
  User,
  Clock,
  Server,
  Lock,
  Loader2,
} from 'lucide-react';
import { AuditLogEntry } from '../../server/adminService';

interface AdminAuditLogsProps {
  token: string;
  onToast: (msg: string) => void;
}

export const AdminAuditLogs: React.FC<AdminAuditLogsProps> = ({ token, onToast }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/audit-logs?limit=100', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      } else {
        onToast('Failed to load audit logs.');
      }
    } catch {
      onToast('Network error loading audit logs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    let list = [...logs];

    if (actionFilter !== 'all') {
      list = list.filter((l) => l.action.toLowerCase() === actionFilter.toLowerCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (l) =>
          l.adminUser.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.details.toLowerCase().includes(q) ||
          (l.targetId && l.targetId.toLowerCase().includes(q)) ||
          l.ip.includes(q)
      );
    }

    setFilteredLogs(list);
  }, [logs, search, actionFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 p-6 rounded-3xl">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Administrative Audit Log Archive</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 font-mono">
              {logs.length} Recorded Events
            </span>
          </h1>
          <p className="text-xs text-zinc-400">
            Immutable chronological record of administrative logins, status modifications, and data purges.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={isLoading}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-950 border border-zinc-800 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail by administrator name, action, target reference ID, IP..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 shrink-0"
        >
          <option value="all">All Actions</option>
          <option value="ADMIN_LOGIN_SUCCESS">Login Success</option>
          <option value="ADMIN_LOGIN_FAILED">Login Failed</option>
          <option value="ADMIN_LOGOUT">Logout</option>
          <option value="REVIEW_VERIFY_TOGGLE">Review Verification Toggle</option>
          <option value="REVIEW_DELETE">Review Deletion</option>
          <option value="DELETION_STATUS_UPDATE">Deletion Status Update</option>
          <option value="PERMANENT_ACCOUNT_PURGE_EXECUTED">Permanent Account Purge</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
            <p className="text-xs">Loading audit events...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-sm font-semibold text-zinc-300">No audit events found</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Administrative actions will automatically generate real-time log entries here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Administrator</th>
                  <th className="py-3 px-4">Action Type</th>
                  <th className="py-3 px-4">Target Ref</th>
                  <th className="py-3 px-4">Event Description</th>
                  <th className="py-3 px-4 text-right">Origin IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {filteredLogs.map((log) => (
                  <tr key={log.id || log.createdAt} className="hover:bg-zinc-900/30 transition">
                    <td className="py-3 px-4 font-mono text-[11px] text-zinc-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>

                    <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                      {log.adminUser}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-zinc-400 whitespace-nowrap">
                      {log.targetId || '—'}
                    </td>

                    <td className="py-3 px-4 text-zinc-300">
                      {log.details}
                    </td>

                    <td className="py-3 px-4 font-mono text-[10px] text-zinc-500 text-right whitespace-nowrap">
                      {log.ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
