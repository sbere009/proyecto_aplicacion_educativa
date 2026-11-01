// Text-to-Speech wrapper around the Web Speech API, tuned for Spanish.
// Includes a keep-alive to work around the Chrome bug where speechSynthesis
// stops firing after ~15s or gets stuck in a paused state, which would
// otherwise require a page reload to hear speech again.

let voices: SpeechSynthesisVoice[] = [];
let preferred: SpeechSynthesisVoice | null = null;
let keepAliveTimer: number | null = null;

function isSpanish(v: SpeechSynthesisVoice) {
  return /^es(-|_)?/i.test(v.lang) || /español|spanish/i.test(v.name);
}

function loadVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  voices = window.speechSynthesis.getVoices();
  if (!voices.length) return;
  const es = voices.filter(isSpanish);
  preferred =
    es.find((v) => /américas|americas|latin|mexico|méxico|us/i.test(v.name)) ||
    es.find((v) => /female|mujer|femenino/i.test(v.name)) ||
    es[0] ||
    null;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

// Chrome pauses speechSynthesis after ~15 seconds of speech and silently stops
// firing callbacks. Polling resume() keeps the engine alive so speech keeps
// working across many repetitions without a page reload.
function startKeepAlive() {
  if (keepAliveTimer != null) return;
  keepAliveTimer = window.setInterval(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.resume();
    }
  }, 5000);
}

let muted = false;

/** Globally mute/unmute speech. */
export function setMuted(m: boolean) {
  muted = m;
  if (m && typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
}

export function getTtsStatus() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return 'unsupported';
  return 'ok';
}

/** Speak Spanish text. Cancels any in-progress speech. Safe to call repeatedly. */
export function speak(text: string, opts?: { rate?: number; pitch?: number; onEnd?: () => void }) {
  if (muted) {
    opts?.onEnd?.();
    return;
  }
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    opts?.onEnd?.();
    return;
  }
  // Clear any stuck queue and make sure the engine isn't paused.
  window.speechSynthesis.cancel();
  if (window.speechSynthesis.paused) window.speechSynthesis.resume();

  if (!preferred) loadVoices();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'es-ES';
  if (preferred) u.voice = preferred;
  u.rate = opts?.rate ?? 0.92;
  u.pitch = opts?.pitch ?? 1.08;

  let ended = false;
  const finish = () => {
    if (ended) return;
    ended = true;
    opts?.onEnd?.();
  };
  u.onend = finish;
  u.onerror = finish;

  // Fallback: some browsers stop firing onend after heavy use. Guarantee the
  // caller's callback runs so UI (e.g. spinner) never gets stuck "speaking".
  const fallbackMs = Math.max(1200, text.length * 95);
  const fallback = window.setTimeout(finish, fallbackMs);

  startKeepAlive();
  // Slight delay lets Chrome pick up the chosen voice after cancel().
  window.setTimeout(() => {
    try {
      window.speechSynthesis.speak(u);
    } catch {
      window.clearTimeout(fallback);
      finish();
    }
  }, 60);
}

export function stopSpeak() {
  if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
}
