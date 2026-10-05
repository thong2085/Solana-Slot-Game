/**
 * Lost Relics of Ra - 5x3 Slot Engine
 * 20 Fixed Paylines, RTP ~96.5%, Medium-High Volatility
 */

export interface Payline {
  id: number;
  // Row index (0: top, 1: middle, 2: bottom) for each of the 5 reels
  coords: [number, number, number, number, number];
  color: string;
}

// 20 Classic Fixed Paylines for 5x3 grid
export const PAYLINES: Payline[] = [
  { id: 1,  coords: [1, 1, 1, 1, 1], color: '#FFD700' }, // Center horizontal
  { id: 2,  coords: [0, 0, 0, 0, 0], color: '#FF4500' }, // Top horizontal
  { id: 3,  coords: [2, 2, 2, 2, 2], color: '#00E5FF' }, // Bottom horizontal
  { id: 4,  coords: [0, 1, 2, 1, 0], color: '#76FF03' }, // V shape
  { id: 5,  coords: [2, 1, 0, 1, 2], color: '#D500F9' }, // Inverted V
  { id: 6,  coords: [0, 0, 1, 2, 2], color: '#FF1744' }, // Step down
  { id: 7,  coords: [2, 2, 1, 0, 0], color: '#00E676' }, // Step up
  { id: 8,  coords: [1, 0, 0, 0, 1], color: '#FF9100' }, // Top dip
  { id: 9,  coords: [1, 2, 2, 2, 1], color: '#2979FF' }, // Bottom valley
  { id: 10, coords: [0, 1, 0, 1, 0], color: '#F50057' }, // Top zigzag
  { id: 11, coords: [2, 1, 2, 1, 2], color: '#00B0FF' }, // Bottom zigzag
  { id: 12, coords: [1, 0, 1, 0, 1], color: '#FFEA00' }, // Center-top zigzag
  { id: 13, coords: [1, 2, 1, 2, 1], color: '#651FFF' }, // Center-bottom zigzag
  { id: 14, coords: [0, 1, 1, 1, 0], color: '#1DE9B6' }, // Shallow V
  { id: 15, coords: [2, 1, 1, 1, 2], color: '#FF3D00' }, // Shallow inverted V
  { id: 16, coords: [1, 1, 0, 1, 1], color: '#C6FF00' }, // Top blip
  { id: 17, coords: [1, 1, 2, 1, 1], color: '#E040FB' }, // Bottom blip
  { id: 18, coords: [0, 0, 2, 0, 0], color: '#00BFA5' }, // Top dip down
  { id: 19, coords: [2, 2, 0, 2, 2], color: '#FF6D00' }, // Bottom jump up
  { id: 20, coords: [0, 2, 0, 2, 0], color: '#AEEA00' }, // Full zigzag
];

export type SymbolId =
  | 'archaeologist'
  | 'pharaoh'
  | 'anubis'
  | 'cleopatra'
  | 'prince'
  | 'scarab'
  | 'eye'
  | 'ankh'
  | 'scepter'
  | 'a'
  | 'k'
  | 'q'
  | 'j'
  | '10'
  | 'scatter'
  | 'wild'
  | 'crystal';

export interface SymbolInfo {
  id: SymbolId;
  name: string;
  tier: 'special' | 'high' | 'mid' | 'low';
  // Payout multipliers for [count=2, count=3, count=4, count=5]
  payouts: [number, number, number, number];
  isWild?: boolean;
  isScatter?: boolean;
  canExpand?: boolean;
}

export const SYMBOLS: Record<SymbolId, SymbolInfo> = {
  archaeologist: {
    id: 'archaeologist',
    name: 'Nhà Khảo Cổ',
    tier: 'high',
    payouts: [10, 50, 200, 500],
    canExpand: true,
  },
  pharaoh: {
    id: 'pharaoh',
    name: 'Pharaoh Vàng',
    tier: 'high',
    payouts: [5, 30, 100, 200],
    canExpand: true,
  },
  anubis: {
    id: 'anubis',
    name: 'Thần Anubis',
    tier: 'high',
    payouts: [5, 25, 75, 150],
    canExpand: true,
  },
  cleopatra: {
    id: 'cleopatra',
    name: 'Nữ Hoàng Cleopatra',
    tier: 'high',
    payouts: [5, 20, 50, 100],
    canExpand: true,
  },
  prince: {
    id: 'prince',
    name: 'Hoàng Tử Ai Cập',
    tier: 'high',
    payouts: [5, 20, 50, 100],
    canExpand: true,
  },
  scarab: {
    id: 'scarab',
    name: 'Bọ Hung Ngọc',
    tier: 'mid',
    payouts: [0, 15, 40, 80],
    canExpand: true,
  },
  eye: {
    id: 'eye',
    name: 'Mắt Thần Horus',
    tier: 'mid',
    payouts: [0, 10, 30, 60],
    canExpand: true,
  },
  ankh: {
    id: 'ankh',
    name: 'Chìa Khóa Ankh',
    tier: 'mid',
    payouts: [0, 8, 25, 50],
    canExpand: true,
  },
  scepter: {
    id: 'scepter',
    name: 'Quyền Trượng Thần',
    tier: 'mid',
    payouts: [0, 6, 20, 40],
    canExpand: true,
  },
  a: {
    id: 'a',
    name: 'Biểu Tượng A',
    tier: 'low',
    payouts: [0, 5, 15, 30],
    canExpand: true,
  },
  k: {
    id: 'k',
    name: 'Biểu Tượng K',
    tier: 'low',
    payouts: [0, 5, 12, 25],
    canExpand: true,
  },
  q: {
    id: 'q',
    name: 'Biểu Tượng Q',
    tier: 'low',
    payouts: [0, 4, 10, 20],
    canExpand: true,
  },
  j: {
    id: 'j',
    name: 'Biểu Tượng J',
    tier: 'low',
    payouts: [0, 3, 8, 15],
    canExpand: true,
  },
  '10': {
    id: '10',
    name: 'Biểu Tượng 10',
    tier: 'low',
    payouts: [0, 2, 5, 10],
    canExpand: true,
  },
  wild: {
    id: 'wild',
    name: 'Mặt Trời Thần Ra (Wild)',
    tier: 'special',
    payouts: [10, 50, 200, 500],
    isWild: true,
    canExpand: false,
  },
  scatter: {
    id: 'scatter',
    name: 'Sách Phép Ra (Scatter)',
    tier: 'special',
    payouts: [0, 2, 20, 200], // Multiplied by total bet
    isScatter: true,
    canExpand: false,
  },
  crystal: {
    id: 'crystal',
    name: 'Pha Lê Ngọc Bích',
    tier: 'special',
    payouts: [0, 10, 50, 120],
    canExpand: true,
  },
};

// Reel strips with weighted distributions for realistic 96.5% RTP
export const REEL_STRIPS: SymbolId[][] = [
  // Reel 1
  [
    '10', 'j', 'q', 'scatter', 'k', 'a', 'scepter', 'ankh', 'eye', 'scarab',
    'prince', 'cleopatra', 'anubis', 'pharaoh', 'archaeologist', 'wild',
    '10', 'j', 'q', 'k', 'a', 'crystal', '10', 'j', 'q', 'k', 'a',
    'scepter', 'ankh', 'eye', 'scarab', '10', 'j', 'q'
  ],
  // Reel 2
  [
    'j', 'q', 'k', 'a', '10', 'scepter', 'wild', 'ankh', 'eye', 'scarab',
    'prince', 'cleopatra', 'anubis', 'pharaoh', 'archaeologist', 'crystal',
    '10', 'j', 'q', 'k', 'a', '10', 'j', 'q', 'k', 'a',
    'scepter', 'ankh', 'eye', 'scarab', 'j', 'q', 'k'
  ],
  // Reel 3 (Contains Scatter for anticipation)
  [
    'q', 'k', 'a', '10', 'j', 'scatter', 'scepter', 'ankh', 'eye', 'scarab',
    'wild', 'prince', 'cleopatra', 'anubis', 'pharaoh', 'archaeologist',
    '10', 'j', 'q', 'k', 'a', 'crystal', '10', 'j', 'q', 'k', 'a',
    'scepter', 'ankh', 'eye', 'scarab', 'q', 'k', 'a'
  ],
  // Reel 4
  [
    'k', 'a', '10', 'j', 'q', 'scepter', 'ankh', 'wild', 'eye', 'scarab',
    'prince', 'cleopatra', 'anubis', 'pharaoh', 'archaeologist', 'crystal',
    '10', 'j', 'q', 'k', 'a', '10', 'j', 'q', 'k', 'a',
    'scepter', 'ankh', 'eye', 'scarab', 'k', 'a', '10'
  ],
  // Reel 5 (Contains Scatter for excitement trigger!)
  [
    'a', '10', 'j', 'q', 'k', 'scatter', 'scepter', 'ankh', 'eye', 'scarab',
    'prince', 'cleopatra', 'anubis', 'pharaoh', 'archaeologist', 'wild',
    '10', 'j', 'q', 'k', 'a', 'crystal', '10', 'j', 'q', 'k', 'a',
    'scepter', 'ankh', 'eye', 'scarab', 'a', '10', 'j'
  ],
];

export interface SpinResult {
  // 5 columns x 3 rows matrix: grid[col][row]
  grid: SymbolId[][];
  winningLines: WinningLine[];
  scatterCount: number;
  scatterPositions: [number, number][]; // [col, row]
  isFreeSpinsTriggered: boolean;
  freeSpinsAwarded: number;
  totalWinAmount: number;
  isBigWin: boolean;
  hasAnticipation: boolean; // Trigger anticipation on reel 5 if reels 1 & 3 have scatters
  // Expanding Symbol details for Free Spins
  expandingSymbol?: SymbolId;
  expandedCols?: number[];
  expandedWinAmount?: number;
}

export interface WinningLine {
  payline: Payline;
  symbol: SymbolId;
  count: number;
  payout: number;
  // Winning positions on the grid: Array of [col, row]
  positions: [number, number][];
}

/**
 * Generate a random spin result
 */
export function generateSpin(
  betAmount: number,
  isFreeSpin = false,
  activeExpandingSymbol?: SymbolId
): SpinResult {
  const grid: SymbolId[][] = [];

  // Spin 5 reels
  for (let c = 0; c < 5; c++) {
    const strip = REEL_STRIPS[c];
    const stopIdx = Math.floor(Math.random() * strip.length);
    const colSymbols: SymbolId[] = [];
    for (let r = 0; r < 3; r++) {
      colSymbols.push(strip[(stopIdx + r) % strip.length]);
    }
    grid.push(colSymbols);
  }

  // Detect Scatters
  const scatterPositions: [number, number][] = [];
  for (let c = 0; c < 5; c++) {
    for (let r = 0; r < 3; r++) {
      if (grid[c][r] === 'scatter') {
        scatterPositions.push([c, r]);
      }
    }
  }

  const scatterCount = scatterPositions.length;
  // Anticipation: Scatter lands on reel 0 (Reel 1) and reel 2 (Reel 3)
  const hasScatterReel1 = scatterPositions.some(([c]) => c === 0);
  const hasScatterReel3 = scatterPositions.some(([c]) => c === 2);
  const hasAnticipation = hasScatterReel1 && hasScatterReel3;

  const isFreeSpinsTriggered = scatterCount >= 3;
  const freeSpinsAwarded = isFreeSpinsTriggered ? 10 : 0;

  // Evaluate 20 Fixed Paylines
  const winningLines: WinningLine[] = [];
  const lineBet = betAmount / 20.0;
  let totalWinAmount = 0;

  for (const payline of PAYLINES) {
    const lineSymbols = payline.coords.map((row, col) => grid[col][row]);
    
    // Evaluate line from left to right (reel 1 to 5)
    // Find the leading match symbol (accounting for Wild)
    let leadSymbol: SymbolId | null = null;
    let matchCount = 0;

    for (let col = 0; col < 5; col++) {
      const sym = lineSymbols[col];
      if (sym === 'scatter') {
        // Scatters do not pay on paylines (they pay anywhere)
        break;
      }

      if (leadSymbol === null) {
        leadSymbol = sym;
        matchCount = 1;
      } else if (sym === 'wild' || sym === leadSymbol || leadSymbol === 'wild') {
        if (leadSymbol === 'wild' && sym !== 'wild') {
          leadSymbol = sym; // Adopt the concrete symbol
        }
        matchCount++;
      } else {
        break;
      }
    }

    if (leadSymbol && matchCount >= 2) {
      const info = SYMBOLS[leadSymbol];
      // Index in payouts array: count 2 -> idx 0, count 3 -> idx 1, etc.
      const payoutIdx = matchCount - 2;
      const multiplier = info.payouts[payoutIdx] || 0;

      if (multiplier > 0) {
        const linePayout = multiplier * lineBet;
        totalWinAmount += linePayout;

        const positions: [number, number][] = [];
        for (let col = 0; col < matchCount; col++) {
          positions.push([col, payline.coords[col]]);
        }

        winningLines.push({
          payline,
          symbol: leadSymbol,
          count: matchCount,
          payout: linePayout,
          positions,
        });
      }
    }
  }

  // Scatter Payout (Multiplied by total bet)
  if (scatterCount >= 3) {
    const scatterMult = scatterCount === 3 ? 2 : scatterCount === 4 ? 20 : 200;
    totalWinAmount += scatterMult * betAmount;
  }

  // Free Spins: Expanding Symbol Feature Evaluation
  let expandedCols: number[] | undefined;
  let expandedWinAmount = 0;

  if (isFreeSpin && activeExpandingSymbol) {
    const colsWithExpSym: number[] = [];
    for (let c = 0; c < 5; c++) {
      if (grid[c].includes(activeExpandingSymbol)) {
        colsWithExpSym.push(c);
      }
    }

    const expInfo = SYMBOLS[activeExpandingSymbol];
    const minRequired = expInfo.tier === 'high' ? 2 : 3;

    if (colsWithExpSym.length >= minRequired) {
      expandedCols = colsWithExpSym;
      const count = colsWithExpSym.length;
      const multiplier = expInfo.payouts[count - 2] || 0;
      // Pays on all 20 lines when expanded!
      expandedWinAmount = multiplier * lineBet * 20;
      totalWinAmount += expandedWinAmount;
    }
  }

  const isBigWin = totalWinAmount >= betAmount * 15;

  return {
    grid,
    winningLines,
    scatterCount,
    scatterPositions,
    isFreeSpinsTriggered,
    freeSpinsAwarded,
    totalWinAmount,
    isBigWin,
    hasAnticipation,
    expandingSymbol: activeExpandingSymbol,
    expandedCols,
    expandedWinAmount,
  };
}

/**
 * Randomly pick an eligible expanding symbol for Free Spins
 */
export function pickRandomExpandingSymbol(): SymbolId {
  const candidates: SymbolId[] = [
    'archaeologist', 'pharaoh', 'anubis', 'cleopatra', 'prince',
    'scarab', 'eye', 'ankh', 'scepter',
    'a', 'k', 'q', 'j', '10', 'crystal'
  ];
  return candidates[Math.floor(Math.random() * candidates.length)];
}
