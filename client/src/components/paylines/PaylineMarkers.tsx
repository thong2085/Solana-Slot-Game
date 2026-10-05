import React from 'react';
import { PAYLINES } from '../../core/slot-engine';
import './PaylineMarkers.scss';

interface PaylineMarkersProps {
  activeWinningLineIds: number[];
  hoveredLineId: number | null;
  onHoverLine: (id: number | null) => void;
}

export const PaylineMarkers: React.FC<PaylineMarkersProps> = ({
  activeWinningLineIds,
  hoveredLineId,
  onHoverLine,
}) => {
  const leftLines = PAYLINES.slice(0, 10); // Lines 1 - 10
  const rightLines = PAYLINES.slice(10, 20); // Lines 11 - 20

  return (
    <div className="payline-markers-container">
      {/* Left Column: Lines 1 to 10 on the left temple pillar */}
      <div className="markers-column markers-left">
        {leftLines.map((pl) => {
          const isWinning = activeWinningLineIds.includes(pl.id);
          const isHovered = hoveredLineId === pl.id;

          return (
            <div
              key={pl.id}
              className={`payline-badge-btn ${isWinning ? 'winning' : ''} ${
                isHovered ? 'hovered' : ''
              }`}
              style={{
                ['--line-color' as string]: pl.color,
              }}
              onMouseEnter={() => onHoverLine(pl.id)}
              onMouseLeave={() => onHoverLine(null)}
              title={`Payline #${pl.id}`}
            >
              <div className="badge-gem" />
              <span className="badge-num">{pl.id}</span>
            </div>
          );
        })}
      </div>

      {/* Right Column: Lines 11 to 20 on the right temple pillar */}
      <div className="markers-column markers-right">
        {rightLines.map((pl) => {
          const isWinning = activeWinningLineIds.includes(pl.id);
          const isHovered = hoveredLineId === pl.id;

          return (
            <div
              key={pl.id}
              className={`payline-badge-btn ${isWinning ? 'winning' : ''} ${
                isHovered ? 'hovered' : ''
              }`}
              style={{
                ['--line-color' as string]: pl.color,
              }}
              onMouseEnter={() => onHoverLine(pl.id)}
              onMouseLeave={() => onHoverLine(null)}
              title={`Payline #${pl.id}`}
            >
              <div className="badge-gem" />
              <span className="badge-num">{pl.id}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
