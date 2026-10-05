import React from 'react';
import { WinningLine, PAYLINES } from '../../core/slot-engine';
import './PaylineOverlay.scss';

interface PaylineOverlayProps {
  winningLines: WinningLine[];
  activeLineIndex: number | null; // Null means show all or cycle
  previewLineId?: number | null;
}

export const PaylineOverlay: React.FC<PaylineOverlayProps> = ({
  winningLines,
  activeLineIndex,
  previewLineId,
}) => {
  // Grid dimensions mapping: 5 columns (0..4), 3 rows (0..2)
  // Percentages in SVG viewBox 0..500 x 0..300
  const colX = [50, 150, 250, 350, 450];
  const rowY = [50, 150, 250];

  // If there's an active preview line from hovering a badge
  const previewPayline =
    previewLineId ? PAYLINES.find((pl) => pl.id === previewLineId) : null;

  if (winningLines.length === 0 && !previewPayline) return null;

  const linesToRender =
    winningLines.length > 0
      ? activeLineIndex !== null && winningLines[activeLineIndex]
        ? [winningLines[activeLineIndex]]
        : winningLines
      : [];

  return (
    <div className="payline-overlay-container">
      <svg
        viewBox="0 0 500 300"
        className="payline-svg"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="laser-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Preview Hover Payline */}
        {previewPayline && (
          <g className="payline-group preview-group">
            {(() => {
              let pathD = '';
              for (let col = 0; col < 5; col++) {
                const x = colX[col];
                const y = rowY[previewPayline.coords[col]];
                pathD += col === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
              }
              return (
                <>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={previewPayline.color}
                    strokeWidth="9"
                    opacity="0.65"
                    filter="url(#laser-glow)"
                    className="payline-glow-stroke"
                  />
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="3.5"
                    strokeDasharray="6 4"
                    className="payline-core-stroke"
                  />
                  {previewPayline.coords.map((row, col) => (
                    <circle
                      key={col}
                      cx={colX[col]}
                      cy={rowY[row]}
                      r="8"
                      fill="#FFF"
                      stroke={previewPayline.color}
                      strokeWidth="3.5"
                      className="payline-node"
                    />
                  ))}
                </>
              );
            })()}
          </g>
        )}

        {/* 2. Active Winning Lines */}
        {linesToRender.map((wLine, idx) => {
          const { payline, count } = wLine;
          let pathD = '';
          for (let col = 0; col < 5; col++) {
            const x = colX[col];
            const y = rowY[payline.coords[col]];
            pathD += col === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
          }

          return (
            <g key={payline.id || idx} className="payline-group">
              {/* Outer Glow Line */}
              <path
                d={pathD}
                fill="none"
                stroke={payline.color}
                strokeWidth="8"
                opacity="0.55"
                filter="url(#laser-glow)"
                className="payline-glow-stroke"
              />
              {/* Core Sharp Laser Line */}
              <path
                d={pathD}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeDasharray="6 3"
                className="payline-core-stroke"
              />
              {/* Pulsing Dots at Winning Symbol Nodes */}
              {payline.coords.slice(0, count).map((row, col) => (
                <circle
                  key={col}
                  cx={colX[col]}
                  cy={rowY[row]}
                  r="7"
                  fill="#FFF"
                  stroke={payline.color}
                  strokeWidth="3"
                  className="payline-node"
                />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
