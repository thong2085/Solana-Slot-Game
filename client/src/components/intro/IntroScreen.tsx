import React, { useState } from 'react';
import { soundEngine } from '../../core/audio-engine';
import './IntroScreen.scss';

interface IntroScreenProps {
  onStartDemo: () => void;
  onConnectWallet: () => void;
  onOpenPaytable: () => void;
  walletAddress?: string;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onStartDemo,
  onConnectWallet,
  onOpenPaytable,
  walletAddress,
  isMuted,
  onToggleMute,
}) => {
  const [isWarping, setIsWarping] = useState(false);

  const handleEnter = (action: 'demo' | 'wallet') => {
    setIsWarping(true);
    soundEngine.playTombEntranceGong();

    setTimeout(() => {
      if (action === 'demo') {
        onStartDemo();
      } else {
        onConnectWallet();
      }
    }, 650);
  };

  return (
    <div className={`intro-screen-overlay ${isWarping ? 'warp-out' : ''}`}>
      {/* 1. Real Egyptian Burial Chamber Background */}
      <div className="intro-chamber-bg" />
      <div className="intro-dark-vignette" />

      {/* Floating Golden Sparks & Light Rays */}
      <div className="intro-sunbeam" />
      <div className="intro-torch-flame left-torch" />
      <div className="intro-torch-flame right-torch" />

      {/* Top Floating Controls */}
      <div className="intro-floating-top">
        <button
          className={`intro-sound-toggle-btn ${isMuted ? 'muted' : ''}`}
          onClick={onToggleMute}
          title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        >
          {isMuted ? '🔇 Âm Thanh: Tắt' : '🔊 Âm Thanh: Bật'}
        </button>
      </div>

      {/* Grand Hero Stage: Large Poster with Royal Golden Tablet in the Center */}
      <div className="intro-grand-stage">
        <div className="poster-canvas-wrapper">
          {/* Large Hero Poster */}
          <img
            src="/assets/ui/banner.jpg"
            alt="Lost Relics of Ra"
            className="hero-poster-img"
          />
          <div className="poster-outer-gold-border" />
          <div className="poster-central-depth-shadow" />

          {/* Royal Big Win Golden Tablet Centered on the Poster */}
          <div className="poster-center-tablet">
            <div className="tablet-frame-relative">
              {/* Royal Golden Frame with Wings, Gems and Coins */}
              <img
                src="/assets/ui/big_win.png"
                alt="Royal Golden Frame"
                className="tablet-gold-frame-img"
              />

              {/* Interactive Content Nestled Strictly on the Parchment Surface */}
              <div className="tablet-parchment-content">
                {/* 2 Authentic Ancient Game Buttons */}
                <div className="tablet-game-actions">
                  {/* Primary Royal Gold Button */}
                  <button
                    className="game-cartouche-btn btn-gold-royal"
                    onClick={() => handleEnter('demo')}
                  >
                    <span className="btn-inner-border" />
                    <span className="btn-icon">⚡</span>
                    <span className="btn-title">VÀO CHƠI (DEMO)</span>
                  </button>

                  {/* Secondary Turquoise Solana Stone Button */}
                  <button
                    className="game-cartouche-btn btn-turquoise-wallet"
                    onClick={() => handleEnter('wallet')}
                  >
                    <span className="btn-inner-border" />
                    <span className="btn-icon">💎</span>
                    <span className="btn-title">
                      {walletAddress ? 'VÍ ĐÃ KẾT NỐI' : 'KẾT NỐI VÍ SOLANA'}
                    </span>
                  </button>
                </div>

                {/* Paytable Action Link */}
                <div className="tablet-footer">
                  <button
                    className="tablet-paytable-btn"
                    onClick={() => {
                      soundEngine.playClick();
                      onOpenPaytable();
                    }}
                  >
                    📜 Xem Bảng Trả Thưởng & Luật Chơi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
