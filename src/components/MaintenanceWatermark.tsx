import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MaintenanceWatermark: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.aside
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          id="system-operational-badge"
          aria-label="Dispatch operational status notice"
          className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-40 max-w-[calc(100vw-6rem)] sm:max-w-[18rem] bg-black/95 text-white border border-zinc-800 shadow-xl rounded-2xl p-2.5 sm:px-3.5 sm:py-2.5 flex items-center gap-2.5 backdrop-blur-md"
        >
          <div className="relative flex items-center justify-center shrink-0">
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </div>

          <div className="space-y-0.5 pr-1 flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 truncate">
                Fleet Operational
              </span>
              <span className="text-[9px] bg-zinc-800 text-zinc-300 font-bold px-1.5 py-0.2 rounded shrink-0">
                Lucknow
              </span>
            </div>
            <p className="text-[10px] font-medium text-zinc-300 leading-tight">
              Booking dispatch active via 9278499882.
            </p>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss operational notice"
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800/80 transition shrink-0 cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
