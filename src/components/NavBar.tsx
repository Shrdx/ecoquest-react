'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';

export default function NavBar() {
  const { state } = useUser();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

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
            <div className="flex items-center gap-2 text-cyan-300 bg-cyan-300/10 border border-cyan-300/30 px-2.5 py-1 rounded-lg text-sm">
              <span>🪙</span>
              <span>{state.points.toLocaleString()}</span>
            </div>
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
              <Link href="/dashboard" onClick={() => setOpen(false)} className={isActive('/dashboard') ? 'text-emerald-400' : ''}>Dashboard</Link>
              <Link href="/courses" onClick={() => setOpen(false)} className={isActive('/courses') ? 'text-emerald-400' : ''}>Courses</Link>
              <Link href="/leaderboard" onClick={() => setOpen(false)} className={isActive('/leaderboard') ? 'text-emerald-400' : ''}>Leaderboard</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

