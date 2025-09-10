'use client';
import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, User, LoginCredentials, SignupCredentials } from '@/types/auth';
import { AuthService } from '@/services/authService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
  clearError: () => void;
}

type AuthAction = 
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing user on mount
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      dispatch({ type: 'AUTH_SUCCESS', payload: currentUser });
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const user = await AuthService.login(credentials);
      AuthService.setCurrentUser(user);
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: (error as Error).message });
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const user = await AuthService.signup(credentials);
      AuthService.setCurrentUser(user);
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: (error as Error).message });
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    const updatedUser = AuthService.updateUser(updates);
    if (updatedUser) {
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
