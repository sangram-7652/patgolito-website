import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  MessageSquare,
  UserX,
  Activity,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Database,
  Loader2,
} from 'lucide-react';
import { PatgolitoLogo } from '../PatgolitoLogo';
import { AdminLoginGate } from './AdminLoginGate';
import { AdminDashboard } from './AdminDashboard';
import { AdminReviews } from './AdminReviews';
import { AdminDeletionRequests } from './AdminDeletionRequests';
import { AdminAuditLogs } from './AdminAuditLogs';
import { AdminSecuritySettings } from './AdminSecuritySettings';

export type AdminTab = 'dashboard' | 'reviews' | 'deletions' | 'audit' | 'security';

interface AdminPanelProps {
  onReturnHome: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onReturnHome }) => {
  const [token, setToken] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? sessionStorage.getItem('patgolito_admin_token') : null;
  });
  const [adminUser, setAdminUser] = useState<{ id: string; name: string; role: string } | null>(() => {
    if (typeof window !== 'undefined') {
      const raw = sessionStorage.getItem('patgolito_admin_user');
      return raw ? JSON.parse(raw) : null;
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isVerifyingSession, setIsVerifyingSession] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dashboard statistics state
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4000);
  };

  // Verify session on mount if token exists
  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setIsVerifyingSession(false);
        return;
      }

      try {
        const res = await fetch('/api/admin/session', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.admin) {
            setAdminUser(data.admin);
          } else {
            handleLogout();
          }
        } else {
          handleLogout();
        }
      } catch {
        // Network failure; keep offline token for continuity
      } finally {
        setIsVerifyingSession(false);
      }
    };

    verifySession();
  }, [token]);

  // Fetch Dashboard Stats when authenticated
  const fetchStats = async () => {
    if (!token) return;
    setIsLoadingStats(true);
    try {
      const res = await fetch('/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setDashboardStats(data);
      }
    } catch {
      // Ignored
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token]);

  const handleLoginSuccess = (newToken: string, user: { id: string; name: string; role: string }) => {
    setToken(newToken);
    setAdminUser(user);
    showToast(`Welcome back, ${user.name}`);
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch {
        // Ignored
      }
    }

    sessionStorage.removeItem('patgolito_admin_token');
    sessionStorage.removeItem('patgolito_admin_user');
    setToken(null);
    setAdminUser(null);
    setActiveTab('dashboard');
  };

  // Loading indicator during session verification
  if (isVerifyingSession) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        <p className="text-xs text-zinc-400 font-mono">Verifying administrative terminal session...</p>
      </div>
    );
  }

  // Not authenticated -> show Login Gate
  if (!token || !adminUser) {
    return <AdminLoginGate onLoginSuccess={handleLoginSuccess} />;
  }

  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'reviews' as AdminTab, label: 'Reviews Management', icon: MessageSquare },
    { id: 'deletions' as AdminTab, label: 'Deletion Requests', icon: UserX },
    { id: 'audit' as AdminTab, label: 'Audit Trail Logs', icon: Activity },
    { id: 'security' as AdminTab, label: 'Security & Access', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row antialiased selection:bg-emerald-500 selection:text-black">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-zinc-900 border border-emerald-500/60 text-white px-4 py-3 rounded-2xl shadow-2xl shadow-black text-xs font-semibold flex items-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex w-64 xl:w-72 bg-zinc-950 border-r border-zinc-800/80 flex-col justify-between shrink-0 h-screen sticky top-0 p-5">
        <div className="space-y-6">
          {/* Logo & Brand */}
          <div className="pb-4 border-b border-zinc-900">
            <PatgolitoLogo size="md" />
            <div className="flex items-center gap-1.5 mt-3 text-[11px] text-zinc-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Operations Terminal</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-zinc-900 text-white border border-zinc-800 shadow-sm shadow-black'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Sign-out */}
        <div className="pt-4 border-t border-zinc-900 space-y-3">
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white truncate max-w-[140px]">{adminUser.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black text-emerald-400 uppercase">
                ADMIN
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono truncate">ID: {adminUser.id}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="flex-1 py-2 px-3 rounded-xl bg-zinc-900 hover:bg-red-950/40 hover:text-red-300 text-zinc-400 hover:border-red-900/50 border border-zinc-800 text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            <button
              onClick={onReturnHome}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition cursor-pointer"
              title="Preview Public Website"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden bg-zinc-950 border-b border-zinc-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <PatgolitoLogo size="sm" />

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-zinc-950 border-b border-zinc-800 px-4 py-4 space-y-3 z-30"
          >
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive ? 'bg-zinc-900 text-white border border-zinc-800' : 'text-zinc-400'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-zinc-900 flex items-center justify-between gap-2">
              <span className="text-xs text-zinc-400 font-mono truncate">{adminUser.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-red-950/60 text-red-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && (
          <AdminDashboard
            stats={dashboardStats}
            isLoading={isLoadingStats}
            onRefresh={fetchStats}
            onNavigateTab={(tab) => {
              if (tab === 'reviews') setActiveTab('reviews');
              if (tab === 'deletions') setActiveTab('deletions');
              if (tab === 'audit') setActiveTab('audit');
            }}
          />
        )}

        {activeTab === 'reviews' && <AdminReviews token={token} onToast={showToast} />}

        {activeTab === 'deletions' && <AdminDeletionRequests token={token} onToast={showToast} />}

        {activeTab === 'audit' && <AdminAuditLogs token={token} onToast={showToast} />}

        {activeTab === 'security' && (
          <AdminSecuritySettings adminUser={adminUser} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
};
