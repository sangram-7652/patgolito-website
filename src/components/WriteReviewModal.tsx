import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ShieldCheck, CheckCircle2, AlertCircle, Loader2, Truck, Users } from 'lucide-react';
import { submitCustomerReview } from '../lib/firebase';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (authorName: string) => void;
}

// Active fleet services verified in PATGOLITO operations
const ACTIVE_FLEET_OPTIONS = [
  'Tata Ace',
  'Three-Wheeler Goods Loader',
  'Compact Three-Wheeler',
  'E-Loader Electric Cargo',
  'Two-Wheeler Express',
];

const RATING_LABELS: Record<number, string> = {
  5: 'Exceptional — Highly Recommend',
  4: 'Very Good — Smooth Move',
  3: 'Good — Met Expectations',
  2: 'Fair — Room for Improvement',
  1: 'Disappointing',
};

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState('');
  const [vehicleType, setVehicleType] = useState('Tata Ace');
  const [hadHelper, setHadHelper] = useState(true);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = authorName.trim();
    const trimmedComment = comment.trim();

    if (trimmedName.length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }

    if (trimmedComment.length < 10) {
      setErrorMessage('Please provide your review feedback with at least 10 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitCustomerReview({
        authorName: trimmedName,
        locality: 'Lucknow',
        vehicleType,
        rating,
        title: title.trim() || `${vehicleType} trip review`,
        comment: trimmedComment,
        hadHelper,
        verified: true,
      });

      if (result.success) {
        onSuccess(trimmedName);
        onClose();
      } else {
        setErrorMessage(result.error || 'Could not save review. Please check your network and retry.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network connection error';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeRating = hoverRating || rating;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        id="write-review-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-6"
        >
          {/* Modal Header */}
          <div className="bg-black text-white p-6 sm:p-7 flex items-start justify-between gap-4 border-b border-zinc-800">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Customer Review</span>
              </div>
              <h2 id="review-modal-title" className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Share Your Experience
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                Your authentic feedback guides customers across our transport network.
              </p>
            </div>

            <button
              onClick={onClose}
              aria-label="Close review dialog"
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-6 mt-6 p-4 rounded-2xl bg-zinc-900 text-white border border-zinc-700 flex items-start gap-3 text-xs"
            >
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-amber-300">Action Required</p>
                <p className="text-zinc-300">{errorMessage}</p>
              </div>
            </motion.div>
          )}

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Rating Stars Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase text-zinc-700 tracking-wider">
                Overall Rating <span className="text-emerald-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div 
                  className="flex items-center gap-1.5 bg-zinc-50 p-2 rounded-2xl border border-zinc-200 w-fit"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      className="p-1 rounded-lg hover:scale-115 transition-transform cursor-pointer focus:outline-hidden"
                      aria-label={`Rate ${star} Stars`}
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= activeRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-zinc-200 text-zinc-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-zinc-900">
                  {RATING_LABELS[activeRating] || `${activeRating} Stars`}
                </span>
              </div>
            </div>

            {/* Author Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase text-zinc-700 tracking-wider">
                Your Full Name <span className="text-emerald-500">*</span>
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:border-black focus:bg-white transition"
              />
            </div>

            {/* Vehicle Type Selection (Only active service fleet) */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase text-zinc-700 tracking-wider">
                Vehicle Booked
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ACTIVE_FLEET_OPTIONS.map((fleetItem) => {
                  const isSelected = vehicleType === fleetItem;
                  return (
                    <button
                      key={fleetItem}
                      type="button"
                      onClick={() => setVehicleType(fleetItem)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition flex items-center gap-2 cursor-pointer border ${
                        isSelected
                          ? 'bg-black text-white border-black shadow-xs'
                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                      }`}
                    >
                      <Truck className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`} />
                      <span className="truncate">{fleetItem}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct Door-to-Door Transit Service Switch */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-800" />
                  <p className="text-xs font-bold text-zinc-900">
                    Verified Direct Dispatch Trip
                  </p>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Completed with verified commercial transport driver
                </p>
              </div>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-zinc-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setHadHelper(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    hadHelper ? 'bg-black text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setHadHelper(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    !hadHelper ? 'bg-black text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Review Headline */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase text-zinc-700 tracking-wider">
                Review Headline <span className="text-zinc-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Prompt service and transparent pricing"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:border-black focus:bg-white transition"
              />
            </div>

            {/* Review Feedback Text */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase text-zinc-700 tracking-wider">
                Your Review & Comments <span className="text-emerald-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share details about driver punctuality, loading care, vehicle condition, or pricing clarity..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:border-black focus:bg-white transition resize-y"
              />
              <div className="flex justify-between items-center text-[10px] text-zinc-400 pt-0.5">
                <span>Minimum 10 characters</span>
                <span>{comment.length} characters</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Publishing Review...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Post Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
