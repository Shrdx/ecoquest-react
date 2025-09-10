'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function DebugAuth() {
  const { login, signup, logout, user, isAuthenticated, error, isLoading } = useAuth();
  const [showDebug, setShowDebug] = useState(false);

  const handleTestSignup = async () => {
    try {
      await signup({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });
      console.log('Signup successful');
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  const handleTestLogin = async () => {
    try {
      await login({
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('Login successful');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 left-4 bg-red-500 text-white px-3 py-2 rounded text-sm z-50"
      >
        Debug Auth
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg max-w-sm text-xs z-50">
      <button
        onClick={() => setShowDebug(false)}
        className="float-right text-white/50 hover:text-white"
      >
        ×
      </button>
      
      <h3 className="font-bold mb-2">Auth Debug</h3>
      
      <div className="space-y-2">
        <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
        <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
        <div>User: {user ? user.name : 'None'}</div>
        <div>Error: {error || 'None'}</div>
        
        <div className="space-y-1 pt-2">
          <button
            onClick={handleTestSignup}
            className="block w-full bg-green-600 px-2 py-1 rounded text-xs"
            disabled={isLoading}
          >
            Test Signup
          </button>
          
          <button
            onClick={handleTestLogin}
            className="block w-full bg-blue-600 px-2 py-1 rounded text-xs"
            disabled={isLoading}
          >
            Test Login
          </button>
          
          <button
            onClick={logout}
            className="block w-full bg-red-600 px-2 py-1 rounded text-xs"
            disabled={isLoading}
          >
            Logout
          </button>
        </div>
        
        <div className="pt-2 text-xs text-gray-300">
          LocalStorage Users: {typeof window !== 'undefined' ? localStorage.getItem('ecoquest_users') || 'None' : 'SSR'}
        </div>
      </div>
    </div>
  );
}
