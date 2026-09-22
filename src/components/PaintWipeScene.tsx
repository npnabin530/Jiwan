import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Crown, Eraser, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

interface PaintWipeSceneProps {
  onWipeComplete: () => void;
  personName?: string;
  age?: number;
}

export const PaintWipeScene: React.FC<PaintWipeSceneProps> = ({
  onWipeComplete,
  personName = 'Jawan Urnaw',
  age = 19,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [wipePercent, setWipePercent] = useState(0);
  const [isFullyRevealed, setIsFullyRevealed] = useState(false);
  const lastSoundTime = useRef(0);

  // Initialize canvas with red paint
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Fill with deep festive red base
    const grad = ctx.createRadialGradient(
      width / 2,
      height / 2,
      30,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.75
    );
    grad.addColorStop(0, '#ef4444');
    grad.addColorStop(0.5, '#dc2626');
    grad.addColorStop(0.85, '#991b1b');
    grad.addColorStop(1, '#450a0a');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Add playful celebratory paint splatters
    ctx.fillStyle = '#f87171';
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 30 + 10;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Gold sparkle flecks
    ctx.fillStyle = '#fbbf24';
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 3.5 + 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  useEffect(() => {
    initCanvas();
    const handleResize = () => initCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas]);

  const eraseAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';

    // Soft round eraser brush
    const brushRadius = 55;
    const radGrad = ctx.createRadialGradient(x, y, 0, x, y, brushRadius);
    radGrad.addColorStop(0, 'rgba(0,0,0,1)');
    radGrad.addColorStop(0.8, 'rgba(0,0,0,0.9)');
    radGrad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
    ctx.fill();

    const now = Date.now();
    if (now - lastSoundTime.current > 120) {
      soundManager.playWipeSparkle();
      lastSoundTime.current = now;
    }
  };

  const calculateWipedArea = () => {
    const canvas = canvasRef.current;
    if (!canvas || isFullyRevealed) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const step = 20;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparentCount = 0;
    let totalSampled = 0;

    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const index = (y * canvas.width + x) * 4 + 3;
        if (imgData[index] < 128) {
          transparentCount++;
        }
        totalSampled++;
      }
    }

    const pct = Math.round((transparentCount / totalSampled) * 100);
    setWipePercent(pct);

    if (pct >= 40 && !isFullyRevealed) {
      triggerFullReveal();
    }
  };

  const triggerFullReveal = () => {
    if (isFullyRevealed) return;
    setIsFullyRevealed(true);
    setWipePercent(100);
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#ef4444', '#10b981', '#fbbf24', '#ffffff', '#ec4899'],
    });
    setTimeout(() => {
      onWipeComplete();
    }, 2800);
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    eraseAt(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    eraseAt(e.clientX, e.clientY);
    calculateWipedArea();
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    calculateWipedArea();
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const touch = e.touches[0];
    if (touch) eraseAt(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const touch = e.touches[0];
    if (touch) {
      eraseAt(touch.clientX, touch.clientY);
      calculateWipedArea();
    }
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
    calculateWipedArea();
  };

  return (
    <div
      ref={containerRef}
      id="paint-wipe-container"
      className="relative w-full h-full min-h-[100dvh] sm:min-h-full overflow-hidden bg-neutral-950 flex items-center justify-center select-none"
    >
      {/* UNDERNEATH LAYER: The Revealed Birthday Message */}
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center text-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/50 via-neutral-950 to-black">
        <div className="w-64 h-64 rounded-full bg-amber-500/15 blur-3xl absolute pointer-events-none animate-pulse" />

        {/* Crown Icon */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5 shadow-[0_0_25px_rgba(251,191,36,0.6)] mb-3 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center">
            <Crown className="w-7 h-7 text-amber-400" />
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-amber-400 font-bold tracking-[0.2em] text-[11px] sm:text-xs uppercase mb-1.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          The Secret Message
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </p>

        {/* Dynamic Birthday Text */}
        <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.7)] leading-tight">
          Happy {age}th Birthday
        </h1>
        <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-400 to-amber-300 drop-shadow-[0_0_20px_rgba(239,68,68,0.7)] mt-1.5">
          {personName}
        </h2>

        {/* Heartfelt Note */}
        <p className="text-neutral-300 font-dancing text-lg sm:text-xl font-bold mt-3 max-w-xs text-gold-glow">
          Wishing you infinite laughter, giant victories & endless joy! ✨
        </p>

        {/* Age Level Badge */}
        <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600/30 via-amber-500/30 to-red-600/30 border border-amber-400/50 backdrop-blur-md">
          <span className="text-amber-300 font-bold text-xs tracking-wider">LEVEL {age} UNLOCKED 🚀</span>
        </div>
      </div>

      {/* TOP LAYER: Interactive Paint Scratch Canvas */}
      <canvas
        ref={canvasRef}
        id="paint-scratch-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`absolute inset-0 z-10 w-full h-full cursor-crosshair touch-none transition-opacity duration-1000 ${
          isFullyRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      {/* Floating Instructions Banner & Progress */}
      <AnimatePresence>
        {!isFullyRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-center px-4 w-full max-w-xs pointer-events-none"
          >
            <div className="pointer-events-auto bg-neutral-900/90 backdrop-blur-md border border-amber-500/40 rounded-2xl p-3 shadow-2xl shadow-black/80 flex flex-col items-center gap-2.5 w-full">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                <Eraser className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>Swipe finger to wipe red paint!</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden border border-neutral-700">
                <div
                  className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full transition-all duration-200"
                  style={{ width: `${Math.min(wipePercent * 2.5, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between w-full text-[11px] text-neutral-400 px-1">
                <span>Revealed: {wipePercent}%</span>
                <button
                  id="btn-reveal-all"
                  onClick={triggerFullReveal}
                  className="text-amber-400 hover:text-amber-300 font-semibold underline decoration-dotted transition-colors cursor-pointer"
                >
                  Reveal All ⚡
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Toast */}
      {isFullyRevealed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-8 z-30 flex items-center gap-1.5 px-5 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-bold text-xs backdrop-blur-md"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Surprise Unveiled! Fireworks next... 🎆</span>
        </motion.div>
      )}
    </div>
  );
};
