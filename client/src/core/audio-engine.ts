/**
 * Web Audio API Sound Synthesizer for Lost Relics of Ra
 * Ancient Egyptian atmosphere, reel mechanics, anticipation, and win fanfares
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted = false;
  private bgmGain: GainNode | null = null;
  private anticipationOsc: OscillatorNode | null = null;
  private anticipationGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.bgmGain) {
      this.bgmGain.gain.value = this.isMuted ? 0 : 0.2;
    }
    return this.isMuted;
  }

  // Play button click / tap
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  // Reel spin sound (rolling stone sound)
  public playSpinStart() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.2);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.05, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  // Reel stop thud (heavy stone locking in place)
  public playReelStop(reelIndex: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    // Pitch steps up slightly for each reel stopped
    const baseFreq = 120 + reelIndex * 15;
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.12);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.13);
  }

  // Scatter landing gong / bell sound
  public playScatterLand(count: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const freq = 523.25 * (count === 1 ? 1 : count === 2 ? 1.25 : 1.5);
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.35);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.52);
  }

  // Anticipation tension drone on Reel 5
  public startAnticipation() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    this.stopAnticipation();
    const t = this.ctx.currentTime;
    this.anticipationOsc = this.ctx.createOscillator();
    this.anticipationGain = this.ctx.createGain();

    this.anticipationOsc.type = 'sawtooth';
    this.anticipationOsc.frequency.setValueAtTime(220, t);
    this.anticipationOsc.frequency.linearRampToValueAtTime(440, t + 2.5);

    this.anticipationGain.gain.setValueAtTime(0.05, t);
    this.anticipationGain.gain.linearRampToValueAtTime(0.25, t + 2.0);

    this.anticipationOsc.connect(this.anticipationGain);
    this.anticipationGain.connect(this.ctx.destination);

    this.anticipationOsc.start(t);
  }

  public stopAnticipation() {
    if (this.anticipationOsc) {
      try {
        this.anticipationOsc.stop();
        this.anticipationOsc.disconnect();
      } catch (e) {}
      this.anticipationOsc = null;
    }
  }

  // Line win celebration melody
  public playWin() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    // Harmonic arpeggio in Ancient Egyptian minor pentatonic (A, C, D, E, G)
    const notes = [440, 523.25, 587.33, 659.25, 880];
    const t = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const noteTime = t + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.3, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.28);
    });
  }

  // Expanding Symbol beam sound
  public playExpandingBeam() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.6);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.7);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.75);
  }

  // Big Win celebration fanfares and coin chimes
  public playCoinShower() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    // Series of 8 bell/coin metallic chimes
    const t = this.ctx.currentTime;
    for (let i = 0; i < 8; i++) {
      const chimeTime = t + i * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200 + Math.random() * 800, chimeTime);

      gain.gain.setValueAtTime(0.2, chimeTime);
      gain.gain.exponentialRampToValueAtTime(0.005, chimeTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(chimeTime);
      osc.stop(chimeTime + 0.22);
    }
  }

  // Ancient Egyptian entrance gong when entering the tomb
  public playTombEntranceGong() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Deep resonant tom-drum
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(120, t);
    osc1.frequency.exponentialRampToValueAtTime(45, t + 1.2);
    gain1.gain.setValueAtTime(0.6, t);
    gain1.gain.exponentialRampToValueAtTime(0.01, t + 1.4);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(t);
    osc1.stop(t + 1.5);

    // Ancient resonant bell
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(440, t);
    osc2.frequency.exponentialRampToValueAtTime(220, t + 1.8);
    gain2.gain.setValueAtTime(0.35, t);
    gain2.gain.exponentialRampToValueAtTime(0.005, t + 2.0);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t);
    osc2.stop(t + 2.1);
  }
}

export const soundEngine = new SoundEngine();
