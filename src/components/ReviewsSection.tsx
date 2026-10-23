import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  ShieldCheck,
  ThumbsUp,
  MessageSquarePlus,
  Filter,
  Truck,
  Users,
  CheckCircle2,
  Sparkles,
  Search,
} from 'lucide-react';
import {
  CustomerReview,
  subscribeToReviews,
  markReviewHelpful,
} from '../lib/firebase';
import CircularCarousel from './CircularCarousel';
import { BlurText, SplitText } from './AnimatedText';
import BorderGlow from './BorderGlow';
import { AnimatedButton } from './AnimatedButton';

// Lazy load WriteReviewModal to keep initial bundle size lean for optimal SEO & performance
const WriteReviewModal = lazy(() =>
  import('./WriteReviewModal').then((module) => ({ default: module.WriteReviewModal }))
);

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all');
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'highest' | 'newest' | 'helpful'>('highest');
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('patgolito_helpful_reviews');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [recentSubmitNotice, setRecentSubmitNotice] = useState<string | null>(null);
  const [justVotedId, setJustVotedId] = useState<string | null>(null);

  // Subscribe to real-time reviews from Firebase Firestore
  useEffect(() => {
    const unsubscribe = subscribeToReviews((fetchedReviews) => {
      setReviews(fetchedReviews);
    });
    return () => unsubscribe();
  }, []);

  // Compute rating stats
  const stats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        avg: 5.0,
        total: 0,
        starsCount: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
        helperMovesCount: 0,
      };
    }
    const total = reviews.length;
    let sum = 0;
    const starsCount: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let helperMovesCount = 0;

    reviews.forEach((r) => {
      const score = Math.min(5, Math.max(1, Math.round(r.rating)));
      sum += r.rating;
      starsCount[score] = (starsCount[score] || 0) + 1;
      if (r.hadHelper) helperMovesCount++;
    });

    const avg = Number((sum / total).toFixed(1));
    return { avg, total, starsCount, helperMovesCount };
  }, [reviews]);

  // Handle helpful voting
  const handleHelpfulVote = async (reviewId: string) => {
    if (!reviewId || votedMap[reviewId]) return;
    const updatedMap = { ...votedMap, [reviewId]: true };
    setVotedMap(updatedMap);
    try {
      localStorage.setItem('patgolito_helpful_reviews', JSON.stringify(updatedMap));
    } catch {
      // LocalStorage fallback
    }

    setJustVotedId(reviewId);
    setTimeout(() => {
      setJustVotedId((curr) => (curr === reviewId ? null : curr));
    }, 2800);

    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r
      )
    );
    await markReviewHelpful(reviewId);
  };

  // Filtered and sorted reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => {
        if (selectedRatingFilter !== 'all' && r.rating !== selectedRatingFilter) {
          return false;
        }
        if (selectedVehicleFilter !== 'all' && !r.vehicleType.toLowerCase().includes(selectedVehicleFilter.toLowerCase())) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'highest') {
          return b.rating - a.rating;
        }
        if (sortBy === 'helpful') {
          return (b.helpfulCount || 0) - (a.helpfulCount || 0);
        }
        return 0;
      });
  }, [reviews, selectedRatingFilter, selectedVehicleFilter, sortBy]);

  // Construct items for CircularCarousel
  const items = useMemo(() => {
    return filteredReviews.map((review, idx) => ({
      id: review.id || `rev-${idx}`,
      src: `/images/review-${(idx % 4) + 1}.jpg`,
      alt: `${review.authorName} review`,
      title: review.authorName,
      subtitle: `${review.vehicleType} • ${review.locality}`,
      authorName: review.authorName,
      locality: review.locality,
      vehicleType: review.vehicleType,
      rating: review.rating,
      comment: review.comment,
      hadHelper: review.hadHelper,
      verified: review.verified,
      helpfulCount: review.helpfulCount || 0,
      createdAt: review.createdAt,
      hasVoted: votedMap[review.id || ''] || false,
    }));
  }, [filteredReviews, votedMap]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <section id="reviews" className="py-20 md:py-28 border-b border-zinc-200 bg-zinc-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Our Community reviews</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight">
            <SplitText text="Trusted by Verified Customers & Merchants" />
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
            <BlurText text="Real customer feedback for intra-city logistics, active fleet dispatches, and punctual vehicle transport across Lucknow." delay={0.15} />
          </p>
        </motion.div>

        {/* Success Notice Banner */}
        <AnimatePresence>
          {recentSubmitNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto p-4 rounded-2xl bg-black text-white border border-emerald-500/50 shadow-lg flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium text-zinc-200">
                  Thank you, <strong className="text-white">{recentSubmitNotice}</strong>! Your review has been saved to Firebase Firestore and is now live.
                </span>
              </div>
              <button
                onClick={() => setRecentSubmitNotice(null)}
                className="text-zinc-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overall Rating & Statistics Overview Card */}
        <BorderGlow
          edgeSensitivity={30}
          glowColor="40 80 80"
          backgroundColor="#ffffff"
          borderRadius={24}
          glowRadius={40}
          glowIntensity={1}
          coneSpread={25}
          animated={false}
          colors={['#10b981', '#34d399', '#f59e0b']}
        >
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Big Score */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-3 border-b lg:border-b-0 lg:border-r border-zinc-200 pb-6 lg:pb-0 lg:pr-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-black text-black tracking-tight">
                  {stats.avg.toFixed(1)}
                </span>
                <span className="text-lg font-bold text-zinc-400">/ 5.0</span>
              </div>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${
                      s <= Math.round(stats.avg)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-zinc-200 text-zinc-300'
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-zinc-600 font-medium">
                Based on <strong className="text-black font-bold">{stats.total}</strong> authentic customer reviews across our verified trips.
              </p>

              <div className="pt-2">
                <AnimatedButton
                  onClick={() => setIsModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold flex items-center gap-2 hover:bg-zinc-800 transition cursor-pointer shadow-md border border-zinc-800"
                >
                  <MessageSquarePlus className="w-4 h-4 text-emerald-400" />
                  <span>Write a Customer Review</span>
                </AnimatedButton>
              </div>
            </div>

            {/* Middle Rating Distribution Bars */}
            <div className="lg:col-span-5 space-y-2 border-b lg:border-b-0 lg:border-r border-zinc-200 pb-6 lg:pb-0 lg:pr-8">
              {[5, 4, 3, 2, 1].map((starVal) => {
                const count = stats.starsCount[starVal] || 0;
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={starVal} className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 w-12 font-bold text-zinc-700">
                      <span>{starVal}</span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="flex-1 h-2.5 rounded-full bg-zinc-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full bg-amber-400 rounded-full"
                      />
                    </div>
                    <span className="w-10 text-right font-medium text-zinc-500 text-[11px]">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right Highlights */}
            <div className="lg:col-span-3 space-y-4">
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-950">100% Punctual Dispatch</p>
                  <p className="text-[11px] text-zinc-500">
                    Verified commercial vehicles with punctual arrival
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-950">100% Genuine Feedback</p>
                  <p className="text-[11px] text-zinc-500">Live verified database synchronization</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BorderGlow>

        {/* Filter & Sort Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-zinc-500 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>

            {/* Rating Filter Buttons */}
            <button
              onClick={() => setSelectedRatingFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedRatingFilter === 'all'
                  ? 'bg-black text-white'
                  : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              All Ratings ({reviews.length})
            </button>

            <button
              onClick={() => setSelectedRatingFilter(5)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                selectedRatingFilter === 5
                  ? 'bg-black text-white'
                  : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>5 Stars ({stats.starsCount[5] || 0})</span>
            </button>

            {/* Vehicle Type Filter (Only active operating vehicles) */}
            <select
              value={selectedVehicleFilter}
              onChange={(e) => setSelectedVehicleFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-zinc-200 text-zinc-800 focus:outline-hidden focus:border-black cursor-pointer"
            >
              <option value="all">All Vehicles</option>
              <option value="Tata Ace">Tata Ace</option>
              <option value="Three-Wheeler">Three-Wheeler</option>
              <option value="E-Loader">E-Loader</option>
              <option value="Two-Wheeler">Two-Wheeler</option>
            </select>
          </div>

            {/* Sort Control */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
              <span className="text-xs font-bold text-zinc-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'highest' | 'newest' | 'helpful')}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-zinc-200 text-zinc-800 focus:outline-hidden focus:border-black cursor-pointer"
              >
                <option value="highest">Top Reviews (Highest Rating)</option>
                <option value="newest">Most Recent</option>
                <option value="helpful">Most Helpful / Liked</option>
              </select>

              <button
                onClick={() => setIsModalOpen(true)}
                className="md:hidden px-3 py-1.5 rounded-xl bg-black text-white text-xs font-bold cursor-pointer shrink-0"
              >
                + Write Review
              </button>
            </div>
          </div>

        {/* Reviews 3D Circular Carousel Display */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-500 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-950">No reviews match your filters</h3>
              <p className="text-xs text-zinc-500">
                Try resetting your filters to see all reviews.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedRatingFilter('all');
                setSelectedVehicleFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ width: '100%', height: '560px', position: 'relative' }}>
            <CircularCarousel
              items={items}
              preset="cylinder"
              intro="rise"
              cardWidth={220}
              aspectRatio={1}
              speed={14}
              captions={false}
              gap={25}
              tilt={-5}
              curve={1}
              perspective={2500}
              autoplay="drift"
              interval={3}
              direction="left"
              momentum={0.6}
              snap
              pauseOnHover
              focusOnClick
              draggable
              parallax={0.3}
              stretch={0.5}
              fadeColor="#000000"
              depthFade={0.55}
              innerShade={0.6}
              cornerRadius={12}
              onHelpfulVote={handleHelpfulVote}
            />
          </div>
        )}
      </div>

      {/* Write Review Modal (Lazy Loaded on demand) */}
      {isModalOpen && (
        <Suspense fallback={null}>
          <WriteReviewModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={(authorName) => {
              setRecentSubmitNotice(authorName);
              setTimeout(() => setRecentSubmitNotice(null), 8000);
            }}
          />
        </Suspense>
      )}
    </section>
  );
};
