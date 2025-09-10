'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to EcoQuest! 🌍',
    content: 'Get ready to embark on an amazing journey to save our planet! This quick tutorial will show you around.',
    position: 'center'
  },
  {
    id: 'dashboard',
    title: 'Your Dashboard 📊',
    content: 'This is your command center! Here you can see your progress, current quests, and achievements. Your XP and level are displayed at the top.',
    target: '.dashboard-welcome',
    position: 'bottom'
  },
  {
    id: 'quests',
    title: 'Start Your Quests 🏆',
    content: 'Complete environmental challenges to earn XP and unlock achievements. Each quest teaches you something new about protecting our planet!',
    target: '.quest-card',
    position: 'top'
  },
  {
    id: 'badges',
    title: 'Earn Badges & Achievements 🏅',
    content: 'As you progress, you\\'ll unlock special badges that showcase your environmental knowledge and actions!',
    target: '.badge-section',
    position: 'left'
  },
  {
    id: 'stats',
    title: 'Track Your Impact 📈',
    content: 'Monitor your learning journey with detailed stats. See your XP, completed quests, and global ranking!',
    target: '.stats-sidebar',
    position: 'left'
  },
  {
    id: 'courses',
    title: 'Explore Courses 📚',
    content: 'Dive deeper into environmental topics with our comprehensive courses. From ocean health to renewable energy!',
    position: 'center',
    action: () => {
      // This could navigate to courses page
    }
  },
  {
    id: 'notifications',
    title: 'Achievement Notifications 🎉',
    content: 'Watch for these celebration notifications when you earn XP, complete quests, or unlock achievements!',
    position: 'center'
  },
  {
    id: 'ready',
    title: 'You\\'re All Set! 🚀',
    content: 'Now you\\'re ready to start your eco-journey! Remember: every small action makes a big difference for our planet. Let\\'s save the world together!',
    position: 'center'
  }
];

interface OnboardingTutorialProps {
  isOpen: boolean;
  onComplete: () => void;
}

export default function OnboardingTutorial({ isOpen, onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const { showAchievement, showSuccess } = useNotification();

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setShowDemo(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  const handleNext = () => {
    // Show demo notification for notifications step
    if (step.id === 'notifications' && !showDemo) {
      setShowDemo(true);
      showAchievement({
        id: 'tutorial_demo',
        name: 'Tutorial Master',
        icon: '🎓',
        description: 'You completed the EcoQuest tutorial!',
        type: 'special',
        xpReward: 100
      });
      
      setTimeout(() => {
        showSuccess('Great job following along! This is how notifications work.', 'Tutorial Demo');
      }, 1000);
      return;
    }

    if (step.action) {
      step.action();
    }

    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const getOverlayPosition = () => {
    if (step.position === 'center') {
      return 'items-center justify-center';
    }
    
    // For target-based positioning, we'd use more complex logic
    // For now, center everything for simplicity
    return 'items-center justify-center';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
      {/* Overlay */}
      <div className={`flex h-full p-4 ${getOverlayPosition()}`}>
        {/* Tutorial Card */}
        <div className="relative max-w-md w-full bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-white/10 rounded-2xl shadow-2xl p-6 backdrop-blur-md">
          {/* Progress Indicator */}
          <div className="flex items-center gap-1 mb-4">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded ${
                  index <= currentStep ? 'bg-emerald-400' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Step Counter */}
          <div className="text-center mb-4">
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-400/20 text-emerald-300 font-semibold">
              Step {currentStep + 1} of {tutorialSteps.length}
            </span>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
            <p className="text-white/80 leading-relaxed">{step.content}</p>
          </div>

          {/* Interactive Elements for Specific Steps */}
          {step.id === 'dashboard' && (
            <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-emerald-400/20 rounded-full flex items-center justify-center text-emerald-300">
                  🌱
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">Tutorial User</div>
                  <div className="text-xs text-white/70">Level 1 • 0/500 XP</div>
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded">
                <div className="h-2 bg-gradient-to-r from-emerald-400 to-cyan-300 rounded w-0 animate-pulse" />
              </div>
            </div>
          )}

          {step.id === 'quests' && (
            <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌊</span>
                  <span className="font-semibold text-white text-sm">Ocean Explorer</span>
                </div>
                <span className="text-xs px-2 py-1 bg-cyan-300/20 text-cyan-300 rounded">Action Quest</span>
              </div>
              <div className="text-xs text-white/70 mb-2">Learn about marine conservation...</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/20 rounded">
                  <div className="h-1 bg-emerald-400 rounded w-1/3" />
                </div>
                <span className="text-xs text-white/70">1/3</span>
              </div>
            </div>
          )}

          {step.id === 'badges' && (
            <div className="mb-4 flex justify-center gap-2">
              {['🏆', '💧', '♻️', '🌳'].map((badge, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center text-lg ${
                    i < 2 ? 'bg-emerald-400/20 border-emerald-400/40' : 'bg-white/5 border-white/20 opacity-50'
                  }`}
                >
                  {badge}
                </div>
              ))}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 justify-between">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-sm text-white/70 hover:text-white/90 transition-colors"
            >
              Skip Tutorial
            </button>
            
            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-4 py-2 text-sm bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Back
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="px-6 py-2 text-sm font-semibold bg-emerald-400 text-emerald-950 rounded-lg hover:bg-emerald-300 transition-colors"
              >
                {showDemo ? 'Continue' : isLastStep ? 'Get Started!' : 'Next'}
              </button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-2 -left-2 w-12 h-12 bg-emerald-400/20 rounded-full blur-xl" />
          <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-cyan-400/20 rounded-full blur-xl" />
        </div>
      </div>

      {/* Pulsing hint for targeted elements */}
      {step.target && (
        <style jsx>{`
          ${step.target} {
            position: relative;
            z-index: 51;
            box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.5);
            border-radius: 8px;
            animation: pulse-hint 2s infinite;
          }
          
          @keyframes pulse-hint {
            0% { box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.5); }
            50% { box-shadow: 0 0 0 8px rgba(34, 211, 238, 0.3); }
            100% { box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.5); }
          }
        `}</style>
      )}
    </div>
  );
}
