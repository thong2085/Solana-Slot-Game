import React from 'react';
import { SYMBOLS, SymbolId } from '../../core/slot-engine';
import './PaytableModal.scss';

interface PaytableModalProps {
  onClose: () => void;
}

export const PaytableModal: React.FC<PaytableModalProps> = ({ onClose }) => {
  const symbolList: SymbolId[] = [
    'archaeologist',
    'pharaoh',
    'anubis',
    'cleopatra',
    'prince',
    'scarab',
    'eye',
    'ankh',
    'scepter',
    'a',
    'k',
    'q',
    'j',
    '10',
    'wild',
    'scatter',
  ];

  return (
    <div className="paytable-modal-overlay" onClick={onClose}>
      <div className="paytable-scroll-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Background Papyrus Scroll */}
        <img
          src="/assets/ui/paytable_scroll.png"
          alt="Ancient Papyrus Scroll"
          className="papyrus-scroll-bg"
        />

        {/* Scroll Content Inside Frame */}
        <div className="scroll-content-body">
          <div className="scroll-header">
            <h2 className="scroll-title">BẢNG TRẢ THƯỞNG & LUẬT CHƠI</h2>
            <p className="scroll-subtitle">Lost Relics of Ra • 20 Fixed Paylines • RTP 96.5%</p>
          </div>

          {/* Symbol Payout Grid */}
          <div className="symbol-payout-grid">
            {symbolList.map((id) => {
              const info = SYMBOLS[id];
              return (
                <div key={id} className={`payout-card tier-${info.tier}`}>
                  <div className="payout-card-img">
                    <img src={`/assets/symbols/${id}.png`} alt={info.name} />
                  </div>
                  <div className="payout-card-info">
                    <span className="card-name">{info.name}</span>
                    <div className="payout-tiers">
                      {info.isScatter ? (
                        <>
                          <span className="tier-row">5x: <b>200x Tổng Cược</b></span>
                          <span className="tier-row">4x: <b>20x Tổng Cược</b></span>
                          <span className="tier-row">3x: <b>2x + 10 Free Spins</b></span>
                        </>
                      ) : (
                        <>
                          <span className="tier-row">5x: <b>{info.payouts[3]}x</b></span>
                          <span className="tier-row">4x: <b>{info.payouts[2]}x</b></span>
                          <span className="tier-row">3x: <b>{info.payouts[1]}x</b></span>
                          {info.payouts[0] > 0 && (
                            <span className="tier-row">2x: <b>{info.payouts[0]}x</b></span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Special Mechanics Section */}
          <div className="features-section">
            <div className="feature-block">
              <h3>☀️ BIỂU TƯỢNG WILD (MẶT TRỜI RA)</h3>
              <p>Thay thế cho mọi biểu tượng thông thường để tạo thành tổ hợp thắng cao nhất trên 20 đường Payline.</p>
            </div>
            <div className="feature-block">
              <h3>📖 10 FREE SPINS & BIỂU TƯỢNG MỞ RỘNG (EXPANDING SYMBOL)</h3>
              <p>
                Rơi 3+ cuốn sách Scatter kích hoạt 10 Vòng Quay Miễn Phí. Trước khi quay, sách thần Ra sẽ mở ra chọn ngẫu nhiên 1 Biểu Tượng Mở Rộng. Khi biểu tượng này xuất hiện đủ số lượng trong Free Spins, cột sáng Thần Ra sẽ rọi xuống mở rộng phủ kín cả 3 hàng ($1 \times 3$) và trả thưởng trên cả 20 dòng thắng!
              </p>
            </div>
            <div className="feature-block">
              <h3>⚡ HIỆU ỨNG HỒI HỘP (ANTICIPATION REEL 5)</h3>
              <p>
                Khi Scatter đã xuất hiện ở Cột 1 và Cột 3, Cột 5 sẽ quay chậm lại trong vầng hào quang bốc cháy để gia tăng sự phấn khích hồi hộp!
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button className="close-scroll-btn" onClick={onClose}>
            ĐÓNG CUỘN GIẤY
          </button>
        </div>
      </div>
    </div>
  );
};
