import React, { useState, useEffect, useRef } from 'react';
import { SymbolId, SYMBOLS } from '../../core/slot-engine';
import './ReelGrid.scss';

interface ReelGridProps {
  grid: SymbolId[][];
  isSpinning: boolean;
  spinningReels: boolean[];
  winningPositions: Set<string>; // 'col,row'
  expandedCols: number[];
  expandingSymbol?: SymbolId;
  hasAnticipation: boolean;
}

// Strip patterns per reel (repeated twice for seamless downward slide)
const STRIP_PRESETS: SymbolId[][] = [
  ['archaeologist', '10', 'cleopatra', 'a', 'wild', 'scatter', 'k', 'anubis', 'q', 'pharaoh', 'j'],
  ['pharaoh', 'j', 'anubis', 'q', 'cleopatra', '10', 'wild', 'a', 'scarab', 'k'],
  ['wild', 'k', 'archaeologist', 'scatter', 'a', 'pharaoh', '10', 'eye', 'j', 'anubis', 'q'],
  ['anubis', 'q', 'scarab', 'k', 'cleopatra', 'j', 'wild', '10', 'pharaoh', 'a'],
  ['cleopatra', 'a', 'wild', 'scatter', '10', 'anubis', 'k', 'archaeologist', 'q', 'pharaoh', 'j'],
];

export const ReelGrid: React.FC<ReelGridProps> = ({
  grid,
  isSpinning,
  spinningReels,
  winningPositions,
  expandedCols,
  expandingSymbol,
  hasAnticipation,
}) => {
  // Track bounce landing state when each reel finishes spinning
  const [landingCols, setLandingCols] = useState<boolean[]>([false, false, false, false, false]);
  const prevSpinningRef = useRef<boolean[]>(spinningReels);

  useEffect(() => {
    spinningReels.forEach((isReelSpinning, colIdx) => {
      // Trigger landing bounce when reel transitions from true to false
      if (prevSpinningRef.current[colIdx] && !isReelSpinning) {
        setLandingCols((prev) => {
          const next = [...prev];
          next[colIdx] = true;
          return next;
        });

        setTimeout(() => {
          setLandingCols((prev) => {
            const next = [...prev];
            next[colIdx] = false;
            return next;
          });
        }, 380);
      }
    });

    prevSpinningRef.current = [...spinningReels];
  }, [spinningReels]);

  return (
    <div className="reel-grid-container">
      {/* 5 Reel Columns */}
      <div className="reels-track">
        {grid.map((column, colIdx) => {
          const isReelSpinning = spinningReels[colIdx];
          const isLanding = landingCols[colIdx];
          const isExpanded = expandedCols.includes(colIdx);
          const isAnticipating = colIdx === 4 && hasAnticipation && isReelSpinning;

          // Double the preset strip to 20 symbols for seamless downward loop
          const spinningStrip = [...STRIP_PRESETS[colIdx], ...STRIP_PRESETS[colIdx]];

          // 5 symbols for stationary strip (1 top buffer, 3 rows, 1 bottom buffer)
          const stationaryStrip = [
            { id: STRIP_PRESETS[colIdx][8], rowIdx: -1, isBuffer: true },
            { id: column[0], rowIdx: 0, isBuffer: false },
            { id: column[1], rowIdx: 1, isBuffer: false },
            { id: column[2], rowIdx: 2, isBuffer: false },
            { id: STRIP_PRESETS[colIdx][2], rowIdx: 3, isBuffer: true },
          ];

          return (
            <div
              key={colIdx}
              className={`reel-column reel-${colIdx} ${isReelSpinning ? 'spinning' : ''} ${
                isLanding ? 'landing' : ''
              } ${isAnticipating ? 'anticipating' : ''} ${isExpanded ? 'expanded' : ''}`}
            >
              {/* Anticipation Flame Aura on Reel 5 */}
              {isAnticipating && (
                <div className="anticipation-aura">
                  <img
                    src="/assets/vfx/magic_aura_7.png"
                    alt="Anticipation Aura"
                    className="aura-effect spin-aura"
                  />
                  <div className="anticipation-glow" />
                </div>
              )}

              {/* Expanding Beam of Holy Sunlight */}
              {isExpanded && (
                <div className="expanding-beam-wrapper">
                  <img
                    src="/assets/vfx/light_beam.png"
                    alt="Expanding Light Pillar"
                    className="light-beam-anim"
                  />
                </div>
              )}

              {/* Dynamic Reel Strip: Fast Continuous Slide when Spinning, or 3 Rows with Landing Bounce when Stopped */}
              {isReelSpinning ? (
                <div className="symbols-strip spinning-strip">
                  {spinningStrip.map((symbolId, stripIdx) => {
                    const symInfo = SYMBOLS[symbolId] || SYMBOLS['10'];
                    return (
                      <div key={stripIdx} className={`symbol-cell tier-${symInfo.tier}`}>
                        <div className="symbol-inner">
                          <img
                            src={`/assets/symbols/${symbolId}.png`}
                            alt={symInfo.name}
                            className="symbol-img motion-blur"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={`symbols-strip stationary-strip ${isLanding ? 'bounce-landing' : ''}`}>
                  {stationaryStrip.map((item, idx) => {
                    const effectiveSymbol =
                      !item.isBuffer && isExpanded && expandingSymbol ? expandingSymbol : item.id;
                    const isWinning = !item.isBuffer && winningPositions.has(`${colIdx},${item.rowIdx}`);
                    const symInfo = SYMBOLS[effectiveSymbol] || SYMBOLS['10'];

                    return (
                      <div
                        key={idx}
                        className={`symbol-cell ${isWinning ? 'winning' : ''} ${
                          isExpanded && !item.isBuffer ? 'expanded-symbol' : ''
                        } ${item.isBuffer ? 'buffer-cell' : ''} tier-${symInfo.tier}`}
                      >
                        <div className="symbol-inner">
                          <img
                            src={`/assets/symbols/${effectiveSymbol}.png`}
                            alt={symInfo.name}
                            className="symbol-img"
                          />
                          {/* Winning Golden Sparkles Glow */}
                          {isWinning && (
                            <>
                              <div className="win-sparkle-halo" />
                              <img
                                src="/assets/vfx/spark_1.png"
                                alt="Win Sparkle"
                                className="win-sparkle-icon"
                              />
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
