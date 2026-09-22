import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Gift, BookOpen, PartyPopper, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

interface CelebrationSurpriseSceneProps {
  onOpenBook: () => void;
  personName?: string;
  age?: number;
}

interface FloatingBalloon {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;
  popped: boolean;
  drift: number;
}

const BALLOON_COLORS = [
  'from-red-600 to-rose-400',
  'from-amber-500 to-yellow-300',
  'from-pink-600 to-rose-400',
  'from-purple-600 to-indigo-400',
  'from-emerald-500 to-teal-300',
  'from-blue-600 to-cyan-400',
];

export const CelebrationSurpriseScene: React.FC<CelebrationSurpriseSceneProps> = ({
  onOpenBook,
  personName = 'Jawan',
  age = 19,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [balloons, setBalloons] = useState<FloatingBalloon[]>([]);
  const [poppedCount, setPoppedCount] = useState<number>(0);
  const [showSurpriseModal, setShowSurpriseModal] = useState<boolean>(false);
  const [noTransformed, setNoTransformed] = useState<boolean>(false);
  const [isOpeningBook, setIsOpeningBook] = useState<boolean>(false);

  const firstName = personName.split(' ')[0] || 'Jawan';

  // Initialize dynamic fireworks particles canvas
  const initFireworks = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = container.clientWidth || window.innerWidth;
    canvas.height = container.clientHeight || window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      size: number;
    }

    let particles: Particle[] = [];
    let animationFrameId: number;
    const colors = ['#ef4444', '#fbbf24', '#3b82f6', '#ec4899', '#10b981', '#a855f7', '#ffffff'];

    const createExplosion = (x: number, y: number) => {
      const pCount = 35;
      const color = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < pCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          size: Math.random() * 2.5 + 1.5,
        });
      }
    };

    let nextLaunch = 0;
    const render = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Date.now() > nextLaunch) {
        const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
        const y = Math.random() * canvas.height * 0.4 + canvas.height * 0.1;
        createExplosion(x, y);
        soundManager.playFireworkCrackle();
        nextLaunch = Date.now() + Math.random() * 900 + 500;
      }

      particles = particles.filter((p) => p.alpha > 0.02);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.alpha *= 0.96;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const cleanup = initFireworks();
    return cleanup;
  }, [initFireworks]);

  // Spawn celebratory floating balloons for mobile
  useEffect(() => {
    const initialBalloons: FloatingBalloon[] = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: 100 + Math.random() * 80,
      speed: Math.random() * 0.35 + 0.2,
      size: Math.random() * 15 + 50,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      popped: false,
      drift: Math.random() * 2 - 1,
    }));
    setBalloons(initialBalloons);

    const interval = setInterval(() => {
      setBalloons((prev) =>
        prev.map((b) => {
          if (b.popped) return b;
          let newY = b.y - b.speed;
          if (newY < -20) {
            newY = 110;
          }
          return {
            ...b,
            y: newY,
            x: Math.max(8, Math.min(92, b.x + Math.sin(newY / 15) * 0.25)),
          };
        })
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Launch surprise modal after 4.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSurpriseModal(true);
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
      });
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const handlePopBalloon = (id: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    soundManager.playBalloonPop();
    setBalloons((prev) => prev.map((b) => (b.id === id ? { ...b, popped: true } : b)));
    setPoppedCount((c) => c + 1);
    confetti({
      particleCount: 20,
      spread: 40,
      origin: { y: 0.5 },
    });
  };

  // Transform "NO" to "YES" when touched or hovered
  const handleNoInteraction = () => {
    if (!noTransformed) {
      soundManager.playMagicChime();
      setNoTransformed(true);
    }
  };

  // User accepts the grand surprise
  const handleAcceptSurprise = () => {
    setIsOpeningBook(true);
    soundManager.playMagicChime();
    confetti({
      particleCount: 160,
      spread: 120,
      origin: { y: 0.5 },
      colors: ['#fbbf24', '#f59e0b', '#ec4899', '#3b82f6', '#ffffff', '#10b981'],
    });
    setTimeout(() => {
      onOpenBook();
    }, 1100);
  };

  return (
    <div
      ref={containerRef}
      id="celebration-surprise-container"
      className="relative w-full h-full min-h-[100dvh] sm:min-h-full overflow-hidden bg-neutral-950 flex flex-col items-center justify-between select-none"
    >
      {/* Dynamic Fireworks Canvas Background */}
      <canvas
        ref={canvasRef}
        id="fireworks-canvas"
        className="absolute inset-0 z-0 w-full h-full pointer-events-none"
      />

      {/* Floating Interactive Balloons Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {balloons.map((b) => {
          if (b.popped) return null;
          return (
            <div
              key={b.id}
              id={`floating-balloon-${b.id}`}
              onClick={(e) => handlePopBalloon(b.id, e)}
              onTouchStart={(e) => handlePopBalloon(b.id, e)}
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: `${b.size}px`,
                height: `${b.size * 1.25}px`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group touch-manipulation transform active:scale-125 transition-transform"
            >
              <div
                className={`w-full h-full rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-tr ${b.color} shadow-lg shadow-black/60 border border-white/20 relative flex items-center justify-center`}
              >
                <div className="absolute top-2 left-2 w-2.5 h-4 rounded-full bg-white/40 blur-[1px] rotate-[-25deg]" />
                <span className="text-[10px] font-bold text-white/90 drop-shadow-sm">🎈</span>
              </div>
              <div className="w-2 h-1.5 bg-neutral-700 mx-auto -mt-0.5 rounded-b-sm" />
              <div className="w-0.5 h-8 bg-neutral-500/70 mx-auto" />
            </div>
          );
        })}
      </div>

      {/* Top Banner */}
      <div className="relative z-20 pt-6 px-4 text-center max-w-xs pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg mb-1">
          <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
          <span>Popped {poppedCount} Balloons!</span>
        </div>
        <h1 className="font-cinzel text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 drop-shadow-md">
          CELEBRATION TIME! 🎆
        </h1>
      </div>

      {/* Center Floating Prompt while waiting for modal */}
      {!showSurpriseModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-20 text-center px-4 py-2 rounded-full bg-neutral-900/80 backdrop-blur-md border border-amber-400/40 text-neutral-200 text-xs shadow-xl"
        >
          <span>Tap any floating balloon to pop it! 💥</span>
        </motion.div>
      )}

      {/* Bottom Spacer */}
      <div className="h-6" />

      {/* SURPRISE MODAL (No button magically converts into Yes button) */}
      <AnimatePresence>
        {showSurpriseModal && (
          <div
            id="surprise-modal-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              id="surprise-modal-box"
              initial={{ scale: 0.6, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.4, opacity: 0, filter: 'brightness(2)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="relative w-full max-w-xs sm:max-w-sm bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-7 shadow-[0_0_60px_rgba(245,158,11,0.5)] flex flex-col items-center text-center overflow-hidden"
            >
              {/* Magic Golden Sparkle Beams */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/25 rounded-full blur-2xl pointer-events-none" />

              {/* Gift / Magic Book Icon */}
              <motion.div
                animate={{
                  rotate: [0, -6, 6, -6, 0],
                  scale: [1, 1.08, 1],
                }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-red-600 via-amber-500 to-yellow-400 p-0.5 shadow-xl shadow-amber-500/40 mb-3 flex items-center justify-center"
              >
                <div className="w-full h-full rounded-2xl bg-neutral-950 flex items-center justify-center">
                  <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
                </div>
              </motion.div>

              {/* Modal Question */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Special Surprise</span>
              </div>

              <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight">
                Ready for the Surprise, {firstName}? 🎁
              </h2>

              <p className="text-neutral-300 text-xs sm:text-sm font-light mb-6">
                Your grand {age}th memory book and birthday ceremonies await!
              </p>

              {/* YES / NO Action Buttons */}
              <div className="w-full flex flex-col gap-3">
                {/* YES Button 1 */}
                <motion.button
                  id="btn-surprise-yes-main"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleAcceptSurprise}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-neutral-950 font-black text-sm shadow-[0_0_25px_rgba(245,158,11,0.6)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-neutral-950 stroke-[3]" />
                  <span>YES! Open The Memory Book! 📖</span>
                </motion.button>

                {/* NO Button -> Converts into YES on hover or touch */}
                <motion.button
                  id="btn-surprise-no-transform"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onMouseEnter={handleNoInteraction}
                  onTouchStart={handleNoInteraction}
                  onClick={noTransformed ? handleAcceptSurprise : handleNoInteraction}
                  className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                    noTransformed
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-neutral-950 shadow-[0_0_25px_rgba(16,185,129,0.6)] animate-pulse'
                      : 'bg-neutral-800/90 text-neutral-400 border border-neutral-700 hover:text-white'
                  }`}
                >
                  {noTransformed ? (
                    <>
                      <Sparkles className="w-4 h-4 text-neutral-950" />
                      <span>YES! (Magic Turned No into YES! ✨)</span>
                    </>
                  ) : (
                    <span>No, not yet... 🙈</span>
                  )}
                </motion.button>
              </div>

              {noTransformed && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-emerald-400 text-[11px] font-bold mt-3"
                >
                  Haha! &ldquo;No&rdquo; is not allowed on your {age}th birthday! 🎉
                </motion.p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bright Transition Book Opening Flash */}
      <AnimatePresence>
        {isOpeningBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[60] bg-gradient-to-t from-amber-400 via-yellow-200 to-white flex flex-col items-center justify-center text-neutral-950"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.4, 1.8] }}
              transition={{ duration: 1 }}
            >
              <BookOpen className="w-20 h-20 text-neutral-950" />
            </motion.div>
            <h2 className="font-cinzel text-2xl font-black mt-4">
              Opening The {age}th Memory Book...
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
