'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { state, dispatch } = useUser();
  const { isAuthenticated, user } = useAuth();

  // If not authenticated, prompt sign-in and show a friendly gate.
  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ecoquest:open-auth', { detail: { mode: 'login' } }));
    }
  }, [isAuthenticated]);

  const continueQuest = (id: string) => {
    dispatch({ type: 'PROGRESS_QUEST', payload: { id, amount: 1 } });
    dispatch({ type: 'ADD_POINTS', payload: 20 });
    alert('Continuing quest... +20 XP');
  };

  const startQuest = (id: string) => {
    dispatch({ type: 'START_QUEST', payload: id });
    dispatch({ type: 'ADD_POINTS', payload: 10 });
    alert('Quest started! +10 XP');
  };

  if (!isAuthenticated) {
    return (
      <div className="container-eco py-10">
        <div className="card-eco p-6 text-center">
          <h1 className="text-2xl font-bold">Please sign in to view your dashboard</h1>
          <p className="text-white/70 mt-1">Your quests, badges and progress appear here after you log in.</p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              className="btn-primary-eco"
              onClick={() => window.dispatchEvent(new CustomEvent('ecoquest:open-auth', { detail: { mode: 'login' } }))}
            >
              🚀 Sign In
            </button>
            <button
              className="btn-secondary-eco"
              onClick={() => window.dispatchEvent(new CustomEvent('ecoquest:open-auth', { detail: { mode: 'signup' } }))}
            >
              🌱 Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-eco py-8">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-cyan-300/15 to-emerald-400/15 border border-white/15 rounded-xl p-5">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}! 🌱</h1>
        <p className="text-white/70">Track your progress and continue your eco-journey.</p>
        <div className="flex items-center gap-3 mt-3">
          <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 font-semibold">Level {state.level}</span>
          <div className="flex-1 h-2 bg-white/10 rounded">
            <div className="h-2 rounded bg-gradient-to-r from-emerald-400 to-cyan-300" style={{ width: `${(state.xp/500)*100}%` }} />
          </div>
          <span className="text-sm text-white/70">{state.xp}/500 XP</span>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_320px] gap-5 mt-6">
        {/* Current Quests */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Current Quests</h2>
          {state.quests.length === 0 ? (
            <div className="card-eco p-5 text-center">
              <p className="text-white/70">No quests yet. Start your first quest to begin earning XP!</p>
              <div className="mt-3 flex justify-center gap-2">
                <Link href="/courses" className="btn-primary-eco">📚 Browse Courses</Link>
                <button className="btn-secondary-eco" onClick={() => alert('Quests will appear here once you enroll in a course.')}>How it works</button>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {state.quests.map((q) => (
                <div key={q.id} className="card-eco p-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-300" />
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{q.title}</h3>
                      <div className="text-xs mt-1 px-2 py-0.5 rounded bg-cyan-300/15 text-cyan-200 font-semibold inline-block">
                        {q.type === 'action' ? 'Action Quest' : q.type === 'knowledge' ? 'Knowledge Quest' : 'Daily Challenge'}
                      </div>
                    </div>
                    <div className="text-xl">{q.icon}</div>
                  </div>
                  <p className="text-white/70 text-sm mt-2">{q.description}</p>
                  <div className="mt-3">
                    <div className="flex-1 h-2 bg-white/10 rounded">
                      <div className="h-2 rounded bg-gradient-to-r from-emerald-400 to-cyan-300" style={{ width: `${(q.progress/q.maxProgress)*100}%` }} />
                    </div>
                    <small className="text-white/70">{q.progress}/{q.maxProgress} tasks completed</small>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {q.status === 'not-started' ? (
                      <button className="btn-secondary-eco" onClick={() => startQuest(q.id)}>Start Quest</button>
                    ) : (
                      <button className="btn-primary-eco" onClick={() => continueQuest(q.id)}>{q.type === 'daily' ? 'Log Today' : 'Continue'}</button>
                    )}
                    <span className="text-emerald-300 font-semibold">+{q.xpReward} XP</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent Achievements */}
          <div className="card-eco p-4">
            <h3 className="font-semibold">Recent Achievements</h3>
            {state.badges.length === 0 ? (
              <p className="text-white/70 mt-2">No badges yet. Complete quests to earn your first badge!</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-3">
                {state.badges.map((b) => (
                  <div key={b.id} className={`w-14 h-14 grid place-items-center rounded-lg border ${b.earned ? 'bg-emerald-400/20 border-emerald-400/40' : 'bg-white/5'}`} title={b.name}>
                    <span className={b.earned ? '' : 'opacity-50'}>{b.icon}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="card-eco p-4">
            <h4 className="font-semibold">Your Stats</h4>
            <div className="divide-y divide-white/10 mt-2">
              <div className="py-2 flex items-center justify-between"><span>Total XP</span><strong>{state.totalXp}</strong></div>
              <div className="py-2 flex items-center justify-between"><span>Quests Completed</span><strong>{state.quests.filter(q=>q.status==='completed').length}</strong></div>
              <div className="py-2 flex items-center justify-between"><span>Badges Earned</span><strong>{state.badges.filter(b=>b.earned).length}</strong></div>
              <div className="py-2 flex items-center justify-between"><span>Streak</span><strong>{state.streak} days 🔥</strong></div>
              <div className="py-2 flex items-center justify-between"><span>Global Rank</span><strong>#{state.rank}</strong></div>
            </div>
          </div>

          <div className="card-eco p-4">
            <h4 className="font-semibold">Quick Actions</h4>
            <Link href="/courses" className="btn-primary-eco w-full mt-2 inline-flex justify-center">📚 Browse Courses</Link>
            <button
              className="btn-secondary-eco w-full mt-2"
              onClick={() => alert('Enroll in a course to unlock daily challenges!')}
            >
              ▶ Start Daily Challenge
            </button>
          </div>

          <div className="card-eco p-4">
            <h4 className="font-semibold">Friends Leaderboard</h4>
            <p className="text-white/70 mt-2">Coming soon — connect with friends and compete!</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

