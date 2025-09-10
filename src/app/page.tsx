'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import AuthModal from '@/components/auth/AuthModal';

export default function Home() {
  const { dispatch } = useUser();
  const { isAuthenticated, user } = useAuth();
  const { showSuccess } = useNotification();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const featuresRef = useRef<HTMLDivElement | null>(null);

  const addPoints = (n: number) => {
    dispatch({ type: 'ADD_POINTS', payload: n });
    showSuccess(`Great! You earned ${n} points! Keep exploring! 🌟`);
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Navigate to dashboard for authenticated users
      window.location.href = '/dashboard';
    } else {
      // Show signup modal for new users
      setAuthMode('signup');
      setShowAuth(true);
    }
  };

  return (
    <div className="pb-12">
      {/* Hero */}
      <section className="py-14">
        <div className="container-eco grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl/tight md:text-5xl font-extrabold">
              Learn Environmental Science Through <span className="text-emerald-400">Gaming</span>
            </h1>
            <p className="text-white/70 mt-3">
              Embark on an exciting journey to save the planet! Complete quests, earn rewards, and compete with friends
              while learning about environmental conservation.
            </p>
            <div className="mt-5 flex gap-3">
              <button onClick={handleGetStarted} className="btn-primary-eco">
                <span>▶</span> {isAuthenticated ? `Continue Quest, ${user?.name}` : 'Start Your Quest'}
              </button>
              <button
                className="btn-secondary-eco"
                onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}
              >
                ℹ️ Learn More
              </button>
            </div>
          </div>
          <div className="grid place-items-center">
            {/* Planet visual */}
            <div className="relative w-full aspect-square max-w-[320px]">
              <div className="absolute inset-0 rounded-full shadow-2xl" style={{
                background: 'radial-gradient(circle at 30% 30%, #2bd4a6, #095233 60%)'
              }} />
              <div className="absolute inset-0 rounded-full" style={{
                background: 'radial-gradient(circle at 60% 40%, rgba(255,255,255,.15), transparent 60%)'
              }} />
              <div className="absolute -inset-3 rounded-full shadow-[0_0_40px_10px_rgba(34,211,238,.25)_inset,0_0_60px_rgba(34,211,238,.25)]" />
              <span className="absolute top-[10%] left-[15%] text-cyan-300 animate-bounce">♻️</span>
              <span className="absolute top-[20%] right-[10%] text-cyan-300 animate-bounce [animation-delay:200ms]">🔆</span>
              <span className="absolute bottom-[15%] left-[18%] text-cyan-300 animate-bounce [animation-delay:400ms]">🍃</span>
              <span className="absolute bottom-[10%] right-[15%] text-cyan-300 animate-bounce [animation-delay:600ms]">💧</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-6">
        <div className="container-eco grid md:grid-cols-4 gap-4">
          {[
            { icon: '👥', title: '50,000+', subtitle: 'Active Learners' },
            { icon: '🗺️', title: '1,000+', subtitle: 'Quests Completed' },
            { icon: '🏆', title: '25,000+', subtitle: 'Badges Earned' },
            { icon: '🌍', title: '100+', subtitle: 'Countries' },
          ].map((s, i) => (
            <div key={i} className="card-eco p-4 flex items-center gap-3">
              <div className="w-10 h-10 grid place-items-center rounded-lg bg-emerald-400/20 text-emerald-300">{s.icon}</div>
              <div>
                <h3 className="text-xl font-bold">{s.title}</h3>
                <p className="text-white/70 text-sm">{s.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-10" ref={featuresRef}>
        <div className="container-eco">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Game-Based Learning Features</h2>
            <p className="text-white/70">Discover how we make environmental education engaging and fun</p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                title: 'Interactive Quests',
                desc: 'Embark on missions to solve real-world environmental challenges through gamified scenarios.',
              },
              {
                title: 'Achievement System',
                desc: 'Earn badges, unlock levels, and collect rewards as you master environmental concepts.',
              },
              {
                title: 'Progress Tracking',
                desc: 'Monitor your learning journey with detailed analytics and personalized insights.',
              },
              {
                title: 'Social Learning',
                desc: 'Compete with friends, join teams, and participate in global environmental challenges.',
              },
            ].map((f, i) => (
              <div key={i} className="card-eco p-4">
                <div className="w-10 h-10 grid place-items-center rounded-lg bg-cyan-300/20 text-cyan-300 mb-2">★</div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-white/70 text-sm mt-1">{f.desc}</p>
                {i === 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-1 h-2 bg-white/10 rounded">
                      <div className="h-2 rounded bg-gradient-to-r from-emerald-400 to-cyan-300" style={{ width: '75%' }} />
                    </div>
                    <span className="text-sm">75% Complete</span>
                  </div>
                )}
                {i === 1 && (
                  <div className="flex gap-2 mt-3 text-lg">
                    <span>🌱</span>
                    <span>♻️</span>
                    <span>🌊</span>
                    <span className="opacity-50">🔒</span>
                  </div>
                )}
                {i === 2 && (
                  <div className="flex gap-1 h-14 items-end mt-2">
                    {[60, 80, 45, 90].map((h, b) => (
                      <div key={b} className="w-3 rounded bg-gradient-to-b from-cyan-300 to-transparent" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                )}
                {i === 3 && (
                  <div className="flex gap-2 mt-3 text-sm">
                    <span className="px-2 py-1 rounded bg-white/10">#1 Sarah</span>
                    <span className="px-2 py-1 rounded bg-white/10">#2 Mike</span>
                    <span className="px-2 py-1 rounded bg-emerald-400/20 text-emerald-900">#3 You</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Quiz */}
      <section className="py-8">
        <div className="container-eco">
          <div className="card-eco p-5 max-w-3xl">
            <h3 className="text-xl font-bold">🧠 Quick Environmental Quiz</h3>
            <p className="text-white/70">Test your knowledge and earn points!</p>
            <div className="mt-3 grid md:grid-cols-2 gap-3">
              {[{ t: '50%', c: false }, { t: '25%', c: false }, { t: '9%', c: true }, { t: '75%', c: false }].map((o, i) => (
                <button
                  key={i}
                  className="px-3 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-cyan-300/10 hover:border-cyan-300/30 text-left"
                  onClick={() => {
                    if (o.c) {
                      addPoints(50);
                      alert('Correct! +50 points');
                    } else {
                      alert('Not quite. Try the next quest!');
                    }
                  }}
                >
                  {o.t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-10">
        <div className="container-eco">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Choose Your Learning Path</h2>
            <p className="text-white/70">Select a specialized track that matches your interests</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: '🌊', title: 'Ocean Guardian', desc: 'Dive deep into marine conservation and ocean health', levels: 12, weeks: 8, progress: 30 },
              { icon: '🌳', title: 'Forest Protector', desc: 'Learn about deforestation, biodiversity, and forest conservation', levels: 15, weeks: 10, progress: 0 },
              { icon: '☀️', title: 'Clean Energy Champion', desc: 'Explore renewable energy and sustainable technology solutions', levels: 10, weeks: 6, progress: 60 },
            ].map((p, i) => (
              <div key={i} className="card-eco p-4">
                <div className="flex items-center gap-2 mb-1"><span className="text-xl">{p.icon}</span><h3 className="font-semibold">{p.title}</h3></div>
                <p className="text-white/70 text-sm">{p.desc}</p>
                <div className="text-white/60 text-sm mt-2">{p.levels} Levels • {p.weeks} weeks</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-2 bg-white/10 rounded">
                    <div className="h-2 rounded bg-gradient-to-r from-emerald-400 to-cyan-300" style={{ width: `${p.progress}%` }} />
                  </div>
                  <span className="text-sm">{p.progress ? `${Math.round((p.progress/100)*p.levels)}/${p.levels} Complete` : 'Start Now'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10">
        <div className="container-eco">
          <div className="card-eco p-6 text-center bg-gradient-to-br from-white/5 to-transparent">
            <h2 className="text-2xl font-bold">Ready to Save the Planet?</h2>
            <p className="text-white/70 mt-1">
              {isAuthenticated 
                ? `Welcome back, ${user?.name}! Continue your environmental journey.`
                : 'Join thousands of eco-warriors in the ultimate environmental education adventure!'
              }
            </p>
            <button onClick={handleGetStarted} className="btn-primary-eco mt-4 inline-flex">
              <span>🚀</span> {isAuthenticated ? 'Continue Adventure' : 'Join the Adventure'}
            </button>
          </div>
        </div>
      </section>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        initialMode={authMode}
      />
    </div>
  );
}
