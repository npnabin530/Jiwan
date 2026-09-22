import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Heart,
  Flame,
  MessageSquare,
  Plus,
  RotateCcw,
  BookOpen,
  Send,
  Crown,
  Gamepad2,
  Scroll,
  ArrowRight,
  Folder,
  Layers,
  Settings,
  Upload,
  Cake as CakeIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MemoryItem, BirthdayWish, Album, CelebrationSettings } from '../types';
import { soundManager } from '../utils/audio';
import { AlbumCover } from './AlbumCover';
import { RomanticMemoryCard } from './RomanticMemoryCard';
import { MemoryViewerModal } from './MemoryViewerModal';
import { TicTacToeGame } from './TicTacToeGame';
import { TicTacToeSettings } from '../types';

interface MemoryBookSceneProps {
  onRestart: () => void;
  memories: MemoryItem[];
  albums: Album[];
  wishes: BirthdayWish[];
  onAddWish: (wish: BirthdayWish) => void;
  settings: CelebrationSettings;
  tictactoeSettings?: TicTacToeSettings;
  onOpenAdmin?: () => void;
}


type StageType = 'memories' | 'tictactoe' | 'cake' | 'letter';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Memories', icon: '✨' },
  { id: 'Our Moments', label: '💕 Our Moments', icon: '💕' },
  { id: 'Favorite Photos', label: '📸 Favorite Photos', icon: '📸' },
  { id: 'Silly Memories', label: '😂 Silly Memories', icon: '😂' },
  { id: 'Little Messages', label: '💌 Little Messages', icon: '💌' },
  { id: 'Birthday Moments', label: '🎂 Birthday Moments', icon: '🎂' },
  { id: 'Special Days', label: '✨ Special Days', icon: '✨' },
];

export const MemoryBookScene: React.FC<MemoryBookSceneProps> = ({
  onRestart,
  memories,
  albums,
  wishes,
  onAddWish,
  settings,
  tictactoeSettings,
  onOpenAdmin,
}) => {
  const [currentStage, setCurrentStage] = useState<StageType>('memories');
  const [isAlbumOpen, setIsAlbumOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewerMemoryId, setViewerMemoryId] = useState<string | null>(null);

  // 19th Birthday Cake Candle state
  const [candlesBlown, setCandlesBlown] = useState<boolean>(false);
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);

  // Wishes Form State inside Letter stage
  const [showWishesWall, setShowWishesWall] = useState<boolean>(false);
  const [authorName, setAuthorName] = useState<string>('');
  const [relationText, setRelationText] = useState<string>('');
  const [messageText, setMessageText] = useState<string>('');
  const [isAddingWish, setIsAddingWish] = useState<boolean>(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  // Filter memories by category or custom album
  const filteredMemories = memories.filter((m) => {
    if (selectedCategory === 'all') return true;
    if (m.category === selectedCategory) return true;
    if (m.albumId === selectedCategory) return true;
    return false;
  });

  const previewImages = memories.slice(0, 3).map((m) => m.image);

  const handleOpenAlbum = () => {
    setIsAlbumOpen(true);
    soundManager.playMagicChime();
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#fb7185', '#fde047', '#ffffff', '#c084fc'],
    });
  };

  const handleOpenViewer = (memory: MemoryItem) => {
    setViewerMemoryId(memory.id);
    soundManager.playMagicChime();
  };

  const handleBlowCandles = () => {
    if (candlesBlown) return;
    setCandlesBlown(true);
    soundManager.playCandleBlow();
    confetti({
      particleCount: 150,
      spread: 110,
      origin: { y: 0.55 },
      colors: ['#fbbf24', '#f59e0b', '#ef4444', '#10b981', '#ffffff'],
    });
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      setIsListeningMic(false);
    }
  };

  const toggleMicBlow = async () => {
    if (isListeningMic) {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      setIsListeningMic(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      setIsListeningMic(true);
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (!isListeningMic || candlesBlown) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        if (average > 50) {
          handleBlowCandles();
          return;
        }
        requestAnimationFrame(checkVolume);
      };
      requestAnimationFrame(checkVolume);
    } catch {
      setIsListeningMic(false);
      alert(`Microphone access unavailable. Tap the "Blow Out ${settings.age} Candles" button directly!`);
    }
  };

  const handleAddWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !messageText.trim()) return;

    const colors = [
      'bg-rose-500',
      'bg-amber-500',
      'bg-pink-500',
      'bg-fuchsia-500',
      'bg-purple-500',
      'bg-red-500',
    ];
    const newWish: BirthdayWish = {
      id: `w-${Date.now()}`,
      author: authorName.trim(),
      relation: relationText.trim() || 'Friend',
      message: messageText.trim(),
      timestamp: 'Just now',
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
    };

    onAddWish(newWish);
    setAuthorName('');
    setRelationText('');
    setMessageText('');
    setIsAddingWish(false);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
  };

  return (
    <div
      id="romantic-memory-book-container"
      className="relative w-full h-full min-h-[100dvh] sm:min-h-full bg-cream-scrapbook scrapbook-paper-texture text-neutral-800 flex flex-col items-center justify-between pb-12 overflow-x-hidden select-none"
    >
      {/* Delicate Floating Ribbons, Hearts & Sparkles in the background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute top-12 left-4 text-3xl opacity-40"
        >
          🎈
        </motion.div>
        <motion.div
          animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
          className="absolute top-28 right-4 text-2xl opacity-40"
        >
          🌸
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="absolute bottom-24 left-6 text-2xl opacity-40"
        >
          🎀
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.25, 1], y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }}
          className="absolute bottom-32 right-6 text-2xl opacity-40"
        >
          💕
        </motion.div>
      </div>

      {/* Header with Romantic Brand and Admin Link */}
      <header className="relative z-20 w-full px-4 pt-3.5 pb-2.5 flex items-center justify-between border-b border-rose-200/80 bg-white/70 backdrop-blur-md shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-300 p-0.5 shadow-md shadow-rose-300/40">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <span className="text-sm">🎂</span>
            </div>
          </div>
          <div>
            <h1 className="font-playfair text-sm sm:text-base font-bold text-rose-950 truncate max-w-[140px] sm:max-w-xs">
              {settings.personName}
            </h1>
            <p className="font-dancing text-rose-600 text-xs font-bold -mt-0.5">
              Sweet {settings.age}th Keepsake 💕
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Admin CMS Studio Button */}
          {onOpenAdmin && (
            <button
              id="btn-header-admin-cms"
              onClick={onOpenAdmin}
              title="Open Admin CMS Studio"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 hover:text-rose-800 text-xs font-bold cursor-pointer shadow-xs transition-colors"
            >
              <Settings className="w-3 h-3 text-rose-500" />
              <span>Admin CMS</span>
            </button>
          )}

          {/* Restart */}
          <button
            id="btn-restart-celebration"
            onClick={onRestart}
            title="Replay from Beginning"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white border border-rose-200 text-neutral-600 hover:text-rose-600 text-xs cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Replay</span>
          </button>
        </div>
      </header>

      {/* Stage Navigation Pills */}
      <div className="relative z-20 w-full px-3 pt-2.5 flex items-center justify-center gap-1 sm:gap-2">
        <button
          onClick={() => setCurrentStage('memories')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
            currentStage === 'memories'
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-300/50'
              : 'bg-white/80 text-neutral-600 hover:bg-rose-50 hover:text-rose-600 border border-rose-200'
          }`}
        >
          <BookOpen className="w-3 h-3" />
          <span>Scrapbook ({memories.length})</span>
        </button>

        {tictactoeSettings?.enabled !== false && (
          <button
            id="tab-stage-tictactoe"
            onClick={() => setCurrentStage('tictactoe')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              currentStage === 'tictactoe'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-300/50'
                : 'bg-white/80 text-neutral-600 hover:bg-rose-50 hover:text-rose-600 border border-rose-200'
            }`}
          >
            <Gamepad2 className="w-3 h-3" />
            <span>Tic-Tac-Toe 🎮</span>
          </button>
        )}

        <button
          onClick={() => setCurrentStage('cake')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
            currentStage === 'cake'
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-300/50'
              : 'bg-white/80 text-neutral-600 hover:bg-rose-50 hover:text-rose-600 border border-rose-200'
          }`}
        >
          <Flame className="w-3 h-3" />
          <span>Candles</span>
        </button>

        <button
          onClick={() => setCurrentStage('letter')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
            currentStage === 'letter'
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-300/50'
              : 'bg-white/80 text-neutral-600 hover:bg-rose-50 hover:text-rose-600 border border-rose-200'
          }`}
        >
          <Scroll className="w-3 h-3" />
          <span>Letter & Wishes</span>
        </button>
      </div>

      {/* MAIN STAGE CONTENT */}
      <main className="relative z-10 w-full px-3 pt-3 flex-1 flex flex-col items-center">
        {/* ================= STAGE 1: SCRAPBOOK & ALBUM COVER ================= */}
        {currentStage === 'memories' && (
          <div className="w-full flex flex-col items-center">
            {/* If album is closed, show the interactive Album Cover */}
            <AnimatePresence mode="wait">
              {!isAlbumOpen ? (
                <motion.div
                  key="album-cover-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: -60 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  <AlbumCover
                    personName={settings.personName}
                    age={settings.age}
                    previewImages={previewImages}
                    onOpenAlbum={handleOpenAlbum}
                  />
                </motion.div>
              ) : (
                /* Opened Scrapbook Memory Collection */
                <motion.div
                  key="scrapbook-collection-view"
                  initial={{ opacity: 0, rotateY: 40 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="w-full flex flex-col items-center"
                >
                  {/* Scrapbook Header Banner */}
                  <div className="relative mb-3 text-center max-w-sm">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <button
                        onClick={() => setIsAlbumOpen(false)}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/80 border border-rose-200 text-rose-600 text-[10px] font-bold shadow-2xs hover:bg-rose-50 cursor-pointer"
                      >
                        <span>📖 View Cover</span>
                      </button>
                      <span className="text-xs text-rose-400">•</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Handcrafted Scrapbook</span>
                      </span>
                    </div>

                    <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-rose-950">
                      {settings.memoryAlbumTitle || 'Our Birthday Memories 💕'}
                    </h2>
                    <p className="font-dancing text-rose-700 text-base sm:text-lg font-bold">
                      {settings.memoryAlbumSubtitle || 'A little book full of beautiful moments...'}
                    </p>
                  </div>

                  {/* Romantic Category Tabs */}
                  <div className="w-full max-w-md flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar">
                    {CATEGORY_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedCategory(tab.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                          selectedCategory === tab.id
                            ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-200'
                            : 'bg-white/80 text-neutral-600 hover:bg-rose-50 hover:text-rose-600 border border-rose-200/80'
                        }`}
                      >
                        <span>{tab.label}</span>
                      </button>
                    ))}

                    {/* Custom Albums from Admin Panel */}
                    {albums.map((alb) => (
                      <button
                        key={alb.id}
                        onClick={() => setSelectedCategory(alb.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                          selectedCategory === alb.id
                            ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                            : 'bg-white/80 text-neutral-600 hover:bg-rose-50 hover:text-rose-600 border border-rose-200/80'
                        }`}
                      >
                        <span>{alb.badge}</span>
                        <span>{alb.name}</span>
                      </button>
                    ))}

                    {/* Direct Upload Button */}
                    <button
                      onClick={onOpenAdmin}
                      className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 text-xs font-bold border border-rose-300 whitespace-nowrap flex items-center gap-1 cursor-pointer ml-auto"
                    >
                      <Upload className="w-3 h-3" />
                      <span>+ Upload</span>
                    </button>
                  </div>

                  {/* Empty state or Scrapbook Layout */}
                  {filteredMemories.length === 0 ? (
                    <div className="py-12 flex flex-col items-center text-center max-w-xs">
                      <span className="text-4xl mb-2">📸</span>
                      <p className="text-neutral-500 text-xs font-semibold">
                        No memories in this category yet.
                      </p>
                      <button
                        onClick={onOpenAdmin}
                        className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Upload First Photo in Admin</span>
                      </button>
                    </div>
                  ) : (
                    /* Scrapbook-Style Non-Uniform Layout */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-md py-2">
                      {filteredMemories.map((mem, index) => (
                        <RomanticMemoryCard
                          key={mem.id}
                          memory={mem}
                          index={index}
                          onOpenViewer={handleOpenViewer}
                        />
                      ))}
                    </div>
                  )}

                  {/* Special Final Birthday Page Section */}
                  <motion.div
                    id="final-birthday-scrapbook-page"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative w-full max-w-md my-8 rounded-[32px] p-6 sm:p-8 bg-gradient-to-b from-[#fffbf7] via-[#fff4ea] to-[#fdeef2] border-2 border-rose-300/90 shadow-[0_20px_45px_rgba(244,114,182,0.25)] text-center flex flex-col items-center overflow-hidden"
                  >
                    {/* Washi tape accents */}
                    <div className="washi-tape-gold -top-2.5 left-1/2 -translate-x-1/2 w-28 rounded-xs" />
                    <div className="absolute top-4 right-4 text-2xl">🎉</div>
                    <div className="absolute top-4 left-4 text-2xl">🎈</div>

                    <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-wider mb-2">
                      <Sparkles className="w-3 h-3 text-rose-500" />
                      <span>Grand Birthday Chapter</span>
                      <Sparkles className="w-3 h-3 text-rose-500" />
                    </div>

                    <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-rose-950 tracking-tight leading-tight">
                      🎂 HAPPY BIRTHDAY, {settings.personName.toUpperCase()}! 💗
                    </h2>

                    <p className="font-dancing text-lg sm:text-xl font-bold text-rose-700 mt-2 leading-snug">
                      "These aren't just photos... they're little pieces of our story. ✨"
                    </p>

                    {/* Cute Cake and Balloon Cluster */}
                    <div className="my-4 flex items-center justify-center gap-3">
                      <span className="text-3xl animate-bounce">🎈</span>
                      <div className="relative p-3 rounded-full bg-white border border-rose-200 shadow-md">
                        <CakeIcon className="w-10 h-10 text-rose-500" />
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="absolute -top-1 -right-1 text-sm"
                        >
                          ✨
                        </motion.div>
                      </div>
                      <span className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>
                        🎂
                      </span>
                    </div>

                    {/* Featured Final Photo if available */}
                    {memories[0] && (
                      <div className="w-full rounded-2xl overflow-hidden bg-white p-2 shadow-md border border-rose-200 mb-4">
                        <img
                          src={memories[0].image}
                          alt="Final Celebration Moment"
                          className="w-full h-44 object-cover rounded-xl"
                          referrerPolicy="no-referrer"
                        />
                        <p className="font-dancing text-xs text-rose-600 font-bold mt-1.5">
                          Forever & Always • Chapter {settings.age}
                        </p>
                      </div>
                    )}

                    {/* CTA Button: Play Birthday Tic-Tac-Toe */}
                    {tictactoeSettings?.enabled !== false && (
                      <motion.button
                        id="btn-play-tictactoe-memories"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentStage('tictactoe')}
                        className="w-full py-3 rounded-2xl bg-white hover:bg-rose-50 text-rose-700 font-extrabold text-xs sm:text-sm border-2 border-rose-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all mb-2.5"
                      >
                        <Gamepad2 className="w-4 h-4 text-rose-500" />
                        <span>🎮 Play Birthday Tic-Tac-Toe vs Robot</span>
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      </motion.button>
                    )}

                    {/* CTA Button: Open Your Birthday Message */}
                    <motion.button
                      id="btn-open-birthday-message-final"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setCurrentStage('letter')}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-extrabold text-sm sm:text-base shadow-[0_10px_25px_rgba(244,114,182,0.5)] border border-rose-300/50 flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Scroll className="w-4 h-4 text-white" />
                      <span>💌 Open Your Birthday Message</span>
                      <Sparkles className="w-4 h-4 text-yellow-200" />
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ================= STAGE 2: TIC-TAC-TOE VS ROBOT MINI-GAME ================= */}
        {currentStage === 'tictactoe' && (
          <div className="w-full flex flex-col items-center">
            <TicTacToeGame
              settings={tictactoeSettings}
              onBackToMemories={() => setCurrentStage('memories')}
              onBackToBirthday={onRestart}
            />
          </div>
        )}

        {/* ================= STAGE 3: BIRTHDAY CAKE & CANDLES ================= */}
        {currentStage === 'cake' && (
          <div className="w-full max-w-sm flex flex-col items-center text-center py-4 bg-white/70 backdrop-blur-md rounded-3xl p-5 border border-rose-200 shadow-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-700 text-[10px] font-bold tracking-wider uppercase mb-2">
              <Flame className="w-3 h-3 text-amber-500" />
              <span>{settings.age}th Birthday Cake Ceremony</span>
              <Flame className="w-3 h-3 text-amber-500" />
            </div>

            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-rose-950 mb-1">
              Blow All {settings.age} Candles! 🎂
            </h2>

            <p className="text-neutral-600 text-xs mb-5">
              {candlesBlown
                ? `✨ All ${settings.age} candles extinguished! Your birthday wishes are sealed, ${settings.personName.split(' ')[0]}!`
                : `Tap the button or blow into your microphone to extinguish all ${settings.age} candles!`}
            </p>

            {/* 3D Birthday Cake */}
            <div className="relative flex flex-col items-center my-3 w-full">
              {/* Candles */}
              <div className="flex items-end justify-center gap-1 mb-1 z-20 w-full max-w-[280px] overflow-hidden">
                {Array.from({ length: Math.min(settings.age, 24) }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <AnimatePresence>
                      {!candlesBlown ? (
                        <motion.div
                          animate={{
                            scaleY: [1, 1.25, 0.95, 1],
                            scaleX: [1, 0.9, 1.1, 1],
                            rotate: [-4, 4, -3, 3],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.8 + (i % 5) * 0.1,
                            ease: 'easeInOut',
                          }}
                          className="w-2 h-3.5 rounded-full bg-gradient-to-t from-amber-400 via-yellow-200 to-white shadow-[0_0_8px_rgba(251,191,36,0.9)] mb-0.5"
                        />
                      ) : (
                        <motion.div
                          initial={{ opacity: 1, scale: 1, y: 0 }}
                          animate={{ opacity: 0, scale: 2, y: -15 }}
                          transition={{ duration: 1.2 }}
                          className="w-1.5 h-1.5 rounded-full bg-neutral-400 blur-xs mb-0.5"
                        />
                      )}
                    </AnimatePresence>
                    <div
                      style={{
                        backgroundColor: i % 2 === 0 ? '#fb7185' : '#fbbf24',
                        height: i % 3 === 0 ? '22px' : '18px',
                      }}
                      className="w-1.5 rounded-t-xs shadow-xs"
                    />
                  </div>
                ))}
              </div>

              {/* Cake Tier 1 */}
              <div className="relative z-10 w-48 h-10 bg-gradient-to-r from-rose-200 via-pink-100 to-rose-200 rounded-t-2xl shadow-md border-b-2 border-rose-300 flex items-center justify-around px-3">
                <span className="text-xs">🍓</span>
                <span className="font-dancing text-rose-800 font-bold text-xs">Chapter {settings.age} Milestone</span>
                <span className="text-xs">🍓</span>
              </div>

              {/* Cake Tier 2 */}
              <div className="relative z-0 w-60 h-12 bg-gradient-to-r from-rose-300 via-pink-200 to-rose-300 rounded-t-xl shadow-lg border-b-3 border-rose-400 flex items-center justify-center px-3 -mt-1">
                <span className="font-cinzel text-rose-950 font-black text-xs tracking-widest drop-shadow-xs">
                  {settings.personName.toUpperCase()}
                </span>
              </div>

              {/* Cake Tier 3 */}
              <div className="w-72 h-16 bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 rounded-t-xl shadow-xl border-t border-rose-300 flex items-center justify-around px-4 -mt-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-xs" />
                ))}
              </div>

              {/* Cake Stand */}
              <div className="w-80 h-3.5 bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400 rounded-full shadow-[0_10px_25px_rgba(244,114,182,0.4)] -mt-1" />
            </div>

            {/* Candle Controls & Progression */}
            <div className="flex flex-col items-center gap-3 mt-5 w-full max-w-xs">
              {!candlesBlown ? (
                <>
                  <motion.button
                    id="btn-blow-candles-action"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleBlowCandles}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-extrabold text-sm shadow-[0_10px_25px_rgba(244,114,182,0.5)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Flame className="w-4 h-4 text-white fill-white" />
                    <span>Blow Out {settings.age} Candles! 🎂</span>
                  </motion.button>

                  <button
                    id="btn-mic-blow-action"
                    onClick={toggleMicBlow}
                    className={`w-full py-2.5 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isListeningMic
                        ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                        : 'bg-white border-rose-200 text-neutral-600 hover:bg-rose-50'
                    }`}
                  >
                    <span>{isListeningMic ? '🎤 Listening... (Blow into mic!)' : '🎤 Use Microphone to Blow'}</span>
                  </button>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-3 w-full"
                >
                  <div className="px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 font-bold text-xs text-center">
                    ✨ Wish Sealed! Ready to Read Your Letter! ✨
                  </div>

                  <motion.button
                    id="btn-goto-letter-after-candles"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setCurrentStage('letter')}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-extrabold text-sm shadow-[0_10px_25px_rgba(244,114,182,0.5)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Scroll className="w-4 h-4 text-white" />
                    <span>Read Birthday Letter 📜</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* ================= STAGE 4: ROYAL BIRTHDAY LETTER & WISHES WALL ================= */}
        {currentStage === 'letter' && (
          <div className="w-full max-w-sm py-3 flex flex-col items-center">
            {/* Weathered Parchment / Romantic Birthday Card */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full rounded-3xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(244,114,182,0.25)] text-neutral-900 overflow-hidden border-2 border-rose-300/80 bg-[#fffaf5]"
            >
              <div className="washi-tape-gold -top-2.5 left-1/2 -translate-x-1/2 w-28 rounded-xs" />

              {/* Decorative Wax Seal */}
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-rose-500 p-0.5 shadow-lg flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-rose-200/60 flex flex-col items-center justify-center bg-rose-600">
                    <Heart className="w-4 h-4 text-white fill-white mb-0.5" />
                    <span className="font-cinzel font-black text-white text-[10px]">{settings.age}</span>
                  </div>
                </div>
              </div>

              {/* Calligraphy Header */}
              <div className="text-center mb-4">
                <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-rose-600 font-bold mb-0.5">
                  ~ A Heartfelt Birthday Letter ~
                </p>
                <h1 className="font-playfair text-2xl font-bold text-rose-950">
                  {settings.letterTitle}
                </h1>
                <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-rose-300 to-transparent mx-auto mt-1" />
              </div>

              {/* Parchment Body Text */}
              <div className="font-playfair text-neutral-800 text-sm leading-relaxed space-y-3 text-justify">
                {settings.letterBody.map((paragraph, idx) => (
                  <p key={idx}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Signature & Seal */}
              <div className="mt-6 pt-4 border-t border-rose-200 flex flex-col items-center text-center gap-1.5">
                <p className="font-dancing text-2xl text-rose-700 font-bold">
                  {settings.signatureName}
                </p>
                <p className="text-[10px] text-neutral-500">{settings.dateStamp}</p>
                <div className="mt-1 px-3 py-0.5 rounded-full bg-rose-100 text-rose-700 font-cinzel text-[10px] font-bold">
                  👑 CELEBRATED WITH ALL OUR LOVE 👑
                </div>
              </div>
            </motion.div>

            {/* Bottom Letter Actions */}
            <div className="flex flex-col gap-2.5 mt-5 w-full max-w-sm">
              <button
                id="btn-toggle-wishes-wall"
                onClick={() => setShowWishesWall(!showWishesWall)}
                className="w-full py-3 rounded-2xl bg-white border border-rose-300 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-50 transition-all cursor-pointer shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
                <span>{showWishesWall ? 'Hide Guest Wishes' : 'Read & Post Guest Wishes 💬'}</span>
              </button>

              <button
                id="btn-replay-all-final"
                onClick={onRestart}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Celebration Journey 🔄</span>
              </button>

              {onOpenAdmin && (
                <button
                  id="btn-goto-admin-from-letter"
                  onClick={onOpenAdmin}
                  className="w-full py-2.5 rounded-2xl bg-white/90 border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-rose-500" />
                  <span>Open Admin Control Panel 🛠️</span>
                </button>
              )}
            </div>

            {/* Wishes Wall */}
            <AnimatePresence>
              {showWishesWall && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full mt-5 border-t border-rose-200 pt-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-rose-950 font-playfair">Guest Wishes Wall</h3>
                    <button
                      onClick={() => setIsAddingWish(!isAddingWish)}
                      className="px-3 py-1.5 rounded-full bg-rose-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isAddingWish ? 'Cancel' : 'Add Wish'}</span>
                    </button>
                  </div>

                  {isAddingWish && (
                    <form onSubmit={handleAddWishSubmit} className="bg-white p-3 rounded-2xl border border-rose-200 mb-4 flex flex-col gap-2.5 shadow-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          placeholder="Your Name"
                          className="bg-[#fffbf7] border border-rose-200 rounded-xl px-2.5 py-1.5 text-xs text-neutral-800 focus:outline-rose-400"
                        />
                        <input
                          type="text"
                          value={relationText}
                          onChange={(e) => setRelationText(e.target.value)}
                          placeholder="Relation (e.g. Best Friend)"
                          className="bg-[#fffbf7] border border-rose-200 rounded-xl px-2.5 py-1.5 text-xs text-neutral-800 focus:outline-rose-400"
                        />
                      </div>
                      <textarea
                        required
                        rows={2}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder={`Leave a heartfelt birthday note for ${settings.personName}...`}
                        className="bg-[#fffbf7] border border-rose-200 rounded-xl px-2.5 py-1.5 text-xs text-neutral-800 resize-none focus:outline-rose-400"
                      />
                      <button
                        type="submit"
                        className="self-end px-4 py-1.5 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Send className="w-3 h-3" />
                        <span>Post Wish</span>
                      </button>
                    </form>
                  )}

                  <div className="grid grid-cols-1 gap-2.5">
                    {wishes.map((w) => (
                      <div key={w.id} className="bg-white border border-rose-200/80 p-3 rounded-xl shadow-2xs">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className={`w-6 h-6 rounded-full ${w.avatarColor} text-white font-bold text-[10px] flex items-center justify-center`}>
                            {w.author.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-neutral-900">{w.author}</h4>
                            <span className="text-[9px] text-rose-500 font-semibold">{w.relation}</span>
                          </div>
                        </div>
                        <p className="text-xs text-neutral-700 italic">&ldquo;{w.message}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Full-Screen Romantic Photo Viewer Modal */}
      <MemoryViewerModal
        isOpen={viewerMemoryId !== null}
        onClose={() => setViewerMemoryId(null)}
        memories={filteredMemories}
        initialMemoryId={viewerMemoryId}
      />
    </div>
  );
};
