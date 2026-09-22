import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, HelpCircle, Target, MousePointerClick } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

interface BalloonGameSceneProps {
  onRedBalloonPopped: () => void;
  personName?: string;
  age?: number;
}

export const BalloonGameScene: React.FC<BalloonGameSceneProps> = ({
  onRedBalloonPopped,
  personName = 'Jawan',
  age = 19,
}) => {
  const [clickCount, setClickCount] = useState<number>(0);
  const [blackBalloonPos, setBlackBalloonPos] = useState({ x: 50, y: 50 }); // percentage
  const [dodgeMessage, setDodgeMessage] = useState<string>('');
  const [showRedBalloon, setShowRedBalloon] = useState<boolean>(false);
  const [redBalloonPopped, setRedBalloonPopped] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const firstName = personName.split(' ')[0] || 'Jawan';

  const funnyDodgeMessages = [
    '💨 You clicked it! But it darted away!',
    `⚡ Fast click, ${firstName}! Teleported again!`,
    '🎯 Try one more click! Almost there!',
    '🎈 Wow! Look down, the Red Balloon appeared!',
  ];

  const handleBlackBalloonClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (showRedBalloon) return;

    soundManager.playBalloonDodge();
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    const messageIndex = Math.min(nextCount - 1, funnyDodgeMessages.length - 1);
    setDodgeMessage(funnyDodgeMessages[messageIndex]);

    if (nextCount >= 4) {
      setTimeout(() => {
        setShowRedBalloon(true);
      }, 350);
    } else {
      // Safe phone bounds (25% to 75% horizontal, 30% to 65% vertical)
      const newX = Math.floor(Math.random() * 50) + 25;
      const newY = Math.floor(Math.random() * 35) + 30;
      setBlackBalloonPos({ x: newX, y: newY });
    }
  };

  const handleRedBalloonClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (redBalloonPopped) return;

    setRedBalloonPopped(true);
    soundManager.playBalloonPop();

    const clientX = 'clientX' in e ? e.clientX : (e.touches[0]?.clientX ?? window.innerWidth / 2);
    const clientY = 'clientY' in e ? e.clientY : (e.touches[0]?.clientY ?? window.innerHeight / 2);

    confetti({
      particleCount: 120,
      spread: 110,
      origin: {
        x: clientX / window.innerWidth,
        y: clientY / window.innerHeight,
      },
      colors: ['#dc2626', '#ef4444', '#f87171', '#fbbf24', '#ffffff'],
    });

    setTimeout(() => {
      onRedBalloonPopped();
    }, 450);
  };

  return (
    <div
      ref={containerRef}
      id="balloon-game-container"
      className="relative w-full h-full min-h-[100dvh] sm:min-h-full overflow-hidden bg-neutral-950 flex flex-col items-center justify-between select-none p-4"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black z-0 pointer-events-none" />

      {/* Header instructions */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 mt-2 flex flex-col items-center text-center max-w-xs"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-[11px] font-semibold mb-1.5 shadow-md">
          <Target className="w-3.5 h-3.5 text-amber-400" />
          <span>Stage 1: Balloon Hunter</span>
        </div>

        <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
          {showRedBalloon ? (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 font-extrabold animate-pulse">
              Quick! Pop the Glowing RED Balloon! 🎈
            </span>
          ) : (
            <span className="text-neutral-200">
              Tap the <span className="text-neutral-300 font-black underline decoration-amber-400">Black Balloon</span> to pop it!
            </span>
          )}
        </h1>

        {/* Click reaction toast */}
        <div className="h-7 flex items-center justify-center mt-1">
          <AnimatePresence mode="wait">
            {dodgeMessage && !showRedBalloon && (
              <motion.span
                key={clickCount}
                initial={{ opacity: 0, scale: 0.8, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -5 }}
                className="text-amber-400 text-[11px] font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 rounded-full backdrop-blur-sm shadow-md"
              >
                {dodgeMessage} ({clickCount}/4)
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Interactive Arena */}
      <div className="relative w-full flex-1 z-10">
        {/* Slippery Black Balloon (moves ONLY ON CLICK) */}
        <AnimatePresence>
          {!showRedBalloon && (
            <motion.div
              id="black-balloon"
              key="black-balloon"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                left: `${blackBalloonPos.x}%`,
                top: `${blackBalloonPos.y}%`,
              }}
              exit={{
                y: -500,
                opacity: 0,
                scale: 0.3,
                transition: { duration: 0.7, ease: 'easeIn' },
              }}
              transition={{
                type: 'spring',
                stiffness: 380,
                damping: 24,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none group touch-manipulation"
              onClick={handleBlackBalloonClick}
            >
              <div className="relative flex flex-col items-center">
                <motion.div
                  animate={{ y: [-3, 3, -3] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="mb-1 px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-600 text-amber-400 font-bold text-[9px] flex items-center gap-1 shadow-md"
                >
                  <MousePointerClick className="w-2.5 h-2.5" />
                  <span>Tap Me!</span>
                </motion.div>

                {/* Balloon Bulb */}
                <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-700 shadow-xl shadow-black/90 border border-neutral-700/60 relative flex items-center justify-center transform group-hover:scale-105 active:scale-95 transition-transform">
                  <div className="absolute top-3 left-3 w-4 h-6 rounded-full bg-white/30 blur-[1px] rotate-[-25deg]" />
                  <div className="absolute top-4 left-4 w-1.5 h-2.5 rounded-full bg-white/60" />
                  <span className="text-neutral-500 font-bold text-[10px] select-none">Pop?</span>
                </div>

                {/* Knot */}
                <div className="w-3.5 h-2.5 bg-neutral-900 rounded-b-md -mt-1 border-t border-neutral-700" />

                {/* String */}
                <motion.div
                  animate={{ rotate: [-6, 6, -6] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="w-0.5 h-16 bg-gradient-to-b from-neutral-500 via-neutral-600 to-transparent"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glowing Red Balloon Rising from Bottom */}
        <AnimatePresence>
          {showRedBalloon && !redBalloonPopped && (
            <motion.div
              id="red-balloon"
              key="red-balloon"
              initial={{ y: 400, opacity: 0, x: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                x: [0, -10, 10, 0],
              }}
              transition={{
                y: { duration: 1.1, ease: 'easeOut' },
                x: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
              }}
              className="absolute left-1/2 bottom-1/4 -translate-x-1/2 cursor-pointer group touch-manipulation"
              onClick={handleRedBalloonClick}
            >
              <div className="absolute -inset-6 rounded-full bg-red-600/30 blur-xl animate-pulse" />
              <div className="relative flex flex-col items-center">
                <motion.div
                  animate={{ y: [-3, 3, -3], scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="mb-1.5 px-3 py-0.5 rounded-full bg-amber-400 text-neutral-950 font-black text-[11px] shadow-lg shadow-amber-400/50 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>TAP TO POP! 💥</span>
                </motion.div>

                {/* Red Balloon */}
                <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-tr from-red-800 via-red-600 to-rose-400 shadow-[0_0_40px_rgba(239,68,68,0.8)] border-2 border-red-400/80 relative flex items-center justify-center transform active:scale-95 transition-transform duration-200">
                  <div className="absolute top-4 left-4 w-6 h-8 rounded-full bg-white/40 blur-[1px] rotate-[-25deg]" />
                  <div className="absolute top-5 left-5 w-2.5 h-3 rounded-full bg-white/80" />
                  <span className="font-cinzel text-amber-200 font-extrabold text-lg drop-shadow-md">
                    {age}
                  </span>
                </div>

                {/* Knot */}
                <div className="w-4 h-3 bg-red-800 rounded-b-md -mt-1 border-t border-red-500 shadow-md" />

                {/* Ribbon */}
                <motion.div
                  animate={{ rotate: [-8, 8, -8] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  className="w-1 h-20 bg-gradient-to-b from-amber-400 via-amber-500 to-yellow-600 rounded-full shadow-md shadow-amber-400/40"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hint Footer */}
      <div className="relative z-20 mb-2 text-center text-[11px] text-neutral-500 flex items-center gap-1">
        <HelpCircle className="w-3 h-3" />
        <span>{showRedBalloon ? 'Tap red balloon to wipe screen!' : 'Tap black balloon 4 times to unlock.'}</span>
      </div>
    </div>
  );
};
