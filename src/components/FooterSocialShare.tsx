import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Share2,
  Instagram,
  Facebook,
  Twitter,
  Pin,
  AtSign,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { SocialFlipButton } from './SocialFlipButton';

interface FooterSocialShareProps {
  onToast?: (message: string) => void;
}

export const FooterSocialShare: React.FC<FooterSocialShareProps> = ({ onToast }) => {
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const shareData = {
    title: 'PATGOLITO | Best Transport & Logistics Company in Lucknow',
    text: 'Book verified transport vehicles across Lucknow on PATGOLITO! Fast intra-city goods transport with transparent distance fares.',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://patgolito.com',
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url,
        });
        if (onToast) onToast('Shared successfully!');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      setCopied(true);
      if (onToast) onToast('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/patgolito',
      ariaLabel: 'Follow PATGOLITO on Instagram',
      colorHover: 'hover:text-pink-400 hover:border-pink-500/40',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
      ariaLabel: 'Share PATGOLITO on Facebook',
      colorHover: 'hover:text-emerald-400 hover:border-emerald-500/40',
    },
    {
      name: 'Threads',
      icon: AtSign,
      url: `https://www.threads.net/intent/post?text=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`,
      ariaLabel: 'Share on Threads',
      colorHover: 'hover:text-white hover:border-zinc-500',
    },
    {
      name: 'X',
      icon: Twitter,
      url: `https://x.com/intent/post?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`,
      ariaLabel: 'Share on X (Twitter)',
      colorHover: 'hover:text-white hover:border-zinc-500',
    },
    {
      name: 'Pinterest',
      icon: Pin,
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareData.url)}&description=${encodeURIComponent(shareData.text)}`,
      ariaLabel: 'Save on Pinterest',
      colorHover: 'hover:text-red-400 hover:border-red-500/40',
    },
  ];

  return (
    <div className="space-y-4" id="patgolito-footer-social-share">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title / Eyebrow */}
        <div>
          <p className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
            <span>Connect & Share</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Spread the word or reach out across platforms
          </p>
        </div>

        {/* Action Controls: Native Share & Social Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Main Native Share Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNativeShare}
            id="footer-native-share-btn"
            aria-label="Share PATGOLITO app via native sharing"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share App</span>
          </motion.button>

          {/* Quick Copy Link Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={copyToClipboard}
            id="footer-copy-link-btn"
            aria-label="Copy PATGOLITO link"
            className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700/80 text-xs font-medium px-3 py-2 rounded-xl transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy Link</span>
              </>
            )}
          </motion.button>

          {/* Interactive 3D Social Flip Buttons Strip */}
          <div className="pl-1 sm:pl-2 border-l border-zinc-800 flex items-center">
            <SocialFlipButton />
          </div>
        </div>
      </div>

      {/* Fallback Share Modal if Native Share is not supported or user clicks on desktop */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-md w-full text-white shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-base font-bold">Share PATGOLITO</h3>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Share Lucknow’s trusted moving & helper platform
                  </p>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition"
                  aria-label="Close share dialog"
                >
                  ✕
                </button>
              </div>

              {/* Direct share platform options */}
              <div className="grid grid-cols-5 gap-2 text-center">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-emerald-400 group-hover:bg-zinc-700 transition">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-medium text-zinc-400 group-hover:text-white truncate w-full">
                        {social.name}
                      </span>
                    </a>
                  );
                })}
              </div>

              {/* Link copy field */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Page Link
                </label>
                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-2">
                  <input
                    type="text"
                    readOnly
                    value={shareData.url}
                    className="bg-transparent text-xs text-zinc-300 px-2 py-1 w-full outline-hidden"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 font-medium transition"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
