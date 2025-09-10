"use client";
import { useMemo, useState } from "react";

interface Row {
  id: number;
  name: string;
  xp: number;
}

const sampleGlobal: Row[] = [
  { id: 1, name: "Sarah M.", xp: 3120 },
  { id: 2, name: "Mike R.", xp: 2890 },
  { id: 3, name: "Priya K.", xp: 2640 },
  { id: 247, name: "You", xp: 2450 },
];

export default function LeaderboardPage() {
  const [tab, setTab] = useState<"Global" | "Friends" | "Local">("Global");
  const rows = useMemo(() => sampleGlobal, []);

  return (
    <div className="container-eco py-8">
      <h1 className="text-2xl font-bold">{tab} Leaderboard</h1>

      <div className="flex gap-2 mt-3">
        {["Global", "Friends", "Local"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as "Global" | "Friends" | "Local")}
            className={`px-3 py-1.5 rounded-lg border ${tab === t ? "bg-emerald-400 text-emerald-950 border-transparent" : "bg-white/10 border-white/15"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="card-eco mt-4 overflow-hidden">
        <div className="grid grid-cols-[60px_1fr_120px] text-white/70 px-4 py-3 bg-white/10 font-semibold">
          <div>Rank</div>
          <div>Player</div>
          <div>XP</div>
        </div>
        {rows.map((r, idx) => (
          <div key={r.id} className={`grid grid-cols-[60px_1fr_120px] items-center px-4 py-3 border-t border-white/10 ${r.name === "You" ? "bg-emerald-400/10" : ""}`}>
            <div>
              <div className={`w-8 h-8 grid place-items-center rounded-full font-bold ${idx === 0 ? "bg-yellow-400 text-black" : idx === 1 ? "bg-gray-500 text-white" : idx === 2 ? "bg-amber-700 text-black" : "bg-white/10 text-white"}`}>{r.id}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10" />
              <strong>{r.name}</strong>
            </div>
            <div className={`font-bold ${r.name === "You" ? "text-emerald-300" : ""}`}>{r.xp.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

