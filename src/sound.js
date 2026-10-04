// Web Audio API sound synthesizer for Gaushala Portal (no external audio files needed)
let audioCtx = null;
let sirenOsc = null;
let sirenGain = null;
let isSirenActive = false;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playNotificationSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.35);
  } catch (e) {
    console.warn('Audio error', e);
  }
}

export function playSuccessSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C E G C
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.08;
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      
      gain.gain.setValueAtTime(0.12, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(start);
      osc.stop(start + 0.25);
    });
  } catch (e) {
    console.warn('Audio error', e);
  }
}

export function playAlertWarningSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(300, now + 0.2);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.25);
  } catch (e) {
    console.warn('Audio error', e);
  }
}

export function toggleSirenSound(enable) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;
    
    if (enable && !isSirenActive) {
      isSirenActive = true;
      const now = ctx.currentTime;
      sirenOsc = ctx.createOscillator();
      sirenGain = ctx.createGain();
      
      sirenOsc.type = 'sawtooth';
      sirenGain.gain.setValueAtTime(0.18, now);
      
      // Siren sweep modulation
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(1.5, now); // 1.5 Hz siren cycle
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(250, now); // swing between 450 and 950 Hz
      
      sirenOsc.frequency.setValueAtTime(700, now);
      lfo.connect(sirenOsc.frequency);
      
      sirenOsc.connect(sirenGain);
      sirenGain.connect(ctx.destination);
      
      lfo.start(now);
      sirenOsc.start(now);
      
      // Auto shutoff after 6 seconds to avoid annoyance
      setTimeout(() => {
        stopSiren();
      }, 6000);
      return true;
    } else {
      stopSiren();
      return false;
    }
  } catch (e) {
    console.warn('Siren error', e);
    return false;
  }
}

function stopSiren() {
  if (isSirenActive && sirenOsc && sirenGain && audioCtx) {
    try {
      sirenGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
      setTimeout(() => {
        try {
          sirenOsc.stop();
          sirenOsc.disconnect();
        } catch (_) {}
        sirenOsc = null;
        sirenGain = null;
        isSirenActive = false;
      }, 350);
    } catch (_) {
      isSirenActive = false;
    }
  } else {
    isSirenActive = false;
  }
}
