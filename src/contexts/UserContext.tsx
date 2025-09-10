'use client';
import { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

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
  | { type: 'START_QUEST'; payload: string }
  | { type: 'INIT_STATE'; payload: UserState };

const initialState: UserState = {
  name: 'Guest',
  level: 1,
  xp: 0,
  totalXp: 0,
  points: 0,
  badges: [],
  quests: [],
  courses: [],
  streak: 0,
  rank: 0
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
    case 'INIT_STATE':
      return action.payload;
    default:
      return state;
  }
}

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
} | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { showAchievement, showSuccess } = useNotification();
  
  // Load user-specific data based on authentication
  const getUserKey = () => user ? `ecoquest_user_data_${user.id}` : 'ecoquest_user_data_guest';
  
  const loadUserData = (): UserState => {
    if (typeof window === 'undefined') return initialState;
    
    try {
      const savedData = localStorage.getItem(getUserKey());
      if (savedData) {
        const parsed = JSON.parse(savedData);

        // If this is guest data and looks like old demo data, ignore it and start fresh.
        if (!user) {
          const looksLikeOldDemo =
            parsed?.name === 'Alex' ||
            (Array.isArray(parsed?.quests) && parsed.quests.some((q: any) => q?.id === '1')) ||
            parsed?.level === 7 || parsed?.totalXp === 2450 || parsed?.points === 1250;
          if (looksLikeOldDemo) {
            return { ...initialState, name: 'Guest' };
          }
        }

        // Ensure we have all required fields with defaults (fresh baseline + saved overrides)
        return {
          ...initialState,
          ...parsed,
          name: user?.name || parsed.name || initialState.name
        };
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
    
    return {
      ...initialState,
      name: user?.name || initialState.name
    };
  };
  
  const [state, dispatch] = useReducer(userReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize user data when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      const userData = loadUserData();
      dispatch({ type: 'INIT_STATE', payload: userData });
      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  // Save data whenever state changes (but not during initialization)
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      localStorage.setItem(getUserKey(), JSON.stringify(state));
    }
  }, [state, isInitialized]);
  
  // Enhanced dispatch with notifications
  const enhancedDispatch = (action: UserAction) => {
    dispatch(action);
    
    // Handle notifications based on actions
    switch (action.type) {
      case 'ADD_XP':
        if (action.payload >= 50) {
          showSuccess(`Great job! +${action.payload} XP earned! 🌟`);
        }
        break;
        
      case 'EARN_BADGE':
        const badge = state.badges.find(b => b.id === action.payload);
        if (badge) {
          showAchievement({
            id: badge.id,
            name: badge.name,
            icon: badge.icon,
            description: `You've earned the ${badge.name} badge!`,
            type: 'special',
            xpReward: 100
          });
        }
        break;
        
      case 'COMPLETE_QUEST':
        const quest = state.quests.find(q => q.id === action.payload);
        if (quest) {
          showAchievement({
            id: quest.id,
            name: quest.title,
            icon: quest.icon,
            description: 'Quest completed successfully!',
            type: 'quest',
            xpReward: quest.xpReward
          });
          
          // Add XP for quest completion
          dispatch({ type: 'ADD_XP', payload: quest.xpReward });
        }
        break;
        
      case 'ENROLL_COURSE':
        const course = state.courses.find(c => c.id === action.payload);
        if (course) {
          showSuccess(`Successfully enrolled in ${course.title}! 📚`);
        }
        break;
    }
  };
  
  return (
    <UserContext.Provider value={{ state, dispatch: enhancedDispatch }}>
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
