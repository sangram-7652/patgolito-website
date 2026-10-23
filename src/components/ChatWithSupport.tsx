import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';

interface ChatWithSupportProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const ChatWithSupport: React.FC<ChatWithSupportProps> = ({
  phoneNumber = '919278499882',
  defaultMessage = 'Hello PATGOLITO Support! I need assistance with booking a transport vehicle or helper in Lucknow.',
}) => {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: 0.5 }}
      className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6 print:hidden"
    >
      <motion.a
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.96 }}
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with PATGOLITO Support on WhatsApp"
        id="floating-chat-with-support-btn"
        className="group relative flex items-center gap-2.5 sm:gap-3 bg-zinc-950 hover:bg-black text-white px-3.5 sm:px-5 py-2.5 sm:py-3.5 rounded-full shadow-2xl border border-zinc-800/90 transition-all duration-200 hover:shadow-emerald-950/40 hover:border-emerald-500/60 cursor-pointer"
      >
        {/* Emerald Glow & Pulse Icon */}
        <div className="relative flex items-center justify-center shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md group-hover:bg-emerald-500 transition-colors">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500 border-2 border-zinc-950"></span>
          </span>
        </div>

        {/* Text Container */}
        <div className="flex flex-col items-start pr-1">
          <span className="text-[9px] sm:text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-none">
            Direct Helpline
          </span>
          <span className="text-xs sm:text-sm font-black text-white tracking-tight mt-0.5 whitespace-nowrap">
            WhatsApp Support
          </span>
        </div>
      </motion.a>
    </motion.div>
  );
};
