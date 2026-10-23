import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Truck,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  Award,
  Shield,
  Phone,
  CheckCircle,
  Radio,
  ChevronDown,
  HelpCircle,
  FileText,
  Mail,
  Scale,
  Building2,
  Lock,
} from 'lucide-react';
import { PatgolitoLogo } from './PatgolitoLogo';
import { Breadcrumb } from './Breadcrumb';
import { BlurText, FoldText, SplitText } from './AnimatedText';
import BorderGlow from './BorderGlow';
import { AnimatedButton } from './AnimatedButton';

interface AboutPageProps {
  onOpenBooking: () => void;
  onNavigate?: (tab: 'landing' | 'about' | 'terms' | 'privacy') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenBooking, onNavigate }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const aboutFaqs = [
    {
      q: 'What is the corporate entity operating PATGOLITO?',
      a: 'PATGOLITO is a technology-enabled logistics platform operated by Zoago Logistics Solutions Private Limited, a registered company headquartered in Lucknow, Uttar Pradesh, India.',
    },
    {
      q: 'What is PATGOLITO’s operating model and driver relationship?',
      a: 'In accordance with our official Terms & Conditions, PATGOLITO functions as an intermediary technology platform connecting customers with independent vehicle owners and drivers. Drivers are independent service providers responsible for maintaining valid driving licences, commercial registration certificates, permits, and active insurance under the Motor Vehicles Act, 1988.',
    },
    {
      q: 'How does PATGOLITO’s verified vehicle dispatch work?',
      a: 'When booking any PATGOLITO vehicle, you are instantly connected to verified commercial transport fleets (Tata Ace, 3-Wheelers, E-Loaders, 2-Wheelers). Drivers arrive promptly at your pickup point for direct, transparent door-to-door transit across Lucknow.',
    },
    {
      q: 'What regulatory standards and laws govern transactions on PATGOLITO?',
      a: 'All platform interactions, carriage coordination, and dispute resolutions are governed by the laws of India, with exclusive legal jurisdiction resting with the competent courts in Lucknow, Uttar Pradesh. Prohibited items strictly exclude contraband, explosives, and illegal narcotics under the NDPS Act, 1985.',
    },
    {
      q: 'What types of vehicles are available in the PATGOLITO fleet?',
      a: 'Our approved fleet categories in Lucknow include: Two-wheeler (parcels & small packages up to 20 kg), E-loader (clean electric loader up to 350 kg), Three-wheeler goods loader (up to 500 kg), Compact three-wheeler (maneuverable in congested lanes), and Tata Ace (up to 750 kg for home shifting and cargo).',
    },
    {
      q: 'How is the trip price calculated and are there hidden fees?',
      a: 'Our pricing is fully transparent and calculated using upfront distance formulas: base fare + calibrated per-kilometer route rate. The upfront quote communicated before booking confirmation is what you pay. Toll charges and parking fees, if incurred during transit, are payable as per actual receipts.',
    },
    {
      q: 'Which areas of Lucknow does PATGOLITO serve?',
      a: 'We cover major localities across the Lucknow metropolitan area and key corridors, including Gomti Nagar, Gomti Nagar Extension, Hazratganj, Aliganj, Indira Nagar, Mahanagar, Ashiyana, Rajajipuram, Transport Nagar, Jankipuram, Sushant Golf City, Amausi Industrial Area, and Chinhat.',
    },
  ];

  return (
    <div className="bg-white text-zinc-950 pb-20">
      {/* Search Engine Optimized Semantic Breadcrumb Navigation */}
      <Breadcrumb
        id="about-breadcrumb"
        items={[
          { label: 'Home', href: '/', tab: 'landing' },
          { label: 'About PATGOLITO', href: '/about', active: true },
        ]}
        onNavigate={onNavigate}
      />

      {/* Editorial Header */}
      <section className="py-20 md:py-28 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl space-y-6"
          >
            <span className="text-xs font-black tracking-widest uppercase text-zinc-500">
              About PATGOLITO
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-black tracking-tight leading-[1.08]">
              <SplitText text="Every Delivery," /> <br />
              <FoldText text="Handled With" />{' '}
              <span className="underline decoration-4 underline-offset-8 decoration-emerald-500 inline-block">
                Care & Trust.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-600 font-normal leading-relaxed">
              <BlurText text="Founded in Lucknow, PATGOLITO was created to solve the single most frustrating flaw in modern logistics: transport apps that send a driver who refuses to lift a single item. We combine verified vehicles with trained, courteous helpers for true door-to-room delivery." delay={0.2} />
            </p>
          </motion.div>
        </div>
      </section>

      {/* Large Image & Mission Section */}
      <section className="py-20 border-b border-zinc-200 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 space-y-6"
            >
              <span className="text-xs font-black tracking-widest uppercase text-zinc-500">
                Our Purpose
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-black leading-tight">
                <FoldText text="HAR JAGAH • HAR SAMAN • PATGOLITO KE SATH" />
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                Whether it is a family shifting homes across Gomti Nagar, a college student moving a fridge to Aliganj, or a merchant dispatching inventory from Transport Nagar, we eliminate physical exhaustion and haggling from intra-city moving.
              </p>
              <div className="p-6 bg-white rounded-2xl border border-zinc-200 space-y-2 shadow-xs">
                <p className="text-xs font-black uppercase text-zinc-900 tracking-wider">The Standard We Set</p>
                <p className="text-sm text-zinc-700 font-medium">
                  "Your Trust. Our Promise. Saman Aapka, Mehnat Hamari" — Verified commercial vehicles, upfront transparent pricing, and respectful service.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, x: 20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6"
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
                colors={['#10b981', '#34d399', '#ffffff']}
              >
                <div className="rounded-3xl bg-zinc-950 text-white p-8 sm:p-10 border border-zinc-800 shadow-xl space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
                    <PatgolitoLogo size="md" />
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-1 rounded-full">
                      Official Transport
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-xs">
                        01
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-white">Direct Door-to-Door Transit</p>
                        <p className="text-xs text-zinc-400">Punctual pickup, dedicated vehicle transport, and safe delivery.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-xs">
                        02
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-white">Transparent Distance Fares</p>
                        <p className="text-xs text-zinc-400">Calibrated road-distance calculation — zero tipping or spot haggling.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-xs">
                        03
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-white">Live GPS & Route Protection</p>
                        <p className="text-xs text-zinc-400">Direct algorithmic toll/distance calculation with live map tracking.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span>Active across all Lucknow zones</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={onOpenBooking}
                      className="bg-white hover:bg-zinc-200 text-black text-xs font-bold px-4 py-2 rounded-lg transition cursor-pointer"
                    >
                      Book Now
                    </motion.button>
                  </div>
                </div>
              </BorderGlow>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Operational Values */}
      <section className="py-20 md:py-28 border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl space-y-3"
          >
            <span className="text-xs font-black tracking-widest uppercase text-zinc-500">
              Core Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-black">
              How We Operate Every Day
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="transition"
            >
              <BorderGlow
                edgeSensitivity={30}
                glowColor="40 80 80"
                backgroundColor="#fafafa"
                borderRadius={16}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                animated={false}
                colors={['#10b981', '#34d399', '#f59e0b']}
              >
                <div className="p-8 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4 h-full">
                  <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm">
                    01
                  </div>
                  <h3 className="text-xl font-bold text-zinc-950">Complete Responsibility</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    We take ownership of the whole moving lifecycle — from stairs pickup at floor 3 to careful placement inside your destination room.
                  </p>
                </div>
              </BorderGlow>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="transition"
            >
              <BorderGlow
                edgeSensitivity={30}
                glowColor="40 80 80"
                backgroundColor="#fafafa"
                borderRadius={16}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                animated={false}
                colors={['#10b981', '#34d399', '#f59e0b']}
              >
                <div className="p-8 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4 h-full">
                  <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm">
                    02
                  </div>
                  <h3 className="text-xl font-bold text-zinc-950">Zero Price Ambiguity</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Fares are calculated algorithmically based on exact road distance. No spot bargaining, no last-minute surprise demands.
                  </p>
                </div>
              </BorderGlow>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              whileHover={{ y: -4 }}
              className="transition"
            >
              <BorderGlow
                edgeSensitivity={30}
                glowColor="40 80 80"
                backgroundColor="#fafafa"
                borderRadius={16}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                animated={false}
                colors={['#10b981', '#34d399', '#f59e0b']}
              >
                <div className="p-8 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4 h-full">
                  <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm">
                    03
                  </div>
                  <h3 className="text-xl font-bold text-zinc-950">Dignity of Labor</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Our helper team and drivers are respected partners, fairly compensated, background-verified, and trained for careful handling of all goods.
                  </p>
                </div>
              </BorderGlow>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Corporate Governance & Official Legal Information */}
      <section id="corporate-legal-information" className="py-20 md:py-28 border-b border-zinc-200 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-black text-white text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official Corporate Disclosure</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight">
              Corporate Governance & Legal Framework
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              PATGOLITO operates under strict regulatory compliance, transparent corporate governance, and consumer protection protocols under Indian law.
            </p>
          </motion.div>

          {/* 4-Card Legal & Governance Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Operating Corporate Entity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="transition"
              id="legal-card-entity"
            >
              <BorderGlow
                edgeSensitivity={30}
                glowColor="40 80 80"
                backgroundColor="#ffffff"
                borderRadius={16}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                animated={false}
                colors={['#10b981', '#34d399', '#f59e0b']}
              >
                <div className="p-6 rounded-2xl bg-white border border-zinc-200 space-y-4 shadow-2xs hover:border-zinc-300 transition h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">Corporate Entity</span>
                      <h3 className="text-base font-bold text-zinc-950">Zoago Logistics Solutions Private Limited</h3>
                    </div>
                    <ul className="text-xs text-zinc-600 space-y-2 leading-relaxed">
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Brand & Platform:</strong> PATGOLITO</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Headquarters:</strong> Lucknow, Uttar Pradesh, India</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Corporate Nature:</strong> Registered Private Limited Logistics Company</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </BorderGlow>
            </motion.div>

            {/* Card 2: Intermediary Platform Architecture */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="transition"
              id="legal-card-platform"
            >
              <BorderGlow
                edgeSensitivity={30}
                glowColor="40 80 80"
                backgroundColor="#ffffff"
                borderRadius={16}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                animated={false}
                colors={['#10b981', '#34d399', '#f59e0b']}
              >
                <div className="p-6 rounded-2xl bg-white border border-zinc-200 space-y-4 shadow-2xs hover:border-zinc-300 transition h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">Platform Model</span>
                      <h3 className="text-base font-bold text-zinc-950">Technology Intermediary</h3>
                    </div>
                    <ul className="text-xs text-zinc-600 space-y-2 leading-relaxed">
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Connects customers with verified independent vehicle owners & drivers.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Drivers operate as independent service providers with validated commercial licenses.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Upfront calibrated per-km fares with zero hidden surcharges.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </BorderGlow>
            </motion.div>

            {/* Card 3: Regulatory & Statutory Compliance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="transition"
              id="legal-card-statutory"
            >
              <BorderGlow
                edgeSensitivity={30}
                glowColor="40 80 80"
                backgroundColor="#ffffff"
                borderRadius={16}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                animated={false}
                colors={['#10b981', '#34d399', '#f59e0b']}
              >
                <div className="p-6 rounded-2xl bg-white border border-zinc-200 space-y-4 shadow-2xs hover:border-zinc-300 transition h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">Statutory Compliance</span>
                      <h3 className="text-base font-bold text-zinc-950">Motor Vehicles Act, 1988</h3>
                    </div>
                    <ul className="text-xs text-zinc-600 space-y-2 leading-relaxed">
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Strict adherence to transport safety standards and insurance requirements.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Strict prohibited goods enforcement under NDPS Act, 1985 & explosive laws.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>GST compliant fare calculation and verifiable distance receipts.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </BorderGlow>
            </motion.div>

            {/* Card 4: Jurisdiction & Communication */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="transition"
              id="legal-card-jurisdiction"
            >
              <BorderGlow
                edgeSensitivity={30}
                glowColor="40 80 80"
                backgroundColor="#ffffff"
                borderRadius={16}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                animated={false}
                colors={['#10b981', '#34d399', '#f59e0b']}
              >
                <div className="p-6 rounded-2xl bg-white border border-zinc-200 space-y-4 shadow-2xs hover:border-zinc-300 transition h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">Legal Jurisdiction</span>
                      <h3 className="text-base font-bold text-zinc-950">Lucknow, Uttar Pradesh</h3>
                    </div>
                    <ul className="text-xs text-zinc-600 space-y-2 leading-relaxed">
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Exclusive jurisdiction of competent courts in Lucknow, Uttar Pradesh, India.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Official Email:</strong> official@patgolito.com</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Support Email:</strong> support@patgolito.com</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </BorderGlow>
            </motion.div>
          </div>

          {/* Official Policy Fast-Links Bar */}
          <div className="p-6 bg-white rounded-2xl border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-950">Review Complete Legal Documents</p>
                <p className="text-xs text-zinc-500">Read our complete Terms & Conditions and customer Privacy Policy.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="/terms"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate?.('terms');
                }}
                className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-100 text-xs font-bold text-zinc-900 inline-flex items-center gap-1.5 transition cursor-pointer"
                id="about-btn-view-terms"
              >
                <FileText className="w-3.5 h-3.5 text-zinc-700" />
                <span>Terms & Conditions</span>
              </a>
              <a
                href="/privacy"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate?.('privacy');
                }}
                className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-100 text-xs font-bold text-zinc-900 inline-flex items-center gap-1.5 transition cursor-pointer"
                id="about-btn-view-privacy"
              >
                <Lock className="w-3.5 h-3.5 text-zinc-700" />
                <span>Privacy Policy</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions - Collapsible Accordion */}
      <section className="py-20 md:py-28 border-b border-zinc-200 bg-zinc-50/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3"
          >
            <div className="inline-flex items-center gap-2 bg-black text-white text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              <BlurText text="Frequently Asked Questions" />
            </h2>
            <p className="text-sm text-zinc-600 max-w-xl mx-auto">
              Everything you need to know about PATGOLITO logistics, driver verification, and door-to-room helper support in Lucknow.
            </p>
          </motion.div>

          <div className="space-y-4">
            {aboutFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs hover:border-zinc-300 transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    id={`faq-question-${idx}`}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-zinc-900 cursor-pointer select-none transition-colors hover:text-black"
                  >
                    <span className="leading-snug pr-2">{faq.q}</span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-white' : 'text-zinc-600'
                        }`}
                      />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${idx}`}
                        role="region"
                        aria-labelledby={`faq-question-${idx}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.28, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 font-medium">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="p-6 rounded-2xl bg-white border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
          >
            <div className="space-y-1">
              <p className="text-sm font-bold text-zinc-900">Have a specific question about your move?</p>
              <p className="text-xs text-zinc-500">Our Lucknow dispatch team is available to assist with rate enquiries and vehicle scheduling.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="tel:9278499882"
                className="inline-flex items-center gap-2 text-xs font-bold bg-black text-white hover:bg-zinc-800 px-4 py-2.5 rounded-xl transition"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Support</span>
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenBooking}
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                <span>Book Vehicle</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lucknow Operations Headquarters */}
      <section className="py-20 bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl space-y-6"
          >
            <span className="text-xs font-black tracking-widest uppercase text-emerald-400">
              Operations Center & Legal Headquarters
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              <SplitText text="Headquartered in Lucknow. Built for Uttar Pradesh." />
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Operating under <strong>Zoago Logistics Solutions Private Limited</strong>, PATGOLITO coordinates real-time dispatch across Transport Nagar, Gomti Nagar, and surrounding corridors.
            </p>

            <BorderGlow
              edgeSensitivity={30}
              glowColor="40 80 80"
              backgroundColor="#09090b"
              borderRadius={16}
              glowRadius={40}
              glowIntensity={1}
              coneSpread={25}
              animated={false}
              colors={['#10b981', '#34d399', '#f59e0b']}
            >
              <div className="p-5 bg-zinc-950/80 rounded-2xl border border-zinc-800 text-xs space-y-2 text-zinc-300">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-zinc-400">
                  <span className="text-white font-bold">Zoago Logistics Solutions Private Limited</span>
                  <span>•</span>
                  <span>Lucknow, Uttar Pradesh, India</span>
                  <span>•</span>
                  <span>Motor Vehicles Act, 1988 Compliance</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
                  <a
                    href="mailto:official@patgolito.com"
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>official@patgolito.com</span>
                  </a>
                  <a
                    href="mailto:support@patgolito.com"
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>support@patgolito.com</span>
                  </a>
                  <a
                    href="tel:9278499882"
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>+91 9278499882</span>
                  </a>
                </div>
              </div>
            </BorderGlow>

            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <AnimatedButton
                onClick={onOpenBooking}
                className="bg-white hover:bg-zinc-100 text-black font-bold text-sm px-8 py-4 rounded-xl border border-zinc-200 inline-flex items-center gap-2 cursor-pointer shadow-lg"
                shineColor="rgba(0,0,0,0.3)"
              >
                <span>Book a PATGOLITO Vehicle</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </AnimatedButton>
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="tel:9278499882"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-7 py-4 rounded-xl transition inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Hotline</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
