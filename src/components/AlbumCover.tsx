import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Cake, BookOpen, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

interface AlbumCoverProps {
  personName: string;
  age: number;
  previewImages: string[];
  onOpenAlbum: () => void;
}

export const AlbumCover: React.FC<AlbumCoverProps> = ({
  personName,
  age,
  previewImages,
  onOpenAlbum,
}) => {
  const handleOpenClick = () => {
    soundManager.playMagicChime();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#fb7185', '#fda4af', '#fde047', '#ffffff', '#c084fc'],
    });
    onOpenAlbum();
  };

  return (
    <div
      id="romantic-album-cover"
      className="relative w-full max-w-sm sm:max-w-md mx-auto my-3 rounded-[32px] p-5 sm:p-7 overflow-hidden border-2 border-rose-200/90 shadow-[0_20px_50px_rgba(244,114,182,0.25)] bg-gradient-to-b from-[#fffbf7] via-[#fff4ea] to-[#fdeef2] text-neutral-800"
    >
      {/* Rose Gold & Pastel Sparkle Highlights */}
      <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-rose-300/30 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-amber-200/40 blur-2xl pointer-events-none" />

      {/* Floating Pastel Balloons & Decorative Ribbons */}
      <motion.div
        animate={{ y: [-6, 6, -6], rotate: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="absolute top-4 left-4 z-10 text-2xl select-none"
      >
        🎈
      </motion.div>
      <motion.div
        animate={{ y: [6, -6, 6], rotate: [4, -4, 4] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-6 right-5 z-10 text-2xl select-none"
      >
        🎀
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="absolute bottom-16 right-4 z-10 text-xl select-none"
      >
        🌸
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.25, 1], y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut', delay: 0.8 }}
        className="absolute bottom-20 left-4 z-10 text-xl select-none"
      >
        💕
      </motion.div>

      {/* Delicate Decorative Top Stamp */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/90 border border-rose-300/60 text-rose-600 text-[10px] font-bold tracking-wider uppercase mb-2 shadow-xs"
        >
          <Sparkles className="w-3 h-3 text-rose-500 animate-spin" style={{ animationDuration: '4s' }} />
          <span>A Magical Keepsake</span>
          <Sparkles className="w-3 h-3 text-rose-500 animate-spin" style={{ animationDuration: '4s' }} />
        </motion.div>

        {/* Cover Title */}
        <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-rose-950 tracking-tight leading-tight">
          🎂 OUR BIRTHDAY MEMORIES 💕
        </h1>

        <p className="font-dancing text-lg sm:text-xl font-bold text-rose-700/90 mt-1">
          A little book full of beautiful moments...
        </p>

        {/* Personalized dedication */}
        <div className="mt-1 mb-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/80 border border-rose-200 text-xs font-semibold text-neutral-700 shadow-xs">
          <span>Dedicated to</span>
          <strong className="text-rose-600 font-bold">{personName}</strong>
          <span>• Turning {age} ✨</span>
        </div>

        {/* Centerpiece: Cute Birthday Cake with Glowing Candles & Fanned Polaroids */}
        <div className="relative my-3 w-full flex flex-col items-center justify-center">
          {/* Fanned out Polaroid previews behind the cake */}
          <div className="relative w-64 h-36 flex items-center justify-center mb-1">
            {previewImages[0] && (
              <motion.div
                initial={{ rotate: -14, x: -35 }}
                animate={{ rotate: [-14, -12, -14], x: [-35, -30, -35] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute w-24 h-28 bg-white p-1.5 pb-4 rounded-xl shadow-lg border border-rose-200/80 -translate-y-2"
              >
                <img
                  src={previewImages[0]}
                  alt="Preview 1"
                  className="w-full h-20 object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />
                <div className="w-8 h-1 bg-rose-200/80 rounded-full mx-auto mt-1" />
              </motion.div>
            )}

            {previewImages[2] && (
              <motion.div
                initial={{ rotate: 14, x: 35 }}
                animate={{ rotate: [14, 12, 14], x: [35, 30, 35] }}
                transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: 0.3 }}
                className="absolute w-24 h-28 bg-white p-1.5 pb-4 rounded-xl shadow-lg border border-rose-200/80 -translate-y-2"
              >
                <img
                  src={previewImages[2]}
                  alt="Preview 2"
                  className="w-full h-20 object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />
                <div className="w-8 h-1 bg-rose-200/80 rounded-full mx-auto mt-1" />
              </motion.div>
            )}

            {previewImages[1] && (
              <motion.div
                animate={{ y: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="relative z-10 w-28 h-32 bg-white p-1.5 pb-5 rounded-xl shadow-xl border-2 border-rose-300"
              >
                <div className="washi-tape-gold -top-2 left-6 w-14" />
                <img
                  src={previewImages[1]}
                  alt="Preview Center"
                  className="w-full h-22 object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />
                <p className="font-dancing text-center text-xs font-bold text-rose-600 mt-1">
                  Sweet Memories ✨
                </p>
              </motion.div>
            )}
          </div>

          {/* Cute Birthday Cake Illustration */}
          <div className="relative mt-2 flex flex-col items-center">
            {/* Glowing candle flames */}
            <div className="flex items-center gap-3 mb-0.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.25, 0.9, 1],
                      opacity: [0.9, 1, 0.85, 0.9],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8 + i * 0.2,
                      ease: 'easeInOut',
                    }}
                    className="w-2.5 h-4 rounded-full bg-gradient-to-t from-amber-400 via-yellow-200 to-white shadow-[0_0_12px_rgba(251,191,36,0.95)]"
                  />
                  <div className="w-1.5 h-4 bg-gradient-to-b from-rose-300 to-pink-400 rounded-t-xs" />
                </div>
              ))}
            </div>

            {/* Cake Layers */}
            <div className="w-36 h-7 rounded-t-xl bg-gradient-to-r from-rose-200 via-pink-100 to-rose-200 border border-rose-300 shadow-sm flex items-center justify-around px-2">
              <span className="text-[10px]">🍓</span>
              <span className="font-dancing text-xs font-bold text-rose-700">Sweet 19</span>
              <span className="text-[10px]">🍓</span>
            </div>
            <div className="w-44 h-8 rounded-b-xl bg-gradient-to-r from-rose-300 via-pink-200 to-rose-300 border border-rose-300 shadow-md flex items-center justify-center">
              <span className="text-xs font-cinzel font-bold text-rose-900 tracking-wider">
                👑 CELEBRATE 👑
              </span>
            </div>
          </div>
        </div>

        {/* Large Premium CTA Button */}
        <motion.button
          id="btn-open-my-memories"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleOpenClick}
          className="mt-4 w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-extrabold text-sm sm:text-base shadow-[0_10px_25px_rgba(244,114,182,0.5)] border border-rose-300/50 flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:shadow-[0_15px_30px_rgba(244,114,182,0.65)]"
        >
          <BookOpen className="w-5 h-5 text-white animate-pulse" />
          <span>📖 Open My Memories</span>
          <Sparkles className="w-4 h-4 text-yellow-200" />
        </motion.button>

        <p className="text-[11px] text-rose-600/80 font-medium mt-2 flex items-center gap-1">
          <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
          <span>Tap to flip open your handcrafted digital scrapbook</span>
        </p>
      </div>
    </div>
  );
};
