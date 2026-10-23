"use client";
import React, { memo, forwardRef, useState, useEffect } from "react";
import { LiquidMetal as LiquidMetalShader } from "@paper-design/shaders-react";
import { cn } from "@/lib/utils";

// ============================================================================
// LiquidMetal - Base shader wrapper component
// ============================================================================
export interface LiquidMetalProps {
  /** Base background color of the liquid metal */
  colorBack?: string;
  /** Tint/highlight color for the chrome effect */
  colorTint?: string;
  /** Animation speed (0.1 - 2.0 recommended) */
  speed?: number;
  /** Pattern complexity/repetition (1 - 10) */
  repetition?: number;
  /** Wave distortion amount (0 - 1) */
  distortion?: number;
  /** Texture scale */
  scale?: number;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

export const LiquidMetal = memo(function LiquidMetal({
  colorBack = "#3f3f46",
  colorTint = "#ffffff",
  speed = 0.5,
  repetition = 4,
  distortion = 0.1,
  scale = 1,
  className,
  style,
}: LiquidMetalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={cn("absolute inset-0 z-0 overflow-hidden pointer-events-none", className)}
      style={style}
    >
      {mounted ? (
        <LiquidMetalShader
          colorBack={colorBack}
          colorTint={colorTint}
          speed={speed}
          repetition={repetition}
          distortion={distortion}
          softness={0}
          shiftRed={0.05}
          shiftBlue={0}
          angle={45}
          shape="none"
          scale={scale}
          fit="cover"
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-800 animate-pulse" />
      )}
    </div>
  );
});
LiquidMetal.displayName = "LiquidMetal";

// ============================================================================
// LiquidMetalButton - Premium button with liquid metal border effect
// ============================================================================
export interface LiquidMetalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children: React.ReactNode;
  /** Optional icon displayed on the left */
  icon?: React.ReactNode;
  /** Border width in pixels */
  borderWidth?: number;
  /** Configuration for the LiquidMetal shader */
  metalConfig?: Omit<LiquidMetalProps, "className" | "style">;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

export const LiquidMetalButton = forwardRef<HTMLButtonElement, LiquidMetalButtonProps>(
  (
    {
      children,
      icon,
      borderWidth = 3,
      metalConfig,
      size = "md",
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: "py-2 pl-3 pr-5 gap-2.5 text-xs",
      md: "py-3 pl-4 pr-7 gap-3 text-sm",
      lg: "py-4 pl-5 pr-9 gap-4 text-base",
    };

    const iconSizes = {
      sm: "w-7 h-7",
      md: "w-9 h-9",
      lg: "w-11 h-11",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "relative group cursor-pointer border-none bg-transparent p-0 outline-none transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none",
          className
        )}
        {...props}
      >
        <div
          className="relative rounded-2xl overflow-hidden shadow-[0_12px_30px_-8px_rgba(0,0,0,0.5)]"
          style={{ padding: borderWidth }}
        >
          {/* Liquid Metal Border Layer */}
          <LiquidMetal
            colorBack={metalConfig?.colorBack ?? "#27272a"}
            colorTint={metalConfig?.colorTint ?? "#ffffff"}
            speed={metalConfig?.speed ?? 0.4}
            repetition={metalConfig?.repetition ?? 4}
            distortion={metalConfig?.distortion ?? 0.15}
            scale={metalConfig?.scale ?? 1}
            className="absolute inset-0 z-0 rounded-2xl"
          />

          {/* Inner Button Body */}
          <div
            className={cn(
              "relative z-10 rounded-[14px] flex items-center font-bold tracking-tight",
              "bg-black text-white",
              "transition-colors duration-200",
              "group-hover:bg-zinc-900",
              sizeStyles[size]
            )}
          >
            {icon && (
              <div
                className={cn(
                  "rounded-xl flex items-center justify-center shrink-0",
                  "bg-zinc-900 border border-zinc-800 text-emerald-400",
                  "shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]",
                  iconSizes[size]
                )}
              >
                {icon}
              </div>
            )}
            <span className="font-bold tracking-tight text-white flex items-center gap-2">
              {children}
            </span>
          </div>
        </div>
      </button>
    );
  }
);
LiquidMetalButton.displayName = "LiquidMetalButton";
export default LiquidMetalButton;
