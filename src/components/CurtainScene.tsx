import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Crown } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface CurtainSceneProps {
  onOpen: () => void;
  personName?: string;
  age?: number;
}

export const CurtainScene: React.FC<CurtainSceneProps> = ({
  onOpen,
  personName = 'JAWAN URNAW',
  age = 19,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenCurtains = () => {
    if (isOpen) return;
    setIsOpen(true);
    soundManager.playCurtainSwoosh();
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div
      id="curtain-scene-container"
      onClick={handleOpenCurtains}
      className="relative w-full h-full min-h-[100dvh] sm:min-h-full overflow-hidden bg-neutral-950 flex items-center justify-center select-none cursor-pointer"
    >
      {/* Background Stage Glow that gets revealed */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/40 via-neutral-950 to-black z-0 flex flex-col items-center justify-center">
        <div className="w-64 h-64 rounded-full bg-amber-500/15 blur-3xl animate-pulse" />
      </div>

      {/* Gold Valance & Pelmet (Top Decorative Drapery) */}
      <div className="absolute top-0 left-0 right-0 h-14 z-30 pointer-events-none flex">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-full bg-gradient-to-b from-red-950 via-red-800 to-red-900 rounded-b-2xl border-b-2 border-amber-400/80 shadow-md relative"
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
          </div>
        ))}
      </div>

      {/* Gold Fringe Top Line */}
      <div className="absolute top-14 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 z-30 shadow-sm" />

      {/* Left Curtain */}
      <motion.div
        id="curtain-left"
        initial={{ x: 0, scaleX: 1 }}
        animate={isOpen ? { x: '-105%', scaleX: 0.85, opacity: 0.95 } : { x: 0, scaleX: 1 }}
        transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
        className="absolute top-0 left-0 w-1/2 h-full z-20 origin-left overflow-hidden curtain-velvet shadow-[10px_0_25px_rgba(0,0,0,0.85)]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/70 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-amber-500/30 to-transparent" />

        {/* Golden Tassel Tie-Back Rope (Left) */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 flex items-center">
          <div className="w-8 h-1.5 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full shadow-md" />
          <div className="w-3 h-6 bg-yellow-500 rounded-b-full shadow-md -ml-1 border-t border-yellow-300" />
        </div>
      </motion.div>

      {/* Right Curtain */}
      <motion.div
        id="curtain-right"
        initial={{ x: 0, scaleX: 1 }}
        animate={isOpen ? { x: '105%', scaleX: 0.85, opacity: 0.95 } : { x: 0, scaleX: 1 }}
        transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
        className="absolute top-0 right-0 w-1/2 h-full z-20 origin-right overflow-hidden curtain-velvet shadow-[-10px_0_25px_rgba(0,0,0,0.85)]"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-transparent to-black/70 pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-amber-500/30 to-transparent" />

        {/* Golden Tassel Tie-Back Rope (Right) */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center justify-end">
          <div className="w-3 h-6 bg-yellow-500 rounded-b-full shadow-md -mr-1 border-t border-yellow-300" />
          <div className="w-8 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full shadow-md" />
        </div>
      </motion.div>

      {/* Center Grand Emblem - Tap anywhere on screen to open */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            id="curtain-center-content"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2, transition: { duration: 0.3 } }}
            className="relative z-30 flex flex-col items-center justify-center text-center px-4 max-w-xs pointer-events-none"
          >
            {/* Golden Royal Crown */}
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-full bg-gradient-to-b from-amber-300 via-amber-500 to-yellow-600 p-0.5 shadow-xl shadow-amber-500/40 mb-3 flex items-center justify-center"
            >
              <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center border border-amber-400/40">
                <Crown className="w-8 h-8 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
              </div>
            </motion.div>

            {/* Title Header */}
            <h2 className="text-amber-300 tracking-[0.2em] uppercase text-[11px] font-semibold mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              Grand Birthday Premiere
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            </h2>

            <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 drop-shadow-md mb-2">
              {personName}
            </h1>

            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-950/90 border border-amber-400/50 text-amber-200 text-xs font-medium mb-3 backdrop-blur-sm shadow-xl animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>Tap Screen to Open 🎭</span>
            </div>

            <p className="text-amber-300/80 text-[10px] tracking-widest uppercase font-semibold">
              👑 {age}th Birthday Experience 👑
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
