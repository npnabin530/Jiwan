/**
 * Web Audio API synthesized festive sound effects and Happy Birthday melody.
 * Works seamlessly in all modern browsers without external asset dependencies.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMusicPlaying: boolean = false;
  private musicTimeout: number | null = null;
  private customAudio: HTMLAudioElement | null = null;
  private customAudioUrl: string = '';
  private volume: number = 0.8;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.customAudio) {
      this.customAudio.volume = this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setCustomAudioUrl(url: string) {
    this.customAudioUrl = url;
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isMusicPlaying) {
      this.stopHappyBirthday();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopHappyBirthday();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getIsMusicPlaying(): boolean {
    return this.isMusicPlaying;
  }

  // Curtain Swoosh
  public playCurtainSwoosh() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.6);
      filter.frequency.exponentialRampToValueAtTime(200, now + 1.2);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.5);
      osc.frequency.exponentialRampToValueAtTime(80, now + 1.2);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.3);
    } catch {
      // Ignore audio errors
    }
  }

  // Count Tick Sound (Chime)
  public playCountTick(num: number) {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const baseFreq = 320 + num * 28;

      osc.type = num === 19 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);

      const duration = num === 19 ? 0.8 : 0.15;
      gain.gain.setValueAtTime(num === 19 ? 0.4 : 0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Fallback
    }
  }

  // Balloon Dodge Whoosh / Squeak
  public playBalloonDodge() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.25);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // Fallback
    }
  }

  // Balloon Pop Explosion
  public playBalloonPop() {
    this.playPop();
  }

  // Cute Pop / Heart Sound
  public playPop() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(1050, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);
    } catch {
      // Fallback
    }
  }

  // Celebration Chime / Cheer
  public playCelebrationCheer() {
    this.playMagicChime();
    setTimeout(() => this.playFirework(), 150);
  }

  // Paint Wipe Shimmer
  public playWipeSparkle() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freqs = [784, 880, 988, 1046, 1175, 1318];
      const randomFreq = freqs[Math.floor(Math.random() * freqs.length)];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(randomFreq, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Fallback
    }
  }

  // Firecracker / Firework Blast
  public playFirework() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      // Whistle up
      const whistle = ctx.createOscillator();
      const whistleGain = ctx.createGain();
      whistle.type = 'sine';
      whistle.frequency.setValueAtTime(300, now);
      whistle.frequency.exponentialRampToValueAtTime(1400, now + 0.35);

      whistleGain.gain.setValueAtTime(0.12, now);
      whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      whistle.connect(whistleGain);
      whistleGain.connect(ctx.destination);

      whistle.start(now);
      whistle.stop(now + 0.36);

      // Burst boom at +0.35s
      const burstTime = now + 0.35;
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, burstTime);
      filter.frequency.exponentialRampToValueAtTime(300, burstTime + 0.4);

      const burstGain = ctx.createGain();
      burstGain.gain.setValueAtTime(0.6, burstTime);
      burstGain.gain.exponentialRampToValueAtTime(0.001, burstTime + 0.4);

      noise.connect(filter);
      filter.connect(burstGain);
      burstGain.connect(ctx.destination);

      noise.start(burstTime);
    } catch {
      // Fallback
    }
  }

  public playFireworkCrackle() {
    this.playFirework();
  }

  // Magic Book Open Chime
  public playMagicChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C E G C E G
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteTime = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.18, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.85);
      });
    } catch {
      // Fallback
    }
  }

  // Candle Extinguish Sound
  public playCandleBlow() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      const bufferSize = ctx.sampleRate * 0.6;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, now);
      filter.Q.setValueAtTime(1.5, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
    } catch {
      // Fallback
    }
  }

  // Full Happy Birthday Melody Synthesizer (Music Box / Celesta tone) or Custom Audio
  public playHappyBirthdayMelody() {
    if (this.isMuted) return;
    this.initCtx();
    this.stopHappyBirthday();
    this.isMusicPlaying = true;

    if (this.customAudioUrl) {
      try {
        if (!this.customAudio || this.customAudio.src !== this.customAudioUrl) {
          this.customAudio = new Audio(this.customAudioUrl);
          this.customAudio.loop = true;
        }
        this.customAudio.volume = this.volume;
        this.customAudio.play().catch(() => {
          // If browser blocked autoplay, user can tap play
        });
        return;
      } catch {
        // Fallback to synth melody
      }
    }

    const melody: { note: number; dur: number }[] = [
      { note: 392.00, dur: 0.35 },
      { note: 392.00, dur: 0.25 },
      { note: 440.00, dur: 0.6 },
      { note: 392.00, dur: 0.6 },
      { note: 523.25, dur: 0.6 },
      { note: 493.88, dur: 1.1 },

      { note: 392.00, dur: 0.35 },
      { note: 392.00, dur: 0.25 },
      { note: 440.00, dur: 0.6 },
      { note: 392.00, dur: 0.6 },
      { note: 587.33, dur: 0.6 },
      { note: 523.25, dur: 1.1 },

      { note: 392.00, dur: 0.35 },
      { note: 392.00, dur: 0.25 },
      { note: 783.99, dur: 0.6 },
      { note: 659.25, dur: 0.6 },
      { note: 523.25, dur: 0.6 },
      { note: 493.88, dur: 0.6 },
      { note: 440.00, dur: 1.1 },

      { note: 698.46, dur: 0.35 },
      { note: 698.46, dur: 0.25 },
      { note: 659.25, dur: 0.6 },
      { note: 523.25, dur: 0.6 },
      { note: 587.33, dur: 0.6 },
      { note: 523.25, dur: 1.4 },
    ];

    let totalDuration = 0;
    melody.forEach((item) => {
      totalDuration += item.dur;
    });

    const playSequence = () => {
      if (!this.isMusicPlaying || this.isMuted) return;
      const ctx = this.initCtx();
      let currentTime = ctx.currentTime + 0.05;

      melody.forEach((item) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(item.note, currentTime);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(item.note * 2, currentTime);

        gain.gain.setValueAtTime(0.18, currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, currentTime + item.dur * 0.95);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(currentTime);
        osc2.start(currentTime);
        osc1.stop(currentTime + item.dur);
        osc2.stop(currentTime + item.dur);

        currentTime += item.dur;
      });

      this.musicTimeout = window.setTimeout(() => {
        if (this.isMusicPlaying) {
          playSequence();
        }
      }, (totalDuration + 1.5) * 1000);
    };

    playSequence();
  }

  public stopHappyBirthday() {
    this.isMusicPlaying = false;
    if (this.customAudio) {
      try {
        this.customAudio.pause();
        this.customAudio.currentTime = 0;
      } catch {
        // Ignored
      }
    }
    if (this.musicTimeout) {
      clearTimeout(this.musicTimeout);
      this.musicTimeout = null;
    }
  }
}

export const soundManager = new SoundEngine();
