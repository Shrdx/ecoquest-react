'use client';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10 bg-black/20">
      <div className="container-eco py-8 grid gap-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span className="text-emerald-400">🍃</span>
            <span>EcoQuest</span>
          </div>
          <p className="text-white/70 mt-2">Making environmental education engaging through gamification.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Learning</h4>
          <ul className="space-y-1 text-white/70 text-sm">
            <li>Courses</li>
            <li>Quests</li>
            <li>Challenges</li>
            <li>Resources</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Community</h4>
          <ul className="space-y-1 text-white/70 text-sm">
            <li>Leaderboard</li>
            <li>Forums</li>
            <li>Events</li>
            <li>Blog</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Support</h4>
          <ul className="space-y-1 text-white/70 text-sm">
            <li>Help Center</li>
            <li>Contact</li>
            <li>Privacy</li>
            <li>Terms</li>
          </ul>
        </div>
      </div>
      <div className="py-4 text-center text-white/60 text-sm">© 2024 EcoQuest. All rights reserved.</div>
    </footer>
  );
}

