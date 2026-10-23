"use client";
import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  shineColor?: string;
  as?: string;
}

/**
 * AnimatedButton
 * High-performance button featuring text shine mask and animated border shine effect.
 * Uses PATGOLITO's high-contrast theme with smooth spring physics on hover and press.
 */
export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children = "Browse Components",
  className = "",
  shineColor,
  as = "button",
  onClick,
  disabled,
  type = "button",
  ...rest
}) => {
  const Component = (motion as any)[as] || motion.button;

  return (
    <Component
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 0.5,
      }}
      className={cn(
        "group inline-flex items-center justify-center px-6 py-3 rounded-xl relative overflow-hidden bg-black border border-zinc-800",
        "text-white font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none shadow-md hover:shadow-xl",
        "[--shine:rgba(255,255,255,.7)]",
        className
      )}
      style={shineColor ? ({ "--shine": shineColor } as React.CSSProperties) : undefined}
      {...(rest as any)}
    >
      {/* Text with shine mask */}
      <motion.span
        className="tracking-wide flex items-center justify-center gap-2 h-full w-full relative z-10"
        style={{
          WebkitMaskImage:
            "linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))",
          maskImage:
            "linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))",
        }}
        initial={{ ["--mask-x" as any]: "100%" } as any}
        animate={{ ["--mask-x" as any]: "-100%" } as any}
        transition={{
          repeat: Infinity,
          duration: 1.4,
          ease: "linear",
          repeatDelay: 1.8,
        }}
      >
        {children}
      </motion.span>

      {/* Border shine effect uses the --shine variable */}
      <motion.span
        className="block absolute inset-0 rounded-xl p-px pointer-events-none"
        style={{
          background:
            "linear-gradient(-75deg, transparent 30%, var(--shine) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
        }}
        initial={{ backgroundPosition: "100% 0", opacity: 0 }}
        animate={{ backgroundPosition: ["100% 0", "0% 0"], opacity: [0, 1, 0] }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 1.8,
        }}
      />
    </Component>
  );
};

export default AnimatedButton;
