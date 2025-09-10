'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { NotificationData } from '@/types/auth';

interface NotificationContextType {
  notifications: NotificationData[];
  addNotification: (notification: Omit<NotificationData, 'id'>) => void;
  removeNotification: (id: string) => void;
  showAchievement: (achievement: { id: string; name?: string; title?: string; description?: string; icon: string; type?: string; xpReward?: number }, xpGained?: number) => void;
  showSuccess: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const addNotification = useCallback((notification: Omit<NotificationData, 'id'>) => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove after duration
    const duration = notification.duration || 5000;
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showAchievement = useCallback((achievement: { id: string; name?: string; title?: string; description?: string; icon: string; type?: string; xpReward?: number }, xpGained = 0) => {
    addNotification({
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: achievement.description || `You earned the ${achievement.name} achievement!`,
      achievement: {
        id: achievement.id,
        title: achievement.name || achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        type: achievement.type || 'special',
        xpReward: xpGained || achievement.xpReward || 0,
        unlockedAt: new Date().toISOString()
      },
      duration: 8000 // Longer for achievements
    });
  }, [addNotification]);

  const showSuccess = useCallback((message: string, title = 'Success!') => {
    addNotification({
      type: 'success',
      title,
      message,
      duration: 4000
    });
  }, [addNotification]);

  const showWarning = useCallback((message: string, title = 'Warning') => {
    addNotification({
      type: 'warning',
      title,
      message,
      duration: 6000
    });
  }, [addNotification]);

  const showInfo = useCallback((message: string, title = 'Info') => {
    addNotification({
      type: 'info',
      title,
      message,
      duration: 5000
    });
  }, [addNotification]);

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    showAchievement,
    showSuccess,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
