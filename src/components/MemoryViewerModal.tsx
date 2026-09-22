import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Heart, Calendar, Sparkles, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MemoryItem } from '../types';
import { soundManager } from '../utils/audio';

interface MemoryViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: MemoryItem[];
  initialMemoryId: string | null;
}

export const MemoryViewerModal: React.FC<MemoryViewerModalProps> = ({
  isOpen,
  onClose,
  memories,
  initialMemoryId,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [showHeartPop, setShowHeartPop] = useState<boolean>(false);

  useEffect(() => {
    if (initialMemoryId) {
      const idx = memories.findIndex((m) => m.id === initialMemoryId);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  }, [initialMemoryId, memories]);

  if (!isOpen || memories.length === 0) return null;

  const currentMemory = memories[currentIndex] || memories[0];
  const isFinalMemory = currentIndex === memories.length - 1;

  const handlePrev = () => {
    soundManager.playPop();
    setDirection(-1);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : memories.length - 1));
  };

  const handleNext = () => {
    soundManager.playPop();
    setDirection(1);
    const nextIdx = currentIndex < memories.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(nextIdx);

    // If reaching final memory, trigger celebratory confetti!
    if (nextIdx === memories.length - 1) {
      soundManager.playCelebrationCheer();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#f472b6', '#fb7185', '#fde047', '#ffffff'],
      });
    }
  };

  const handleToggleLike = () => {
    soundManager.playPop();
    const currentId = currentMemory.id;
    const isNowLiked = !likedMap[currentId];
    setLikedMap((prev) => ({ ...prev, [currentId]: isNowLiked }));

    if (isNowLiked) {
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 1000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Dreamy Blurred Backdrop with current image background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-950/85 backdrop-blur-xl"
        >
          <img
            src={currentMemory.image}
            alt="Backdrop blur"
            className="w-full h-full object-cover opacity-20 filter blur-3xl scale-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-rose-950/20 to-black/80 pointer-events-none" />
        </motion.div>

        {/* Modal Scrapbook View Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative z-10 w-full max-w-lg bg-[#fffaf5] rounded-[30px] shadow-[0_25px_60px_rgba(244,114,182,0.35)] border-2 border-rose-200/90 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Top Washi Tape Accent */}
          <div className="washi-tape-gold -top-2 left-1/2 -translate-x-1/2 w-28 rounded-xs" />

          {/* Header Controls */}
          <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-rose-100">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌸</span>
              <div>
                <span className="text-xs font-bold text-rose-600 font-cinzel uppercase tracking-wider">
                  Memory {currentIndex + 1} of {memories.length}
                </span>
                {isFinalMemory && (
                  <span className="ml-2 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                    <Sparkles className="w-2.5 h-2.5 text-rose-500" /> Grand Finale
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-rose-50 text-neutral-600 hover:bg-rose-100 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Animated Content View (Page Slide Effect) */}
          <div className="relative flex-1 overflow-y-auto p-4 sm:p-5">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentMemory.id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex flex-col items-center"
              >
                {/* Polaroid Frame with Rose Gold Border */}
                <div className="relative w-full rounded-2xl bg-white p-2.5 sm:p-3 shadow-lg border border-rose-200/80">
                  <div className="relative rounded-xl overflow-hidden bg-neutral-900 aspect-4/3 sm:aspect-16/10 flex items-center justify-center">
                    <img
                      src={currentMemory.image}
                      alt={currentMemory.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {/* Big Heart Pop Indicator */}
                    <AnimatePresence>
                      {showHeartPop && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1.5, opacity: 1 }}
                          exit={{ scale: 2, opacity: 0 }}
                          className="absolute pointer-events-none text-rose-500 text-6xl drop-shadow-lg"
                        >
                          💖
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Tag Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-xs font-bold text-rose-700 shadow-xs border border-rose-200">
                        {currentMemory.tag || currentMemory.category}
                      </span>
                    </div>
                  </div>

                  {/* Polaroid Bottom Signature Info */}
                  <div className="mt-3 px-1">
                    <div className="flex items-center justify-between text-xs text-neutral-400 font-medium">
                      <span className="flex items-center gap-1 text-rose-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{currentMemory.date}</span>
                      </span>
                      <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                        {currentMemory.category}
                      </span>
                    </div>

                    <h2 className="font-playfair text-xl sm:text-2xl font-bold text-neutral-900 mt-1">
                      {currentMemory.title}
                    </h2>

                    <p className="font-dancing text-base sm:text-lg text-neutral-700 leading-relaxed mt-2 italic">
                      "{currentMemory.description}"
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Navigation Bar */}
          <div className="px-5 py-3 bg-white/90 border-t border-rose-100 flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Heart Favorite Button */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleToggleLike}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                likedMap[currentMemory.id]
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-300'
                  : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  likedMap[currentMemory.id] ? 'fill-white text-white' : 'text-rose-500'
                }`}
              />
              <span>{likedMap[currentMemory.id] ? 'Loved 💕' : 'Love This'}</span>
            </motion.button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <span>{isFinalMemory ? 'Restart ↺' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
