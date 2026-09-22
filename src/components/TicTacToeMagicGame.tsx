import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Trophy, ArrowRight, Wand2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

interface TicTacToeMagicGameProps {
  onWin: () => void;
  personName?: string;
}

type CellValue = 'JAWAN' | 'AI' | null;

export const TicTacToeMagicGame: React.FC<TicTacToeMagicGameProps> = ({
  onWin,
  personName = 'Jawan',
}) => {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [winner, setWinner] = useState<'JAWAN' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [magicMessage, setMagicMessage] = useState<string>('');
  const [movesCount, setMovesCount] = useState<number>(0);

  const firstName = personName.split(' ')[0] || 'Jawan';

  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6],             // Diagonals
  ];

  const checkWinner = (currentBoard: CellValue[]): { winner: CellValue; line: number[] | null } => {
    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: combo };
      }
    }
    return { winner: null, line: null };
  };

  // Trigger magic victory for Jawan
  const triggerMagicWin = (customBoard: CellValue[], winCombo: number[], reason: string) => {
    soundManager.playMagicChime();
    setMagicMessage(reason);
    // Turn the winning combo into JAWAN's crown pieces!
    const magicBoard = [...customBoard];
    winCombo.forEach((idx) => {
      magicBoard[idx] = 'JAWAN';
    });
    setBoard(magicBoard);
    setWinningLine(winCombo);
    setWinner('JAWAN');
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#ef4444', '#ffffff', '#10b981'],
    });
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner || !isPlayerTurn) return;

    soundManager.playCountTick(15);
    const newBoard = [...board];
    newBoard[index] = 'JAWAN';
    const nextMoves = movesCount + 1;
    setMovesCount(nextMoves);
    setBoard(newBoard);

    // 1. Check if player won naturally
    const naturalCheck = checkWinner(newBoard);
    if (naturalCheck.winner === 'JAWAN' && naturalCheck.line) {
      soundManager.playMagicChime();
      setWinner('JAWAN');
      setWinningLine(naturalCheck.line);
      setMagicMessage(`🌟 Pure Brilliance! ${firstName} wins fair and square!`);
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 } });
      return;
    }

    // 2. MAGIC TWIST: If user made 2+ moves, activate birthday destiny!
    if (nextMoves >= 2) {
      setIsPlayerTurn(false);
      setTimeout(() => {
        const bestCombo = winningCombos.find((combo) =>
          combo.filter((i) => newBoard[i] === 'JAWAN').length >= 1
        ) || winningCombos[0];

        const magicLines = [
          `✨ BIRTHDAY MAGIC ACTIVATED! Destiny rewrites the board for ${firstName}!`,
          `👑 Magic Overrule! On your birthday, losing is strictly illegal!`,
          `⚡ Birthday Wizardry turned all pieces into ${firstName}'s Victory Crown!`,
        ];
        const randomMsg = magicLines[Math.floor(Math.random() * magicLines.length)];
        triggerMagicWin(newBoard, bestCombo, randomMsg);
        setIsPlayerTurn(true);
      }, 500);
      return;
    }

    // 3. AI move (plays harmlessly)
    setIsPlayerTurn(false);
    setTimeout(() => {
      const emptyIndices = newBoard
        .map((val, idx) => (val === null ? idx : null))
        .filter((val): val is number => val !== null);

      if (emptyIndices.length > 0) {
        const aiIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        newBoard[aiIndex] = 'AI';
        setBoard([...newBoard]);
        setIsPlayerTurn(true);
      }
    }, 400);
  };

  const handleResetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningLine(null);
    setMagicMessage('');
    setMovesCount(0);
    setIsPlayerTurn(true);
  };

  return (
    <div
      id="tic-tac-toe-magic-section"
      className="w-full max-w-xl bg-gradient-to-b from-neutral-900/90 to-neutral-950 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.25)] flex flex-col items-center text-center my-4"
    >
      {/* Title & Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-widest mb-3">
        <Wand2 className="w-4 h-4 text-amber-400" />
        <span>Birthday Magic Minigame</span>
      </div>

      <h3 className="font-cinzel text-2xl sm:text-3xl font-black text-white mb-1">
        {firstName} vs Birthday AI
      </h3>
      <p className="text-neutral-400 text-xs sm:text-sm mb-4">
        Play Tic-Tac-Toe! (Try to lose if you dare... Birthday Magic is watching! 😉)
      </p>

      {/* Turn Indicator or Magic Banner */}
      <div className="min-h-[44px] flex items-center justify-center mb-4 w-full">
        <AnimatePresence mode="wait">
          {magicMessage ? (
            <motion.div
              key="magic-msg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/30 via-rose-500/30 to-amber-500/30 border border-amber-400/70 text-amber-300 font-bold text-xs sm:text-sm shadow-md"
            >
              {magicMessage}
            </motion.div>
          ) : (
            <span className="text-xs text-neutral-300 font-semibold bg-neutral-800/80 px-4 py-1 rounded-full border border-neutral-700">
              {isPlayerTurn ? '👑 Your Turn (👑 Crown)' : '🤖 AI is pondering...'}
            </span>
          )}
        </AnimatePresence>
      </div>

      {/* 3x3 Grid Board */}
      <div className="grid grid-cols-3 gap-3 w-64 h-64 sm:w-72 sm:h-72 bg-neutral-950 p-3 rounded-2xl border-2 border-neutral-800 shadow-inner">
        {board.map((cell, idx) => {
          const isWinningCell = winningLine?.includes(idx);
          return (
            <motion.button
              key={idx}
              id={`ttt-cell-${idx}`}
              whileHover={{ scale: cell ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCellClick(idx)}
              className={`w-full h-full rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-black transition-all cursor-pointer ${
                isWinningCell
                  ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-neutral-950 shadow-[0_0_20px_rgba(251,191,36,0.9)] animate-pulse'
                  : cell === 'JAWAN'
                  ? 'bg-neutral-800 text-amber-400 border border-amber-500/50 shadow-md'
                  : cell === 'AI'
                  ? 'bg-neutral-900 text-rose-400 border border-neutral-700'
                  : 'bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 text-transparent'
              }`}
            >
              {cell === 'JAWAN' && <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300 fill-amber-300 drop-shadow-md" />}
              {cell === 'AI' && <span className="text-rose-400 text-xl font-bold">❌</span>}
              {!cell && <span className="text-neutral-700 text-xs"> </span>}
            </motion.button>
          );
        })}
      </div>

      {/* Victory Celebration & Progression */}
      {winner && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex flex-col items-center gap-3 w-full"
        >
          <div className="flex items-center gap-2 text-amber-300 font-dancing text-2xl font-bold">
            <Trophy className="w-6 h-6 text-yellow-400 animate-bounce" />
            <span>VICTORY SECURED FOR {firstName.toUpperCase()}! 🏆</span>
          </div>

          <motion.button
            id="btn-goto-cake-after-win"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onWin}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 text-white font-bold text-sm sm:text-base shadow-[0_0_30px_rgba(225,29,72,0.7)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Birthday Cake 🎂</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <button
            onClick={handleResetGame}
            className="text-xs text-neutral-500 hover:text-amber-400 underline mt-1 cursor-pointer"
          >
            Play Again for Fun 🔄
          </button>
        </motion.div>
      )}
    </div>
  );
};
