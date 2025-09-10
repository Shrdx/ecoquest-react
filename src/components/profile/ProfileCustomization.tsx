'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthService } from '@/services/authService';
import { EcoTheme } from '@/types/auth';

interface ProfileCustomizationProps {
  onClose?: () => void;
}

export default function ProfileCustomization({ onClose }: ProfileCustomizationProps) {
  const { user, updateProfile } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '🌱');
  const [selectedTheme, setSelectedTheme] = useState(user?.theme || AuthService.getEcoThemes()[0]);
  const [isLoading, setIsLoading] = useState(false);

  const avatars = AuthService.getAvatars();
  const themes = AuthService.getEcoThemes();

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      updateProfile({
        avatar: selectedAvatar,
        theme: selectedTheme
      });
      
      // Show success notification
      onClose?.();
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getThemePreview = (theme: EcoTheme) => {
    return {
      background: `linear-gradient(135deg, ${theme.primary}20, ${theme.secondary}20)`,
      border: `1px solid ${theme.primary}40`
    };
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Customize Your Profile</h2>
        <p className="text-white/70">Choose your avatar and eco-theme to personalize your experience</p>
      </div>

      {/* Avatar Selection */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">{selectedAvatar}</span>
          Choose Your Avatar
        </h3>
        <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-12 gap-3">
          {avatars.map((avatar, index) => (
            <button
              key={index}
              onClick={() => setSelectedAvatar(avatar)}
              className={`w-12 h-12 text-2xl rounded-lg border-2 transition-all hover:scale-105 ${
                selectedAvatar === avatar
                  ? 'border-emerald-400 bg-emerald-400/20 shadow-lg'
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}
            >
              {avatar}
            </button>
          ))}
        </div>
      </section>

      {/* Theme Selection */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          🎨 Choose Your Eco-Theme
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {themes.map((theme) => (
            <button
              key={theme.name}
              onClick={() => setSelectedTheme(theme)}
              className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                selectedTheme.name === theme.name
                  ? 'border-white/40 shadow-lg'
                  : 'border-white/20 hover:border-white/30'
              }`}
              style={getThemePreview(theme)}
            >
              <div className="text-center">
                <div className="text-lg font-semibold text-white mb-1">{theme.name}</div>
                <div className="flex justify-center gap-2 mb-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: theme.secondary }}
                  />
                </div>
                <div className="text-xs text-white/70">
                  {theme.name === 'Forest' && '🌲 Natural & Growing'}
                  {theme.name === 'Ocean' && '🌊 Cool & Flowing'}
                  {theme.name === 'Desert' && '🏜️ Warm & Energetic'}
                  {theme.name === 'Arctic' && '❄️ Pure & Mystical'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Preview Section */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
        <div 
          className="p-4 rounded-xl border"
          style={getThemePreview(selectedTheme)}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
              {selectedAvatar}
            </div>
            <div>
              <div className="font-semibold text-white">{user?.name || 'Your Name'}</div>
              <div className="text-sm" style={{ color: selectedTheme.primary }}>
                Eco-Warrior • {selectedTheme.name} Theme
              </div>
            </div>
          </div>
          
          {/* Sample UI Elements */}
          <div className="mt-4 space-y-2">
            <div 
              className="px-3 py-2 rounded-lg text-sm font-semibold"
              style={{ 
                backgroundColor: selectedTheme.primary, 
                color: selectedTheme.name === 'Desert' ? '#000' : '#fff' 
              }}
            >
              Primary Button
            </div>
            <div className="flex gap-2">
              <div 
                className="flex-1 h-2 rounded"
                style={{ backgroundColor: selectedTheme.primary + '40' }}
              >
                <div 
                  className="h-2 rounded"
                  style={{ 
                    width: '60%', 
                    background: `linear-gradient(90deg, ${selectedTheme.primary}, ${selectedTheme.secondary})` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-2 rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ 
            backgroundColor: selectedTheme.primary,
            color: selectedTheme.name === 'Desert' ? '#000' : '#fff'
          }}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Saving...
            </div>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
}
