import { useEffect, useRef, useState } from 'react';
import { ECHO_ITEMS } from '@/data/content';
import { c } from '@/lib/colors';
import { playPop, playCorrect, playWrong, playFanfare } from '@/lib/sound';
import { speak, stopSpeak } from '@/lib/tts';
import { getSpeechRecognitionStatus, startRecognition } from '@/lib/speech';
import { burstConfetti } from '@/lib/confetti';
import { Mic, MicOff, RotateCcw, Check, X, Volume2 } from 'lucide-react';

type Status = 'idle' | 'correct' | 'wrong';

export function EchoSection() {
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState<string>('');
  const [solved, setSolved] = useState<boolean[]>(() => ECHO_ITEMS.map(() => false));
  const [micStatus] = useState(getSpeechRecognitionStatus());
  const recRef = useRef<{ stop: () => void; abort: () => void } | null>(null);

  const item = ECHO_ITEMS[index];
  const cm = c(item.color);

  useEffect(() => {
    return () => {
      stopSpeak();
      recRef.current?.abort();
    };
  }, []);

  const reset = (i: number) => {
    setIndex(i);
    setStatus('idle');
    setHeard('');
    stopSpeak();
    recRef.current?.stop();
    setListening(false);
  };

  const handleAnswer = (answer: string): boolean => {
    return answer.trim().toLowerCase().replace(/\s/g, '') === item.startSyllable;
  };

  const choose = (opt: string) => {
    if (status === 'correct') return;
    playPop();
    setHeard(opt);
    if (handleAnswer(opt)) {
      setStatus('correct');
      playCorrect();
      burstConfetti(55);
      setSolved((arr) => {
        const n = [...arr];
        n[index] = true;
        return n;
      });
      speak(`¡${item.startSyllable}! ${item.word} empieza con ${item.startSyllable}`, { rate: 0.85 });
    } else {
      setStatus('wrong');
      playWrong();
      window.setTimeout(() => {
        setStatus('idle');
        setHeard('');
      }, 1000);
    }
  };

  const startMic = () => {
    if (status === 'correct' || listening) return;
    setHeard('');
    setListening(true);
    const rec = startRecognition({
      onResult: (text) => {
        setListening(false);
        setHeard(text);
        const ok = handleAnswer(text) || text.trim().toLowerCase().includes(item.startSyllable.toLowerCase());
        if (ok) {
          setStatus('correct');
          playCorrect();
          burstConfetti(55);
          setSolved((arr) => {
            const n = [...arr];
            n[index] = true;
            return n;
          });
          speak(`¡Muy bien! ${item.word} empieza con ${item.startSyllable}`, { rate: 0.85 });
        } else {
          setStatus('wrong');
          playWrong();
          window.setTimeout(() => setStatus('idle'), 1200);
        }
      },
      onError: () => {
        setListening(false);
        setStatus('wrong');
        playWrong();
        window.setTimeout(() => setStatus('idle'), 1000);
      },
      onEnd: () => setListening(false),
    });
    recRef.current = rec;
    if (!rec) {
      setListening(false);
      setStatus('wrong');
      window.setTimeout(() => setStatus('idle'), 1000);
    }
  };

  const next = () => {
    const ni = (index + 1) % ECHO_ITEMS.length;
    reset(ni);
  };

  const allDone = solved.every(Boolean);

  return (
    <div className="flex flex-col">
      <div className="text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-600">Eco y Repetición</h2>
        <p className="mt-1 text-ink-500">Mira el dibujo. ¿Con qué sílaba empieza la palabra?</p>
      </div>

      {/* Progress */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {ECHO_ITEMS.map((e, i) => (
          <button
            key={e.id}
            onClick={() => reset(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              solved[i] ? 'bg-mint-400' : i === index ? 'bg-lavender-400 w-6' : 'bg-white/70 ring-1 ring-lavender-200'
            }`}
            aria-label={`Palabra ${i + 1}`}
          />
        ))}
      </div>

      {allDone ? (
        <div className="mt-8 rounded-[2rem] bg-gradient-to-br from-mint-100 to-lavender-100 ring-1 ring-white/70 shadow-page p-8 text-center animate-pop-in">
          <div className="text-6xl animate-bob">🏆</div>
          <h3 className="mt-3 font-display text-2xl font-bold text-ink-600">¡Eco perfecto!</h3>
          <p className="mt-1 text-ink-500">Reconociste todas las sílabas iniciales. ¡Gran trabajo, lector!</p>
          <button
            onClick={() => { setSolved(ECHO_ITEMS.map(() => false)); reset(0); }}
            className="btn-magic mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/80 ring-1 ring-white/70 shadow-soft text-ink-600"
          >
            <RotateCcw className="w-5 h-5" />
            Jugar otra vez
          </button>
        </div>
      ) : (
        <div className={`mt-6 rounded-[2rem] ${cm.bg} ring-1 ring-white/70 shadow-page p-6 sm:p-8 relative overflow-hidden animate-pop-in`} key={index}>
          <div className="absolute -right-3 -top-3 text-7xl opacity-15">{item.emoji}</div>

          <div className="relative flex flex-col items-center">
            {/* Big illustration + word */}
            <div className="grid place-items-center w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white/70 shadow-inner">
              <span className="text-6xl sm:text-7xl animate-bob">{item.emoji}</span>
            </div>
            <div className="mt-3 font-display text-3xl sm:text-4xl font-bold text-ink-600">{item.word}</div>
            <button
              onClick={() => { playPop(); speak(item.word, { rate: 0.8 }); }}
              className="btn-magic mt-2 inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-500"
            >
              <Volume2 className="w-4 h-4" /> Escuchar la palabra
            </button>

            <div className="mt-2 text-center text-sm text-ink-400">
              ¿Con qué sílaba <strong className="text-ink-500">empieza</strong>?
            </div>

            {/* Syllable options */}
            <div className="mt-4 grid grid-cols-3 gap-3 w-full">
              {item.options.map((opt) => {
                const isSelected = heard === opt && (status === 'correct' || status === 'wrong');
                return (
                  <button
                    key={opt}
                    onClick={() => choose(opt)}
                    disabled={status === 'correct'}
                    className={`card-lift font-display text-3xl font-bold rounded-2xl py-5 ring-1 shadow-soft transition-all relative ${
                      isSelected && status === 'correct'
                        ? 'bg-mint-200 text-mint-500 ring-mint-300 scale-105'
                        : isSelected && status === 'wrong'
                        ? 'bg-rose-200 text-rose-400 ring-rose-300 animate-jello'
                        : 'bg-white/80 text-ink-600 ring-white/70 hover:bg-white'
                    }`}
                  >
                    {opt}
                    {isSelected && status === 'correct' && (
                      <span className="absolute -right-2 -top-2 grid place-items-center w-7 h-7 rounded-full bg-mint-400 text-white shadow-soft animate-pop-in">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                    {isSelected && status === 'wrong' && (
                      <span className="absolute -right-2 -top-2 grid place-items-center w-7 h-7 rounded-full bg-rose-400 text-white shadow-soft">
                        <X className="w-4 h-4" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Voice section */}
            <div className="mt-6 w-full rounded-2xl bg-white/70 ring-1 ring-white/70 p-4 text-center">
              <div className="font-display text-sm font-semibold text-ink-600 flex items-center justify-center gap-2">
                <Mic className="w-4 h-4 text-lavender-500" />
                ¿O dícelo con tu voz
              </div>
              {micStatus === 'unsupported' ? (
                <p className="mt-2 text-xs text-ink-400 leading-relaxed">
                  Tu navegador no soporta reconocimiento de voz. Usa los botones de sílabas para responder.
                </p>
              ) : (
                <>
                  <button
                    onClick={startMic}
                    disabled={status === 'correct' || listening}
                    className={`btn-magic mt-3 inline-flex items-center gap-2 px-5 py-3 rounded-2xl ring-1 shadow-soft font-display font-semibold transition-all ${
                      listening
                        ? 'bg-rose-200 text-rose-400 ring-rose-300 animate-pulse'
                        : 'bg-gradient-to-r from-peach-200 to-lavender-200 text-ink-600 ring-white/70'
                    }`}
                  >
                    {listening ? (
                      <>
                        <span className="flex gap-1">
                          <span className="w-1.5 h-4 bg-rose-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
                          <span className="w-1.5 h-6 bg-rose-400 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
                          <span className="w-1.5 h-3 bg-rose-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                          <span className="w-1.5 h-5 bg-rose-400 rounded-full animate-pulse" style={{ animationDelay: '0.45s' }} />
                        </span>
                        Escuchando...
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" />
                        Hablar ahora
                      </>
                    )}
                  </button>
                  {heard && (
                    <div className="mt-2 text-xs text-ink-400">
                      Escuché: <span className="font-semibold text-ink-500">«{heard}»</span>
                    </div>
                  )}
                  <p className="mt-2 text-xs text-ink-400">
                    Di la sílaba con la que empieza la palabra, por ejemplo «{item.startSyllable}».
                  </p>
                </>
              )}
            </div>

            {/* Result + next */}
            {status === 'correct' && (
              <div className="mt-4 w-full text-center animate-pop-in">
                <div className="inline-block rounded-2xl bg-mint-100 ring-1 ring-mint-200 px-5 py-2.5 shadow-soft">
                  <span className="font-display text-lg font-bold text-mint-500">
                    ¡Correcto! {item.word} empieza con {item.startSyllable}
                  </span>
                </div>
                <div>
                  <button
                    onClick={next}
                    className="btn-magic mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-peach-200 to-lavender-200 text-ink-600 ring-1 ring-white/70 shadow-soft"
                  >
                    <span className="font-display font-semibold">Siguiente</span>
                    <span className="text-lg">→</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
