import React from 'react';
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

export const ReelGrid: React.FC<ReelGridProps> = ({
  grid,
  isSpinning,
  spinningReels,
  winningPositions,
  expandedCols,
  expandingSymbol,
  hasAnticipation,
}) => {
  return (
    <div className="reel-grid-container">
      {/* 5 Reel Columns */}
      <div className="reels-track">
        {grid.map((column, colIdx) => {
          const isReelSpinning = spinningReels[colIdx];
          const isExpanded = expandedCols.includes(colIdx);
          const isAnticipating = colIdx === 4 && hasAnticipation && isReelSpinning;

          return (
            <div
              key={colIdx}
              className={`reel-column ${isReelSpinning ? 'spinning' : ''} ${
                isAnticipating ? 'anticipating' : ''
              } ${isExpanded ? 'expanded' : ''}`}
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

              {/* 3 Visible Rows per Column */}
              <div className="symbols-strip">
                {column.map((symbolId, rowIdx) => {
                  const effectiveSymbol = isExpanded && expandingSymbol ? expandingSymbol : symbolId;
                  const isWinning = winningPositions.has(`${colIdx},${rowIdx}`);
                  const symInfo = SYMBOLS[effectiveSymbol] || SYMBOLS['10'];

                  return (
                    <div
                      key={rowIdx}
                      className={`symbol-cell ${isWinning ? 'winning' : ''} ${
                        isExpanded ? 'expanded-symbol' : ''
                      } tier-${symInfo.tier}`}
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
            </div>
          );
        })}
      </div>
    </div>
  );
};
