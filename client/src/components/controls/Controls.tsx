import React from 'react';
import './Controls.scss';

interface ControlsProps {
  balance: number;
  betAmount: number;
  lastWin: number;
  isSpinning: boolean;
  isFreeSpins: boolean;
  freeSpinsLeft: number;
  isAutoSpin: boolean;
  isMuted: boolean;
  walletAddress: string;
  onSpin: () => void;
  onAdjustBet: (delta: number) => void;
  onMaxBet: () => void;
  onToggleAutoSpin: () => void;
  onToggleMute: () => void;
  onOpenPaytable: () => void;
  onConnectWallet: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  balance,
  betAmount,
  lastWin,
  isSpinning,
  isFreeSpins,
  freeSpinsLeft,
  isAutoSpin,
  isMuted,
  walletAddress,
  onSpin,
  onAdjustBet,
  onMaxBet,
  onToggleAutoSpin,
  onToggleMute,
  onOpenPaytable,
  onConnectWallet,
}) => {
  return (
    <div className="controls-dashboard">
      {/* Top Status Bar: Meters & Info with Royal Gold Corners */}
      <div className="dashboard-meters">
        <div className="gold-filigree-corner top-left" />
        <div className="gold-filigree-corner top-right" />
        <div className="gold-filigree-corner bottom-left" />
        <div className="gold-filigree-corner bottom-right" />

        {/* Balance Meter */}
        <div className="meter-box balance-meter">
          <span className="meter-label">SỐ DƯ (SOL)</span>
          <span className="meter-value">{balance.toFixed(2)}</span>
        </div>

        {/* Win Meter */}
        <div className={`meter-box win-meter ${lastWin > 0 ? 'has-win' : ''}`}>
          <span className="meter-label">TIỀN THẮNG</span>
          <span className="meter-value">
            {lastWin > 0 ? `+${lastWin.toFixed(2)}` : '0.00'}
          </span>
        </div>

        {/* Total Bet Meter */}
        <div className="meter-box bet-meter">
          <span className="meter-label">TỔNG CƯỢC (20 LINES)</span>
          <div className="bet-adjust-controls">
            <button
              className="bet-btn-step"
              onClick={() => onAdjustBet(-2)}
              disabled={isSpinning || isFreeSpins || betAmount <= 2}
            >
              -
            </button>
            <span className="meter-value bet-val">{betAmount.toFixed(0)}</span>
            <button
              className="bet-btn-step"
              onClick={() => onAdjustBet(2)}
              disabled={isSpinning || isFreeSpins || betAmount >= 100}
            >
              +
            </button>
          </div>
        </div>

        {/* Free Spins Alert Badge if in Free Spins mode */}
        {isFreeSpins && (
          <div className="free-spins-badge animate-pulse">
            <span className="fs-title">FREE SPINS</span>
            <span className="fs-count">{freeSpinsLeft} LƯỢT</span>
          </div>
        )}
      </div>

      {/* Main Buttons Bar */}
      <div className="dashboard-actions">
        {/* Left Action Buttons */}
        <div className="action-group left-group">
          {/* Paytable Button */}
          <button
            className="action-btn paytable-btn"
            onClick={onOpenPaytable}
            title="Bảng Trả Thưởng"
          >
            <img src="/assets/ui/paytable_scroll.png" alt="Paytable" className="btn-icon-papyrus" />
            <span className="btn-text">PAYTABLE</span>
          </button>

          {/* Sound Toggle Button */}
          <button
            className={`action-btn sound-btn ${isMuted ? 'muted' : ''}`}
            onClick={onToggleMute}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            <span className="sound-emoji">{isMuted ? '🔇' : '🔊'}</span>
          </button>

          {/* Max Bet Button */}
          <button
            className="action-btn max-bet-btn"
            onClick={onMaxBet}
            disabled={isSpinning || isFreeSpins || betAmount >= 100}
          >
            MAX BET
          </button>
        </div>

        {/* Center: 3D Scarab Spin Button with Altar Pedestal */}
        <div className="center-spin-container">
          {/* Royal Egyptian Altar Pedestal */}
          <div className="spin-altar-pedestal">
            <div className="pedestal-stepped-base" />
            <div className="pedestal-golden-sun-disc" />
          </div>

          <button
            className={`scarab-spin-button ${isSpinning ? 'spinning-active' : ''} ${
              isFreeSpins ? 'free-spin-active' : ''
            }`}
            onClick={onSpin}
            disabled={isSpinning}
            title="Quay Ngay!"
          >
            {/* 3D Scarab Image */}
            <img
              src="/assets/ui/spin_button.png"
              alt="SPIN"
              className="scarab-gem-img"
            />
            {(isSpinning || isFreeSpins) && (
              <span className="spin-label-text">
                {isFreeSpins ? 'FREE SPIN' : 'QUAY...'}
              </span>
            )}
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="action-group right-group">
          {/* Auto Spin Toggle */}
          <button
            className={`action-btn autospin-btn ${isAutoSpin ? 'active' : ''}`}
            onClick={onToggleAutoSpin}
            disabled={isFreeSpins}
          >
            <span className="auto-icon">🔄</span>
            <span className="btn-text">{isAutoSpin ? 'DỪNG' : 'AUTO'}</span>
          </button>

          {/* Wallet Connect Button */}
          <button
            className={`action-btn wallet-btn ${walletAddress ? 'connected' : ''}`}
            onClick={onConnectWallet}
          >
            <span className="wallet-icon">💎</span>
            <span className="btn-text">
              {walletAddress
                ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
                : 'VÍ SOLANA'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
