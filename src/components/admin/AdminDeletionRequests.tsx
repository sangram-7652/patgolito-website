import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  UserX,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShieldAlert,
  Phone,
  Mail,
  Calendar,
  X,
  Loader2,
  Save,
  Check,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { AdminDeletionRequestRecord } from '../../server/adminService';

interface AdminDeletionRequestsProps {
  token: string;
  onToast: (msg: string) => void;
}

export const AdminDeletionRequests: React.FC<AdminDeletionRequestsProps> = ({ token, onToast }) => {
  const [requests, setRequests] = useState<AdminDeletionRequestRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'purge_soonest'>('newest');
  const [countsByStatus, setCountsByStatus] = useState({
    pending: 0,
    in_review: 0,
    scheduled_for_purge: 0,
    completed: 0,
    failed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Detail Modal
  const [selectedRequest, setSelectedRequest] = useState<AdminDeletionRequestRecord | null>(null);

  // Status edit within modal
  const [editingStatus, setEditingStatus] = useState<AdminDeletionRequestRecord['status']>('pending');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Purge confirmation modal
  const [purgeConfirmRequest, setPurgeConfirmRequest] = useState<AdminDeletionRequestRecord | null>(null);
  const [isPurging, setIsPurging] = useState(false);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      params.set('sortBy', sortBy);
      params.set('page', String(page));
      params.set('pageSize', String(pageSize));

      const res = await fetch(`/api/admin/deletion-requests?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
        setTotalCount(data.totalCount || 0);
        setTotalPages(data.totalPages || 1);
        if (data.countsByStatus) setCountsByStatus(data.countsByStatus);
      } else {
        onToast('Failed to load deletion requests.');
      }
    } catch {
      onToast('Network error loading deletion requests.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page, pageSize, statusFilter, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRequests();
  };

  const handleOpenDetail = (req: AdminDeletionRequestRecord) => {
    setSelectedRequest(req);
    setEditingStatus(req.status);
    setAdminNotes(req.adminNotes || '');
  };

  const handleSaveStatus = async () => {
    if (!selectedRequest) return;
    setIsUpdatingStatus(true);

    try {
      const res = await fetch(`/api/admin/deletion-requests/${selectedRequest.id}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: editingStatus,
          adminNotes,
        }),
      });

      if (res.ok) {
        const updated = { ...selectedRequest, status: editingStatus, adminNotes };
        setSelectedRequest(updated);
        setRequests((prev) => prev.map((r) => (r.id === selectedRequest.id ? updated : r)));
        onToast(`Request status updated to "${editingStatus}".`);
      } else {
        onToast('Failed to update request status.');
      }
    } catch {
      onToast('Network error updating status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleExecutePurge = async () => {
    if (!purgeConfirmRequest) return;
    setIsPurging(true);

    try {
      const res = await fetch(`/api/admin/deletion-requests/${purgeConfirmRequest.id}/execute-purge`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onToast(`Permanent account purge completed for ${purgeConfirmRequest.requestId}!`);
        setPurgeConfirmRequest(null);
        if (selectedRequest?.id === purgeConfirmRequest.id) {
          setSelectedRequest(null);
        }
        fetchRequests();
      } else {
        onToast(data.error || 'Purge operation failed. Record marked as failed for safe retry.');
        fetchRequests();
      }
    } catch {
      onToast('Network error during purge execution.');
    } finally {
      setIsPurging(false);
    }
  };

  const getStatusBadge = (status: AdminDeletionRequestRecord['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 border border-emerald-800 text-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Completed</span>
          </span>
        );
      case 'in_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-900 border border-zinc-700 text-zinc-200">
            <Clock className="w-3 h-3 text-zinc-400" />
            <span>In Review</span>
          </span>
        );
      case 'scheduled_for_purge':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/40 border border-amber-800/80 text-amber-300">
            <Calendar className="w-3 h-3 text-amber-400" />
            <span>Scheduled Purge</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-950/60 border border-red-800 text-red-300">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span>Failed / Retry</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/30 border border-amber-800/60 text-amber-400">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 p-6 rounded-3xl">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Permanent Account Deletion Requests</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-amber-400 font-mono">
              {totalCount} Total
            </span>
          </h1>
          <p className="text-xs text-zinc-400">
            Official Google Play Store user data & account erasure pipeline for Lucknow operations.
          </p>
        </div>

        <button
          onClick={fetchRequests}
          disabled={isLoading}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Quick Status KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => {
            setStatusFilter('all');
            setPage(1);
          }}
          className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === 'all' ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-900/50'
          }`}
        >
          <div className="text-[10px] font-bold uppercase text-zinc-400">All Requests</div>
          <div className="text-xl font-black text-white mt-0.5">{totalCount}</div>
        </button>

        <button
          onClick={() => {
            setStatusFilter('pending');
            setPage(1);
          }}
          className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === 'pending' ? 'bg-amber-950/30 border-amber-800' : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-900/50'
          }`}
        >
          <div className="text-[10px] font-bold uppercase text-amber-400">Pending</div>
          <div className="text-xl font-black text-amber-400 mt-0.5">{countsByStatus.pending}</div>
        </button>

        <button
          onClick={() => {
            setStatusFilter('in_review');
            setPage(1);
          }}
          className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === 'in_review' ? 'bg-zinc-900 border-zinc-600' : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-900/50'
          }`}
        >
          <div className="text-[10px] font-bold uppercase text-zinc-300">In Review</div>
          <div className="text-xl font-black text-white mt-0.5">{countsByStatus.in_review}</div>
        </button>

        <button
          onClick={() => {
            setStatusFilter('scheduled_for_purge');
            setPage(1);
          }}
          className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === 'scheduled_for_purge' ? 'bg-amber-950/30 border-amber-800' : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-900/50'
          }`}
        >
          <div className="text-[10px] font-bold uppercase text-amber-300">Scheduled</div>
          <div className="text-xl font-black text-white mt-0.5">{countsByStatus.scheduled_for_purge}</div>
        </button>

        <button
          onClick={() => {
            setStatusFilter('completed');
            setPage(1);
          }}
          className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === 'completed' ? 'bg-emerald-950/30 border-emerald-800' : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-900/50'
          }`}
        >
          <div className="text-[10px] font-bold uppercase text-emerald-400">Purged</div>
          <div className="text-xl font-black text-emerald-400 mt-0.5">{countsByStatus.completed}</div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-950 border border-zinc-800 p-4 sm:p-5 rounded-2xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Reference ID (DEL-PAT-...), name, registered mobile, or email..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded-xl transition cursor-pointer shrink-0"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-zinc-900 text-xs">
          <span className="text-zinc-500 text-[11px] font-semibold uppercase tracking-wider">Filters:</span>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_review">In Review</option>
            <option value="scheduled_for_purge">Scheduled for Purge</option>
            <option value="completed">Completed / Purged</option>
            <option value="failed">Failed Operations</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as any);
              setPage(1);
            }}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="newest">Sort: Submission Newest First</option>
            <option value="oldest">Sort: Submission Oldest First</option>
            <option value="purge_soonest">Sort: Purge Deadline Soonest</option>
          </select>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 ml-auto"
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
            <p className="text-xs">Loading deletion records from Firestore...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-sm font-semibold text-zinc-300">No account deletion requests found</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Any user submitting an erasure request via the public portal will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Reference ID</th>
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Account Type</th>
                  <th className="py-3 px-4">Reason Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Request Date</th>
                  <th className="py-3 px-4">Purge Target</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-zinc-900/30 transition">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-white bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800 text-[11px]">
                        {req.requestId}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{req.fullName}</div>
                      <div className="text-[11px] text-zinc-400 font-mono mt-0.5">{req.phone}</div>
                      {req.email && !req.email.includes('anonymized') && (
                        <div className="text-[10px] text-zinc-500 truncate max-w-[150px]">{req.email}</div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="capitalize font-medium text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded text-[11px]">
                        {req.accountType.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-zinc-300 font-medium truncate">{req.reasonCategory}</p>
                      {req.additionalNotes && (
                        <p className="text-zinc-500 text-[10px] truncate mt-0.5">{req.additionalNotes}</p>
                      )}
                    </td>

                    <td className="py-3 px-4">{getStatusBadge(req.status)}</td>

                    <td className="py-3 px-4 font-mono text-[11px] text-zinc-400 whitespace-nowrap">
                      {new Date(req.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-zinc-400 whitespace-nowrap">
                      {req.status === 'completed' ? (
                        <span className="text-emerald-400 font-semibold">Purged</span>
                      ) : (
                        new Date(req.purgeTargetDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(req)}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-[11px]"
                          title="Manage request"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>

                        {req.status !== 'completed' && (
                          <button
                            onClick={() => setPurgeConfirmRequest(req)}
                            className="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-900/60 text-red-300 text-[11px] transition cursor-pointer flex items-center gap-1"
                            title="Execute permanent account purge"
                          >
                            <UserX className="w-3.5 h-3.5 text-red-400" />
                            <span>Purge</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalCount > 0 && (
          <div className="p-4 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
            <div>
              Showing <span className="font-bold text-white">{(page - 1) * pageSize + 1}</span> to{' '}
              <span className="font-bold text-white">{Math.min(page * pageSize, totalCount)}</span> of{' '}
              <span className="font-bold text-white">{totalCount}</span> requests
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-xs font-semibold text-white flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <span className="px-3 py-1 bg-zinc-900 rounded-lg text-xs font-mono text-zinc-300">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-xs font-semibold text-white flex items-center gap-1 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Request Detail & Status Management Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                      Account Deletion Request Dossier
                    </span>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">Ref: {selectedRequest.requestId}</h2>
                  <p className="text-xs text-zinc-500 font-mono">Firestore Doc ID: {selectedRequest.id}</p>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* User Identity Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80 space-y-1">
                  <span className="text-zinc-500 text-[10px] uppercase font-semibold">User Full Name</span>
                  <p className="font-bold text-white text-sm">{selectedRequest.fullName}</p>
                  <p className="text-zinc-400 text-[11px] capitalize">Account: {selectedRequest.accountType.replace('_', ' ')}</p>
                </div>

                <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80 space-y-1">
                  <span className="text-zinc-500 text-[10px] uppercase font-semibold">Contact Identifiers</span>
                  <p className="text-zinc-200 font-mono text-xs flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{selectedRequest.phone}</span>
                  </p>
                  <p className="text-zinc-400 text-xs flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{selectedRequest.email}</span>
                  </p>
                </div>

                <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80 space-y-1">
                  <span className="text-zinc-500 text-[10px] uppercase font-semibold">Submission Date</span>
                  <p className="font-mono text-zinc-200 text-xs">
                    {new Date(selectedRequest.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80 space-y-1">
                  <span className="text-zinc-500 text-[10px] uppercase font-semibold">Statutory Purge Target</span>
                  <p className="font-mono text-amber-300 text-xs">
                    {selectedRequest.status === 'completed'
                      ? `Completed on ${new Date(selectedRequest.completedAt || selectedRequest.purgeTargetDate).toLocaleDateString('en-IN')}`
                      : new Date(selectedRequest.purgeTargetDate).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Reason Category & Notes */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Erasure Reason Category</span>
                  <span className="text-zinc-400 font-mono text-[11px]">Portal: {selectedRequest.source}</span>
                </div>
                <p className="text-zinc-300 font-medium">{selectedRequest.reasonCategory}</p>
                {selectedRequest.additionalNotes && (
                  <div className="pt-2 border-t border-zinc-800/80">
                    <span className="text-zinc-500 text-[10px] uppercase">User Feedback / Notes:</span>
                    <p className="text-zinc-400 text-xs mt-1 whitespace-pre-wrap">{selectedRequest.additionalNotes}</p>
                  </div>
                )}
              </div>

              {/* Status Update Form */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Administrative Status & Notes</span>
                  </h3>
                  {selectedRequest.processedBy && (
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Last handled by: {selectedRequest.processedBy}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] text-zinc-400 mb-1 block">Workflow Status</label>
                    <select
                      value={editingStatus}
                      onChange={(e) => setEditingStatus(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="pending">Pending Review</option>
                      <option value="in_review">In Review (Identity Vetting)</option>
                      <option value="scheduled_for_purge">Scheduled for Purge</option>
                      <option value="completed">Completed / Purged</option>
                      <option value="failed">Failed / Escalated</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 mb-1 block">Administrative Audit Notes</label>
                    <input
                      type="text"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="e.g. Identity verified via mobile OTP, no pending trips"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    onClick={handleSaveStatus}
                    disabled={isUpdatingStatus}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {isUpdatingStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin text-black" /> : <Save className="w-3.5 h-3.5" />}
                    <span>Save Status Update</span>
                  </button>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition cursor-pointer"
                >
                  Close Dossier
                </button>

                {selectedRequest.status !== 'completed' && (
                  <button
                    onClick={() => {
                      setPurgeConfirmRequest(selectedRequest);
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-950/40"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Execute Permanent Purge</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Irreversible Purge Confirmation Modal */}
      <AnimatePresence>
        {purgeConfirmRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-zinc-950 border border-red-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative"
            >
              <div className="flex items-center gap-3 text-red-400">
                <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-800 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Execute Permanent Account Purge</h3>
                  <p className="text-xs text-red-300">Irreversible user data & profile erasure</p>
                </div>
              </div>

              <div className="space-y-3 text-xs bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 text-zinc-300">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400">Reference ID:</span>
                  <span className="font-mono font-bold text-white">{purgeConfirmRequest.requestId}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400">Target User:</span>
                  <span className="font-bold text-white">{purgeConfirmRequest.fullName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Contact Number:</span>
                  <span className="font-mono text-zinc-200">{purgeConfirmRequest.phone}</span>
                </div>
              </div>

              <div className="text-xs text-zinc-400 space-y-2 bg-red-950/20 border border-red-900/40 rounded-2xl p-4">
                <p className="font-bold text-red-200 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  <span>Permanent Erasure Impact:</span>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-zinc-300">
                  <li>User phone number and email will be permanently unlinked and anonymized.</li>
                  <li>Login credentials and personal profile records are deleted.</li>
                  <li>Commercial tax invoices and carriage compliance logs are retained in non-PII format per Indian CGST and Companies Acts.</li>
                </ul>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setPurgeConfirmRequest(null)}
                  disabled={isPurging}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecutePurge}
                  disabled={isPurging}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shadow-red-950/50"
                >
                  {isPurging ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Erasing Data...</span>
                    </>
                  ) : (
                    <>
                      <UserX className="w-3.5 h-3.5" />
                      <span>Confirm & Execute Purge</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
