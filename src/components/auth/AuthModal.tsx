'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Use a portal so the modal is rendered at the document.body level.
  // This prevents clipping by parent elements (like the sticky, blurred header).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md my-8 bg-gradient-to-br from-slate-900/98 to-slate-800/98 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-lg">
        {/* Decorative elements */}
        <div className="absolute -top-1 -left-1 w-16 h-16 bg-emerald-400/10 rounded-full blur-xl" />
        <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-cyan-400/10 rounded-full blur-xl" />
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white/80 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5"
        >
          ×
        </button>

        {/* Content */}
        <div className="p-6">
          {mode === 'login' ? (
            <LoginForm onToggleMode={toggleMode} onClose={onClose} />
          ) : (
            <SignupForm onToggleMode={toggleMode} onClose={onClose} />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
