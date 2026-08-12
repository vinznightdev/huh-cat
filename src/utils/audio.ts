/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// A solid Web Audio API synthesizer for 100% reliable, zero-dependency retro sound effects.
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    // Create audio context (supports prefix for compatibility)
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

export function resumeAudioContext(): Promise<void> {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    return ctx.resume();
  }
  return Promise.resolve();
}

/**
 * 90s Computer Startup Chime (Inspire by Windows 95/98)
 * A lush, multi-tonal retro synth wash with a shimmering chime at the end.
 */
export function playStartupSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  resumeAudioContext();

  const now = ctx.currentTime;

  // Base lush pad chord (C major add9: C3, G3, C4, E4, D5)
  const freqs = [130.81, 196.00, 261.63, 329.63, 587.33];
  
  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Mix triangle and sine for a warm vintage analog flavor
    osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, now);
    
    // Subtle detune to make it sound chorusy
    osc.detune.setValueAtTime((Math.random() - 0.5) * 15, now);
    
    // Spatial panning for a wider field
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.setValueAtTime((idx / (freqs.length - 1)) * 2 - 1, now);
      osc.connect(gain);
      gain.connect(panner);
      panner.connect(ctx.destination);
    } else {
      osc.connect(gain);
      gain.connect(ctx.destination);
    }

    // Long, beautiful vintage attack and release
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 1.2); // soft attack
    gain.gain.setValueAtTime(0.08, now + 2.5);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5); // long fade

    osc.start(now);
    osc.stop(now + 5.0);
  });

  // A sweet high chime on top (G5, B5, C6) that rings out
  const chimeFreqs = [783.99, 987.77, 1046.50];
  chimeFreqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + 0.8 + idx * 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.8 + idx * 0.15 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc.start(now);
    osc.stop(now + 3.0);
  });
}

/**
 * Satisfying Hover Sound
 * A quick, gentle synthetic bubble/laser chirp.
 */
export function playHoverSound() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'suspended') return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  // Rapid sweep up in pitch (adds a sci-fi/friendly feel)
  osc.frequency.setValueAtTime(650, now);
  osc.frequency.exponentialRampToValueAtTime(1050, now + 0.08);

  gain.gain.setValueAtTime(0.02, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.1);
}

/**
 * Click Sound
 * A crisp vintage mouse or keyboard micro-click.
 */
export function playClickSound() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'suspended') return;

  const now = ctx.currentTime;
  
  // Synthesize a tick/click with high-pass filtered noise/short impulse
  const bufferSize = ctx.sampleRate * 0.02; // 20ms buffer
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(1200, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.03);
}

/**
 * The Iconic HUH?! Sound Effect
 * Synthesized to sound like an upwards voice slide.
 */
export function playHuhSound() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'suspended') return;

  const now = ctx.currentTime;
  
  // We use two oscillators to create a vocal-like double-tone
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  
  // Filter to create a cartoon nasal vocal form
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(800, now);
  filter.Q.setValueAtTime(4, now);

  osc1.type = 'sawtooth';
  osc2.type = 'triangle';

  // Pitch slide upwards rapidly to mimic a shocked vocal expression
  osc1.frequency.setValueAtTime(160, now);
  osc1.frequency.exponentialRampToValueAtTime(380, now + 0.22);
  
  osc2.frequency.setValueAtTime(165, now);
  osc2.frequency.exponentialRampToValueAtTime(385, now + 0.22);

  // Modulate the filter frequency to sound vocal ("u" -> "ah" / "uh" -> "eh")
  filter.frequency.setValueAtTime(600, now);
  filter.frequency.exponentialRampToValueAtTime(1400, now + 0.2);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.03); // rapid swell
  gain.gain.linearRampToValueAtTime(0.12, now + 0.16);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25); // quick drop

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  
  osc1.stop(now + 0.3);
  osc2.stop(now + 0.3);
}

/**
 * Scary Jumpscare / Glitch Sound Effect
 * Screeching synth combined with frequency sweeps and noise burst.
 */
export function playJumpscareSound() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'suspended') return;

  const now = ctx.currentTime;
  
  // 1. Screeching oscillator
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(2500, now);
  osc.frequency.linearRampToValueAtTime(150, now + 0.6); // terrifying pitch drop

  // Detune modulation
  osc.detune.setValueAtTime(0, now);
  osc.detune.linearRampToValueAtTime(1200, now + 0.4);

  oscGain.gain.setValueAtTime(0, now);
  oscGain.gain.linearRampToValueAtTime(0.15, now + 0.05); // immediate impact
  oscGain.gain.linearRampToValueAtTime(0.10, now + 0.3);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.7);

  // 2. High frequency noise explosion (jumpscare burst)
  const bufferSize = ctx.sampleRate * 0.5; // 500ms
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.setValueAtTime(3000, now);
  noiseFilter.frequency.exponentialRampToValueAtTime(400, now + 0.5);
  
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0, now);
  noiseGain.gain.linearRampToValueAtTime(0.18, now + 0.02);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  
  noise.start(now);
  noise.stop(now + 0.6);
}

/**
 * Vintage Windows Error Sound (Ding / Chord)
 * Classic 90s alert chime.
 */
export function playErrorSound() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'suspended') return;

  const now = ctx.currentTime;
  
  // Classic dual sine-wave chime chord (typically a fast alarm sound)
  const freqs = [150, 220, 330];
  
  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);
    
    // Quick low pass to make it more rounded/warm and boxy like 90s speakers
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  });
}

// Chiptune background music loop variables
let chiptuneInterval: any = null;
let chiptuneMasterGain: GainNode | null = null;
let chiptuneIsPlaying = false;
let chiptuneTempo = 130; // BPM
let chiptuneStep = 0;

// Upbeat retro C-Major/A-Minor pentatonic happy scale arpeggio
const MELODY = [261.63, 293.66, 329.63, 392.00, 440.00, 392.00, 329.63, 293.66]; // C4, D4, E4, G4, A4, G4, E4, D4
const BASS = [130.81, 130.81, 146.83, 146.83, 164.81, 164.81, 196.00, 196.00];   // C3, C3, D3, D3, E3, E3, G3, G3

export function startChiptuneLoop(volume = 0.05) {
  const ctx = getAudioContext();
  if (!ctx) return;
  resumeAudioContext();

  if (chiptuneIsPlaying) return;
  chiptuneIsPlaying = true;

  // Create a master gain for the chiptune to control overall volume easily
  chiptuneMasterGain = ctx.createGain();
  chiptuneMasterGain.gain.setValueAtTime(volume, ctx.currentTime);
  chiptuneMasterGain.connect(ctx.destination);

  const stepDuration = 60 / chiptuneTempo / 2; // eighth notes

  chiptuneStep = 0;
  
  const playStep = () => {
    const now = ctx.currentTime;
    
    // Play melody note
    const melOsc = ctx.createOscillator();
    const melGain = ctx.createGain();
    melOsc.type = 'square';
    
    // Get note with some funny pattern variation
    const melodyIndex = (chiptuneStep + (chiptuneStep % 3)) % MELODY.length;
    melOsc.frequency.setValueAtTime(MELODY[melodyIndex], now);
    
    melGain.gain.setValueAtTime(0.12, now);
    melGain.gain.exponentialRampToValueAtTime(0.0001, now + stepDuration * 0.85);
    
    melOsc.connect(melGain);
    if (chiptuneMasterGain) melGain.connect(chiptuneMasterGain);
    melOsc.start(now);
    melOsc.stop(now + stepDuration);

    // Play bass note every 2 steps
    if (chiptuneStep % 2 === 0) {
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'triangle';
      
      const bassIndex = Math.floor(chiptuneStep / 2) % BASS.length;
      bassOsc.frequency.setValueAtTime(BASS[bassIndex], now);
      
      bassGain.gain.setValueAtTime(0.25, now);
      bassGain.gain.exponentialRampToValueAtTime(0.0001, now + stepDuration * 1.8);
      
      bassOsc.connect(bassGain);
      if (chiptuneMasterGain) bassGain.connect(chiptuneMasterGain);
      bassOsc.start(now);
      bassOsc.stop(now + stepDuration * 2);
    }

    // Play retro synthetic hi-hat (noise burst) every 4 steps
    if (chiptuneStep % 4 === 2) {
      const bufferSize = ctx.sampleRate * 0.03; // 30ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(8000, now);
      
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.03, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
      
      noise.connect(filter);
      filter.connect(noiseGain);
      if (chiptuneMasterGain) noiseGain.connect(chiptuneMasterGain);
      noise.start(now);
      noise.stop(now + 0.03);
    }

    chiptuneStep = (chiptuneStep + 1) % 16;
  };

  // Schedule loop using precise audio clock
  let nextNoteTime = ctx.currentTime;
  
  const scheduler = () => {
    while (nextNoteTime < ctx.currentTime + 0.1) {
      playStep();
      nextNoteTime += stepDuration;
    }
    chiptuneInterval = setTimeout(scheduler, 25);
  };

  scheduler();
}

export function stopChiptuneLoop() {
  if (chiptuneInterval) {
    clearTimeout(chiptuneInterval);
    chiptuneInterval = null;
  }
  if (chiptuneMasterGain) {
    chiptuneMasterGain.disconnect();
    chiptuneMasterGain = null;
  }
  chiptuneIsPlaying = false;
}

export function setChiptuneVolume(volume: number) {
  if (chiptuneMasterGain) {
    const ctx = getAudioContext();
    const targetVal = Math.max(0, Math.min(0.2, volume));
    chiptuneMasterGain.gain.linearRampToValueAtTime(targetVal, ctx ? ctx.currentTime + 0.1 : 0);
  }
}

export function isChiptuneLoopPlaying() {
  return chiptuneIsPlaying;
}

