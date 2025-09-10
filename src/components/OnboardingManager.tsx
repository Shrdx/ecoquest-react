'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import OnboardingTutorial from './onboarding/OnboardingTutorial';

export default function OnboardingManager() {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess } = useNotification();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Show onboarding for new authenticated users
    if (isAuthenticated && user?.isNewUser) {
      // Small delay to let the UI settle
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user?.isNewUser]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    
    // Welcome the user
    showSuccess(
      `Welcome to EcoQuest, ${user?.name}! Ready to save the planet? 🌍`,
      'Adventure Begins!'
    );
    
    // Mark user as no longer new
    if (user) {
      // This would typically update the user's isNewUser flag
      // For now, it's handled by the auth context
    }
  };

  return (
    <OnboardingTutorial
      isOpen={showOnboarding}
      onComplete={handleOnboardingComplete}
    />
  );
}
