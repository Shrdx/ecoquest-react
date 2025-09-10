'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SignupFormProps {
  onToggleMode: () => void;
  onClose?: () => void;
}

export default function SignupForm({ onToggleMode, onClose }: SignupFormProps) {
  const { signup, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await signup(formData);
      onClose?.();
    } catch (err) {
      // Error is handled by context
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4:
      case 5: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4:
      case 5: return 'Strong';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Join EcoQuest! 🌍</h2>
        <p className="text-white/70 mt-1">Start your environmental journey today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 text-white placeholder-white/50"
            placeholder="Your eco-warrior name"
          />
        </div>

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
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-1 bg-white/10 rounded">
                  <div 
                    className={`h-1 rounded transition-all ${getStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
                <span className={`text-xs ${getStrengthColor().replace('bg-', 'text-')}`}>
                  {getStrengthText()}
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-white/5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 text-white placeholder-white/50 ${
              formData.confirmPassword && formData.password !== formData.confirmPassword 
                ? 'border-red-500/50' 
                : 'border-white/10'
            }`}
            placeholder="Confirm your password"
          />
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-red-300 text-xs mt-1">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary-eco justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Creating Account...
            </div>
          ) : (
            <>🌱 Create Account</>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-white/70 text-sm">
          Already have an account?{' '}
          <button
            onClick={onToggleMode}
            className="text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            Sign in here
          </button>
        </p>
      </div>

      <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg">
        <p className="text-xs text-white/60 text-center">
          By signing up, you agree to join our mission to save the planet! 🌍✨
        </p>
      </div>
    </div>
  );
}
