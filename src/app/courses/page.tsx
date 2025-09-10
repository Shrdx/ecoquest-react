'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';

const filters = ['All', 'Oceans', 'Forests', 'Energy', 'Climate'] as const;

type Filter = typeof filters[number];

export default function CoursesPage() {
  const { state, dispatch } = useUser();
  const [active, setActive] = useState<Filter>('All');

  const list = state.courses.filter((c) =>
    active === 'All' ? true : c.category === active.toLowerCase()
  );

  return (
    <div className="container-eco py-8">
      <h1 className="text-2xl font-bold">Courses</h1>

      <div className="flex flex-wrap gap-2 mt-3">
        {filters.map((f) => (
          <button
            key={f}
            className={`px-3 py-1.5 rounded-lg border ${active === f ? 'bg-emerald-400 text-emerald-950 border-transparent' : 'bg-white/10 border-white/15'}`}
            onClick={() => setActive(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {list.map((course) => (
          <div key={course.id} className="card-eco p-4">
            <h3 className="font-semibold">{course.title}</h3>
            <div className="text-white/70 text-sm">{course.difficulty} • {course.modules} modules • {course.weeks} weeks</div>
            <p className="text-white/70 text-sm mt-2">{course.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-emerald-300 font-semibold">+{course.xpReward} XP</span>
              {course.enrolled ? (
                <Link href="/dashboard" className="btn-secondary-eco">Go to Dashboard</Link>
              ) : (
                <button
                  className="btn-primary-eco"
                  onClick={() => { dispatch({ type: 'ENROLL_COURSE', payload: course.id }); dispatch({ type: 'ADD_POINTS', payload: 50 }); alert('Enrolled! +50 XP'); }}
                >
                  Enroll
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

