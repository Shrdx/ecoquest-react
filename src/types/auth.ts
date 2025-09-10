export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  theme: EcoTheme;
  joinDate: string;
  lastLogin: string;
  isNewUser: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface EcoTheme {
  name: string;
  primary: string;
  secondary: string;
  background: string;
}

export interface Achievement {
  id: string;
  title?: string;
  description?: string;
  icon: string;
  type?: 'xp' | 'quest' | 'streak' | 'social' | 'special';
  xpReward?: number;
  unlockedAt?: string;
}

export interface NotificationData {
  id: string;
  type: 'success' | 'achievement' | 'warning' | 'info';
  title: string;
  message: string;
  achievement?: Achievement;
  duration?: number;
}
