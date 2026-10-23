import React, { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  ChevronDown,
  Building2,
  Package,
  Boxes,
  Check,
  Radio,
  Phone,
  CheckCircle,
  X,
} from 'lucide-react';
import { VehicleType } from '../types';
import { PatgolitoLogo } from './PatgolitoLogo';
import { CoverageMap } from './CoverageMap';
import { Breadcrumb } from './Breadcrumb';
import { BlurText, FoldText, SplitText, TypewriterText } from './AnimatedText';
import BorderGlow from './BorderGlow';
import { ScrollDissolveReveal } from './ScrollDissolveReveal';
import { AnimatedButton } from './AnimatedButton';
import { CreepyButton } from './CreepyButton';
import { LiquidMetalButton } from './LiquidMetalButton';
import StatsCounter from './StatsCounter';

// Lazy load ReviewsSection for enhanced initial page load SEO & Core Web Vitals
const ReviewsSection = lazy(() =>
  import('./ReviewsSection').then((module) => ({ default: module.ReviewsSection }))
);

interface LandingPageProps {
  onOpenBooking: (vehicleType?: VehicleType, needsHelper?: boolean) => void;
  onNavigate?: (tab: 'landing' | 'about' | 'terms' | 'privacy') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenBooking, onNavigate }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqList = [
    {
      q: 'How does PATGOLITO goods transport work?',
      a: 'PATGOLITO connects you directly with verified commercial transport vehicles (Tata Ace, 3-Wheelers, E-Loaders, 2-Wheelers) for reliable, punctual door-to-door goods movement across Lucknow. You receive transparent upfront fares before confirming.',
    },
    {
      q: 'Which locations do you cover?',
      a: 'PATGOLITO operates across Lucknow—covering residential neighborhoods, apartment complexes, commercial markets, and industrial warehouse corridors. We are also preparing direct fleet operations for Barabanki.',
    },
    {
      q: 'How are the trip charges calculated?',
      a: 'Our pricing is fully transparent with zero hidden fees. It includes the vehicle base fare and a per-kilometer rate based on calculated road distance. You receive the calculated upfront estimate before submitting your booking enquiry.',
    },
    {
      q: 'Can I book PATGOLITO for business and commercial deliveries?',
      a: 'Yes. We provide scheduled deliveries, multi-drop logistics, and GST invoices for retailers, distributors in Transport Nagar, e-commerce merchants, and manufacturing units across Lucknow.',
    },
    {
      q: 'Why is PATGOLITO the best alternative to leading transport apps in Lucknow?',
      a: 'Unlike generic transport booking apps where drivers frequently cancel or demand extra cash bargaining on arrival, PATGOLITO operates with a verified local fleet, guaranteed vehicle dispatch, 100% upfront fixed road-calibrated fares, 1-tap helper options (+₹300 flat), and direct human dispatch support at 9278499882.',
    },
    {
      q: 'How do PATGOLITO mini truck and tempo rental rates compare to other transport apps?',
      a: 'PATGOLITO provides clear, upfront base pricing starting at ₹49 for two-wheelers, ₹149 for 3-wheelers/E-loaders, and ₹249 for Tata Ace mini trucks. Every rupee is calculated via verified road-distance without hidden surge multipliers or post-trip cash demands.',
    },
    {
      q: 'Does PATGOLITO provide helpers and labour for loading and unloading compared to other apps?',
      a: 'Yes. With PATGOLITO, you can easily add 1 or 2 verified loading helpers with a single tap during booking for ₹300 flat per helper, ensuring careful handling of furniture, appliances, and commercial cartons straight into your room or warehouse.',
    },
    {
      q: 'How fast will the vehicle arrive?',
      a: 'Vehicles typically arrive within 20 to 40 minutes across Lucknow depending on traffic and vehicle availability in your pickup locality. You can coordinate directly with our dispatch desk at 9278499882.',
    },
  ];

  return (
    <div className="bg-white text-zinc-950 antialiased">
      {/* Search Engine Optimized Semantic Breadcrumb Navigation */}
      <Breadcrumb
        id="landing-breadcrumb"
        items={[
          { label: 'Home', href: '/', tab: 'landing' },
          { label: 'Transport & Logistics Lucknow', href: '/', active: true },
        ]}
        onNavigate={onNavigate}
      />

      {/* ============================================================ */}
      {/* 1. HERO SECTION: Official PATGOLITO Commercial Identity */}
      {/* ============================================================ */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 border-b border-zinc-200 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="lg:col-span-7 space-y-7"
            >
              {/* Trust & Tagline Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-flex items-center gap-3 bg-black text-white px-4 py-2 rounded-2xl shadow-sm border border-zinc-800"
              >
                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Your Trust. Our Promise.</p>
                  <p className="text-xs font-bold text-white">
                    <BlurText text="Saman Aapka, Mehnat Hamari" delay={0.1} />
                  </p>
                </div>
              </motion.div>

              {/* Bold Primary Headline Matching Official Poster */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-3"
              >
                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black text-black tracking-tight leading-[1.05] min-h-[2.1em] sm:min-h-[2.2em]">
                  <span className="block">Every Delivery,</span>
                  <span className="inline-block">
                    <TypewriterText
                      words={[
                        'Handled With Care & Trust.',
                        'Verified Fleets & Fair Fares.',
                        'Prompt Dispatch in Lucknow.',
                        'Zero Driver Bargaining.',
                      ]}
                      typingSpeed={50}
                      deletingSpeed={25}
                      pauseDuration={2600}
                      loop={true}
                      highlightWords={['Care & Trust.', 'Verified Fleets & Fair Fares.', 'in Lucknow.', 'Bargaining.']}
                      highlightClassName="underline decoration-4 underline-offset-8 decoration-emerald-500"
                      cursorClassName="bg-emerald-500"
                    />
                  </span>
                </h1>
                <p className="text-lg sm:text-xl font-medium text-zinc-600">
                  <BlurText text="From small parcels to large shipments, we deliver everything that matters." delay={0.25} />
                </p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed max-w-xl"
              >
                On-demand mini trucks, commercial pickups, and verified logistics fleets across Lucknow.
                Zero haggling, transparent upfront fares, and prompt vehicle dispatch.
              </motion.p>

              {/* Official Brand Entity Identity & Search Disambiguation */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 flex items-center gap-2.5 max-w-xl"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>
                  <strong className="text-zinc-950 font-bold">PATGOLITO™</strong> is an official registered Indian logistics and goods transport brand operated by <strong>Zoago Logistics Solutions Private Limited</strong> in Lucknow, Uttar Pradesh.
                </span>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2"
              >
                <AnimatedButton
                  onClick={() => onOpenBooking('tata_ace', false)}
                  className="bg-black hover:bg-zinc-900 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center gap-3 cursor-pointer border border-zinc-800"
                >
                  <span>Book Your Delivery Now</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </AnimatedButton>

                <CreepyButton
                  onClick={() => {
                    const el = document.getElementById('services');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto"
                  coverClassName="bg-zinc-900 hover:bg-black border border-zinc-800 text-white font-bold text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    <span>Explore Fleet &amp; Rates</span>
                  </span>
                </CreepyButton>
              </motion.div>

              {/* Verified Trust Guarantees */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="pt-6 border-t border-zinc-100"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-zinc-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Verified Fleets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Upfront Fares</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Helper Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Prompt Dispatch</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Visual Column: High-Tech PATGOLITO Dispatch Terminal & Interactive Booking Matrix */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <BorderGlow
                edgeSensitivity={30}
                glowColor="40 80 80"
                backgroundColor="#09090b"
                borderRadius={24}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                animated={false}
                colors={['#10b981', '#34d399', '#f59e0b']}
              >
                <div className="rounded-3xl bg-zinc-950 text-white p-6 sm:p-8 shadow-2xl border border-zinc-800 space-y-6">
                  {/* Official Logo Banner & Live Telemetry Stats (Optimized for Mobile & Desktop) */}
                  <div className="space-y-4 border-b border-zinc-800 pb-5">
                    <div className="flex items-center justify-between gap-3">
                      <PatgolitoLogo size="md" />
                      <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-400 shrink-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>Live in Lucknow</span>
                      </div>
                    </div>

                    {/* PATGOLITO Current Situation Live Stats Telemetry */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      <div className="bg-zinc-900/90 border border-zinc-800/90 p-2.5 rounded-xl text-left space-y-0.5">
                        <div className="text-base sm:text-lg font-black text-white tracking-tight flex items-center">
                          <StatsCounter value={1240} suffix="+" duration={1.8} className="text-white" />
                        </div>
                        <p className="text-[10px] font-medium text-zinc-400 leading-tight">Trips Completed</p>
                      </div>

                      <div className="bg-zinc-900/90 border border-zinc-800/90 p-2.5 rounded-xl text-left space-y-0.5">
                        <div className="text-base sm:text-lg font-black text-emerald-400 tracking-tight flex items-center">
                          <StatsCounter value={99.4} decimals={1} suffix="%" duration={1.6} className="text-emerald-400" />
                        </div>
                        <p className="text-[10px] font-medium text-zinc-400 leading-tight">On-Time Transit</p>
                      </div>

                      <div className="bg-zinc-900/90 border border-zinc-800/90 p-2.5 rounded-xl text-left space-y-0.5">
                        <div className="text-base sm:text-lg font-black text-white tracking-tight flex items-center">
                          <StatsCounter value={25} suffix="m" duration={1.4} className="text-white" />
                        </div>
                        <p className="text-[10px] font-medium text-zinc-400 leading-tight">Avg. Dispatch</p>
                      </div>

                      <div className="bg-zinc-900/90 border border-zinc-800/90 p-2.5 rounded-xl text-left space-y-0.5">
                        <div className="text-base sm:text-lg font-black text-amber-400 tracking-tight flex items-center">
                          <StatsCounter value={4.9} decimals={1} suffix="★" duration={1.5} className="text-amber-400" />
                        </div>
                        <p className="text-[10px] font-medium text-zinc-400 leading-tight">Verified Rating</p>
                      </div>
                    </div>
                  </div>

                  {/* Slogan Pill & Mission */}
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-200">
                      <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span>The Smarter Way For The Complete Delivery</span>
                    </div>
                    <p className="text-lg font-black leading-tight text-white tracking-wide">
                      <SplitText text="HAR JAGAH • HAR SAMAN • PATGOLITO KE SATH" delay={0.2} />
                    </p>
                    <p className="text-xs text-zinc-400">
                      Samaan Aapka, Mehnat Hamari — Direct intra-city commercial transport and delivery fleet.
                    </p>
                  </div>

                  {/* Instant Fleet Category Selector Grid */}
                  <div className="space-y-2 pt-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Choose Transport Fleet</p>
                    <div className="grid grid-cols-3 gap-2">
                      <motion.button
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onOpenBooking('two_wheeler')}
                        className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 transition text-left space-y-1 group cursor-pointer"
                      >
                        <span className="text-[10px] font-bold text-emerald-400">Express Delivery</span>
                        <p className="text-xs font-bold text-white group-hover:text-emerald-300">2-Wheeler</p>
                        <p className="text-[10px] text-zinc-500">Documents & parcels</p>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onOpenBooking('e_loader')}
                        className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 transition text-left space-y-1 group cursor-pointer"
                      >
                        <span className="text-[10px] font-bold text-emerald-400">Eco Cargo</span>
                        <p className="text-xs font-bold text-white group-hover:text-emerald-300">E-Loader / 3W</p>
                        <p className="text-[10px] text-zinc-500">Up to 500 kg</p>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onOpenBooking('tata_ace')}
                        className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 transition text-left space-y-1 group cursor-pointer"
                      >
                        <span className="text-[10px] font-bold text-emerald-400">Mini Truck</span>
                        <p className="text-xs font-bold text-white group-hover:text-emerald-300">Tata Ace</p>
                        <p className="text-[10px] text-zinc-500">House moves & cargo</p>
                      </motion.button>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <AnimatedButton
                    onClick={() => onOpenBooking()}
                    className="w-full bg-white hover:bg-zinc-200 text-black font-extrabold text-sm py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-zinc-200"
                    shineColor="rgba(0,0,0,0.3)"
                  >
                    <span>Book Transport Vehicle Now</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </AnimatedButton>
                </div>
              </BorderGlow>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TOP REVIEWS SLIDER (ON TOP OF WEBSITE) */}
      {/* ============================================================ */}
      <Suspense
        fallback={
          <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <div className="h-6 w-48 bg-zinc-200 rounded-full mx-auto animate-pulse mb-4" />
            <div className="h-10 w-96 bg-zinc-200 rounded-2xl mx-auto animate-pulse mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-zinc-100 rounded-3xl border border-zinc-200 animate-pulse" />
              ))}
            </div>
          </div>
        }
      >
        <ReviewsSection />
      </Suspense>

      {/* ============================================================ */}
      {/* 3. SERVICES: Editorial Asymmetric Layout */}
      {/* ============================================================ */}
      <section id="services" className="py-20 md:py-28 border-b border-zinc-200 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl space-y-4"
          >
            <span className="text-xs font-black tracking-widest uppercase text-zinc-500">
              Services & Capabilities
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight leading-tight">
              <SplitText text="Engineered for every moving & cargo need in Lucknow." />
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
              <BlurText text="Whether you are shifting home furniture, moving raw material from Transport Nagar, or dispatching customer orders, PATGOLITO provides end-to-end transport and physical loading." delay={0.15} />
            </p>
          </motion.div>

          {/* Editorial Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Featured Large Service Block (7 Columns) with Specs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs hover:border-zinc-400 hover:shadow-md transition flex flex-col justify-between h-full">
                  <div className="p-8 sm:p-10 space-y-6">
                    <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center font-black">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-black bg-zinc-100 px-2.5 py-1 rounded-full border border-zinc-300">
                        Primary Service
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-zinc-950">
                        Door-to-Door Intra-City Goods Transport
                      </h3>
                      <p className="text-sm text-zinc-600 leading-relaxed">
                        Book dedicated mini trucks (Tata Ace, 8ft Bolero, 3-Wheeler) for immediate or scheduled delivery anywhere in Lucknow. Includes live GPS tracking, route optimization, and digital receipting.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-bold text-zinc-800">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-black" />
                        <span>Prompt vehicle dispatch</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-black" />
                        <span>Full load & part load options</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-black" />
                        <span>Zero spot bargaining</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-black" />
                        <span>Verified commercial drivers</span>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-wrap items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onOpenBooking('tata_ace', false)}
                        className="bg-black hover:bg-zinc-800 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition inline-flex items-center gap-2 cursor-pointer"
                      >
                        <span>Book Door-to-Door Transport</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.a
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        href="tel:9278499882"
                        className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs px-4 py-3.5 rounded-xl transition inline-flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-zinc-600" />
                        <span>Call Support</span>
                      </motion.a>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 bg-zinc-950 text-white border-t border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black uppercase tracking-wider text-zinc-300">Fleet Specifications</h4>
                      <span className="text-xs text-emerald-400 font-bold">Verified Drivers</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <motion.div whileHover={{ scale: 1.02 }} className="p-3 bg-zinc-900/90 backdrop-blur-xs rounded-xl border border-zinc-800 space-y-1 transition">
                        <p className="text-xs font-bold text-white">2-Wheeler</p>
                        <p className="text-[11px] text-zinc-400">Up to 20 kg</p>
                        <p className="text-[10px] font-bold text-emerald-400">Instant Dispatch</p>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} className="p-3 bg-zinc-900/90 backdrop-blur-xs rounded-xl border border-zinc-800 space-y-1 transition">
                        <p className="text-xs font-bold text-white">3-Wheeler / E-Loader</p>
                        <p className="text-[11px] text-zinc-400">Up to 500 kg</p>
                        <p className="text-[10px] font-bold text-emerald-400">Commercial Cargo</p>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} className="p-3 bg-zinc-900/90 backdrop-blur-xs rounded-xl border border-zinc-800 space-y-1 transition">
                        <p className="text-xs font-bold text-white">Tata Ace</p>
                        <p className="text-[11px] text-zinc-400">Up to 750 kg</p>
                        <p className="text-[10px] font-bold text-emerald-400">House & Heavy Moves</p>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} className="p-3 bg-zinc-900/90 backdrop-blur-xs rounded-xl border border-zinc-800 space-y-1 transition">
                        <p className="text-xs font-bold text-white">Full Truck Load</p>
                        <p className="text-[11px] text-zinc-400">Dedicated Move</p>
                        <p className="text-[10px] font-bold text-emerald-400">Direct Route</p>
                      </motion.div>
                    </div>
                  </div>
                </div>
            </motion.div>

            {/* Secondary Services Stack (5 Columns) */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              {/* Secondary Card 1 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -3 }}
                className="bg-white rounded-2xl p-7 border border-zinc-200 shadow-xs hover:border-zinc-400 hover:shadow-md transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 text-black flex items-center justify-center font-bold">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-zinc-500">Residential</span>
                </div>
                <h4 className="text-xl font-bold text-zinc-950">House & Apartment Shifting</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Specialized transport for beds, almirahs, sofas, mattresses, and kitchenware with smooth transit directly to your destination.
                </p>
                <button
                  onClick={() => onOpenBooking('pickup', false)}
                  className="text-xs font-bold text-black hover:underline inline-flex items-center gap-1.5 pt-1 cursor-pointer"
                >
                  <span>Book House Move</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </motion.div>

              {/* Secondary Card 2 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -3 }}
                className="bg-white rounded-2xl p-7 border border-zinc-200 shadow-xs hover:border-zinc-400 hover:shadow-md transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 text-black flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-zinc-500">Commercial / B2B</span>
                </div>
                <h4 className="text-xl font-bold text-zinc-950">Commercial & Bulk Freight</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Move hardware, electronics, garments, and raw materials from Transport Nagar to retail stores across Hazratganj, Aminabad, and Aliganj.
                </p>
                <button
                  onClick={() => onOpenBooking('tempo', false)}
                  className="text-xs font-bold text-black hover:underline inline-flex items-center gap-1.5 pt-1 cursor-pointer"
                >
                  <span>Book Commercial Cargo</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </motion.div>

              {/* Secondary Card 3 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -3 }}
                className="bg-white rounded-2xl p-7 border border-zinc-200 shadow-xs hover:border-zinc-400 hover:shadow-md transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 text-black flex items-center justify-center font-bold">
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-zinc-500">Appliance Express</span>
                </div>
                <h4 className="text-xl font-bold text-zinc-950">Single Appliance & Furniture Move</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Bought a new or used fridge, washing machine, or dining table? Get a dedicated mini vehicle to transport and deliver safely without hassle.
                </p>
                <button
                  onClick={() => onOpenBooking('mini_pickup', false)}
                  className="text-xs font-bold text-black hover:underline inline-flex items-center gap-1.5 pt-1 cursor-pointer"
                >
                  <span>Book Appliance Delivery</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3.5 CINEMATIC DESKTOP SHOWCASE: Scroll Dissolve Reveal */}
      {/* ============================================================ */}
      <section className="relative w-full bg-black overflow-hidden border-b border-zinc-800">
        {/* Desktop WebGL Shader Reveal Animation */}
        <div className="hidden md:block">
          <ScrollDissolveReveal
            imageFront="/images/patgolito_fleet_transit.jpg"
            imageBack="/images/patgolito_dispatch_hub.jpg"
            frontLabel="01 • FLEET IN TRANSIT"
            frontTitle="Precision Commercial Fleet in Transit Across Lucknow"
            frontDescription="Connecting Transport Nagar, Gomti Nagar, Aliganj, and Amausi industrial corridors with real-time GPS coordination."
            backLabel="02 • CENTRALIZED LOGISTICS HUB"
            backTitle="Intelligent Dispatch & Verified Fulfillment"
            backDescription="High-capacity sorting, prompt vehicle matching in 20-40 mins, and transparent distance-based pricing with zero haggling."
            onOpenBooking={() => onOpenBooking()}
          />
        </div>

        {/* Responsive Mobile Alternative (Clean & Touch-Optimized) */}
        <div className="block md:hidden px-4 py-16 text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>Fleet &amp; Hub Visual Journey</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight text-white leading-tight">
            From Express Urban Transit to High-Tech Fulfillment
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Every booking is backed by verified commercial vehicles, punctual dispatch desks, and direct door-to-door transit across Lucknow.
          </p>
          <div className="grid grid-cols-1 gap-4 pt-2">
            <div className="rounded-2xl overflow-hidden border border-zinc-800 relative group">
              <img
                src="/images/patgolito_fleet_transit.jpg"
                alt="PATGOLITO Commercial Fleet in Transit"
                className="w-full h-56 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent p-4 flex flex-col justify-end">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">01 Transit</span>
                <p className="text-sm font-bold text-white">Express Intra-City Fleet Dispatch</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-zinc-800 relative group">
              <img
                src="/images/patgolito_dispatch_hub.jpg"
                alt="PATGOLITO Central Logistics Hub"
                className="w-full h-56 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent p-4 flex flex-col justify-end">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">02 Fulfillment</span>
                <p className="text-sm font-bold text-white">Central Sorting &amp; Logistics Hub</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. THE PATGOLITO ADVANTAGE: Verified Logistics Network */}
      {/* ============================================================ */}
      {/* ============================================================ */}
      {/* 4. THE PATGOLITO ADVANTAGE: Verified Logistics Network */}
      {/* (Refined and tightened padding to remove excess empty black space) */}
      {/* ============================================================ */}
      <section id="why-patgolito" className="py-10 md:py-14 bg-zinc-950 text-white border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-5"
            >
              <div className="inline-flex items-center gap-2 bg-zinc-800 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-zinc-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>The PATGOLITO Advantage</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                <SplitText text="Smart Transport." /> <br />
                <FoldText text="Zero Haggling." className="text-zinc-400" />
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed max-w-xl">
                <BlurText text="On other apps, drivers cancel without notice or demand unpredictable cash bargaining. With PATGOLITO, enjoy verified commercial fleets, upfront distance-calibrated fares, and prompt dispatch across Lucknow." delay={0.15} />
              </p>

              {/* Comparison Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="bg-zinc-900/90 p-4 rounded-xl border border-zinc-800 space-y-1.5 h-full">
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Other Apps</p>
                  <p className="text-sm font-bold text-zinc-300">Spot bargaining &amp; cancellations</p>
                  <p className="text-xs text-zinc-500">Drivers cancel on arrival or demand extra cash above estimated meters.</p>
                </div>

                <div className="bg-zinc-900/90 p-4 rounded-xl border border-emerald-500/40 space-y-1.5 relative h-full">
                  <div className="absolute top-2.5 right-2.5 text-[9px] bg-emerald-500 text-black font-black uppercase px-2 py-0.5 rounded">
                    PATGOLITO
                  </div>
                  <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">With PATGOLITO</p>
                  <p className="text-sm font-bold text-white">Verified Drivers &amp; Fixed Rates</p>
                  <p className="text-xs text-zinc-400">100% upfront digital calculation with guaranteed fleet dispatch.</p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3 items-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onOpenBooking('tata_ace', false)}
                  className="bg-white hover:bg-zinc-100 text-black font-bold text-sm px-6 py-3.5 rounded-xl transition shadow-lg inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Book Transport Vehicle Now</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </motion.button>
                <a
                  href="#porter-alternative"
                  className="text-xs font-bold text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-zinc-900 transition flex items-center gap-1.5"
                >
                  <span>View App Comparison</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </a>
              </div>
            </motion.div>

            {/* Right Visual Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5"
            >
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 sm:p-7 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Verified Transport Fleet</h4>
                      <p className="text-[11px] text-zinc-400">Direct citywide cargo transit</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                    Guaranteed Fares
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-white">On-Time Arrival Guarantee</p>
                      <p className="text-[11px] text-zinc-400">Prompt vehicle dispatch within 20 to 40 minutes across Lucknow.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-white">Safe Transit &amp; Cargo Securing</p>
                      <p className="text-[11px] text-zinc-400">Reliable handling of furniture, appliances, boxes, and commercial cargo.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-white">Strict No-Bargaining Guarantee</p>
                      <p className="text-[11px] text-zinc-400">Transparent upfront road-distance rates — what you see is what you pay.</p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black border border-zinc-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300">Ready to dispatch?</span>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onOpenBooking('tata_ace', false)}
                    className="bg-white hover:bg-zinc-200 text-black text-xs font-bold px-4 py-2 rounded-lg transition cursor-pointer"
                  >
                    Book Fleet Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4.5 PORTER ALTERNATIVE IN LUCKNOW: Dedicated Comparison Matrix */}
      {/* High-Intent SEO & Conversion Section targeting Porter alternative */}
      {/* ============================================================ */}
      <section id="porter-alternative" className="py-16 md:py-24 border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-black px-3.5 py-1.5 rounded-full border border-emerald-200 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>The Trusted Alternative to Leading Transport Apps</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
              Looking for a Reliable Alternative to Leading Transport Apps? Meet <span className="underline decoration-4 decoration-emerald-500 underline-offset-8">PATGOLITO</span>.
            </h2>

            <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
              Tired of frequent driver cancellations, cash bargaining upon arrival, and automated chat-only support? PATGOLITO is engineered specifically for Lucknow’s intra-city logistics — offering guaranteed vehicle assignments, fixed road-calibrated fares, upfront helper selection, and an active dispatch hotline at Transport Nagar.
            </p>
          </motion.div>

          {/* Clean Comparative Matrix Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-zinc-200 bg-white shadow-xs overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/80 text-xs">
                    <th className="py-4 px-6 font-black uppercase tracking-wider text-zinc-500 w-1/3">
                      Feature &amp; Service Capability
                    </th>
                    <th className="py-4 px-6 font-black text-black bg-emerald-50/60 border-x border-emerald-100 w-1/3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-sm font-extrabold text-zinc-950">PATGOLITO</span>
                        <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Recommended
                        </span>
                      </div>
                    </th>
                    <th className="py-4 px-6 font-bold text-zinc-500 w-1/3">
                      <span className="text-xs uppercase tracking-wider text-zinc-500">Leading Transport Apps</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-xs sm:text-sm">
                  {/* Row 1: Pricing */}
                  <tr className="hover:bg-zinc-50/50 transition">
                    <td className="py-4 px-6 font-bold text-zinc-900">
                      Pricing Model &amp; Fare Transparency
                    </td>
                    <td className="py-4 px-6 bg-emerald-50/30 border-x border-emerald-100 font-medium text-zinc-900">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-zinc-950 font-bold block">100% Upfront Road Fare</strong>
                          <span className="text-xs text-zinc-600">Calculated strictly by verified road kilometers. Zero driver haggling.</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-zinc-600">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                        <div>
                          <span>Metered estimates often contested on arrival; common demands for cash top-ups.</span>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Row 2: Driver Cancellations */}
                  <tr className="hover:bg-zinc-50/50 transition">
                    <td className="py-4 px-6 font-bold text-zinc-900">
                      Driver Assignment &amp; Cancellation Rate
                    </td>
                    <td className="py-4 px-6 bg-emerald-50/30 border-x border-emerald-100 font-medium text-zinc-900">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-zinc-950 font-bold block">Guaranteed Fleet Assignment</strong>
                          <span className="text-xs text-zinc-600">Verified commercial drivers dispatched promptly within 20–40 mins across Lucknow.</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-zinc-600">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                        <div>
                          <span>High cancellation rate during peak Lucknow traffic, rain, or outer ring road routes.</span>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Row 3: Helpers */}
                  <tr className="hover:bg-zinc-50/50 transition">
                    <td className="py-4 px-6 font-bold text-zinc-900">
                      Helper &amp; Loading Labour Option
                    </td>
                    <td className="py-4 px-6 bg-emerald-50/30 border-x border-emerald-100 font-medium text-zinc-900">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-zinc-950 font-bold block">1-Tap Standard Helper (+₹300 flat)</strong>
                          <span className="text-xs text-zinc-600">Add 1 or 2 verified helpers with fixed standardized pricing directly in the booking form.</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-zinc-600">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                        <div>
                          <span>Helper availability is unstandardized and rates must usually be negotiated verbally on arrival.</span>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Row 4: Support */}
                  <tr className="hover:bg-zinc-50/50 transition">
                    <td className="py-4 px-6 font-bold text-zinc-900">
                      Local Support &amp; Dispatch Desk
                    </td>
                    <td className="py-4 px-6 bg-emerald-50/30 border-x border-emerald-100 font-medium text-zinc-900">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-zinc-950 font-bold block">Live Human Dispatch Hotline (9278499882)</strong>
                          <span className="text-xs text-zinc-600">Speak directly to Lucknow-based logistics controllers for real-time trip coordination.</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-zinc-600">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                        <div>
                          <span>Automated bot-driven support tickets with slow resolution times during transit emergencies.</span>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Row 5: Local Hubs */}
                  <tr className="hover:bg-zinc-50/50 transition">
                    <td className="py-4 px-6 font-bold text-zinc-900">
                      Transport Nagar &amp; Lucknow Hub Presence
                    </td>
                    <td className="py-4 px-6 bg-emerald-50/30 border-x border-emerald-100 font-medium text-zinc-900">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-zinc-950 font-bold block">Deep Local Logistics Hub Integration</strong>
                          <span className="text-xs text-zinc-600">Active coordination across Transport Nagar, Gomti Nagar, Aliganj, and Amausi industrial corridors.</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-zinc-600">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                        <div>
                          <span>Generic nationwide dispatch algorithm with no local warehouse marshalling hubs.</span>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Row 6: B2B Invoicing */}
                  <tr className="hover:bg-zinc-50/50 transition">
                    <td className="py-4 px-6 font-bold text-zinc-900">
                      B2B Invoicing &amp; Multi-Stop Drops
                    </td>
                    <td className="py-4 px-6 bg-emerald-50/30 border-x border-emerald-100 font-medium text-zinc-900">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-zinc-950 font-bold block">Instant GST Invoices &amp; Multi-Drop Dispatch</strong>
                          <span className="text-xs text-zinc-600">Simple automated invoices tailored for Lucknow merchants, distributors, and shopkeepers.</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-zinc-600">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                        <div>
                          <span>Complex enterprise registration needed for basic GST billing and multi-stop delivery.</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom Section Banner with Direct Conversion Actions */}
            <div className="p-6 sm:p-8 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-sm font-bold text-zinc-950">Switch to PATGOLITO — Lucknow's Trusted Logistics Alternative</p>
                <p className="text-xs text-zinc-600">Tata Ace, 3-Wheelers, E-Loaders &amp; 2-Wheelers available on-demand with zero hassle.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onOpenBooking('tata_ace')}
                  className="bg-black hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-sm inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Book Mini Truck / Tempo</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </motion.button>
                <a
                  href="tel:9278499882"
                  className="bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 font-bold text-xs sm:text-sm px-4 py-3 rounded-xl transition inline-flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Call Dispatch (9278499882)</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. HOW IT WORKS: 01, 02, 03, 04 Editorial Process */}
      {/* ============================================================ */}
      <section id="how-it-works" className="py-20 md:py-28 border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl space-y-3"
          >
            <span className="text-xs font-black tracking-widest uppercase text-zinc-500">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight leading-tight">
              <FoldText text="How PATGOLITO Works" />
            </h2>
            <p className="text-base text-zinc-600 font-normal">
              <BlurText text="From instant booking to safe inside-room delivery in four seamless steps." delay={0.15} />
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white p-7 rounded-2xl border border-zinc-200 hover:border-black hover:shadow-lg transition-all space-y-4 h-full flex flex-col justify-between"
            >
              <div>
                <span className="text-4xl font-black text-black tracking-tighter">01</span>
                <h3 className="text-lg font-bold text-zinc-950 mt-2">Set Locations &amp; Vehicle</h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Enter your pickup and drop points in Lucknow. Select the vehicle matching your cargo weight.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="bg-white p-7 rounded-2xl border border-zinc-200 hover:border-black hover:shadow-lg transition-all space-y-4 h-full flex flex-col justify-between"
            >
              <div>
                <span className="text-4xl font-black text-black tracking-tighter">02</span>
                <h3 className="text-lg font-bold text-zinc-950 mt-2">Upfront Fixed Fare</h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Calibrated distance-based pricing calculated upfront. Zero hidden charges, zero driver bargaining.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -4 }}
              className="bg-white p-7 rounded-2xl border border-zinc-200 hover:border-black hover:shadow-lg transition-all space-y-4 h-full flex flex-col justify-between"
            >
              <div>
                <span className="text-4xl font-black text-black tracking-tighter">03</span>
                <h3 className="text-lg font-bold text-zinc-950 mt-2">Prompt Dispatch</h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Your assigned verified vehicle arrives promptly at your pickup address within 20 to 40 minutes.
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -4 }}
              className="bg-white p-7 rounded-2xl border border-zinc-200 hover:border-black hover:shadow-lg transition-all space-y-4 h-full flex flex-col justify-between"
            >
              <div>
                <span className="text-4xl font-black text-black tracking-tighter">04</span>
                <h3 className="text-lg font-bold text-zinc-950 mt-2">Delivered &amp; Unloaded</h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Goods are unloaded inside your destination room. Pay easily via UPI, Card, or Cash on Delivery.
              </p>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ============================================================ */}
      {/* 8. COMMERCIAL & BUSINESS LOGISTICS ("Move more. Manage less.") */}
      {/* ============================================================ */}
      <section id="business" className="py-20 md:py-28 bg-zinc-950 text-white border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6"
            >
              <span className="text-xs font-black tracking-widest uppercase text-emerald-400">
                Enterprise & Commercial Solutions
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                <SplitText text="Move more." /> <br />
                <FoldText text="Manage less." className="text-zinc-400" />
              </h2>

              <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed max-w-xl">
                <BlurText text="Powering daily logistics for manufacturers, retail stores, e-commerce distributors, and wholesalers across Lucknow and Transport Nagar." delay={0.2} />
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-zinc-200 pt-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>GST Compliant Billing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Dedicated Fleet Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Multi-Stop Route Dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Scheduled Daily Pickups</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <LiquidMetalButton
                  onClick={() => onOpenBooking('tempo', true)}
                  size="md"
                  icon={<Truck className="w-4 h-4 text-emerald-400" />}
                  borderWidth={3}
                >
                  <span>Partner with PATGOLITO</span>
                  <ArrowRight className="w-4 h-4 text-white ml-1" />
                </LiquidMetalButton>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5"
            >
              <BorderGlow
                edgeSensitivity={30}
                glowColor="40 80 80"
                backgroundColor="#09090b"
                borderRadius={24}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                animated={false}
                colors={['#c084fc', '#f472b6', '#10b981']}
              >
                <div className="rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">Lucknow B2B Commercial Corridors</h3>
                        <p className="text-xs text-zinc-400">High-volume daily distribution</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950 border border-emerald-800/60 px-2.5 py-1 rounded-full">
                      Active Corridors
                    </span>
                  </div>

                  <div className="space-y-3">
                    <motion.div whileHover={{ scale: 1.01 }} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs transition">
                      <div className="space-y-0.5">
                        <p className="font-bold text-white">Transport Nagar Warehouse Corridor</p>
                        <p className="text-[11px] text-zinc-400">Primary freight & heavy goods interchange</p>
                      </div>
                      <span className="text-emerald-400 font-bold text-[11px] bg-emerald-950/80 px-2 py-0.5 rounded">Active Corridor</span>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.01 }} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs transition">
                      <div className="space-y-0.5">
                        <p className="font-bold text-white">Hazratganj & Aminabad Retail Markets</p>
                        <p className="text-[11px] text-zinc-400">Scheduled same-day store replenishment</p>
                      </div>
                      <span className="text-emerald-400 font-bold text-[11px] bg-emerald-950/80 px-2 py-0.5 rounded">Same-Day</span>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.01 }} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs transition">
                      <div className="space-y-0.5">
                        <p className="font-bold text-white">Amausi & Sarojini Nagar Industrial Link</p>
                        <p className="text-[11px] text-zinc-400">Bulk materials & packaging dispatch</p>
                      </div>
                      <span className="text-emerald-400 font-bold text-[11px] bg-emerald-950/80 px-2 py-0.5 rounded">On Demand</span>
                    </motion.div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-white">Need Customized Merchant Rates?</p>
                      <p className="text-[10px] text-zinc-400">Monthly billing & dedicated fleet</p>
                    </div>
                    <motion.a
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      href="tel:9278499882"
                      className="bg-white hover:bg-zinc-200 text-black text-xs font-bold px-3.5 py-2 rounded-lg transition shrink-0"
                    >
                      Call B2B Desk
                    </motion.a>
                  </div>
                </div>
              </BorderGlow>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. LUCKNOW CITYWIDE COVERAGE & EXPANSION */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <span className="text-xs font-black tracking-widest uppercase text-zinc-500">
              Citywide Presence & Regional Expansion
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight">
              <SplitText text="Active Across Key Lucknow Localities" />
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
              <BlurText text="We connect residential neighborhoods, local markets, and industrial corridors across Lucknow, with direct fleet expansion preparing for Barabanki." delay={0.15} />
            </p>
          </motion.div>

          <CoverageMap onOpenBooking={onOpenBooking} />
        </div>
      </section>

      {/* ============================================================ */}
      {/* 11. FAQ SECTION */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 border-b border-zinc-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3"
          >
            <span className="text-xs font-black tracking-widest uppercase text-zinc-500">
              Questions & Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-black">
              <BlurText text="Frequently Asked Questions" />
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqList.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs hover:border-zinc-300 transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm text-zinc-900 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-black' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="px-6 pb-6 pt-0 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 font-medium"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 12. HIGH-IMPACT BOTTOM CTA BANNER WITH DIRECT CALL ACTION */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <BorderGlow
              edgeSensitivity={30}
              glowColor="40 80 80"
              backgroundColor="#000000"
              borderRadius={28}
              glowRadius={40}
              glowIntensity={1}
              coneSpread={25}
              animated={false}
              colors={['#10b981', '#34d399', '#f59e0b']}
            >
              <div className="bg-black text-white rounded-3xl p-10 md:p-16 text-center space-y-8 shadow-2xl">
                <div className="max-w-3xl mx-auto space-y-4">
                  <span className="text-xs font-black tracking-widest uppercase text-emerald-400">
                    HAR JAGAH • HAR SAMAN • PATGOLITO KE SATH
                  </span>
                  <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                    <SplitText text="Ready to move your goods" /> <br />
                    <FoldText text="with zero hassle?" />
                  </h2>
                  <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto font-normal">
                    <BlurText text="Book a verified vehicle with dedicated helper support across Lucknow in under 60 seconds." delay={0.2} />
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onOpenBooking('tata_ace', true)}
                    className="bg-white hover:bg-zinc-100 text-black font-bold text-base px-9 py-4 rounded-xl transition shadow-lg inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Book a Vehicle Now</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </motion.button>
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    href="tel:9278499882"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base px-8 py-4 rounded-xl transition shadow-lg inline-flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Dispatch Hotline</span>
                  </motion.a>
                </div>
              </div>
            </BorderGlow>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
