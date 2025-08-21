"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SoundContextType {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  playSound: (soundType: 'success' | 'error' | 'click' | 'connection') => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const savedSettings = window.localStorage.getItem('gameSettings');
      if (savedSettings) {
        const { soundEnabled } = JSON.parse(savedSettings);
        return soundEnabled ?? true;
      }
    } catch {}
    return true;
  });

  // Update localStorage when soundEnabled changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedSettings = window.localStorage.getItem('gameSettings');
      const settings = savedSettings ? JSON.parse(savedSettings) : {};
      window.localStorage.setItem('gameSettings', JSON.stringify({
        ...settings,
        soundEnabled
      }));
    } catch {}
  }, [soundEnabled]);

  const [sounds, setSounds] = useState<null | {
    success: HTMLAudioElement;
    error: HTMLAudioElement;
    click: HTMLAudioElement;
    connection: HTMLAudioElement;
  }>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setSounds({
      success: new Audio('/sounds/success.mp3'),
      error: new Audio('/sounds/error.mp3'),
      click: new Audio('/sounds/click.mp3'),
      connection: new Audio('/sounds/connection.mp3'),
    });
  }, []);

  const playSound = (soundType: 'success' | 'error' | 'click' | 'connection') => {
    // Only play sound if soundEnabled is true
    if (!soundEnabled) return;
    if (!sounds) return;

    if (sounds[soundType]) {
      // Reset the audio to start
      sounds[soundType].currentTime = 0;
      // Play the sound
      const playPromise = sounds[soundType].play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Audio play failed:", error);
        });
      }
    }
  };

  return (
    <SoundContext.Provider value={{ 
      soundEnabled, 
      setSoundEnabled,
      playSound
    }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
} 