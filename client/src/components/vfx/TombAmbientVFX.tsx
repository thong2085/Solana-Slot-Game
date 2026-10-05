import React, { useMemo } from 'react';
import './TombAmbientVFX.scss';

interface TombAmbientVFXProps {
  isSpinning: boolean;
  isWinning: boolean;
  lastWin: number;
  isFreeSpins: boolean;
}

interface Particle {
  id: number;
  imgSrc: string;
  leftPercent: number;
  bottomPercent: number;
  sizePx: number;
  durationSec: number;
  delaySec: number;
  driftPx: number;
  opacity: number;
}

interface RainCoin {
  id: number;
  imgSrc: string;
  leftPercent: number;
  sizePx: number;
  durationSec: number;
  delaySec: number;
  driftPx: number;
  spinDurationSec: number;
  opacity: number;
  blurPx: number;
}

export const TombAmbientVFX: React.FC<TombAmbientVFXProps> = ({
  isSpinning,
  isWinning,
  lastWin,
  isFreeSpins,
}) => {
  // 1. Continuous Cascading Golden Coins Rain (Mưa tiền xu vàng rơi liên tục)
  const continuousRainCoins = useMemo<RainCoin[]>(() => {
    const list: RainCoin[] = [];
    const totalCoins = 36;

    for (let i = 0; i < totalCoins; i++) {
      const coinIndex = i % 9;
      const isBack = i % 3 === 0;
      const isFore = i % 3 === 1;

      // Distribute evenly across full screen width
      const leftPercent = 2 + (i * (96 / totalCoins)) + (Math.random() * 3 - 1.5);

      let sizePx: number;
      let durationSec: number;
      let opacity: number;
      let blurPx: number;

      if (isBack) {
        // Deep background layer (smaller, slower, subtle blur)
        sizePx = 22 + Math.random() * 8;
        durationSec = 4.8 + Math.random() * 2.0;
        opacity = 0.65;
        blurPx = 0.8;
      } else if (isFore) {
        // Foreground layer (larger, faster, bright gold)
        sizePx = 36 + Math.random() * 14;
        durationSec = 2.6 + Math.random() * 1.0;
        opacity = 0.95;
        blurPx = 0;
      } else {
        // Midground layer
        sizePx = 28 + Math.random() * 8;
        durationSec = 3.6 + Math.random() * 1.2;
        opacity = 0.82;
        blurPx = 0.2;
      }

      list.push({
        id: i,
        imgSrc: `/assets/vfx/coin_${coinIndex}.png`,
        leftPercent,
        sizePx,
        durationSec,
        // Negative delay ensures coins are already in motion at all heights on load
        delaySec: -(Math.random() * 6),
        driftPx: (Math.random() - 0.5) * 60,
        spinDurationSec: 0.9 + Math.random() * 1.1,
        opacity,
        blurPx,
      });
    }

    return list;
  }, []);

  // 2. Steady stream of floating embers & fire sparks
  const particles = useMemo<Particle[]>(() => {
    const list: Particle[] = [];
    const count = 22;

    for (let i = 0; i < count; i++) {
      const isSpark = i % 2 === 0;
      const index = i % 8;
      const imgSrc = isSpark
        ? `/assets/vfx/spark_${index}.png`
        : `/assets/vfx/particle_${index}.png`;

      let leftPercent: number;
      if (i < 8) {
        leftPercent = 12 + Math.random() * 15;
      } else if (i < 16) {
        leftPercent = 73 + Math.random() * 15;
      } else {
        leftPercent = 25 + Math.random() * 50;
      }

      list.push({
        id: i,
        imgSrc,
        leftPercent,
        bottomPercent: 12 + Math.random() * 22,
        sizePx: 16 + Math.random() * 20,
        durationSec: 4.2 + Math.random() * 4.5,
        delaySec: -(Math.random() * 5),
        driftPx: (Math.random() - 0.5) * 50,
        opacity: 0.6 + Math.random() * 0.4,
      });
    }

    return list;
  }, []);

  return (
    <div
      className={`tomb-ambient-vfx-container ${isSpinning ? 'spinning-ambient' : ''} ${
        isFreeSpins ? 'freespin-ambient' : ''
      } ${isWinning ? 'winning-ambient' : ''}`}
    >
      {/* 1. Continuous Falling Golden Coins Rain (Mưa xu vàng rơi liên tục) */}
      <div className="continuous-coin-rain-layer">
        {continuousRainCoins.map((coin) => (
          <div
            key={coin.id}
            className="continuous-falling-coin"
            style={{
              left: `${coin.leftPercent}%`,
              width: `${coin.sizePx}px`,
              height: `${coin.sizePx}px`,
              animationDuration: `${coin.durationSec}s`,
              animationDelay: `${coin.delaySec}s`,
              ['--drift-x' as string]: `${coin.driftPx}px`,
              opacity: coin.opacity,
              filter: coin.blurPx > 0 ? `blur(${coin.blurPx}px)` : undefined,
            }}
          >
            <img
              src={coin.imgSrc}
              alt="Falling Coin"
              className="rain-coin-img"
              style={{
                animationDuration: `${coin.spinDurationSec}s`,
              }}
            />
          </div>
        ))}
      </div>

      {/* 2. Divine Celestial Sunbeam of Ra (Center Pillar of Light) */}
      <div className="celestial-sunbeam-wrapper">
        <img
          src="/assets/vfx/light_beam.png"
          alt="Holy Light Beam of Ra"
          className="celestial-sunbeam-img"
        />
        <div className="sunbeam-golden-glow" />
      </div>

      {/* 3. Left Brazier Torch Magical Fire Energy */}
      <div className="torch-flame-aura left-torch">
        <img
          src="/assets/vfx/aura_7.png"
          alt="Left Fire Aura"
          className="torch-aura-outer spin-slow"
        />
        <img
          src="/assets/vfx/aura_5.png"
          alt="Left Fire Core"
          className="torch-aura-inner pulse-fire"
        />
        <div className="torch-flicker-glow" />
      </div>

      {/* 4. Right Brazier Torch Magical Fire Energy */}
      <div className="torch-flame-aura right-torch">
        <img
          src="/assets/vfx/aura_7.png"
          alt="Right Fire Aura"
          className="torch-aura-outer spin-slow-reverse"
        />
        <img
          src="/assets/vfx/aura_5.png"
          alt="Right Fire Core"
          className="torch-aura-inner pulse-fire"
        />
        <div className="torch-flicker-glow" />
      </div>

      {/* 5. Glowing Treasure Chests Radiance (Behind lower machine base) */}
      <div className="treasure-chest-glow left-chest">
        <div className="chest-light-cone" />
        <img
          src="/assets/vfx/aura_2.png"
          alt="Chest Glow Left"
          className="chest-aura-burst"
        />
        <img
          src="/assets/vfx/spark_1.png"
          alt="Chest Sparkle"
          className="chest-diamond-sparkle"
        />
      </div>

      <div className="treasure-chest-glow right-chest">
        <div className="chest-light-cone" />
        <img
          src="/assets/vfx/aura_2.png"
          alt="Chest Glow Right"
          className="chest-aura-burst"
        />
        <img
          src="/assets/vfx/spark_2.png"
          alt="Chest Sparkle"
          className="chest-diamond-sparkle"
        />
      </div>

      {/* 6. Temple Architecture Twinkles (Top Ancient Egypt Cartouche & Pillars) */}
      <div className="temple-twinkle-layer">
        <img
          src="/assets/vfx/spark_1.png"
          alt="Twinkle 1"
          className="twinkle-sparkle spark-top-left"
        />
        <img
          src="/assets/vfx/spark_2.png"
          alt="Twinkle 2"
          className="twinkle-sparkle spark-top-right"
        />
        <img
          src="/assets/vfx/spark_0.png"
          alt="Twinkle 3"
          className="twinkle-sparkle spark-center-cartouche"
        />
      </div>

      {/* 6. Floating Golden Dust & Fire Embers Stream */}
      <div className="floating-embers-stream">
        {particles.map((p) => (
          <div
            key={p.id}
            className="floating-ember-item"
            style={{
              left: `${p.leftPercent}%`,
              bottom: `${p.bottomPercent}%`,
              width: `${p.sizePx}px`,
              height: `${p.sizePx}px`,
              animationDuration: `${p.durationSec}s`,
              animationDelay: `${p.delaySec}s`,
              ['--drift-x' as string]: `${p.driftPx}px`,
              opacity: p.opacity,
            }}
          >
            <img src={p.imgSrc} alt="Ember" className="ember-img" />
          </div>
        ))}
      </div>

      {/* 7. Extra Win Celebration Aura Burst */}
      {isWinning && lastWin > 0 && (
        <div className="win-ambient-celebration">
          <div className="win-energy-aura-burst">
            <img
              src="/assets/vfx/aura_0.png"
              alt="Win Burst Aura"
              className="win-burst-img pulse-burst"
            />
          </div>
        </div>
      )}
    </div>
  );
};
