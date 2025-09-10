'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  onToggleMode: () => void;
  onClose?: () => void;
}

export default function LoginForm({ onToggleMode, onClose }: LoginFormProps) {
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(formData);
      onClose?.();
    } catch {
      // Error is handled by context
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Welcome Back! 🌱</h2>
        <p className="text-white/70 mt-1">Continue your eco-journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 text-white placeholder-white/50"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 pr-10 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 text-white placeholder-white/50"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary-eco justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Signing In...
            </div>
          ) : (
            <>🚀 Sign In</>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-white/70 text-sm">
          Don&apos;t have an account?{' '}
          <button
            onClick={onToggleMode}
            className="text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            Sign up here
          </button>
        </p>
      </div>

      {/* Demo credentials */}
      <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg">
        <p className="text-xs text-white/60 text-center">
          <strong>Demo:</strong> Try signing up with any email and password (6+ chars)
        </p>
      </div>
    </div>
  );
}
