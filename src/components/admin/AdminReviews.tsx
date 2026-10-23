import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Truck,
  ThumbsUp,
  X,
  Loader2,
} from 'lucide-react';
import { AdminReviewRecord } from '../../server/adminService';

interface AdminReviewsProps {
  token: string;
  onToast: (msg: string) => void;
}

export const AdminReviews: React.FC<AdminReviewsProps> = ({ token, onToast }) => {
  const [reviews, setReviews] = useState<AdminReviewRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
  const [verifiedFilter, setVerifiedFilter] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating_high' | 'rating_low'>('newest');
  const [isLoading, setIsLoading] = useState(true);

  // Selected Review for Detail Modal
  const [selectedReview, setSelectedReview] = useState<AdminReviewRecord | null>(null);

  // Confirmation state for deleting a review
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingVerify, setIsUpdatingVerify] = useState<string | null>(null);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (ratingFilter !== undefined) params.set('rating', String(ratingFilter));
      if (verifiedFilter !== undefined) params.set('verified', String(verifiedFilter));
      params.set('sortBy', sortBy);
      params.set('page', String(page));
      params.set('pageSize', String(pageSize));

      const res = await fetch(`/api/admin/reviews?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setTotalCount(data.totalCount || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        onToast('Failed to load reviews from database.');
      }
    } catch {
      onToast('Network error while querying reviews.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, pageSize, ratingFilter, verifiedFilter, sortBy]);

  // Debounced search handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchReviews();
  };

  const handleToggleVerify = async (review: AdminReviewRecord) => {
    setIsUpdatingVerify(review.id);
    const newStatus = !review.verified;

    try {
      const res = await fetch(`/api/admin/reviews/${review.id}/verify`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verified: newStatus }),
      });

      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === review.id ? { ...r, verified: newStatus } : r))
        );
        if (selectedReview?.id === review.id) {
          setSelectedReview({ ...selectedReview, verified: newStatus });
        }
        onToast(`Review verification updated to ${newStatus ? 'Verified' : 'Unverified'}`);
      } else {
        onToast('Failed to update verification status.');
      }
    } catch {
      onToast('Network error during verification toggle.');
    } finally {
      setIsUpdatingVerify(null);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        setTotalCount((c) => Math.max(0, c - 1));
        setDeleteConfirmId(null);
        if (selectedReview?.id === reviewId) setSelectedReview(null);
        onToast('Review permanently removed from Firestore.');
      } else {
        onToast('Failed to delete review record.');
      }
    } catch {
      onToast('Network error during review deletion.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 p-6 rounded-3xl">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Customer Reviews Management</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 font-mono">
              {totalCount} Total
            </span>
          </h1>
          <p className="text-xs text-zinc-400">
            Real customer feedback loaded from Firestore <span className="font-mono text-zinc-300">reviews</span> collection.
          </p>
        </div>

        <button
          onClick={fetchReviews}
          disabled={isLoading}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-zinc-950 border border-zinc-800 p-4 sm:p-5 rounded-2xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, review title, comment, locality..."
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

          {/* Rating filter */}
          <select
            value={ratingFilter === undefined ? '' : ratingFilter}
            onChange={(e) => {
              setRatingFilter(e.target.value === '' ? undefined : Number(e.target.value));
              setPage(1);
            }}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Ratings (1 - 5★)</option>
            <option value="5">5 Stars only</option>
            <option value="4">4 Stars only</option>
            <option value="3">3 Stars only</option>
            <option value="2">2 Stars only</option>
            <option value="1">1 Star only</option>
          </select>

          {/* Verified filter */}
          <select
            value={verifiedFilter === undefined ? '' : String(verifiedFilter)}
            onChange={(e) => {
              setVerifiedFilter(e.target.value === '' ? undefined : e.target.value === 'true');
              setPage(1);
            }}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Verification Status</option>
            <option value="true">Verified Bookings Only</option>
            <option value="false">Unverified Only</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as any);
              setPage(1);
            }}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="rating_high">Sort: Highest Rating</option>
            <option value="rating_low">Sort: Lowest Rating</option>
          </select>

          {/* Page Size */}
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

      {/* Reviews Table / Card Grid */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
            <p className="text-xs">Querying Firestore reviews database...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-sm font-semibold text-zinc-300">No reviews match current search criteria</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Try clearing filters or adjusting your search keyword to view other customer records.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Reviewer</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Service & Locality</th>
                  <th className="py-3 px-4 max-w-xs">Feedback Excerpt</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-zinc-900/30 transition">
                    {/* Reviewer */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{rev.authorName}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        UID: {rev.userId ? rev.userId.slice(0, 10) : 'anon'}...
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800">
                        <span className="font-black text-white">{rev.rating}</span>
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      </div>
                    </td>

                    {/* Service & Locality */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-300">{rev.vehicleType}</div>
                      <div className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
                        <span className="truncate max-w-[120px]">{rev.locality}</span>
                      </div>
                    </td>

                    {/* Feedback Excerpt */}
                    <td className="py-3 px-4 max-w-xs">
                      {rev.title && <div className="font-semibold text-white truncate">{rev.title}</div>}
                      <p className="text-zinc-400 text-[11px] line-clamp-2 mt-0.5">{rev.comment}</p>
                    </td>

                    {/* Verification Status */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleVerify(rev)}
                        disabled={isUpdatingVerify === rev.id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold cursor-pointer border transition ${
                          rev.verified
                            ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300 hover:bg-emerald-900/40'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                        }`}
                        title="Click to toggle verified badge"
                      >
                        {isUpdatingVerify === rev.id ? (
                          <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                        ) : rev.verified ? (
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-zinc-500" />
                        )}
                        <span>{rev.verified ? 'Verified Booking' : 'Unverified'}</span>
                      </button>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 font-mono text-[11px] text-zinc-400 whitespace-nowrap">
                      {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedReview(rev)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer"
                          title="View full review details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(rev.id)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                          title="Delete spam review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
              <span className="font-bold text-white">{totalCount}</span> reviews
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

      {/* Review Detail Modal */}
      <AnimatePresence>
        {selectedReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative"
            >
              <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Review Record Details</span>
                  <h2 className="text-xl font-bold text-white mt-1">{selectedReview.authorName}</h2>
                  <p className="text-xs text-zinc-500 font-mono">Document ID: {selectedReview.id}</p>
                </div>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Detail Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] uppercase font-semibold">Rating</span>
                  <div className="flex items-center gap-1 mt-1 text-white font-bold">
                    <span>{selectedReview.rating} Stars</span>
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </div>
                </div>

                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] uppercase font-semibold">Vehicle Transport</span>
                  <p className="mt-1 text-white font-semibold">{selectedReview.vehicleType}</p>
                </div>

                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] uppercase font-semibold">Locality</span>
                  <p className="mt-1 text-white font-semibold">{selectedReview.locality}</p>
                </div>

                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] uppercase font-semibold">Status</span>
                  <p className="mt-1 text-emerald-400 font-semibold">
                    {selectedReview.verified ? 'Verified Move' : 'Unverified'}
                  </p>
                </div>

                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] uppercase font-semibold">Helpful Votes</span>
                  <p className="mt-1 text-white font-semibold">{selectedReview.helpfulCount} votes</p>
                </div>

                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] uppercase font-semibold">Date Submitted</span>
                  <p className="mt-1 text-zinc-300 font-mono text-[11px]">
                    {new Date(selectedReview.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Title & Comment Text */}
              <div className="space-y-2 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4">
                {selectedReview.title && (
                  <h3 className="font-bold text-white text-sm">{selectedReview.title}</h3>
                )}
                <p className="text-zinc-300 text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedReview.comment}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <button
                  onClick={() => handleToggleVerify(selectedReview)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-white transition flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Toggle Verified Badge</span>
                </button>

                <button
                  onClick={() => {
                    setDeleteConfirmId(selectedReview.id);
                    setSelectedReview(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-800/80 text-xs font-semibold text-red-300 transition flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Delete Review</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-zinc-950 border border-red-900/60 rounded-3xl p-6 space-y-5 shadow-2xl"
            >
              <div className="flex items-center gap-3 text-red-400">
                <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800/80 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Permanently Delete Review?</h3>
                  <p className="text-xs text-zinc-400">This action will immediately delete the record from Firestore.</p>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                Review ID: <span className="font-mono text-zinc-400">{deleteConfirmId}</span>
                <br />
                This operation is audited and cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteReview(deleteConfirmId)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer"
                >
                  {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  <span>Confirm Permanent Delete</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
