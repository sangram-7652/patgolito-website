import React, { useState, useRef, useCallback } from 'react';

export interface BorderGlowProps {
  children?: React.ReactNode;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number | string;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  className?: string;
  style?: React.CSSProperties;
  borderWidth?: number;
}

// Strict PATGOLITO Brand Guideline: NO BLUE COLOR ANYWHERE
function sanitizeBrandColors(rawColors?: string[]): string[] {
  const fallback = ['#10b981', '#34d399', '#f59e0b', '#ffffff'];
  if (!rawColors || rawColors.length === 0) return fallback;

  return rawColors.map((c) => {
    const clean = c.toLowerCase().trim();
    if (
      clean === '#38bdf8' ||
      clean.includes('blue') ||
      clean === '#60a5fa' ||
      clean === '#3b82f6' ||
      clean === '#0284c7'
    ) {
      return '#10b981'; // Cleanly replace any blue with official emerald
    }
    // RGB high-blue suppression
    if (clean.startsWith('#') && (clean.length === 7 || clean.length === 4)) {
      const full =
        clean.length === 4
          ? '#' + clean[1] + clean[1] + clean[2] + clean[2] + clean[3] + clean[3]
          : clean;
      const r = parseInt(full.slice(1, 3), 16) || 0;
      const g = parseInt(full.slice(3, 5), 16) || 0;
      const b = parseInt(full.slice(5, 7), 16) || 0;
      if (b > r * 1.3 && b > g * 1.3 && b > 130) {
        return '#10b981'; // Neutralize to emerald
      }
    }
    return c;
  });
}

export const BorderGlow: React.FC<BorderGlowProps> = ({
  children,
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor,
  borderRadius = 24,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  animated = false,
  colors,
  className = '',
  style = {},
  borderWidth = 1.5,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [isHovered, setIsHovered] = useState(false);

  const activeColors = sanitizeBrandColors(colors);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setMousePos({ x: -200, y: -200 });
  }, []);

  // Compute radius styling
  const radiusValue = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;
  const innerRadiusValue =
    typeof borderRadius === 'number'
      ? `${Math.max(0, borderRadius - borderWidth)}px`
      : borderRadius;

  // Build reactive gradient
  const gradientStops = activeColors.join(', ');
  const glowDiameter = glowRadius * 4;

  const borderStyle: React.CSSProperties = isHovered
    ? {
        background: `radial-gradient(${glowDiameter}px circle at ${mousePos.x}px ${mousePos.y}px, ${gradientStops}, rgba(228, 228, 231, 0.5) 75%, transparent 100%)`,
        opacity: glowIntensity,
      }
    : animated
    ? {
        background: `conic-gradient(from 0deg, ${gradientStops}, ${activeColors[0]})`,
        opacity: 0.6 * glowIntensity,
      }
    : {
        background: 'rgba(228, 228, 231, 0.7)',
        opacity: 1,
      };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative group transition-all duration-300 ${className}`}
      style={{
        borderRadius: radiusValue,
        padding: `${borderWidth}px`,
        ...style,
      }}
    >
      {/* Interactive Reactive Border Layer */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-200"
        style={{
          borderRadius: radiusValue,
          ...borderStyle,
        }}
      />

      {/* Subtle Ambient Outer Aura on Hover */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none filter blur-md -z-10 transition-opacity duration-300"
          style={{
            borderRadius: radiusValue,
            background: `radial-gradient(${glowDiameter * 1.2}px circle at ${mousePos.x}px ${mousePos.y}px, ${activeColors[0]}44, ${activeColors[1] || activeColors[0]}22, transparent 80%)`,
            opacity: 0.7 * glowIntensity,
          }}
        />
      )}

      {/* Inner Card Content Container */}
      <div
        className="relative z-10 w-full h-full transition-colors duration-200"
        style={{
          borderRadius: innerRadiusValue,
          backgroundColor: backgroundColor || 'inherit',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default BorderGlow;
