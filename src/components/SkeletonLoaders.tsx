import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'rounded' | 'pill';
}

/**
 * High-performance, accessible skeleton block with smooth shimmering pulse animation.
 * Strict black/zinc/emerald neutral styling - ZERO blue colors.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rounded',
}) => {
  const variantStyles = {
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    rounded: 'rounded-2xl',
    pill: 'rounded-full',
  }[variant];

  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-zinc-200/90 via-zinc-100 to-zinc-200/90 ${variantStyles} ${className}`}
      aria-hidden="true"
    />
  );
};

/**
 * Skeleton Loader for Landing Page
 */
export const LandingPageSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-12 pb-20 animate-pulse" aria-busy="true" aria-label="Loading PATGOLITO home">
      {/* Hero Section Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <Skeleton className="h-6 w-48 bg-zinc-200" variant="pill" />
            <div className="space-y-3">
              <Skeleton className="h-12 sm:h-16 w-full max-w-xl bg-zinc-200" />
              <Skeleton className="h-10 sm:h-12 w-3/4 max-w-md bg-zinc-200" />
            </div>
            <Skeleton className="h-5 w-full max-w-lg bg-zinc-200" />
            <div className="flex flex-wrap gap-4 pt-2">
              <Skeleton className="h-14 w-48 bg-zinc-900" variant="rounded" />
              <Skeleton className="h-14 w-44 bg-zinc-200" variant="rounded" />
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-100">
              <Skeleton className="h-16 bg-zinc-100" />
              <Skeleton className="h-16 bg-zinc-100" />
              <Skeleton className="h-16 bg-zinc-100" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <Skeleton className="h-96 w-full bg-zinc-100" variant="rounded" />
          </div>
        </div>
      </div>

      {/* Fleet Showcase Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64 bg-zinc-200" />
          <Skeleton className="h-6 w-32 bg-zinc-200" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 rounded-2xl border border-zinc-200 bg-white space-y-4">
              <Skeleton className="h-32 w-full bg-zinc-100" />
              <Skeleton className="h-5 w-36 bg-zinc-200" />
              <Skeleton className="h-4 w-24 bg-zinc-200" />
              <Skeleton className="h-10 w-full bg-zinc-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton Loader for About Page
 */
export const AboutPageSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-12 pb-20 bg-white" aria-busy="true" aria-label="Loading About PATGOLITO">
      {/* Editorial Header Skeleton */}
      <div className="bg-zinc-950 text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4 text-center">
          <Skeleton className="h-6 w-40 mx-auto bg-zinc-800" variant="pill" />
          <Skeleton className="h-12 w-3/4 mx-auto bg-zinc-800" />
          <Skeleton className="h-5 w-full max-w-lg mx-auto bg-zinc-800/80" />
        </div>
      </div>

      {/* Narrative Section Skeleton */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <Skeleton className="h-7 w-48 bg-zinc-200" />
            <Skeleton className="h-4 w-full bg-zinc-200" />
            <Skeleton className="h-4 w-5/6 bg-zinc-200" />
            <Skeleton className="h-4 w-4/5 bg-zinc-200" />
          </div>
          <Skeleton className="h-64 w-full bg-zinc-100" variant="rounded" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl border border-zinc-200 space-y-3">
              <Skeleton className="h-8 w-8 bg-zinc-200" variant="circular" />
              <Skeleton className="h-5 w-32 bg-zinc-200" />
              <Skeleton className="h-4 w-full bg-zinc-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton Loader for Modals (Booking / Auth)
 */
export const ModalSkeleton: React.FC = () => {
  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-lg mx-auto bg-white rounded-3xl" aria-busy="true" aria-label="Loading content">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-44 bg-zinc-200" />
          <Skeleton className="h-3.5 w-32 bg-zinc-200" />
        </div>
        <Skeleton className="h-8 w-8 bg-zinc-200" variant="circular" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-12 w-full bg-zinc-100" />
        <Skeleton className="h-12 w-full bg-zinc-100" />
        <Skeleton className="h-20 w-full bg-zinc-100" />
      </div>
      <Skeleton className="h-12 w-full bg-zinc-900" />
    </div>
  );
};
