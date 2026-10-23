import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

// ==========================================
// 1. BLUR TEXT ANIMATION
// Words softly resolve from gentle optical blur to crisp, legible focus
// ==========================================
interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  by?: 'words' | 'letters';
  once?: boolean;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  className = '',
  delay = 0,
  stagger = 0.03,
  by = 'words',
  once = true,
}) => {
  const parts = by === 'words' ? text.split(' ') : text.split('');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: {
      filter: 'blur(8px)',
      opacity: 0,
      y: 6,
    },
    visible: {
      filter: 'blur(0px)',
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1] as const, // Smooth organic deceleration
      },
    },
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-20px' }}
      aria-label={text}
    >
      {parts.map((part, idx) => (
        <motion.span
          key={idx}
          variants={itemVariants}
          className="inline-block mr-[0.25em] last:mr-0"
          aria-hidden="true"
        >
          {part}
        </motion.span>
      ))}
    </motion.span>
  );
};

// ==========================================
// 2. FOLD TEXT ANIMATION
// Gentle 3D dimensional unfold with subtle editorial perspective
// ==========================================
interface FoldTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  direction?: 'up' | 'down';
  once?: boolean;
}

export const FoldText: React.FC<FoldTextProps> = ({
  text,
  className = '',
  delay = 0,
  stagger = 0.035,
  direction = 'up',
  once = true,
}) => {
  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      rotateX: direction === 'up' ? -25 : 25,
      y: direction === 'up' ? 8 : -8,
      transformOrigin: direction === 'up' ? '50% 100%' : '50% 0%',
    },
    visible: {
      opacity: 1,
      rotateX: 0,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const, // Refined gentle unfold
      },
    },
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      style={{ perspective: 900, transformStyle: 'preserve-3d' }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-20px' }}
      aria-label={text}
    >
      {words.map((word, idx) => (
        <span
          key={idx}
          className="inline-block overflow-hidden py-0.5 mr-[0.25em] last:mr-0"
        >
          <motion.span
            variants={wordVariants}
            className="inline-block"
            aria-hidden="true"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

// ==========================================
// 3. SPLIT TEXT ANIMATION
// High-precision kinetic typography with masked slide-up entrance
// ==========================================
interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 0,
  stagger = 0.035,
  once = true,
}) => {
  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      y: '100%',
      opacity: 0,
    },
    visible: {
      y: '0%',
      opacity: 1,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1] as const, // Clean editorial slide
      },
    },
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-20px' }}
      aria-label={text}
    >
      {words.map((word, idx) => (
        <span
          key={idx}
          className="inline-block overflow-hidden align-top py-0.5 mr-[0.25em] last:mr-0"
        >
          <motion.span
            variants={wordVariants}
            className="inline-block"
            aria-hidden="true"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

// ==========================================
// 4. TYPEWRITER / TYPING TEXT ANIMATION
// High-fidelity, smooth typewriter animation with blinking cursor and optional highlights
// ==========================================
interface TypewriterTextProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
  className?: string;
  cursorClassName?: string;
  showCursor?: boolean;
  highlightWords?: string[];
  highlightClassName?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  words,
  typingSpeed = 50,
  deletingSpeed = 25,
  pauseDuration = 2600,
  loop = true,
  className = '',
  cursorClassName = 'bg-emerald-500',
  showCursor = true,
  highlightWords = [],
  highlightClassName = 'underline decoration-4 underline-offset-8 decoration-emerald-500',
}) => {
  const safeWords = words.length > 0 ? words : [''];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState(safeWords[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);

  useEffect(() => {
    const activeTargetWord = safeWords[currentWordIndex % safeWords.length] || '';

    if (isWaiting) {
      const timer = setTimeout(() => {
        setIsWaiting(false);
        if (loop && safeWords.length > 1) {
          setIsDeleting(true);
        }
      }, pauseDuration);
      return () => clearTimeout(timer);
    }

    if (isDeleting) {
      if (currentText.length > 0) {
        const timer = setTimeout(() => {
          setCurrentText(activeTargetWord.substring(0, currentText.length - 1));
        }, deletingSpeed);
        return () => clearTimeout(timer);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % safeWords.length);
      }
    } else {
      if (currentText.length < activeTargetWord.length) {
        const timer = setTimeout(() => {
          setCurrentText(activeTargetWord.substring(0, currentText.length + 1));
        }, typingSpeed);
        return () => clearTimeout(timer);
      } else {
        setIsWaiting(true);
      }
    }
  }, [currentText, isDeleting, isWaiting, currentWordIndex, safeWords, typingSpeed, deletingSpeed, pauseDuration, loop]);

  // Render text with styled highlight spans if matching target highlight words
  const renderFormatted = () => {
    if (!highlightWords || highlightWords.length === 0) {
      return currentText;
    }

    for (const hw of highlightWords) {
      const idx = currentText.indexOf(hw);
      if (idx !== -1) {
        const before = currentText.substring(0, idx);
        const match = currentText.substring(idx, idx + hw.length);
        const after = currentText.substring(idx + hw.length);
        return (
          <>
            {before}
            <span className={highlightClassName}>{match}</span>
            {after}
          </>
        );
      }

      // Check partial matches at the tail
      for (let len = hw.length - 1; len >= 3; len--) {
        const sub = hw.substring(0, len);
        if (currentText.endsWith(sub)) {
          const before = currentText.substring(0, currentText.length - len);
          return (
            <>
              {before}
              <span className={highlightClassName}>{sub}</span>
            </>
          );
        }
      }
    }

    return currentText;
  };

  return (
    <span
      className={`inline-flex items-baseline flex-wrap ${className}`}
      aria-label={safeWords[currentWordIndex % safeWords.length]}
    >
      <span className="inline" aria-hidden="true">
        {renderFormatted()}
      </span>
      {showCursor && (
        <span
          className={`inline-block w-[3px] sm:w-[4px] h-[0.85em] ${cursorClassName} ml-1 align-baseline rounded-full animate-pulse`}
          aria-hidden="true"
        />
      )}
    </span>
  );
};
