import React from 'react';

interface PatgolitoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'badge';
  lightText?: boolean;
}

export const PatgolitoLogo: React.FC<PatgolitoLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  lightText = false,
}) => {
  const heightSizes = {
    sm: 'h-9 sm:h-10',
    md: 'h-12 sm:h-14 lg:h-15',
    lg: 'h-16 sm:h-18 lg:h-20',
    xl: 'h-24 sm:h-28',
  };

  const imageSrc = '/patgolito_logo.png';
  const remoteFallback = 'https://i.ibb.co/VW95dCD8/final-yes-to-logo.jpg';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Patgolito Brand Logo with WebP, CLS protection & Descriptive Alt */}
      <div className="relative shrink-0 flex items-center">
        <picture className="flex items-center">
          <source srcSet="/patgolito_logo.webp" type="image/webp" />
          <source srcSet="/patgolito_logo.png" type="image/png" />
          <img
            src={imageSrc}
            width="320"
            height="80"
            onError={(e) => {
              if (e.currentTarget.src !== remoteFallback) {
                e.currentTarget.src = remoteFallback;
              }
            }}
            alt="PATGOLITO - Best Transport & Logistics Company in Lucknow | Verified Mini Truck & Tempo Hire"
            className={`${heightSizes[size]} w-auto max-w-[280px] sm:max-w-[420px] object-contain rounded-md transition-transform duration-200 hover:scale-[1.02]`}
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </picture>
      </div>

      {variant === 'badge' && (
        <div className="hidden sm:flex flex-col">
          <div className="flex items-center rounded overflow-hidden text-[10px] font-black uppercase tracking-wider border border-zinc-300">
            <span className="bg-black text-white px-2 py-0.5">Samaan Aapka</span>
            <span className="bg-emerald-600 text-white px-2 py-0.5">Mehnat Hamari!</span>
          </div>
        </div>
      )}
    </div>
  );
};
