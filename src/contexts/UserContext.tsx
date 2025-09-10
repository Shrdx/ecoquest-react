'use client';
import { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'action' | 'knowledge' | 'daily';
  icon: string;
  progress: number;
  maxProgress: number;
  xpReward: number;
  status: 'not-started' | 'in-progress' | 'completed';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: number;
  weeks: number;
  xpReward: number;
  enrolled: boolean;
}

export interface UserState {
  name: string;
  level: number;
  xp: number;
  totalXp: number;
  points: number;
  badges: Badge[];
  quests: Quest[];
  courses: Course[];
  streak: number;
  rank: number;
}

type UserAction =
  | { type: 'ADD_XP'; payload: number }
  | { type: 'ADD_POINTS'; payload: number }
  | { type: 'COMPLETE_QUEST'; payload: string }
  | { type: 'PROGRESS_QUEST'; payload: { id: string; amount: number } }
  | { type: 'EARN_BADGE'; payload: string }
  | { type: 'ENROLL_COURSE'; payload: string }
  | { type: 'START_QUEST'; payload: string };

const initialState: UserState = {
  name: 'Alex',
  level: 7,
  xp: 350,
  totalXp: 2450,
  points: 1250,
  badges: [
    { id: '1', name: 'First Quest', icon: '🏆', earned: true, earnedAt: new Date() },
    { id: '2', name: 'Water Saver', icon: '💧', earned: true, earnedAt: new Date() },
    { id: '3', name: 'Recycling Expert', icon: '♻️', earned: true, earnedAt: new Date() },
    { id: '4', name: 'Tree Hugger', icon: '🌳', earned: true, earnedAt: new Date() },
    { id: '5', name: 'Clean Energy', icon: '☀️', earned: true, earnedAt: new Date() },
    { id: '6', name: 'Ocean Guardian', icon: '🌊', earned: false },
  ],
  quests: [
    {
      id: '1',
      title: 'Ocean Cleanup Mission',
      description: 'Learn about ocean pollution and design a cleanup strategy for your local beach or waterway.',
      type: 'action',
      icon: '🌊',
      progress: 2,
      maxProgress: 5,
      xpReward: 150,
      status: 'in-progress'
    },
    {
      id: '2',
      title: 'Renewable Energy Explorer',
      description: 'Discover different types of renewable energy and calculate your home\'s potential for solar power.',
      type: 'knowledge',
      icon: '⚡',
      progress: 0,
      maxProgress: 4,
      xpReward: 120,
      status: 'not-started'
    },
    {
      id: '3',
      title: 'Plastic-Free Challenge',
      description: 'Track your plastic usage for a week and find sustainable alternatives for single-use items.',
      type: 'daily',
      icon: '♻️',
      progress: 6,
      maxProgress: 7,
      xpReward: 80,
      status: 'in-progress'
    }
  ],
  courses: [
    {
      id: '1',
      title: 'Ocean Health Fundamentals',
      description: 'Understand marine ecosystems, pollution sources, and conservation strategies.',
      category: 'oceans',
      difficulty: 'Beginner',
      modules: 6,
      weeks: 4,
      xpReward: 300,
      enrolled: false
    },
    {
      id: '2',
      title: 'Forest Biodiversity 101',
      description: 'Explore forest biomes, species interdependence, and deforestation impacts.',
      category: 'forests',
      difficulty: 'Beginner',
      modules: 8,
      weeks: 6,
      xpReward: 420,
      enrolled: false
    },
    {
      id: '3',
      title: 'Renewable Energy Systems',
      description: 'Dive into solar, wind, hydro, and emerging clean technologies.',
      category: 'energy',
      difficulty: 'Intermediate',
      modules: 7,
      weeks: 5,
      xpReward: 380,
      enrolled: false
    },
    {
      id: '4',
      title: 'Climate Change: Causes & Solutions',
      description: 'Analyze climate drivers, mitigation strategies, and adaptation planning.',
      category: 'climate',
      difficulty: 'Advanced',
      modules: 9,
      weeks: 8,
      xpReward: 520,
      enrolled: false
    }
  ],
  streak: 7,
  rank: 247
};

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'ADD_XP':
      const newTotalXp = state.totalXp + action.payload;
      const newXp = state.xp + action.payload;
      const newLevel = Math.floor(newTotalXp / 500) + 1;
      return {
        ...state,
        xp: newXp >= 500 ? newXp - 500 : newXp,
        totalXp: newTotalXp,
        level: newLevel
      };
    case 'ADD_POINTS':
      return { ...state, points: state.points + action.payload };
    case 'COMPLETE_QUEST':
      return {
        ...state,
        quests: state.quests.map(quest =>
          quest.id === action.payload
            ? { ...quest, status: 'completed' as const, progress: quest.maxProgress }
            : quest
        )
      };
    case 'PROGRESS_QUEST':
      return {
        ...state,
        quests: state.quests.map(quest =>
          quest.id === action.payload.id
            ? { 
                ...quest, 
                progress: Math.min(quest.progress + action.payload.amount, quest.maxProgress),
                status: quest.progress + action.payload.amount >= quest.maxProgress ? 'completed' : 'in-progress'
              }
            : quest
        )
      };
    case 'EARN_BADGE':
      return {
        ...state,
        badges: state.badges.map(badge =>
          badge.id === action.payload
            ? { ...badge, earned: true, earnedAt: new Date() }
            : badge
        )
      };
    case 'ENROLL_COURSE':
      return {
        ...state,
        courses: state.courses.map(course =>
          course.id === action.payload
            ? { ...course, enrolled: true }
            : course
        )
      };
    case 'START_QUEST':
      return {
        ...state,
        quests: state.quests.map(quest =>
          quest.id === action.payload
            ? { ...quest, status: 'in-progress' as const }
            : quest
        )
      };
    default:
      return state;
  }
}

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
} | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);
  
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
