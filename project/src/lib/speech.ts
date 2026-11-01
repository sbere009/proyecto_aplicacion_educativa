// Thin wrapper around the Web Speech Recognition API (Spanish).

export interface SpeechRecognitionLike {
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export type RecognitionHandlers = {
  onResult: (transcript: string) => void;
  onError?: (err: string) => void;
  onEnd?: () => void;
};

export function getSpeechRecognitionStatus(): 'unsupported' | 'ok' {
  if (typeof window === 'undefined') return 'unsupported';
  const sr =
    (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
  return sr ? 'ok' : 'unsupported';
}

/**
 * Start a one-shot Spanish recognition session.
 * Returns a handle you can stop(), or null if unsupported.
 */
export function startRecognition(handlers: RecognitionHandlers): SpeechRecognitionLike | null {
  if (typeof window === 'undefined') return null;
  const Ctor =
    (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
  if (!Ctor) return null;
  const rec = new Ctor();
  // @ts-expect-error — set props on vendor object
  rec.lang = 'es-ES';
  // @ts-expect-error
  rec.interimResults = false;
  // @ts-expect-error
  rec.maxAlternatives = 1;
  // @ts-expect-error
  rec.continuous = false;
  // @ts-expect-error
  rec.onresult = (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => {
    const text = e.results[0]?.[0]?.transcript ?? '';
    handlers.onResult(text.trim());
  };
  // @ts-expect-error
  rec.onerror = (e: { error?: string }) => handlers.onError?.(e.error ?? 'error');
  // @ts-expect-error
  rec.onend = () => handlers.onEnd?.();
  try {
    rec.start();
    return rec;
  } catch {
    return null;
  }
}
