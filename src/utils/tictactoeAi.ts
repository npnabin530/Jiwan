export type CellValue = 'player' | 'robot' | null;
export type Difficulty = 'easy' | 'medium' | 'hard';

export const WINNING_COMBOS: number[][] = [
  [0, 1, 2], // Row 1
  [3, 4, 5], // Row 2
  [6, 7, 8], // Row 3
  [0, 3, 6], // Col 1
  [1, 4, 7], // Col 2
  [2, 5, 8], // Col 3
  [0, 4, 8], // Diag 1
  [2, 4, 6], // Diag 2
];

export interface GameResult {
  winner: 'player' | 'robot' | 'draw' | null;
  line: number[] | null;
}

/**
 * Check if the board has a winner or draw
 */
export function checkWinner(board: CellValue[]): GameResult {
  for (const combo of WINNING_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: combo };
    }
  }

  const isFull = board.every((cell) => cell !== null);
  if (isFull) {
    return { winner: 'draw', line: null };
  }

  return { winner: null, line: null };
}

/**
 * Returns empty cell indices
 */
export function getAvailableMoves(board: CellValue[]): number[] {
  const moves: number[] = [];
  board.forEach((cell, idx) => {
    if (cell === null) moves.push(idx);
  });
  return moves;
}

/**
 * Minimax recursive algorithm for Unbeatable Hard AI
 */
function minimax(
  board: CellValue[],
  depth: number,
  isMaximizing: boolean
): { score: number; move?: number } {
  const result = checkWinner(board);
  if (result.winner === 'robot') {
    return { score: 10 - depth };
  }
  if (result.winner === 'player') {
    return { score: depth - 10 };
  }
  if (result.winner === 'draw') {
    return { score: 0 };
  }

  const availableMoves = getAvailableMoves(board);

  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      board[move] = 'robot';
      const evalResult = minimax(board, depth + 1, false);
      board[move] = null; // undo

      if (evalResult.score > bestScore) {
        bestScore = evalResult.score;
        bestMove = move;
      }
    }
    return { score: bestScore, move: bestMove };
  } else {
    let bestScore = Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      board[move] = 'player';
      const evalResult = minimax(board, depth + 1, true);
      board[move] = null; // undo

      if (evalResult.score < bestScore) {
        bestScore = evalResult.score;
        bestMove = move;
      }
    }
    return { score: bestScore, move: bestMove };
  }
}

/**
 * Select the Robot's move based on selected difficulty
 */
export function getRobotMove(board: CellValue[], difficulty: Difficulty): number {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return -1;

  // -------------------------------------------------------------
  // EASY: Mostly random moves with occasional lucky blocks
  // -------------------------------------------------------------
  if (difficulty === 'easy') {
    // 30% chance to take an immediate winning move if available
    if (Math.random() < 0.3) {
      for (const move of availableMoves) {
        board[move] = 'robot';
        if (checkWinner(board).winner === 'robot') {
          board[move] = null;
          return move;
        }
        board[move] = null;
      }
    }
    // Random move
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }

  // -------------------------------------------------------------
  // MEDIUM: Strategic basics (takes wins, blocks player, favors center/corners)
  // -------------------------------------------------------------
  if (difficulty === 'medium') {
    // 1. Can Robot win right now?
    for (const move of availableMoves) {
      board[move] = 'robot';
      if (checkWinner(board).winner === 'robot') {
        board[move] = null;
        return move;
      }
      board[move] = null;
    }

    // 2. Can Player win on next turn? Block them!
    for (const move of availableMoves) {
      board[move] = 'player';
      if (checkWinner(board).winner === 'player') {
        board[move] = null;
        return move;
      }
      board[move] = null;
    }

    // 3. Take center if open (75% chance)
    if (board[4] === null && Math.random() < 0.75) {
      return 4;
    }

    // 4. Take corners if available
    const corners = [0, 2, 6, 8].filter((idx) => board[idx] === null);
    if (corners.length > 0 && Math.random() < 0.6) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    // 5. Random fallback
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }

  // -------------------------------------------------------------
  // HARD: Optimal Minimax (Impossible to defeat)
  // -------------------------------------------------------------
  // For the opening move if board is completely empty, pick center or corner instantly for speed
  if (availableMoves.length === 9) {
    const openings = [4, 0, 2, 6, 8];
    return openings[Math.floor(Math.random() * openings.length)];
  }

  const { move } = minimax([...board], 0, true);
  return move !== undefined ? move : availableMoves[0];
}
