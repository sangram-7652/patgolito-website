"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  FaGithub,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaDiscord,
} from "react-icons/fa";

export interface SocialItem {
  letter: string;
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
}

interface SocialFlipButtonProps {
  items?: SocialItem[];
  className?: string;
  itemClassName?: string;
  frontClassName?: string;
  backClassName?: string;
}

export const defaultSocialItems: SocialItem[] = [
  { letter: "C", icon: <FaGithub />, label: "Github", href: "#" },
  { letter: "O", icon: <FaTwitter />, label: "Twitter", href: "https://x.com/patgolito" },
  { letter: "N", icon: <FaLinkedin />, label: "LinkedIn", href: "https://linkedin.com/company/patgolito" },
  { letter: "T", icon: <FaInstagram />, label: "Instagram", href: "https://instagram.com/patgolito" },
  { letter: "A", icon: <FaFacebook />, label: "Facebook", href: "https://facebook.com/patgolito" },
  { letter: "C", icon: <FaEnvelope />, label: "Email", href: "mailto:support@patgolito.com" },
  { letter: "T", icon: <FaDiscord />, label: "Discord", href: "#" },
];

interface SocialFlipNodeProps {
  item: SocialItem;
  index: number;
  isHovered: boolean;
  setTooltipIndex: (val: number | null) => void;
  tooltipIndex: number | null;
  itemClassName?: string;
  frontClassName?: string;
  backClassName?: string;
}

const SocialFlipNode: React.FC<SocialFlipNodeProps> = ({
  item,
  index,
  isHovered,
  setTooltipIndex,
  tooltipIndex,
  itemClassName,
  frontClassName,
  backClassName,
}) => {
  const content = (
    <>
      <AnimatePresence>
        {isHovered && tooltipIndex === index && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8, x: "-50%" }}
            animate={{ opacity: 1, y: -50, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 10, scale: 0.8, x: "-50%" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-1/2 z-50 whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xl pointer-events-none"
          >
            {item.label}
            {/* Arrow */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-neutral-900" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative h-full w-full"
        initial={false}
        animate={{ rotateY: isHovered ? 180 : 0 }}
        transition={{
          duration: 0.8,
          type: "spring",
          stiffness: 120,
          damping: 15,
          delay: index * 0.08,
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front - Letter */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-lg bg-zinc-900 text-lg font-bold text-white shadow-sm border border-zinc-800",
            frontClassName
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          {item.letter}
        </div>

        {/* Back - Icon */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-lg bg-black text-lg text-emerald-400 border border-emerald-500/30",
            backClassName
          )}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {item.icon}
        </div>
      </motion.div>
    </>
  );

  const sharedProps = {
    className: cn("relative h-10 w-10 cursor-pointer block select-none", itemClassName),
    style: { perspective: "1000px" },
    onMouseEnter: () => setTooltipIndex(index),
    onMouseLeave: () => setTooltipIndex(null),
    "aria-label": item.label,
  };

  if (item.href) {
    return (
      <a
        {...sharedProps}
        href={item.href}
        target={item.href.startsWith("mailto:") ? undefined : "_blank"}
        rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      {...sharedProps}
      onClick={item.onClick}
    >
      {content}
    </button>
  );
};

export function SocialFlipButton({
  items = defaultSocialItems,
  className,
  itemClassName,
  frontClassName,
  backClassName,
}: SocialFlipButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);

  return (
    <div
      className={cn("flex items-center gap-2 flex-wrap", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTooltipIndex(null);
      }}
    >
      {items.map((item, index) => (
        <SocialFlipNode
          key={`${item.letter}-${index}`}
          item={item}
          index={index}
          isHovered={isHovered}
          setTooltipIndex={setTooltipIndex}
          tooltipIndex={tooltipIndex}
          itemClassName={itemClassName}
          frontClassName={frontClassName}
          backClassName={backClassName}
        />
      ))}
    </div>
  );
}

export default SocialFlipButton;
