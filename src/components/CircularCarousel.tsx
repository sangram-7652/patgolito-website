import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, ShieldCheck, Truck, Users, ThumbsUp } from 'lucide-react';
import BorderGlow from './BorderGlow';

export interface CircularCarouselItem {
  id?: string | number;
  src?: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  // Optional customer review fields
  authorName?: string;
  locality?: string;
  vehicleType?: string;
  rating?: number;
  comment?: string;
  hadHelper?: boolean;
  verified?: boolean;
  helpfulCount?: number;
  createdAt?: string;
  [key: string]: any;
}

export interface CircularCarouselProps {
  items: CircularCarouselItem[];
  preset?: 'cylinder' | 'ring' | 'flat';
  intro?: 'rise' | 'fade' | 'zoom' | 'none';
  cardWidth?: number;
  aspectRatio?: number;
  speed?: number;
  captions?: boolean;
  gap?: number;
  tilt?: number;
  curve?: number;
  perspective?: number;
  autoplay?: 'drift' | boolean;
  interval?: number;
  direction?: 'left' | 'right';
  momentum?: number;
  snap?: boolean;
  pauseOnHover?: boolean;
  focusOnClick?: boolean;
  draggable?: boolean;
  parallax?: number;
  stretch?: number;
  fadeColor?: string;
  depthFade?: number;
  innerShade?: number;
  cornerRadius?: number;
  className?: string;
  renderCard?: (item: CircularCarouselItem, index: number, isCenter: boolean) => React.ReactNode;
  onItemClick?: (item: CircularCarouselItem, index: number) => void;
  onHelpfulVote?: (reviewId: string) => void;
}

export const CircularCarousel: React.FC<CircularCarouselProps> = ({
  items = [],
  preset = 'cylinder',
  intro = 'rise',
  cardWidth = 220,
  aspectRatio = 1,
  speed = 14,
  captions = false,
  gap = 25,
  tilt = -5,
  curve = 1,
  perspective = 2500,
  autoplay = 'drift',
  interval = 3,
  direction = 'left',
  momentum = 0.6,
  snap = true,
  pauseOnHover = true,
  focusOnClick = true,
  draggable = true,
  parallax = 0.3,
  stretch = 0.5,
  fadeColor = '#000000',
  depthFade = 0.55,
  innerShade = 0.6,
  cornerRadius = 12,
  className = '',
  renderCard,
  onItemClick,
  onHelpfulVote,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [introReady, setIntroReady] = useState<boolean>(intro === 'none');
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Drag physics tracking refs
  const dragStartXRef = useRef<number>(0);
  const dragStartRotationRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const lastXRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const momentumFrameRef = useRef<number | null>(null);

  const totalItems = Math.max(items.length, 1);
  const anglePerItem = 360 / totalItems;

  // Calculate 3D radius based on card width, gap, and curve factor
  const effectiveCardWidth = cardWidth;
  const cardHeight = Math.round(effectiveCardWidth / (aspectRatio || 1));
  const spacing = effectiveCardWidth + gap;
  const calculatedRadius = Math.max(
    320,
    Math.round((spacing / (2 * Math.sin(Math.PI / Math.max(totalItems, 3)))) * curve)
  );

  // Handle intro animation
  useEffect(() => {
    if (intro !== 'none') {
      const timer = setTimeout(() => {
        setIntroReady(true);
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [intro]);

  // Autoplay Drift animation loop
  useEffect(() => {
    if (!autoplay || isHovered || isDragging) return;

    let lastTimestamp = performance.now();
    const driftSpeedDegreesPerSec = (speed * 0.45) * (direction === 'left' ? -1 : 1);

    const animateDrift = (currentTimestamp: number) => {
      const deltaSec = (currentTimestamp - lastTimestamp) / 1000;
      lastTimestamp = currentTimestamp;

      setRotation((prev) => {
        const next = prev + driftSpeedDegreesPerSec * deltaSec;
        return next;
      });

      animFrameRef.current = requestAnimationFrame(animateDrift);
    };

    animFrameRef.current = requestAnimationFrame(animateDrift);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [autoplay, isHovered, isDragging, speed, direction]);

  // Keep currentIndex updated based on closest rotation angle
  useEffect(() => {
    const normalizedRot = -rotation;
    let index = Math.round(normalizedRot / anglePerItem) % totalItems;
    if (index < 0) index += totalItems;
    setCurrentIndex((prev) => (prev !== index ? index : prev));
  }, [rotation, anglePerItem, totalItems]);

  // Snap to nearest item
  const snapToNearest = useCallback(() => {
    if (!snap) return;
    setRotation((prev) => {
      const step = anglePerItem;
      const target = Math.round(prev / step) * step;
      return target;
    });
  }, [snap, anglePerItem]);

  // Rotate to specific item index
  const rotateToIndex = useCallback((targetIndex: number) => {
    setRotation((prev) => {
      const currentNormalized = ((-prev % 360) + 360) % 360;
      const targetAngle = targetIndex * anglePerItem;
      let diff = targetAngle - currentNormalized;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      return prev - diff;
    });
  }, [anglePerItem]);

  // Drag interaction handlers
  const handlePointerDown = (clientX: number) => {
    if (!draggable) return;
    if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);
    setIsDragging(true);
    dragStartXRef.current = clientX;
    dragStartRotationRef.current = rotation;
    lastXRef.current = clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDragging) return;
    const now = performance.now();
    const dt = Math.max(now - lastTimeRef.current, 1);
    const deltaX = clientX - dragStartXRef.current;
    const stepDeltaX = clientX - lastXRef.current;

    // Angle delta proportional to cylinder perimeter
    const angleDelta = (deltaX / (calculatedRadius * 0.8)) * (180 / Math.PI);
    setRotation(dragStartRotationRef.current + angleDelta);

    velocityRef.current = (stepDeltaX / dt) * 16;
    lastXRef.current = clientX;
    lastTimeRef.current = now;
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Apply momentum with smooth damping decay
    let currentVel = velocityRef.current;
    if (Math.abs(currentVel) > 0.5 && momentum > 0) {
      const applyMomentum = () => {
        currentVel *= Math.min(0.92, 0.85 + momentum * 0.1);
        setRotation((prev) => prev + currentVel * 0.35);

        if (Math.abs(currentVel) > 0.15) {
          momentumFrameRef.current = requestAnimationFrame(applyMomentum);
        } else {
          snapToNearest();
        }
      };
      momentumFrameRef.current = requestAnimationFrame(applyMomentum);
    } else {
      snapToNearest();
    }
  };

  // Nav Arrow Handlers
  const handlePrev = () => {
    setRotation((prev) => prev + anglePerItem);
  };

  const handleNext = () => {
    setRotation((prev) => prev - anglePerItem);
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none overflow-hidden flex flex-col items-center justify-center ${className}`}
      style={{
        perspective: `${perspective}px`,
        perspectiveOrigin: '50% 50%',
      }}
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => {
        if (pauseOnHover) setIsHovered(false);
        if (isDragging) handlePointerUp();
      }}
      onMouseDown={(e) => handlePointerDown(e.clientX)}
      onMouseMove={(e) => handlePointerMove(e.clientX)}
      onMouseUp={handlePointerUp}
      onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
      onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
      onTouchEnd={handlePointerUp}
    >
      {/* 3D Cylindrical Carousel Ring */}
      <div
        className="relative transition-transform ease-out"
        style={{
          width: `${effectiveCardWidth}px`,
          height: `${cardHeight}px`,
          transformStyle: 'preserve-3d',
          transform: `
            rotateX(${tilt}deg) 
            rotateY(${rotation}deg)
            ${!introReady ? 'translateY(50px) scale(0.92)' : 'translateY(0) scale(1)'}
          `,
          transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {items.map((item, index) => {
          const itemAngle = index * anglePerItem;
          // Calculate relative angle to center (0 deg = facing viewer)
          const totalAngle = (itemAngle + rotation) % 360;
          const normalizedAngle = ((totalAngle + 180) % 360) - 180;
          const rad = (normalizedAngle * Math.PI) / 180;
          const cosAngle = Math.cos(rad); // 1 = directly in front, -1 = behind

          // Depth fade and shading
          const isFront = cosAngle > -0.15;
          const fadeOpacity = Math.max(0.15, Math.min(1, (cosAngle + 1) / 2 + (1 - depthFade) * 0.5));
          const shadeDarkness = Math.max(0, (1 - cosAngle) * 0.5 * innerShade);
          const isCenter = Math.abs(normalizedAngle) < anglePerItem * 0.5;

          return (
            <div
              key={item.id || index}
              onClick={(e) => {
                if (Math.abs(velocityRef.current) > 1) return;
                if (focusOnClick && !isCenter) {
                  e.stopPropagation();
                  rotateToIndex(index);
                }
                if (onItemClick) {
                  onItemClick(item, index);
                }
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing backface-visible"
              style={{
                width: `${effectiveCardWidth}px`,
                height: `${cardHeight}px`,
                transform: `rotateY(${itemAngle}deg) translateZ(${calculatedRadius}px)`,
                opacity: fadeOpacity,
                transition: 'opacity 0.25s ease',
                pointerEvents: isFront ? 'auto' : 'none',
              }}
            >
              <BorderGlow
                edgeSensitivity={30}
                glowColor="40 80 80"
                backgroundColor="#ffffff"
                borderRadius={cornerRadius}
                glowRadius={35}
                glowIntensity={1}
                coneSpread={25}
                animated={false}
                colors={['#10b981', '#34d399', '#f59e0b']}
                className="w-full h-full shadow-xl transition-all duration-300"
                style={{
                  transform: isCenter ? 'scale(1.03)' : 'scale(0.97)',
                }}
              >
                <div
                  className="w-full h-full relative overflow-hidden bg-white"
                  style={{
                    borderRadius: `${Math.max(0, cornerRadius - 1.5)}px`,
                  }}
                >
                {/* Custom Card Render Function OR Default Rich Review Card */}
                {renderCard ? (
                  renderCard(item, index, isCenter)
                ) : item.comment || item.authorName ? (
                  // Default Customer Review Card Format
                  <div className="w-full h-full p-3.5 sm:p-4 flex flex-col justify-between text-left bg-white space-y-2 select-none">
                    <div className="space-y-2">
                      {/* Top Author & Star Row */}
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-black text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs">
                            {item.authorName
                              ? item.authorName
                                  .split(' ')
                                  .map((n: string) => n[0])
                                  .slice(0, 2)
                                  .join('')
                                  .toUpperCase()
                              : 'VC'}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-[11px] text-black truncate max-w-[85px]">
                                {item.authorName || 'Verified Customer'}
                              </span>
                              {item.verified !== false && (
                                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                              )}
                            </div>
                            <span className="text-[9px] text-zinc-500 font-medium block truncate max-w-[90px]">
                              {item.locality || 'Lucknow'}
                            </span>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-0.5 shrink-0 pt-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-2.5 h-2.5 ${
                                s <= (item.rating || 5)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-zinc-200 text-zinc-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-1 text-[9px]">
                        {item.vehicleType && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-800 font-semibold truncate max-w-[90px]">
                            <Truck className="w-2.5 h-2.5 text-zinc-600 shrink-0" />
                            <span className="truncate">{item.vehicleType}</span>
                          </span>
                        )}
                        {item.hadHelper && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black text-white font-semibold">
                            <ShieldCheck className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                            <span>Verified Move</span>
                          </span>
                        )}
                      </div>

                      {/* Comment */}
                      <div className="space-y-0.5">
                        <p className="text-[11px] text-zinc-600 leading-snug line-clamp-3 italic">
                          "{item.comment || ''}"
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-1.5 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-500">
                      <span className="text-[9px] text-zinc-400 font-medium">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Verified Move'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onHelpfulVote && item.id) {
                            onHelpfulVote(item.id.toString());
                          }
                        }}
                        disabled={item.hasVoted}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold transition cursor-pointer ${
                          item.hasVoted
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : 'bg-zinc-100 hover:bg-black hover:text-white text-zinc-700'
                        }`}
                      >
                        <ThumbsUp className={`w-2.5 h-2.5 ${item.hasVoted ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                        <span>{item.hasVoted ? 'Helpful' : 'Like'}</span>
                        <span>{item.helpfulCount || 0}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // Default Image Item Format
                  <div className="w-full h-full relative">
                    {item.src && (
                      <img
                        src={item.src}
                        alt={item.alt || item.title || 'PATGOLITO verified logistics transport gallery image'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                    )}
                    {captions && (item.title || item.subtitle) && (
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                        {item.title && <p className="text-xs font-bold">{item.title}</p>}
                        {item.subtitle && <p className="text-[10px] text-zinc-300">{item.subtitle}</p>}
                      </div>
                    )}
                  </div>
                )}

                {/* Depth Shading Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity"
                  style={{
                    backgroundColor: fadeColor,
                    opacity: shadeDarkness,
                  }}
                />
              </div>
            </BorderGlow>
          </div>
        );
        })}
      </div>

      {/* Left / Right Nav Buttons for Precision */}
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-20">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="w-10 h-10 rounded-full bg-black/80 hover:bg-black text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition shadow-lg pointer-events-auto cursor-pointer"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="w-10 h-10 rounded-full bg-black/80 hover:bg-black text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition shadow-lg pointer-events-auto cursor-pointer"
          aria-label="Next card"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Interactive Dot Indicator Bar */}
      <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-20 pointer-events-auto">
        {items.slice(0, 10).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              rotateToIndex(idx);
            }}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              currentIndex === idx ? 'w-6 bg-black' : 'w-1.5 bg-zinc-300 hover:bg-zinc-500'
            }`}
            aria-label={`Go to card ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CircularCarousel;
