import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  ArrowRight
} from 'lucide-react';
import { PatgolitoLogo } from './PatgolitoLogo';
import { AppPageTab } from '../lib/seo';
import { AnimatedButton } from './AnimatedButton';

interface HeaderProps {
  activeTab: AppPageTab;
  setActiveTab: (tab: AppPageTab) => void;
  onOpenNewBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewBooking,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Why PATGOLITO', href: '#why-patgolito' },
    { label: 'Compare Apps', href: '#porter-alternative' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Business', href: '#business' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (activeTab !== 'landing') {
      setActiveTab('landing');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200 text-zinc-900 transition-all">
      {/* Main Clean Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 sm:h-22 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-6 shrink-0 py-2">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center text-left cursor-pointer transition hover:opacity-95"
            aria-label="PATGOLITO Home"
          >
            <PatgolitoLogo size="md" variant="full" />
          </a>
        </div>

        {/* Clean Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-zinc-700">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="text-zinc-700 hover:text-black transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('about');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`transition-colors cursor-pointer ${
              activeTab === 'about' ? 'text-black font-bold' : 'text-zinc-700 hover:text-black'
            }`}
          >
            About PATGOLITO
          </a>
        </nav>

        {/* Right CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          {activeTab !== 'landing' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('landing')}
              className="text-xs font-bold text-zinc-700 hover:text-black px-3.5 py-2 rounded-xl transition hover:bg-zinc-100 cursor-pointer"
            >
              Back to Overview
            </motion.button>
          )}

          <AnimatedButton
            onClick={onOpenNewBooking}
            className="bg-black hover:bg-zinc-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl border border-zinc-800 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            {/* Glowing Emerald Pulse Dot */}
            <span className="relative flex h-2 w-2 mr-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>

            <span>Book a Vehicle</span>

            <ArrowRight className="w-3.5 h-3.5 text-emerald-400 ml-0.5" />
          </AnimatedButton>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={onOpenNewBooking}
            className="relative group overflow-hidden bg-black text-white font-bold text-xs px-3.5 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 border border-zinc-800 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Book</span>
            <ArrowRight className="w-3 h-3 text-emerald-400" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-zinc-800 rounded-lg hover:bg-zinc-100 transition cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer with smooth animation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="sm:hidden bg-white border-b border-zinc-200 px-6 py-6 space-y-4 shadow-xl overflow-hidden"
          >
            <div className="space-y-3 text-base font-bold text-zinc-800">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="block w-full text-left py-1 text-zinc-800 hover:text-black cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/about"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('about');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-1 text-zinc-800 hover:text-black cursor-pointer"
              >
                About PATGOLITO
              </a>
            </div>

            <div className="pt-4 border-t border-zinc-100">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onOpenNewBooking();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-black text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book a Vehicle</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
