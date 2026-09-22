import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Music2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface SoundControlProps {
  className?: string;
}

export const SoundControl: React.FC<SoundControlProps> = ({ className = '' }) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [isMusicPlaying, setIsMusicPlaying] = useState(soundManager.getIsMusicPlaying());

  useEffect(() => {
    const interval = setInterval(() => {
      setIsMuted(soundManager.getMuted());
      setIsMusicPlaying(soundManager.getIsMusicPlaying());
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const newMuteState = soundManager.toggleMute();
    setIsMuted(newMuteState);
  };

  const handleToggleMusic = () => {
    if (isMusicPlaying) {
      soundManager.stopHappyBirthday();
      setIsMusicPlaying(false);
    } else {
      if (isMuted) {
        soundManager.setMuted(false);
        setIsMuted(false);
      }
      soundManager.playHappyBirthdayMelody();
      setIsMusicPlaying(true);
    }
  };

  return (
    <div
      id="sound-controls-panel"
      aria-label="Audio & Music Controls"
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md border border-amber-500/30 rounded-full px-3 py-1.5 shadow-xl shadow-black/40 ${className}`}
    >
      <button
        id="btn-toggle-music"
        onClick={handleToggleMusic}
        title={isMusicPlaying ? 'Pause Birthday Music' : 'Play Birthday Music'}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
          isMusicPlaying
            ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-rose-500/30 animate-pulse'
            : 'bg-neutral-800 text-neutral-300 hover:text-amber-400 hover:bg-neutral-700'
        }`}
      >
        {isMusicPlaying ? (
          <>
            <Music2 className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
            <span>Music On 🎶</span>
          </>
        ) : (
          <>
            <Music className="w-3.5 h-3.5" />
            <span>Play Music</span>
          </>
        )}
      </button>

      <button
        id="btn-toggle-sound"
        onClick={handleToggleSound}
        title={isMuted ? 'Unmute All Sounds' : 'Mute All Sounds'}
        className="p-1.5 rounded-full text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 transition-colors cursor-pointer"
      >
        {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
      </button>
    </div>
  );
};
