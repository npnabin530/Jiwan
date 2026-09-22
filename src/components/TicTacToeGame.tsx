import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Sparkles,
  Trophy,
  Heart,
  Volume2,
  VolumeX,
  BookOpen,
  Cake,
  Bot,
  User,
  Zap,
} from 'lucide-react';
import { TicTacToeSettings } from '../types';
import { CellValue, Difficulty, checkWinner, getRobotMove } from '../utils/tictactoeAi';
import { soundManager } from '../utils/audio';

interface TicTacToeGameProps {
  settings?: TicTacToeSettings;
  onBackToMemories: () => void;
  onBackToBirthday: () => void;
}

const DEFAULT_SETTINGS: TicTacToeSettings = {
  enabled: true,
  gameTitle: '🎂 TIC-TAC-TOE',
  gameSubtitle: 'You vs Robot 🤖',
  playerName: 'You',
  robotName: 'Robot',
  playerEmoji: '💗',
  robotEmoji: '🤖',
  defaultDifficulty: 'medium',
  backgroundStyle: 'cream-pink',
  confettiEnabled: true,
  soundEnabled: true,
  winMessage: 'You defeated the birthday robot! 🎂✨',
  loseMessage: 'The robot got this one! Try again? 😄',
  drawMessage: 'Perfectly matched! 💕',
};

export const TicTacToeGame: React.FC<TicTacToeGameProps> = ({
  settings = DEFAULT_SETTINGS,
  onBackToMemories,
  onBackToBirthday,
}) => {
  const activeSettings = { ...DEFAULT_SETTINGS, ...settings };

  // Game Board State
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<'player' | 'robot'>('player');
  const [isRobotThinking, setIsRobotThinking] = useState<boolean>(false);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [winner, setWinner] = useState<'player' | 'robot' | 'draw' | null>(null);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<Difficulty>(activeSettings.defaultDifficulty || 'medium');

  // Session Persistent Scoreboard
  const [scores, setScores] = useState<{ player: number; robot: number; draws: number }>({
    player: 0,
    robot: 0,
    draws: 0,
  });

  // Audio mute state
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.getMuted());

  // Confetti trigger helper
  const triggerConfettiCelebration = useCallback(() => {
    if (!activeSettings.confettiEnabled) return;
    try {
      // Primary burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fb7185', '#f59e0b', '#fbbf24', '#ffffff', '#ec4899'],
      });

      // Side cannons
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0.15, y: 0.7 },
          colors: ['#ec4899', '#f43f5e', '#fde047'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 0.85, y: 0.7 },
          colors: ['#ec4899', '#f43f5e', '#fde047'],
        });
      }, 200);
    } catch {
      // Fallback
    }
  }, [activeSettings.confettiEnabled]);

  // Handle Audio toggle
  const toggleMute = () => {
    const nextMuted = soundManager.toggleMute();
    setIsMuted(nextMuted);
  };

  // Reset current board
  const handlePlayAgain = useCallback(() => {
    setBoard(Array(9).fill(null));
    setWinningLine(null);
    setWinner(null);
    setShowResultModal(false);
    setIsRobotThinking(false);
    setTurn('player');
  }, []);

  // Handle end of game
  const handleGameEnd = useCallback(
    (gameWinner: 'player' | 'robot' | 'draw', line: number[] | null) => {
      setWinner(gameWinner);
      setWinningLine(line);

      // Update persistent scores
      setScores((prev) => ({
        player: gameWinner === 'player' ? prev.player + 1 : prev.player,
        robot: gameWinner === 'robot' ? prev.robot + 1 : prev.robot,
        draws: gameWinner === 'draw' ? prev.draws + 1 : prev.draws,
      }));

      // Audio & Visual celebratory triggers
      if (gameWinner === 'player') {
        if (activeSettings.soundEnabled) soundManager.playGameWin();
        triggerConfettiCelebration();
      } else if (gameWinner === 'robot') {
        if (activeSettings.soundEnabled) soundManager.playRobotBeep();
      } else {
        if (activeSettings.soundEnabled) soundManager.playGameDraw();
      }

      // Show result modal after a brief pause so user sees the winning row
      setTimeout(() => {
        setShowResultModal(true);
      }, 700);
    },
    [activeSettings.soundEnabled, triggerConfettiCelebration]
  );

  // Robot move execution
  const robotThinkingTimer = useRef<number | null>(null);

  const triggerRobotMove = useCallback(
    (currentBoard: CellValue[]) => {
      setIsRobotThinking(true);

      // Thinking delay (450ms) for human-like cute anticipation
      robotThinkingTimer.current = window.setTimeout(() => {
        const bestMove = getRobotMove(currentBoard, difficulty);

        if (bestMove >= 0 && bestMove < 9 && currentBoard[bestMove] === null) {
          const nextBoard = [...currentBoard];
          nextBoard[bestMove] = 'robot';
          setBoard(nextBoard);

          if (activeSettings.soundEnabled) {
            soundManager.playRobotBeep();
          }

          const result = checkWinner(nextBoard);
          if (result.winner) {
            setIsRobotThinking(false);
            handleGameEnd(result.winner, result.line);
          } else {
            setIsRobotThinking(false);
            setTurn('player');
          }
        } else {
          setIsRobotThinking(false);
          setTurn('player');
        }
      }, 500);
    },
    [difficulty, activeSettings.soundEnabled, handleGameEnd]
  );

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (robotThinkingTimer.current) {
        clearTimeout(robotThinkingTimer.current);
      }
    };
  }, []);

  // Player cell click
  const handleCellClick = (index: number) => {
    // If not player's turn, or cell is filled, or robot is thinking, or game already ended
    if (turn !== 'player' || board[index] !== null || isRobotThinking || winner !== null) {
      return;
    }

    // Play tap pop sound
    if (activeSettings.soundEnabled) {
      soundManager.playPlayerTap();
    }

    const nextBoard = [...board];
    nextBoard[index] = 'player';
    setBoard(nextBoard);

    // Check if player won or drew
    const result = checkWinner(nextBoard);
    if (result.winner) {
      handleGameEnd(result.winner, result.line);
    } else {
      setTurn('robot');
      triggerRobotMove(nextBoard);
    }
  };

  return (
    <div
      id="tictactoe-mini-game"
      className="relative w-full h-full min-h-[100dvh] sm:min-h-full flex flex-col justify-between items-center p-3 sm:p-5 select-none font-outfit overflow-y-auto overflow-x-hidden bg-gradient-to-b from-[#fff5f5] via-[#fffaf5] to-[#fef2f2] text-neutral-800"
    >
      {/* Decorative Floating Background Elements */}
      <div className="absolute top-2 left-3 text-2xl opacity-60 pointer-events-none animate-bounce" style={{ animationDuration: '3.5s' }}>
        🎀
      </div>
      <div className="absolute top-6 right-5 text-2xl opacity-60 pointer-events-none animate-pulse" style={{ animationDuration: '2.8s' }}>
        ✨
      </div>
      <div className="absolute bottom-16 left-4 text-3xl opacity-40 pointer-events-none">
        🎈
      </div>
      <div className="absolute bottom-12 right-4 text-2xl opacity-40 pointer-events-none">
        💕
      </div>

      {/* Top Bar: Title & Audio Button */}
      <div className="w-full flex items-center justify-between z-10 pt-1">
        <button
          onClick={onBackToMemories}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-rose-700 text-xs font-bold shadow-sm border border-rose-200 backdrop-blur-md transition-all cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Memories</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-1.5 rounded-full bg-white/80 hover:bg-white border border-rose-200 text-rose-600 shadow-sm transition-all cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-neutral-400" /> : <Volume2 className="w-3.5 h-3.5 text-rose-500" />}
          </button>

          <button
            onClick={onBackToBirthday}
            title="Back to Birthday Start"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-bold shadow-sm shadow-rose-500/20 hover:opacity-95 transition-all cursor-pointer"
          >
            <Cake className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </div>
      </div>

      {/* Main Cute Card Container */}
      <div className="w-full max-w-sm my-auto bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-[0_12px_40px_rgba(244,63,94,0.12)] border-2 border-rose-100 flex flex-col items-center relative z-10">
        {/* Adorable Ribbon Header */}
        <div className="absolute -top-3.5 px-4 py-1 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white text-[11px] font-black tracking-widest uppercase shadow-md flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-yellow-200 animate-spin" style={{ animationDuration: '4s' }} />
          <span>MINI-GAME</span>
          <Sparkles className="w-3 h-3 text-yellow-200 animate-spin" style={{ animationDuration: '4s' }} />
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mt-2 mb-3">
          <h1 className="text-xl sm:text-2xl font-black font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 tracking-wide drop-shadow-sm">
            {activeSettings.gameTitle}
          </h1>
          <p className="text-xs font-semibold text-rose-400 flex items-center justify-center gap-1.5 mt-0.5">
            <span>{activeSettings.gameSubtitle}</span>
          </p>
        </div>

        {/* Difficulty Pill Switcher */}
        <div className="flex items-center gap-1 bg-rose-50/80 p-1 rounded-2xl border border-rose-100 mb-3 shadow-inner">
          {(
            [
              { id: 'easy', label: '🌱 Easy' },
              { id: 'medium', label: '⭐ Medium' },
              { id: 'hard', label: '👑 Hard' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setDifficulty(item.id);
                handlePlayAgain();
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                difficulty === item.id
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm shadow-rose-500/30'
                  : 'text-neutral-500 hover:text-rose-600 hover:bg-rose-100/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Player vs Robot Avatars & Turn Banner */}
        <div className="w-full flex items-center justify-between px-3 py-2 bg-gradient-to-r from-rose-50 via-pink-50/50 to-rose-50 rounded-2xl border border-rose-100/80 mb-3.5">
          {/* Player Badge */}
          <div
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all ${
              turn === 'player' && !winner
                ? 'bg-white shadow-sm border border-rose-300 ring-2 ring-rose-400/20'
                : 'opacity-70'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-400 to-pink-300 flex items-center justify-center text-white text-base shadow-sm">
              {activeSettings.playerEmoji || '💗'}
            </div>
            <div className="text-left">
              <div className="text-xs font-extrabold text-neutral-800 flex items-center gap-1">
                <span>{activeSettings.playerName || 'You'}</span>
                <User className="w-3 h-3 text-rose-500" />
              </div>
              <div className="text-[10px] font-bold text-rose-500">Player</div>
            </div>
          </div>

          {/* VS Divider or Turn Glow */}
          <div className="flex flex-col items-center px-1">
            <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">VS</span>
            <div className="w-5 h-0.5 bg-rose-200 rounded-full mt-0.5" />
          </div>

          {/* Robot Badge */}
          <div
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all ${
              (turn === 'robot' || isRobotThinking) && !winner
                ? 'bg-white shadow-sm border border-amber-300 ring-2 ring-amber-400/20'
                : 'opacity-70'
            }`}
          >
            <div className="text-right">
              <div className="text-xs font-extrabold text-neutral-800 flex items-center justify-end gap-1">
                <Bot className="w-3 h-3 text-amber-500" />
                <span>{activeSettings.robotName || 'Robot'}</span>
              </div>
              <div className="text-[10px] font-bold text-amber-600 capitalize">{difficulty} AI</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-white text-base shadow-sm">
              {activeSettings.robotEmoji || '🤖'}
            </div>
          </div>
        </div>

        {/* Current Turn Status Banner */}
        <div className="w-full mb-3 text-center">
          <AnimatePresence mode="wait">
            {winner ? (
              <motion.div
                key="status-gameover"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-1 px-3 rounded-full bg-rose-100 text-rose-700 text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Round Complete!</span>
              </motion.div>
            ) : isRobotThinking ? (
              <motion.div
                key="status-thinking"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-1 px-3.5 rounded-full bg-amber-100/90 text-amber-800 text-xs font-bold inline-flex items-center gap-2 shadow-sm border border-amber-200/60"
              >
                <span>{activeSettings.robotEmoji || '🤖'} {activeSettings.robotName || 'Robot'} is thinking</span>
                <span className="flex items-center gap-0.5">
                  <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                    className="w-1.5 h-1.5 bg-amber-600 rounded-full inline-block"
                  />
                  <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    className="w-1.5 h-1.5 bg-amber-600 rounded-full inline-block"
                  />
                  <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    className="w-1.5 h-1.5 bg-amber-600 rounded-full inline-block"
                  />
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="status-player"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-1 px-3.5 rounded-full bg-rose-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-rose-500/20"
              >
                <span>{activeSettings.playerEmoji || '💗'}</span>
                <span>Your Turn! Tap an open square</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3×3 GAME BOARD */}
        <div
          id="tictactoe-board-grid"
          className="relative grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-gradient-to-b from-rose-50/70 to-pink-50/40 border border-rose-200/70 shadow-inner w-full aspect-square max-w-[280px] sm:max-w-[310px] touch-manipulation"
        >
          {board.map((cell, index) => {
            const isWinningCell = winningLine?.includes(index);
            const isClickable = !cell && turn === 'player' && !isRobotThinking && !winner;

            return (
              <button
                key={index}
                id={`tictactoe-cell-${index}`}
                disabled={!isClickable}
                onClick={() => handleCellClick(index)}
                aria-label={`Board cell ${index + 1}`}
                className={`relative rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black transition-all cursor-pointer outline-none select-none ${
                  cell
                    ? isWinningCell
                      ? 'bg-gradient-to-tr from-amber-200 via-rose-100 to-amber-100 border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-[1.04] z-10'
                      : 'bg-white/95 border border-rose-200/80 shadow-sm'
                    : isClickable
                    ? 'bg-white hover:bg-rose-50/80 active:scale-95 border-2 border-dashed border-rose-200 hover:border-rose-400 shadow-sm hover:shadow'
                    : 'bg-white/50 border border-rose-100 cursor-not-allowed opacity-80'
                }`}
              >
                {/* Cell Contents with pop animations */}
                <AnimatePresence mode="wait">
                  {cell === 'player' && (
                    <motion.div
                      key="symbol-player"
                      initial={{ scale: 0, rotate: -25 }}
                      animate={{ scale: [0, 1.3, 1], rotate: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="flex items-center justify-center filter drop-shadow-sm select-none"
                    >
                      <span>{activeSettings.playerEmoji || '💗'}</span>
                    </motion.div>
                  )}
                  {cell === 'robot' && (
                    <motion.div
                      key="symbol-robot"
                      initial={{ scale: 0, y: -10 }}
                      animate={{ scale: [0, 1.25, 1], y: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="flex items-center justify-center filter drop-shadow-sm select-none"
                    >
                      <span>{activeSettings.robotEmoji || '🤖'}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Subtle Winning Sparkle Indicator */}
                {isWinningCell && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute -top-1 -right-1 text-xs"
                  >
                    ✨
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>

        {/* Scoreboard Bar */}
        <div className="w-full mt-3.5 pt-3 border-t border-rose-100 flex items-center justify-around text-center">
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
              <span>{activeSettings.playerEmoji || '💗'}</span>
              <span>{activeSettings.playerName || 'You'}</span>
            </span>
            <span className="text-base font-extrabold text-neutral-800">{scores.player}</span>
          </div>

          <div className="h-6 w-px bg-rose-200" />

          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
              <span>{activeSettings.robotEmoji || '🤖'}</span>
              <span>{activeSettings.robotName || 'Robot'}</span>
            </span>
            <span className="text-base font-extrabold text-neutral-800">{scores.robot}</span>
          </div>

          <div className="h-6 w-px bg-rose-200" />

          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1">
              <span>✨</span>
              <span>Draws</span>
            </span>
            <span className="text-base font-extrabold text-neutral-800">{scores.draws}</span>
          </div>
        </div>

        {/* Reset Round Button */}
        <div className="w-full flex items-center justify-center gap-2 mt-3">
          <button
            id="btn-tictactoe-play-again"
            onClick={handlePlayAgain}
            className="flex-1 max-w-[200px] flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-rose-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Play Again</span>
          </button>
        </div>
      </div>

      {/* RESULT MODAL: POPUP CELEBRATION */}
      <AnimatePresence>
        {showResultModal && winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl border-4 border-rose-200 text-center relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-rose-400/20 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />

              {/* Icon / Mascot */}
              <div className="relative mb-3 flex items-center justify-center">
                {winner === 'player' && (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center text-3xl shadow-lg shadow-rose-500/30 animate-bounce">
                    🎉
                  </div>
                )}
                {winner === 'robot' && (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-white flex items-center justify-center text-3xl shadow-lg shadow-amber-400/30">
                    🤖
                  </div>
                )}
                {winner === 'draw' && (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-400 to-pink-300 text-white flex items-center justify-center text-3xl shadow-lg shadow-purple-400/30">
                    ✨
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl font-black font-cinzel text-neutral-800 mb-1">
                {winner === 'player' && '🎉 YOU WON! 💗'}
                {winner === 'robot' && '🤖 ROBOT WON!'}
                {winner === 'draw' && "✨ IT'S A DRAW!"}
              </h3>

              {/* Dynamic Message */}
              <p className="text-xs font-semibold text-neutral-600 mb-4 px-2">
                {winner === 'player' && (activeSettings.winMessage || 'You defeated the birthday robot! 🎂✨')}
                {winner === 'robot' && (activeSettings.loseMessage || 'The robot got this one! Try again? 😄')}
                {winner === 'draw' && (activeSettings.drawMessage || 'Perfectly matched! 💕')}
              </p>

              {/* Current Score Summary */}
              <div className="flex items-center justify-center gap-3 py-2 px-3 rounded-xl bg-rose-50 border border-rose-100 text-xs font-extrabold text-neutral-700 mb-4">
                <span>💗 {scores.player}</span>
                <span className="text-rose-300">•</span>
                <span>🤖 {scores.robot}</span>
                <span className="text-rose-300">•</span>
                <span>✨ {scores.draws}</span>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={handlePlayAgain}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-rose-500/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Play Another Round</span>
                </button>

                <button
                  onClick={() => {
                    setShowResultModal(false);
                    onBackToMemories();
                  }}
                  className="w-full py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Back to Memory Scrapbook</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Navigation */}
      <div className="w-full flex items-center justify-center gap-3 pt-2 text-[11px] text-neutral-400 font-semibold z-10">
        <button
          onClick={onBackToMemories}
          className="hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1"
        >
          <BookOpen className="w-3 h-3" />
          <span>📖 Back to Memories</span>
        </button>
        <span>•</span>
        <button
          onClick={onBackToBirthday}
          className="hover:text-amber-600 transition-colors cursor-pointer flex items-center gap-1"
        >
          <Cake className="w-3 h-3" />
          <span>🎂 Back to Birthday</span>
        </button>
      </div>
    </div>
  );
};
