import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { MaintenanceWatermark } from './components/MaintenanceWatermark';
import { ChatWithSupport } from './components/ChatWithSupport';
import { PatgolitoLogo } from './components/PatgolitoLogo';
import { FooterSocialShare } from './components/FooterSocialShare';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { DeleteAccountPage } from './components/DeleteAccountPage';
import { NotFoundPage } from './components/NotFoundPage';
import { AdminPanel } from './components/admin/AdminPanel';
import { store } from './lib/store';
import { VehicleType } from './types';
import { LandingPageSkeleton, AboutPageSkeleton, ModalSkeleton } from './components/SkeletonLoaders';
import { CheckCircle2, X, Phone, MessageSquare, ShieldCheck, MapPin, Mail } from 'lucide-react';
import { updatePageSeo, AppPageTab } from './lib/seo';

const LandingPage = lazy(() => import('./components/LandingPage').then(m => ({ default: m.LandingPage })));
const AboutPage = lazy(() => import('./components/AboutPage').then(m => ({ default: m.AboutPage })));
const NewBookingModal = lazy(() => import('./components/NewBookingModal').then(m => ({ default: m.NewBookingModal })));

/**
 * Resolves the active application tab from any requested URL path.
 * Handles trailing slashes, case variations, aliases, and direct bookmarks.
 */
export function resolveTabFromPath(rawPath?: string): AppPageTab {
  if (!rawPath) return 'landing';
  const path = rawPath.toLowerCase().trim();
  // Strip trailing slashes unless root '/'
  const normalized = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;

  if (normalized === '/' || normalized === '' || normalized === '/index.html') {
    return 'landing';
  }
  if (normalized === '/about' || normalized.startsWith('/about/') || normalized === '/about-us') {
    return 'about';
  }
  if (
    normalized === '/terms' ||
    normalized.startsWith('/terms/') ||
    normalized.startsWith('/terms-')
  ) {
    return 'terms';
  }
  if (
    normalized === '/privacy' ||
    normalized.startsWith('/privacy/') ||
    normalized.startsWith('/privacy-')
  ) {
    return 'privacy';
  }
  if (
    normalized === '/delete-account' ||
    normalized.startsWith('/delete-account/') ||
    normalized === '/delete-your-account' ||
    normalized.startsWith('/delete-your-account/') ||
    normalized === '/deleteaccount' ||
    normalized === '/deleteyouraccount'
  ) {
    return 'delete-account';
  }
  if (
    normalized === '/services' ||
    normalized === '/how-it-works' ||
    normalized === '/why-patgolito' ||
    normalized === '/reviews' ||
    normalized === '/business'
  ) {
    return 'landing';
  }
  if (
    normalized === '/patowner' ||
    normalized.startsWith('/patowner/') ||
    normalized === '/pat-owner' ||
    normalized.startsWith('/pat-owner/') ||
    normalized === '/admin' ||
    normalized.startsWith('/admin/')
  ) {
    return 'admin';
  }
  if (normalized === '/404' || normalized.startsWith('/404/')) {
    return 'not-found';
  }
  return 'not-found';
}

export function App() {
  const [activeTab, setActiveTab] = useState<AppPageTab>(() => {
    if (typeof window !== 'undefined') {
      return resolveTabFromPath(window.location.pathname);
    }
    return 'landing';
  });

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingVehicleType, setBookingVehicleType] = useState<VehicleType>('tata_ace');
  const [bookingNeedsHelper, setBookingNeedsHelper] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    store.init();
  }, []);

  // Synchronize Technical SEO tags with active page route
  useEffect(() => {
    updatePageSeo(activeTab);
  }, [activeTab]);

  // Support direct section anchors on landing view (e.g. #services, #reviews)
  useEffect(() => {
    if (typeof window !== 'undefined' && activeTab === 'landing') {
      const hash = window.location.hash;
      const path = window.location.pathname.toLowerCase();
      let targetId = '';
      if (hash) {
        targetId = hash.replace('#', '');
      } else if (['/services', '/how-it-works', '/why-patgolito', '/reviews', '/business'].includes(path)) {
        targetId = path.replace('/', '');
      }
      if (targetId) {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [activeTab]);

  // Listen to browser navigation (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(resolveTabFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (tab: AppPageTab) => {
    setActiveTab(tab);
    let targetPath = '/';
    if (tab === 'about') targetPath = '/about';
    if (tab === 'terms') targetPath = '/terms';
    if (tab === 'privacy') targetPath = '/privacy';
    if (tab === 'delete-account') targetPath = '/delete-account';
    if (tab === 'admin') targetPath = '/patowner';
    if (tab === 'not-found') targetPath = '/404';

    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleOpenBooking = (vehicleType?: VehicleType, needsHelper?: boolean) => {
    if (vehicleType) setBookingVehicleType(vehicleType);
    if (needsHelper !== undefined) setBookingNeedsHelper(needsHelper);
    setIsBookingOpen(true);
  };

  const handleBookingSuccess = (enquiryId: string) => {
    showToast(`Booking enquiry #${enquiryId} submitted! Our Lucknow team will call you shortly.`);
  };

  // Dedicated full-screen Administrative Operations Terminal
  if (activeTab === 'admin') {
    return <AdminPanel onReturnHome={() => handleTabChange('landing')} />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-950 flex flex-col selection:bg-black selection:text-white relative overflow-x-hidden">
      {/* Accessible Skip Link for SEO and Screen Readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded-xl focus:shadow-xl focus:border focus:border-zinc-700 text-xs font-bold"
      >
        Skip to main content
      </a>

      {/* Operational Status Badge */}
      <MaintenanceWatermark />

      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 max-w-md bg-black border border-zinc-800 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-800 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs font-bold leading-relaxed">{toastMessage}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenNewBooking={() => handleOpenBooking()}
      />

      {/* Main View Area with Smooth Transitions */}
      <main id="main-content" tabIndex={-1} className="flex-1 bg-white text-zinc-950 focus:outline-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Suspense fallback={<LandingPageSkeleton />}>
                <LandingPage
                  onOpenBooking={handleOpenBooking}
                  onNavigate={handleTabChange}
                />
              </Suspense>
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Suspense fallback={<AboutPageSkeleton />}>
                <AboutPage
                  onOpenBooking={() => handleOpenBooking()}
                  onNavigate={handleTabChange}
                />
              </Suspense>
            </motion.div>
          )}

          {activeTab === 'terms' && (
            <motion.div
              key="terms"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TermsOfServicePage
                onNavigate={handleTabChange}
                onOpenBooking={() => handleOpenBooking()}
              />
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PrivacyPolicyPage
                onNavigate={handleTabChange}
                onOpenBooking={() => handleOpenBooking()}
              />
            </motion.div>
          )}

          {activeTab === 'delete-account' && (
            <motion.div
              key="delete-account"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <DeleteAccountPage
                onNavigate={handleTabChange}
                onOpenBooking={() => handleOpenBooking()}
              />
            </motion.div>
          )}

          {activeTab === 'not-found' && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <NotFoundPage
                onNavigate={handleTabChange}
                onOpenBooking={(vt) => handleOpenBooking(vt, false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Commercial Grade Footer */}
      <footer className="bg-black text-white text-xs border-t border-zinc-800 pt-16 pb-24 sm:pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Top Row: Logo, Legal Entity & Quick Pitch */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 pb-12 border-b border-zinc-800">
            <div className="space-y-4 max-w-md">
              <div className="bg-white px-3.5 py-2.5 rounded-2xl inline-block shadow-md">
                <PatgolitoLogo size="lg" variant="full" />
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                PATGOLITO is Lucknow’s on-demand intra-city logistics and moving platform, operated by{' '}
                <strong className="text-zinc-200">Zoago Logistics Solutions Private Limited</strong>.
                Connecting verified commercial transport vehicles across Lucknow with upfront distance pricing.
              </p>
              <p className="text-[11px] font-bold text-emerald-400">
                Samaan aapka, mehnat hamari.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
              {/* Column 1: Company & Legal */}
              <div className="space-y-3">
                <p className="font-bold text-white uppercase tracking-wider text-[11px]">Company & Legal</p>
                <ul className="space-y-2 text-zinc-400">
                  <li>
                    <a
                      href="/about"
                      onClick={(e) => {
                        e.preventDefault();
                        handleTabChange('about');
                      }}
                      className="hover:text-white transition cursor-pointer text-left block"
                    >
                      About PATGOLITO
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#reviews"
                      onClick={(e) => {
                        e.preventDefault();
                        handleTabChange('landing');
                        setTimeout(() => {
                          const el = document.getElementById('reviews');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="hover:text-white transition cursor-pointer text-left block"
                    >
                      Customer Reviews
                    </a>
                  </li>
                  <li>
                    <a
                      href="/terms"
                      onClick={(e) => {
                        e.preventDefault();
                        handleTabChange('terms');
                      }}
                      className="hover:text-white transition cursor-pointer text-left block"
                    >
                      Terms & Conditions
                    </a>
                  </li>
                  <li>
                    <a
                      href="/privacy"
                      onClick={(e) => {
                        e.preventDefault();
                        handleTabChange('privacy');
                      }}
                      className="hover:text-white transition cursor-pointer text-left block"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/delete-account"
                      onClick={(e) => {
                        e.preventDefault();
                        handleTabChange('delete-account');
                      }}
                      className="hover:text-white transition cursor-pointer text-left block"
                    >
                      Delete Your Account
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 2: Support & Operations */}
              <div className="space-y-3">
                <p className="font-bold text-white uppercase tracking-wider text-[11px]">Lucknow Dispatch</p>
                <ul className="space-y-2 text-zinc-400">
                  <li>
                    <a
                      href="tel:9278499882"
                      className="text-emerald-400 font-bold hover:underline inline-flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Hotline: 9278499882</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://wa.me/919278499882"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition inline-flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp Support</span>
                    </a>
                  </li>
                  <li className="pt-1 flex flex-col gap-1.5 text-xs">
                    <a
                      href="mailto:official@patgolito.com"
                      className="hover:text-emerald-400 transition inline-flex items-center gap-1.5 text-zinc-300"
                    >
                      <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>official@patgolito.com</span>
                    </a>
                    <a
                      href="mailto:support@patgolito.com"
                      className="hover:text-emerald-400 transition inline-flex items-center gap-1.5 text-zinc-300"
                    >
                      <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>support@patgolito.com</span>
                    </a>
                  </li>
                  <li className="text-zinc-500 pt-1">
                    Operational base: Lucknow, Uttar Pradesh, India
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Social Links & Native Share Row */}
          <div className="pb-8 border-b border-zinc-800">
            <FooterSocialShare onToast={showToast} />
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px]">
            <p>
              © 2026 Zoago Logistics Solutions Private Limited (Brand: PATGOLITO). All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <a
                href="/terms"
                onClick={(e) => {
                  e.preventDefault();
                  handleTabChange('terms');
                }}
                className="hover:text-zinc-300 transition cursor-pointer"
              >
                Terms & Conditions
              </a>
              <a
                href="/privacy"
                onClick={(e) => {
                  e.preventDefault();
                  handleTabChange('privacy');
                }}
                className="hover:text-zinc-300 transition cursor-pointer"
              >
                Privacy Policy
              </a>
              <a
                href="/delete-account"
                onClick={(e) => {
                  e.preventDefault();
                  handleTabChange('delete-account');
                }}
                className="hover:text-red-400 transition cursor-pointer"
              >
                Delete Account
              </a>
              <span>Lucknow, UP, India</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Lazy Loaded Booking Modal with Suspense */}
      {isBookingOpen && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <ModalSkeleton />
            </div>
          }
        >
          <NewBookingModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
            onSuccess={handleBookingSuccess}
            defaultVehicleType={bookingVehicleType}
            defaultNeedsHelper={bookingNeedsHelper}
          />
        </Suspense>
      )}

      {/* Floating Chat with Support Button */}
      <ChatWithSupport phoneNumber="919278499882" />
    </div>
  );
}

export default App;

