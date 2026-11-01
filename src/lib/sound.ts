// Synthesized sound effects using the Web Audio API — no asset files needed.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

let muted = false;

/** Globally mute/unmute all synthesized sounds. */
export function setMuted(m: boolean) {
  muted = m;
}

type ToneOpts = {
  freq: number;
  dur?: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
  glideTo?: number;
};

function tone({ freq, dur = 0.18, type = 'sine', gain = 0.18, delay = 0, glideTo }: ToneOpts) {
  if (muted) return;
  const ac = getCtx();
  if (!ac) return;
  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

/** Cheerful ascending arpeggio for correct answers. */
export function playCorrect() {
  tone({ freq: 523.25, dur: 0.12, type: 'triangle' });
  tone({ freq: 659.25, dur: 0.12, type: 'triangle', delay: 0.1 });
  tone({ freq: 783.99, dur: 0.18, type: 'triangle', delay: 0.2 });
  tone({ freq: 1046.5, dur: 0.3, type: 'triangle', delay: 0.3 });
}

/** Soft "try again" descending tone. */
export function playWrong() {
  tone({ freq: 392, dur: 0.18, type: 'sine' });
  tone({ freq: 311.13, dur: 0.28, type: 'sine', delay: 0.16 });
}

/** Gentle page-flip whoosh. */
export function playFlip() {
  if (muted) return;
  const ac = getCtx();
  if (!ac) return;
  const t0 = ac.currentTime;
  const noise = ac.createBufferSource();
  const buffer = ac.createBuffer(1, ac.sampleRate * 0.35, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  noise.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1200, t0);
  filter.frequency.exponentialRampToValueAtTime(400, t0 + 0.3);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.08, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.35);
  noise.connect(filter).connect(g).connect(ac.destination);
  noise.start(t0);
  noise.stop(t0 + 0.4);
}

/** Sparkle / tap pop. */
export function playPop() {
  tone({ freq: 880, dur: 0.09, type: 'triangle', gain: 0.12 });
  tone({ freq: 1320, dur: 0.12, type: 'sine', gain: 0.08, delay: 0.04 });
}

/** Tiny click for hover/tap feedback. */
export function playClick() {
  tone({ freq: 660, dur: 0.05, type: 'square', gain: 0.05 });
}

/** Celebration fanfare for completing a whole activity. */
export function playFanfare() {
  const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.51];
  notes.forEach((f, i) => tone({ freq: f, dur: 0.22, type: 'triangle', delay: i * 0.14 }));
}

/** Unlock audio on first user gesture (mobile autoplay policies). */
export function unlockAudio() {
  getCtx();
}
