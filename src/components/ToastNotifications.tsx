'use client';
import { useNotification } from '@/contexts/NotificationContext';
import { NotificationData } from '@/types/auth';

function Toast({ notification, onClose }: { notification: NotificationData; onClose: () => void }) {
  const getTypeStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20 text-green-300';
      case 'achievement':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300';
      case 'warning':
        return 'bg-orange-500/10 border-orange-500/20 text-orange-300';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-300';
      default:
        return 'bg-white/10 border-white/20 text-white';
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✅';
      case 'achievement':
        return '🏆';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <div
      className={`relative p-4 rounded-lg border backdrop-blur-md shadow-lg animate-in slide-in-from-right duration-300 ${getTypeStyles()}`}
      style={{
        animation: 'slideInFromRight 0.3s ease-out',
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-current/50 hover:text-current/80 text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-current/10"
      >
        ×
      </button>

      <div className="pr-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-1 flex-shrink-0">
            {notification.achievement ? notification.achievement.icon : getIcon()}
          </span>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white mb-1">{notification.title}</h4>
            <p className="text-sm text-current/90">{notification.message}</p>
            
            {notification.achievement && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-400/20 text-emerald-300 font-semibold">
                  +{notification.achievement.xpReward} XP
                </span>
                <span className="text-xs text-current/70">
                  {(notification.achievement.type || 'Special').charAt(0).toUpperCase() + (notification.achievement.type || 'Special').slice(1)} Achievement
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-current/20 rounded-b-lg overflow-hidden">
        <div 
          className="h-full bg-current/50 rounded-b-lg origin-left animate-shrink-width"
          style={{
            animation: `shrinkWidth ${(notification.duration || 5000) / 1000}s linear forwards`
          }}
        />
      </div>

      {/* Celebration particles for achievements */}
      {notification.type === 'achievement' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-ping"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 200}ms`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ToastNotifications() {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <>
      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes shrinkWidth {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }

        .animate-shrink-width {
          transform-origin: left;
        }
      `}</style>
      
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </>
  );
}
