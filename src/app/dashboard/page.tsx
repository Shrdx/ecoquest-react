'use client';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

export default function DashboardPage() {
  const { state, dispatch } = useUser();

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

  return (
    <div className="container-eco py-8">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-cyan-300/15 to-emerald-400/15 border border-white/15 rounded-xl p-5">
        <h1 className="text-2xl font-bold">Welcome back, {state.name}! 🌱</h1>
        <p className="text-white/70">You're making great progress on your environmental journey. Keep it up!</p>
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

          {/* Recent Achievements */}
          <div className="card-eco p-4">
            <h3 className="font-semibold">Recent Achievements</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-3">
              {state.badges.map((b) => (
                <div key={b.id} className={`w-14 h-14 grid place-items-center rounded-lg border ${b.earned ? 'bg-emerald-400/20 border-emerald-400/40' : 'bg-white/5'}`} title={b.name}>
                  <span className={b.earned ? '' : 'opacity-50'}>{b.icon}</span>
                </div>
              ))}
            </div>
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
            <button
              className="btn-primary-eco w-full mt-2"
              onClick={() => { dispatch({ type: 'ADD_POINTS', payload: 30 }); alert('Daily challenge started! +30 XP'); }}
            >
              ▶ Start Daily Challenge
            </button>
            <Link href="/courses" className="btn-secondary-eco w-full mt-2 inline-flex justify-center">
              📚 Browse Courses
            </Link>
          </div>

          <div className="card-eco p-4">
            <h4 className="font-semibold">Friends Leaderboard</h4>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-3"><div className="w-6 h-6 grid place-items-center rounded-full bg-yellow-400 text-black text-sm">1</div><div>Sarah M.</div><div className="ml-auto text-white/70">3,120 XP</div></div>
              <div className="flex items-center gap-3"><div className="w-6 h-6 grid place-items-center rounded-full bg-gray-500 text-white text-sm">2</div><div>Mike R.</div><div className="ml-auto text-white/70">2,890 XP</div></div>
              <div className="flex items-center gap-3 bg-emerald-400/10 px-2 py-1 rounded"><div className="w-6 h-6 grid place-items-center rounded-full bg-amber-700 text-black text-sm">3</div><div>You</div><div className="ml-auto text-emerald-300">{state.totalXp} XP</div></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

