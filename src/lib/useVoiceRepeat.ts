import { useRef, useState } from 'react';
import { getSpeechRecognitionStatus, startRecognition } from '@/lib/speech';

export type VoiceState = 'idle' | 'listening' | 'correct' | 'wrong';

interface UseVoiceRepeatOpts {
  /** Words that count as a correct answer (lowercase, accent-insensitive). */
  expected: string[];
}

/**
 * Shared hook for "Repetir en voz alta" — opens the microphone, listens for
 * the child's voice, and validates the answer against expected words.
 * Works across the Vocales, Abecedario and Eco sections without page reloads.
 */
export function useVoiceRepeat({ expected }: UseVoiceRepeatOpts) {
  const [state, setState] = useState<VoiceState>('idle');
  const [heard, setHeard] = useState('');
  const recRef = useRef<{ stop: () => void; abort: () => void } | null>(null);

  const supported = getSpeechRecognitionStatus() === 'ok';

  const normalize = (s: string) =>
    s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');

  const isMatch = (transcript: string) => {
    const t = normalize(transcript);
    return expected.some((word) => {
      const w = normalize(word);
      return t === w || t.includes(w) || (w.length > 2 && t.startsWith(w));
    });
  };

  const listen = (handlers?: { onCorrect?: () => void; onWrong?: () => void }) => {
    if (!supported) {
      // Unsupported browser — report wrong so the user sees the message.
      setState('wrong');
      setHeard('');
      window.setTimeout(() => setState('idle'), 1200);
      handlers?.onWrong?.();
      return;
    }
    setState('listening');
    setHeard('');
    const rec = startRecognition({
      onResult: (text) => {
        setHeard(text);
        if (isMatch(text)) {
          setState('correct');
          handlers?.onCorrect?.();
        } else {
          setState('wrong');
          handlers?.onWrong?.();
          window.setTimeout(() => setState('idle'), 1400);
        }
      },
      onError: () => {
        setState('wrong');
        handlers?.onWrong?.();
        window.setTimeout(() => setState('idle'), 1200);
      },
      onEnd: () => {
        // Keep "correct" state sticky; reset wrong/idle after a moment.
        setState((s) => (s === 'listening' ? 'idle' : s));
      },
    });
    recRef.current = rec;
    if (!rec) {
      setState('wrong');
      window.setTimeout(() => setState('idle'), 1200);
      handlers?.onWrong?.();
    }
  };

  const stop = () => {
    recRef.current?.abort();
    recRef.current = null;
    setState('idle');
  };

  const reset = () => {
    recRef.current?.abort();
    recRef.current = null;
    setState('idle');
    setHeard('');
  };

  return { state, heard, supported, listen, stop, reset };
}
