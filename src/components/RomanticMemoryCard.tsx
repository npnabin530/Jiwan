import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, ZoomIn, Calendar, Bookmark } from 'lucide-react';
import { MemoryItem } from '../types';
import { soundManager } from '../utils/audio';

interface RomanticMemoryCardProps {
  memory: MemoryItem;
  index: number;
  onOpenViewer: (memory: MemoryItem) => void;
}

export const RomanticMemoryCard: React.FC<RomanticMemoryCardProps> = ({
  memory,
  index,
  onOpenViewer,
}) => {
  const [likes, setLikes] = useState<number>(() => 12 + (index * 7) % 23);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playPop();

    const newLiked = !hasLiked;
    setHasLiked(newLiked);
    setLikes((prev) => (newLiked ? prev + 1 : prev - 1));

    if (newLiked) {
      const heartId = Date.now();
      const randomX = (Math.random() - 0.5) * 40;
      setFloatingHearts((prev) => [...prev, { id: heartId, x: randomX }]);
      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((h) => h.id !== heartId));
      }, 1200);
    }
  };

  const rotation = memory.rotation ?? (index % 2 === 0 ? -2 : 2.5);
  const isFeatured = memory.layoutVariant === 'featured';

  return (
    <motion.div
      id={`memory-card-${memory.id}`}
      initial={{ opacity: 0, y: 30, rotate: rotation }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      whileHover={{ y: -6, scale: 1.02, rotate: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      onClick={() => onOpenViewer(memory)}
      className={`relative rounded-2xl bg-white p-3 sm:p-4 shadow-[0_10px_25px_rgba(244,114,182,0.15)] border border-rose-200/80 cursor-pointer group transition-shadow hover:shadow-[0_20px_35px_rgba(244,114,182,0.3)] ${
        isFeatured ? 'col-span-full' : ''
      }`}
    >
      {/* Washi Tape Accent */}
      {memory.tapeType === 'gold' ? (
        <div className="washi-tape-gold -top-2.5 left-1/2 -translate-x-1/2 w-20 rounded-xs" />
      ) : memory.tapeType === 'corner' ? (
        <div className="washi-tape -top-2 -right-3 w-16 rotate-45 rounded-xs" />
      ) : (
        <div className="washi-tape -top-2.5 left-1/2 -translate-x-1/2 w-20 rounded-xs" />
      )}

      {/* Cute Decorative Corner Sticker */}
      {memory.sticker && (
        <div className="absolute -top-3 -right-2 z-20 text-2xl select-none filter drop-shadow-sm transform group-hover:scale-125 transition-transform">
          {memory.sticker}
        </div>
      )}

      {/* Photo Frame Container */}
      <div className="relative overflow-hidden rounded-xl bg-neutral-100 border border-rose-100">
        <img
          src={memory.image}
          alt={memory.title}
          className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isFeatured ? 'h-56 sm:h-64' : 'h-44 sm:h-48'
          }`}
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Floating Category Tag Badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-bold text-rose-700 shadow-xs border border-rose-200">
            {memory.tag || memory.category}
          </span>
        </div>

        {/* Click to Expand Overlay Pill */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold">
            <ZoomIn className="w-3 h-3 text-rose-300" />
            <span>View</span>
          </span>
        </div>
      </div>

      {/* Scrapbook Handwritten Details */}
      <div className="mt-3 px-1 flex flex-col gap-1">
        {/* Date Stamp */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3 h-3 text-rose-400" />
            <span>{memory.date}</span>
          </span>
          <span className="text-[10px] uppercase tracking-wider text-rose-400 font-bold">
            {memory.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-playfair text-base sm:text-lg font-bold text-neutral-900 leading-snug group-hover:text-rose-600 transition-colors">
          {memory.title}
        </h3>

        {/* Handwritten Style Caption */}
        <p className="font-dancing text-sm sm:text-base text-neutral-700 leading-relaxed italic line-clamp-2">
          "{memory.description}"
        </p>

        {/* Bottom Interactive Row: Heart reaction & details */}
        <div className="mt-2 pt-2 border-t border-rose-100 flex items-center justify-between">
          <div className="relative">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                hasLiked
                  ? 'bg-rose-100 text-rose-600 border border-rose-300 scale-105'
                  : 'bg-neutral-50 text-neutral-500 hover:bg-rose-50 hover:text-rose-500 border border-neutral-200'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 transition-transform ${
                  hasLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''
                }`}
              />
              <span>{likes}</span>
            </button>

            {/* Floating Pop Hearts */}
            <AnimatePresence>
              {floatingHearts.map((heart) => (
                <motion.div
                  key={heart.id}
                  initial={{ opacity: 1, y: 0, scale: 0.8, x: heart.x }}
                  animate={{ opacity: 0, y: -45, scale: 1.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  className="absolute left-3 top-0 pointer-events-none text-rose-500 text-sm z-30"
                >
                  ❤️
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <span className="text-[11px] text-rose-400 font-medium font-outfit flex items-center gap-0.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Cherished Moment</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};
