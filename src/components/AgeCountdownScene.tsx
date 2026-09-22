import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, PartyPopper, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

interface AgeCountdownSceneProps {
  onComplete: () => void;
  personName?: string;
  targetAge?: number;
}

export const AgeCountdownScene: React.FC<AgeCountdownSceneProps> = ({
  onComplete,
  personName = 'JAWAN URNAW',
  targetAge = 19,
}) => {
  const [currentAge, setCurrentAge] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [autoTimer, setAutoTimer] = useState<number>(4);

  useEffect(() => {
    let count = 0;
    const runCount = () => {
      if (count <= targetAge) {
        setCurrentAge(count);
        soundManager.playCountTick(count);

        if (count === targetAge) {
          setIsFinished(true);
          confetti({
            particleCount: 130,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#ef4444', '#ec4899', '#fbbf24', '#ffffff', '#10b981', '#6366f1'],
          });
          soundManager.playHappyBirthdayMelody();
        } else {
          const delay = count < 10 ? 80 : count < 16 ? 110 : count < 18 ? 160 : 260;
          count++;
          setTimeout(runCount, delay);
        }
      }
    };

    const initialTimeout = setTimeout(runCount, 300);
    return () => clearTimeout(initialTimeout);
  }, [targetAge]);

  // Automatic transition countdown once target age is reached
  useEffect(() => {
    if (!isFinished) return;
    const timer = setInterval(() => {
      setAutoTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished, onComplete]);

  return (
    <div
      id="age-countdown-container"
      className="relative w-full h-full min-h-[100dvh] sm:min-h-full overflow-hidden bg-neutral-950 flex flex-col items-center justify-center select-none px-4"
    >
      {/* Dynamic Background Beams & Lightning Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-600/20 via-red-950/30 to-neutral-950 pointer-events-none" />

      {/* Rotating light rays */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
        className="absolute w-[500px] h-[500px] rounded-full bg-[conic-gradient(from_0deg,_transparent_0_300deg,_rgba(251,191,36,0.12)_360deg)] pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-xs sm:max-w-sm">
        {/* Header Badge */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-600/40 via-amber-500/40 to-red-600/40 border border-amber-400/60 text-amber-300 text-[11px] font-bold tracking-wider uppercase mb-4 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
        >
          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-bounce" />
          <span>Age Leap (0 → {targetAge})</span>
          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-bounce" />
        </motion.div>

        <h2 className="text-neutral-300 text-sm font-semibold mb-1">
          Fast-Forwarding For
        </h2>

        <h1 className="font-cinzel text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 mb-4">
          {personName}
        </h1>

        {/* Big Animated Age Counter */}
        <div className="relative my-2 flex items-center justify-center">
          <div
            className={`absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full transition-all duration-300 ${
              isFinished
                ? 'border-4 border-amber-400 bg-amber-500/20 shadow-[0_0_60px_rgba(251,191,36,0.9)] animate-pulse'
                : 'border-2 border-dashed border-amber-500/40 animate-spin'
            }`}
            style={{ animationDuration: isFinished ? '1.5s' : '4s' }}
          />

          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentAge}
              initial={{ scale: 0.3, opacity: 0, rotate: -20 }}
              animate={{ scale: isFinished ? 1.2 : 1.05, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.5, opacity: 0, position: 'absolute' }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="relative font-cinzel font-black text-7xl sm:text-8xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-400 to-yellow-600 drop-shadow-[0_0_35px_rgba(245,158,11,1)]"
            >
              {currentAge}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Milestone Message & Auto Next Countdown */}
        <div className="min-h-[90px] flex flex-col items-center justify-center mt-4">
          <AnimatePresence>
            {isFinished && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center"
              >
                <div className="flex items-center gap-1.5 text-amber-300 font-dancing text-xl sm:text-2xl font-bold mb-2">
                  <PartyPopper className="w-5 h-5 text-rose-400" />
                  <span>Officially {targetAge} Years of Greatness!</span>
                  <PartyPopper className="w-5 h-5 text-rose-400" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-amber-500/50 text-amber-300 text-xs font-bold shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span>Next challenge starting in {autoTimer}s...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
