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
          <span className="meter-label">TỔNG CƯỢC</span>
          <div className="bet-adjust-controls">
            <button
              className="bet-btn-step btn-step-minus"
              onClick={() => onAdjustBet(-2)}
              disabled={isSpinning || isFreeSpins || betAmount <= 2}
              title="Giảm cược"
            >
              <img src="/assets/ui/btn_minus.png" alt="Minus" className="step-btn-img" />
            </button>
            <span className="meter-value bet-val">{betAmount.toFixed(0)}</span>
            <button
              className="bet-btn-step btn-step-plus"
              onClick={() => onAdjustBet(2)}
              disabled={isSpinning || isFreeSpins || betAmount >= 100}
              title="Tăng cược"
            >
              <img src="/assets/ui/btn_plus.png" alt="Plus" className="step-btn-img" />
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
            className="action-btn paytable-btn custom-img-btn"
            onClick={onOpenPaytable}
            title="Bảng Trả Thưởng"
          >
            <img src="/assets/ui/btn_paytable.png" alt="PAYTABLE" className="btn-art-img" />
          </button>

          {/* Sound Toggle Button */}
          <button
            className={`action-btn sound-btn custom-img-btn ${isMuted ? 'muted' : ''}`}
            onClick={onToggleMute}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            <img src="/assets/ui/btn_sound.png" alt="Sound" className="btn-art-img" />
            {isMuted && <span className="sound-muted-cross">✕</span>}
          </button>

          {/* Max Bet Button */}
          <button
            className="action-btn max-bet-btn custom-img-btn"
            onClick={onMaxBet}
            disabled={isSpinning || isFreeSpins || betAmount >= 100}
            title="Cược Tối Đa"
          >
            <img src="/assets/ui/btn_maxbet.png" alt="MAX BET" className="btn-art-img" />
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
            className={`action-btn autospin-btn custom-img-btn ${isAutoSpin ? 'active' : ''}`}
            onClick={onToggleAutoSpin}
            disabled={isFreeSpins}
            title={isAutoSpin ? 'Dừng Tự Động Quay' : 'Tự Động Quay'}
          >
            <img src="/assets/ui/btn_autospin.png" alt="AUTO SPIN" className="btn-art-img" />
            {isAutoSpin && <span className="autospin-active-badge">ACTIVE</span>}
          </button>

          {/* Wallet Connect Button */}
          <button
            className={`action-btn wallet-btn custom-img-btn ${walletAddress ? 'connected' : ''}`}
            onClick={onConnectWallet}
            title={walletAddress ? `Ví: ${walletAddress}` : 'Kết nối ví Solana'}
          >
            <img src="/assets/ui/btn_wallet.png" alt="WEB3 WALLET" className="btn-art-img" />
            {walletAddress && (
              <span className="wallet-connected-pill">
                {`${walletAddress.slice(0, 4)}..${walletAddress.slice(-3)}`}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
