import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  ArrowRight,
  Phone,
  Home,
  Truck,
  MapPin,
  Search,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { PatgolitoLogo } from './PatgolitoLogo';
import { Breadcrumb } from './Breadcrumb';
import { BlurText, SplitText } from './AnimatedText';
import BorderGlow from './BorderGlow';
import { VehicleType } from '../types';
import { AppPageTab } from '../lib/seo';

interface NotFoundPageProps {
  onNavigate: (tab: AppPageTab) => void;
  onOpenBooking: (vehicleType?: VehicleType) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onNavigate,
  onOpenBooking,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/404';

  const quickCorridors = [
    'Gomti Nagar',
    'Transport Nagar (TP Nagar)',
    'Hazratganj',
    'Aliganj',
    'Indira Nagar',
    'Barabanki Corridor',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onOpenBooking('tata_ace');
    } else {
      onNavigate('landing');
    }
  };

  return (
    <div className="bg-white text-zinc-950 antialiased min-h-[85vh] flex flex-col justify-between">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        id="not-found-breadcrumb"
        items={[
          { label: 'Home', href: '/', tab: 'landing' },
          { label: '404 Route Not Found', href: '/404', active: true },
        ]}
        onNavigate={onNavigate}
      />

      <section className="py-12 md:py-20 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <BorderGlow
          edgeSensitivity={30}
          glowColor="40 80 80"
          backgroundColor="#000000"
          borderRadius={28}
          glowRadius={45}
          glowIntensity={1}
          coneSpread={25}
          animated={false}
          colors={['#10b981', '#34d399', '#ffffff']}
        >
          <div className="bg-black text-white rounded-3xl p-8 sm:p-12 md:p-16 border border-zinc-800 shadow-2xl relative overflow-hidden">
            {/* Top Operational Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-8">
              <PatgolitoLogo size="md" />

              <div className="inline-flex items-center gap-2.5 bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-full self-start sm:self-auto">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-zinc-300">
                  Status 404 • Unregistered Transit Route
                </span>
              </div>
            </div>

            {/* Central Graphic & Core Message */}
            <div className="pt-10 pb-8 space-y-6 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 text-emerald-400 mx-auto shadow-inner">
                <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '24s' }} />
              </div>

              <div className="space-y-3">
                <p className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400">
                  HAR JAGAH • HAR SAMAN • PATGOLITO KE SATH
                </p>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                  <SplitText text="Delivery Route" /> <br />
                  <span className="text-zinc-400">Not Found.</span>
                </h1>

                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal pt-2">
                  <BlurText
                    text={`The dispatch link "${currentPath}" is not mapped on our active Lucknow logistics grid. The requested route may have been moved, renamed, or completed.`}
                    delay={0.1}
                  />
                </p>
              </div>

              {/* Primary Call-to-Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('landing')}
                  className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-black font-extrabold text-sm px-7 py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Home className="w-4 h-4 text-black" />
                  <span>Return to Home Terminal</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onOpenBooking('tata_ace')}
                  className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm px-7 py-3.5 rounded-xl transition border border-zinc-700 flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>Book Transport Fleet</span>
                </motion.button>

                <motion.a
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href="tel:9278499882"
                  className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition border border-zinc-800 flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call 9278499882</span>
                </motion.a>
              </div>
            </div>

            {/* Quick Interactive Location / Service Search */}
            <div className="mt-8 pt-8 border-t border-zinc-800/80 max-w-xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 focus-within:border-white transition">
                  <Search className="w-4 h-4 text-zinc-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Lucknow area (e.g., Aliganj, Transport Nagar)..."
                    className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 ml-2 shrink-0 cursor-pointer"
                  >
                    Locate
                  </button>
                </div>
              </form>

              {/* Active Lucknow Corridors Quick-Pills */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="text-[11px] font-bold text-zinc-500 mr-1">Active Hubs:</span>
                {quickCorridors.map((corridor) => (
                  <button
                    key={corridor}
                    type="button"
                    onClick={() => onOpenBooking('tata_ace')}
                    className="text-[11px] font-medium text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{corridor}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Directory Matrix */}
            <div className="mt-12 pt-8 border-t border-zinc-900 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Fleet Transport</p>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  <li>
                    <button
                      onClick={() => onOpenBooking('tata_ace')}
                      className="hover:text-emerald-400 transition cursor-pointer"
                    >
                      Tata Ace Mini Truck
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onOpenBooking('three_wheeler_goods')}
                      className="hover:text-emerald-400 transition cursor-pointer"
                    >
                      3-Wheeler Goods
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onOpenBooking('e_loader')}
                      className="hover:text-emerald-400 transition cursor-pointer"
                    >
                      E-Loader Cargo
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Company</p>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  <li>
                    <a
                      href="/about"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('about');
                      }}
                      className="hover:text-emerald-400 transition cursor-pointer"
                    >
                      About PATGOLITO
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('landing');
                      }}
                      className="hover:text-emerald-400 transition cursor-pointer"
                    >
                      Coverage Map
                    </a>
                  </li>
                  <li>
                    <span className="text-zinc-500">Lucknow Operations</span>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Legal & Trust</p>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  <li>
                    <a
                      href="/terms"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('terms');
                      }}
                      className="hover:text-emerald-400 transition cursor-pointer"
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="/privacy"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('privacy');
                      }}
                      className="hover:text-emerald-400 transition cursor-pointer"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/delete-account"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('delete-account');
                      }}
                      className="hover:text-emerald-400 transition cursor-pointer"
                    >
                      Account Deletion
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Dispatch Desk</p>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  <li>
                    <a href="tel:9278499882" className="text-emerald-400 font-bold hover:underline">
                      +91-9278499882
                    </a>
                  </li>
                  <li className="text-[11px] text-zinc-500">24/7 Intra-City Hotline</li>
                  <li className="text-[11px] text-zinc-500">Lucknow, Uttar Pradesh</li>
                </ul>
              </div>
            </div>

            {/* Corporate Transparency Seal */}
            <div className="mt-8 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Operated by Zoago Logistics Solutions Private Limited</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-zinc-300 inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restart Session</span>
                </button>
                <span>•</span>
                <span className="text-zinc-600">Route Code: ERR_404_NOT_FOUND</span>
              </div>
            </div>
          </div>
        </BorderGlow>
      </section>
    </div>
  );
};
