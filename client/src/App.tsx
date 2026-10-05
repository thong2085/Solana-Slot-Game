import React, { useEffect, useState, useCallback, useRef } from 'react';
import * as buffer from 'buffer';
import {
  SymbolId,
  generateSpin,
  pickRandomExpandingSymbol,
  WinningLine,
  SpinResult,
} from './core/slot-engine';
import { soundEngine } from './core/audio-engine';
import { ReelGrid } from './components/reel-grid/ReelGrid';
import { PaylineOverlay } from './components/paylines/PaylineOverlay';
import { Controls } from './components/controls/Controls';
import { BigWinModal } from './components/modals/BigWinModal';
import { PaytableModal } from './components/modals/PaytableModal';
import { FreeSpinsModal } from './components/modals/FreeSpinsModal';
import { checkIfWalletConnected, connectWallet, getBalance } from './core/wallet';
import './App.scss';

window.Buffer = buffer.Buffer;

const INITIAL_GRID: SymbolId[][] = [
  ['archaeologist', 'anubis', '10'],
  ['pharaoh', 'scarab', 'k'],
  ['cleopatra', 'eye', 'a'],
  ['prince', 'ankh', 'q'],
  ['wild', 'scepter', 'j'],
];

export const App: React.FC = () => {
  // Game Grid & Animation States
  const [grid, setGrid] = useState<SymbolId[][]>(INITIAL_GRID);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningReels, setSpinningReels] = useState<boolean[]>([false, false, false, false, false]);
  const [winningLines, setWinningLines] = useState<WinningLine[]>([]);
  const [winningPositions, setWinningPositions] = useState<Set<string>>(new Set());
  const [activePaylineIndex, setActivePaylineIndex] = useState<number | null>(null);

  // Betting & Balance States
  const [balance, setBalance] = useState<number>(1000.0); // Demo balance or SOL
  const [betAmount, setBetAmount] = useState<number>(20.0);
  const [lastWin, setLastWin] = useState<number>(0);

  // Free Spins & Special Feature States
  const [isFreeSpins, setIsFreeSpins] = useState(false);
  const [freeSpinsLeft, setFreeSpinsLeft] = useState(0);
  const [expandingSymbol, setExpandingSymbol] = useState<SymbolId | undefined>();
  const [expandedCols, setExpandedCols] = useState<number[]>([]);
  const [hasAnticipation, setHasAnticipation] = useState(false);

  // Modals & UI States
  const [isBigWinModalOpen, setIsBigWinModalOpen] = useState(false);
  const [bigWinAmount, setBigWinAmount] = useState(0);
  const [isPaytableModalOpen, setIsPaytableModalOpen] = useState(false);
  const [isFreeSpinsModalOpen, setIsFreeSpinsModalOpen] = useState(false);
  const [pendingExpandingSymbol, setPendingExpandingSymbol] = useState<SymbolId>('archaeologist');

  // Controls & Settings
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');

  // Refs for timers & auto-spin loop
  const autoSpinRef = useRef(isAutoSpin);
  autoSpinRef.current = isAutoSpin;
  const isFreeSpinsRef = useRef(isFreeSpins);
  isFreeSpinsRef.current = isFreeSpins;

  // Check Solana Wallet on load
  useEffect(() => {
    checkIfWalletConnected().then((res) => {
      if (res) {
        setWalletAddress(res as string);
        getBalance().then((balRes) => {
          if (balRes.balance) setBalance(parseFloat(balRes.balance));
        });
      }
    });
  }, []);

  // Cycle active winning paylines for clear visibility
  useEffect(() => {
    if (winningLines.length <= 1) {
      setActivePaylineIndex(null);
      return;
    }

    let current = 0;
    const interval = setInterval(() => {
      current = (current + 1) % (winningLines.length + 1);
      setActivePaylineIndex(current === winningLines.length ? null : current);
    }, 1800);

    return () => clearInterval(interval);
  }, [winningLines]);

  // Handle Bet adjustment
  const handleAdjustBet = (delta: number) => {
    soundEngine.playClick();
    setBetAmount((prev) => Math.min(100, Math.max(2, prev + delta)));
  };

  const handleMaxBet = () => {
    soundEngine.playClick();
    setBetAmount(100);
  };

  const handleToggleAutoSpin = () => {
    soundEngine.playClick();
    setIsAutoSpin((prev) => !prev);
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleConnectWallet = async () => {
    soundEngine.playClick();
    const addr = await connectWallet();
    if (addr) {
      setWalletAddress(addr as string);
      getBalance().then((balRes) => {
        if (balRes.balance) setBalance(parseFloat(balRes.balance));
      });
    }
  };

  // Core Spin Execution
  // Handle outcome after all reels stop
  const handleSpinComplete = useCallback((outcome: SpinResult) => {
    // 1. Process Expanding Symbol in Free Spins
    if (isFreeSpinsRef.current && outcome.expandedCols && outcome.expandedCols.length > 0) {
      setTimeout(() => {
        soundEngine.playExpandingBeam();
        setExpandedCols(outcome.expandedCols || []);
      }, 400);
    }

    // 2. Process Win Lines
    if (outcome.totalWinAmount > 0) {
      setLastWin(outcome.totalWinAmount);
      setBalance((prev) => prev + outcome.totalWinAmount);
      setWinningLines(outcome.winningLines);

      // Collect winning positions for pulse effect
      const posSet = new Set<string>();
      outcome.winningLines.forEach((wl) => {
        wl.positions.forEach(([c, r]) => posSet.add(`${c},${r}`));
      });
      setWinningPositions(posSet);

      if (outcome.isBigWin) {
        soundEngine.playCoinShower();
        setBigWinAmount(outcome.totalWinAmount);
        setIsBigWinModalOpen(true);
      } else {
        soundEngine.playWin();
      }
    }

    // 3. Process Free Spins Trigger
    if (outcome.isFreeSpinsTriggered) {
      const chosenExp = pickRandomExpandingSymbol();
      setPendingExpandingSymbol(chosenExp);
      setTimeout(() => {
        setIsFreeSpinsModalOpen(true);
      }, 1200);
    }

    // 4. Free Spins Completion Check
    if (isFreeSpinsRef.current && freeSpinsLeft <= 1) {
      setTimeout(() => {
        setIsFreeSpins(false);
        setExpandingSymbol(undefined);
        alert('Chúc mừng! Bạn đã hoàn thành 10 Vòng Quay Miễn Phí!');
      }, 1500);
    }

    // 5. Auto Spin Loop
    if (autoSpinRef.current && !outcome.isFreeSpinsTriggered && !outcome.isBigWin) {
      setTimeout(() => {
        if (autoSpinRef.current) {
          executeSpinRef.current();
        }
      }, 1200);
    }
  }, [freeSpinsLeft]);

  // Core Spin Execution
  const executeSpin = useCallback(() => {
    if (isSpinning) return;

    // Check balance if not in Free Spins
    if (!isFreeSpinsRef.current && balance < betAmount) {
      alert('Số dư không đủ! Đang đặt lại 1,000 credit demo để tiếp tục trải nghiệm.');
      setBalance(1000);
      return;
    }

    // Deduct bet if not free spin
    if (!isFreeSpinsRef.current) {
      setBalance((prev) => prev - betAmount);
    } else {
      setFreeSpinsLeft((prev) => prev - 1);
    }

    // Reset previous spin highlights
    setIsSpinning(true);
    setWinningLines([]);
    setWinningPositions(new Set());
    setExpandedCols([]);
    setLastWin(0);
    soundEngine.playSpinStart();

    // Start all 5 reels spinning
    setSpinningReels([true, true, true, true, true]);

    // Calculate outcome mathematically using SlotEngine
    const outcome: SpinResult = generateSpin(
      betAmount,
      isFreeSpinsRef.current,
      expandingSymbol
    );

    setHasAnticipation(outcome.hasAnticipation);
    if (outcome.hasAnticipation) {
      soundEngine.startAnticipation();
    }

    // Sequential reel stops with realistic inertia physics
    const reel5Delay = outcome.hasAnticipation ? 3200 : 2200;
    const delays = [1000, 1300, 1600, 1900, reel5Delay];

    delays.forEach((delay, reelIdx) => {
      setTimeout(() => {
        setSpinningReels((prev) => {
          const next = [...prev];
          next[reelIdx] = false;
          return next;
        });

        setGrid((prevGrid) => {
          const newGrid = [...prevGrid];
          newGrid[reelIdx] = outcome.grid[reelIdx];
          return newGrid;
        });

        soundEngine.playReelStop(reelIdx);

        if (outcome.grid[reelIdx].includes('scatter')) {
          soundEngine.playScatterLand(reelIdx + 1);
        }

        if (reelIdx === 4) {
          soundEngine.stopAnticipation();
          setIsSpinning(false);
          handleSpinComplete(outcome);
        }
      }, delay);
    });
  }, [isSpinning, balance, betAmount, expandingSymbol, handleSpinComplete]);

  const executeSpinRef = useRef(executeSpin);
  executeSpinRef.current = executeSpin;

  const handleStartFreeSpins = () => {
    setIsFreeSpinsModalOpen(false);
    setIsFreeSpins(true);
    setFreeSpinsLeft(10);
    setExpandingSymbol(pendingExpandingSymbol);
    setTimeout(() => {
      executeSpin();
    }, 600);
  };

  return (
    <div className="slot-game-app">
      {/* Background Ambience Torches & Pillars */}
      <div className="tomb-background-ambient" />

      {/* Main Machine Container */}
      <main className="slot-machine-viewport">
        {/* Machine Header Logo */}
        <header className="game-header-brand">
          <h1 className="game-main-title">LOST RELICS OF RA</h1>
          <p className="game-sub-banner">ANCIENT EGYPTIAN 5×3 ADVENTURE • 20 PAYLINES</p>
        </header>

        {/* 5x3 Reels & Stone Temple Frame Wrapper */}
        <div className="machine-frame-wrapper">
          {/* Stone Temple Pillars Frame */}
          <img
            src="/assets/ui/frame.png"
            alt="Ancient Egyptian Temple Frame"
            className="stone-temple-frame-img"
          />

          {/* 5x3 Reel Grid */}
          <ReelGrid
            grid={grid}
            isSpinning={isSpinning}
            spinningReels={spinningReels}
            winningPositions={winningPositions}
            expandedCols={expandedCols}
            expandingSymbol={expandingSymbol}
            hasAnticipation={hasAnticipation}
          />

          {/* 20 Paylines Laser Overlay */}
          <PaylineOverlay
            winningLines={winningLines}
            activeLineIndex={activePaylineIndex}
          />
        </div>

        {/* Dashboard & 3D Scarab Spin Controls */}
        <Controls
          balance={balance}
          betAmount={betAmount}
          lastWin={lastWin}
          isSpinning={isSpinning}
          isFreeSpins={isFreeSpins}
          freeSpinsLeft={freeSpinsLeft}
          isAutoSpin={isAutoSpin}
          isMuted={isMuted}
          walletAddress={walletAddress}
          onSpin={executeSpin}
          onAdjustBet={handleAdjustBet}
          onMaxBet={handleMaxBet}
          onToggleAutoSpin={handleToggleAutoSpin}
          onToggleMute={handleToggleMute}
          onOpenPaytable={() => setIsPaytableModalOpen(true)}
          onConnectWallet={handleConnectWallet}
        />
      </main>

      {/* Big Win Popup & 3D Coin Shower Modal */}
      {isBigWinModalOpen && (
        <BigWinModal
          winAmount={bigWinAmount}
          onClose={() => setIsBigWinModalOpen(false)}
        />
      )}

      {/* Papyrus Scroll Paytable Modal */}
      {isPaytableModalOpen && (
        <PaytableModal onClose={() => setIsPaytableModalOpen(false)} />
      )}

      {/* Free Spins Book of Ra Selection Modal */}
      {isFreeSpinsModalOpen && (
        <FreeSpinsModal
          expandingSymbol={pendingExpandingSymbol}
          onStartFreeSpins={handleStartFreeSpins}
        />
      )}
    </div>
  );
};

export default App;
