import React, { useEffect, useState } from 'react';
import './BigWinModal.scss';

interface BigWinModalProps {
  winAmount: number;
  onClose: () => void;
}

export const BigWinModal: React.FC<BigWinModalProps> = ({ winAmount, onClose }) => {
  const [displayAmount, setDisplayAmount] = useState(0);

  // Animated count up
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const stepTime = 30;
    const increment = winAmount / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= winAmount) {
        setDisplayAmount(winAmount);
        clearInterval(timer);
      } else {
        setDisplayAmount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [winAmount]);

  // Generate 25 floating 3D rotating coins
  const coins = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: Math.random() * 90 + 5,
    delay: Math.random() * 2,
    duration: 2.5 + Math.random() * 2,
    size: 35 + Math.random() * 35,
    frame: i % 9,
  }));

  return (
    <div className="big-win-overlay" onClick={onClose}>
      {/* 3D Coin Shower Showering Down */}
      <div className="coin-shower-container">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="falling-coin"
            style={{
              left: `${coin.left}%`,
              animationDelay: `${coin.delay}s`,
              animationDuration: `${coin.duration}s`,
              width: `${coin.size}px`,
              height: `${coin.size}px`,
            }}
          >
            <img
              src={`/assets/vfx/coin_${coin.frame}.png`}
              alt="Coin"
              className="spinning-coin-img"
            />
          </div>
        ))}
      </div>

      {/* Center Big Win Banner */}
      <div className="big-win-dialog" onClick={(e) => e.stopPropagation()}>
        <img
          src="/assets/ui/big_win.png"
          alt="BIG WIN"
          className="big-win-banner-img"
        />

        {/* Win Numbers */}
        <div className="big-win-amount-box">
          <span className="big-win-label">CHIẾN THẮNG LỚN!</span>
          <span className="big-win-number">+{displayAmount.toFixed(2)} SOL</span>
        </div>

        {/* Collect Button */}
        <button className="collect-win-btn" onClick={onClose}>
          THU TIỀN VÀO TÚI
        </button>
      </div>
    </div>
  );
};
