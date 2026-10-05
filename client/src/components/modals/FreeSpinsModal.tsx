import React, { useEffect, useState } from 'react';
import { SymbolId, SYMBOLS } from '../../core/slot-engine';
import './FreeSpinsModal.scss';

interface FreeSpinsModalProps {
  expandingSymbol: SymbolId;
  onStartFreeSpins: () => void;
}

const CANDIDATES: SymbolId[] = [
  'archaeologist', 'pharaoh', 'anubis', 'cleopatra', 'prince',
  'scarab', 'eye', 'ankh', 'scepter', 'a', 'k', 'q', 'j', '10'
];

export const FreeSpinsModal: React.FC<FreeSpinsModalProps> = ({
  expandingSymbol,
  onStartFreeSpins,
}) => {
  const [revealed, setRevealed] = useState(false);
  const [cyclingSymbol, setCyclingSymbol] = useState<SymbolId>('archaeologist');

  // Cycling book pages animation
  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      const rand = CANDIDATES[Math.floor(Math.random() * CANDIDATES.length)];
      setCyclingSymbol(rand);

      if (count > 25) {
        clearInterval(interval);
        setCyclingSymbol(expandingSymbol);
        setRevealed(true);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [expandingSymbol]);

  const chosenInfo = SYMBOLS[expandingSymbol];

  return (
    <div className="freespins-modal-overlay">
      <div className="freespins-dialog">
        {/* Background Portal Glow */}
        <img
          src="/assets/vfx/magic_aura_8.png"
          alt="Magic Portal"
          className="portal-ring-bg"
        />

        {/* Modal Header */}
        <div className="fs-modal-header">
          <h1 className="fs-title">10 FREE SPINS KÍCH HOẠT!</h1>
          <p className="fs-subtitle">Cuốn Sách Thần Ra Đang Lựa Chọn Biểu Tượng Mở Rộng...</p>
        </div>

        {/* Center Book of Ra & Chosen Symbol */}
        <div className="chosen-symbol-container">
          <div className="symbol-pedestal">
            <img
              src={`/assets/symbols/${cyclingSymbol}.png`}
              alt={chosenInfo.name}
              className={`chosen-symbol-img ${revealed ? 'revealed-anim' : 'cycling'}`}
            />
            {revealed && (
              <>
                <img
                  src="/assets/vfx/spark_1.png"
                  alt="Spark"
                  className="chosen-sparkle spark-top"
                />
                <img
                  src="/assets/vfx/spark_2.png"
                  alt="Spark"
                  className="chosen-sparkle spark-bottom"
                />
              </>
            )}
          </div>
          {revealed && (
            <div className="symbol-info-tag">
              <span className="sym-name">{chosenInfo.name.toUpperCase()}</span>
              <span className="sym-desc">Sẽ Mở Rộng Cả 3 Hàng ($1 \times 3$) Khi Xuất Hiện!</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {revealed && (
          <button className="start-fs-btn" onClick={onStartFreeSpins}>
            BẮT ĐẦU 10 VÒNG QUAY MIỄN PHÍ
          </button>
        )}
      </div>
    </div>
  );
};
