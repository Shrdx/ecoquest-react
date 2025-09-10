'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import ProfileCustomization from './profile/ProfileCustomization';

export default function NavBar() {
  const { state } = useUser();
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileCustomization, setShowProfileCustomization] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const handleLogout = async () => {
    await logout();
    setShowProfile(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur">
      <nav className="bg-black/40 border-b border-white/10">
        <div className="container-eco flex items-center justify-between py-3">
          <div className="flex items-center gap-2 font-bold tracking-wide">
            <span className="text-emerald-400">🍃</span>
            <span>EcoQuest</span>
          </div>

          <ul className="hidden md:flex items-center gap-6 text-white/80">
            <li><Link className={isActive('/') ? 'text-emerald-400' : ''} href="/">Home</Link></li>
            <li><Link className={isActive('/dashboard') ? 'text-emerald-400' : ''} href="/dashboard">Dashboard</Link></li>
            <li><Link className={isActive('/courses') ? 'text-emerald-400' : ''} href="/courses">Courses</Link></li>
            <li><Link className={isActive('/leaderboard') ? 'text-emerald-400' : ''} href="/leaderboard">Leaderboard</Link></li>
          </ul>

          <div className="flex items-center gap-3">
            {/* XP Points */}
            {isAuthenticated && (
              <div className="flex items-center gap-2 text-cyan-300 bg-cyan-300/10 border border-cyan-300/30 px-2.5 py-1 rounded-lg text-sm">
                <span>🪙</span>
                <span>{state.points.toLocaleString()}</span>
              </div>
            )}
            
            {/* User Menu or Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-2 transition-colors"
                >
                  <span className="text-xl">{user?.avatar || '🌱'}</span>
                  <span className="hidden sm:block text-white font-medium">{user?.name}</span>
                  <span className="text-white/50 text-xs">▼</span>
                </button>
                
                {/* Profile Dropdown */}
                {showProfile && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900/95 border border-white/10 rounded-xl shadow-2xl backdrop-blur-md z-50">
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                          {user?.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{user?.name}</div>
                          <div className="text-sm text-white/70">Level {state.level} • {state.totalXp} XP</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowProfileCustomization(true);
                          setShowProfile(false);
                        }}
                        className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                      >
                        🎨 Customize Profile
                      </button>
                      <Link
                        href="/dashboard"
                        onClick={() => setShowProfile(false)}
                        className="block w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        📊 Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                      >
                        👋 Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => handleAuthClick('login')}
                  className="px-3 py-1.5 text-sm text-white/80 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleAuthClick('signup')}
                  className="px-4 py-1.5 text-sm font-semibold bg-emerald-400 text-emerald-950 rounded-lg hover:bg-emerald-300 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button className="md:hidden inline-flex flex-col gap-1" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
              <span className="w-6 h-[3px] bg-white rounded" />
              <span className="w-6 h-[3px] bg-white rounded" />
              <span className="w-6 h-[3px] bg-white rounded" />
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t border-white/10 bg-black/70">
            <div className="container-eco py-3 grid gap-2">
              <Link href="/" onClick={() => setOpen(false)} className={isActive('/') ? 'text-emerald-400' : ''}>Home</Link>
              {isAuthenticated && (
                <>
                  <Link href="/dashboard" onClick={() => setOpen(false)} className={isActive('/dashboard') ? 'text-emerald-400' : ''}>Dashboard</Link>
                  <Link href="/courses" onClick={() => setOpen(false)} className={isActive('/courses') ? 'text-emerald-400' : ''}>Courses</Link>
                  <Link href="/leaderboard" onClick={() => setOpen(false)} className={isActive('/leaderboard') ? 'text-emerald-400' : ''}>Leaderboard</Link>
                </>
              )}
              
              {/* Mobile Auth Buttons */}
              {!isAuthenticated && (
                <div className="pt-2 border-t border-white/10 mt-2 flex gap-2">
                  <button
                    onClick={() => {
                      handleAuthClick('login');
                      setOpen(false);
                    }}
                    className="flex-1 py-2 text-sm text-white/80 bg-white/10 rounded-lg"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      handleAuthClick('signup');
                      setOpen(false);
                    }}
                    className="flex-1 py-2 text-sm font-semibold bg-emerald-400 text-emerald-950 rounded-lg"
                  >
                    Sign Up
                  </button>
                </div>
              )}
              
              {/* Mobile user actions */}
              {isAuthenticated && (
                <div className="pt-2 border-t border-white/10 mt-2 space-y-1">
                  <button
                    onClick={() => {
                      setShowProfileCustomization(true);
                      setOpen(false);
                    }}
                    className="w-full text-left py-2 text-white/80 hover:text-white"
                  >
                    🎨 Customize Profile
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="w-full text-left py-2 text-white/80 hover:text-white"
                  >
                    👋 Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      
      {/* Modals */}
      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        initialMode={authMode}
      />
      
      {showProfileCustomization && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md overflow-y-auto max-h-[90vh]">
            <div className="sticky top-0 bg-inherit border-b border-white/10 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Profile Settings</h2>
              <button
                onClick={() => setShowProfileCustomization(false)}
                className="text-white/50 hover:text-white/80 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5"
              >
                ×
              </button>
            </div>
            <ProfileCustomization onClose={() => setShowProfileCustomization(false)} />
          </div>
        </div>
      )}
      
      {/* Click outside to close profile dropdown */}
      {showProfile && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfile(false)}
        />
      )}
    </header>
  );
}

