import { useEffect, useState } from 'react';
import { COMPLETE_WORDS } from '@/data/content';
import { c } from '@/lib/colors';
import { playPop, playCorrect, playWrong, playFanfare } from '@/lib/sound';
import { speak } from '@/lib/tts';
import { burstConfetti } from '@/lib/confetti';
import { Check, X, RotateCcw, PartyPopper } from 'lucide-react';

type Status = 'idle' | 'wrong' | 'correct';

export function CompleteSection() {
  const [index, setIndex] = useState(0);
  const [filled, setFilled] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [solved, setSolved] = useState<boolean[]>(() => COMPLETE_WORDS.map(() => false));
  const [showWord, setShowWord] = useState(false);

  const item = COMPLETE_WORDS[index];
  const cm = c(item.color);
  const correctSyllable = item.syllables[item.blankIndex];

  const reset = (i: number) => {
    setIndex(i);
    setFilled(null);
    setStatus('idle');
    setShowWord(false);
  };

  useEffect(() => {
    reset(0);
    setSolved(COMPLETE_WORDS.map(() => false));
  }, []);

  const choose = (opt: string) => {
    if (status === 'correct') return;
    playPop();
    setFilled(opt);
    if (opt === correctSyllable) {
      setStatus('correct');
      playCorrect();
      burstConfetti(60);
      speak(item.word, { rate: 0.8 });
      setShowWord(true);
      setSolved((arr) => {
        const next = [...arr];
        next[index] = true;
        return next;
      });
    } else {
      setStatus('wrong');
      playWrong();
      window.setTimeout(() => {
        setStatus('idle');
        setFilled(null);
      }, 900);
    }
  };

  const next = () => {
    const ni = (index + 1) % COMPLETE_WORDS.length;
    reset(ni);
  };

  const allDone = solved.every(Boolean);

  const reorder = (opts: string[]) => {
    const arr = [...opts];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    if (arr[0] === correctSyllable && arr.length > 1) [arr[0], arr[1]] = [arr[1], arr[0]];
    return arr;
  };

  const options = reorder(item.options);

  return (
    <div className="flex flex-col">
      <div className="text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-600">Completa la Palabra</h2>
        <p className="mt-1 text-ink-500">Toca la sílaba que falta para formar la palabra del dibujo.</p>
      </div>

      {/* Progress dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {COMPLETE_WORDS.map((w, i) => (
          <button
            key={w.id}
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
          <div className="text-6xl animate-bob">🎊</div>
          <h3 className="mt-3 font-display text-2xl font-bold text-ink-600">¡Lo lograste!</h3>
          <p className="mt-1 text-ink-500">Completaste todas las palabras. ¡Eres un lector mágico!</p>
          <button
            onClick={() => { setSolved(COMPLETE_WORDS.map(() => false)); reset(0); }}
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
            {/* Illustration */}
            <div className="grid place-items-center w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white/70 shadow-inner">
              <span className="text-6xl sm:text-7xl animate-bob">{item.emoji}</span>
            </div>

            {/* Word with blank */}
            <div className="mt-5 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              {item.syllables.map((syl, i) => {
                const isBlank = i === item.blankIndex;
                if (isBlank) {
                  return (
                    <div
                      key={i}
                      className={`relative grid place-items-center min-w-[5.5rem] sm:min-w-[6.5rem] h-20 sm:h-24 rounded-2xl border-2 border-dashed transition-all ${
                        status === 'correct'
                          ? 'border-mint-400 bg-mint-100'
                          : status === 'wrong'
                          ? 'border-rose-300 bg-rose-100 animate-jello'
                          : 'border-white bg-white/60'
                      }`}
                    >
                      {filled ? (
                        <span className={`font-display text-4xl sm:text-5xl font-bold ${status === 'correct' ? 'text-mint-500' : 'text-rose-400'} animate-pop-in`}>
                          {filled}
                        </span>
                      ) : (
                        <span className="text-3xl text-ink-400/60">?</span>
                      )}
                      {status === 'correct' && (
                        <span className="absolute -right-2 -top-2 grid place-items-center w-7 h-7 rounded-full bg-mint-400 text-white shadow-soft animate-pop-in">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                      {status === 'wrong' && (
                        <span className="absolute -right-2 -top-2 grid place-items-center w-7 h-7 rounded-full bg-rose-400 text-white shadow-soft">
                          <X className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  );
                }
                return (
                  <div
                    key={i}
                    className="grid place-items-center min-w-[5.5rem] sm:min-w-[6.5rem] h-20 sm:h-24 rounded-2xl bg-white/80 ring-1 ring-white/70 shadow-soft"
                  >
                    <span className="font-display text-4xl sm:text-5xl font-bold text-ink-600">{syl}</span>
                  </div>
                );
              })}
            </div>

            {/* Complete word reveal */}
            {showWord && (
              <div className="mt-4 animate-pop-in">
                <div className="rounded-2xl bg-white/80 ring-1 ring-mint-200 px-5 py-2.5 shadow-soft">
                  <span className="font-display text-2xl font-bold text-mint-500">¡{item.word}!</span>
                </div>
              </div>
            )}

            {/* Options */}
            <div className="mt-6 w-full">
              <div className="text-center text-sm text-ink-400 mb-2">Elige la sílaba correcta:</div>
              <div className="grid grid-cols-3 gap-3">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => choose(opt)}
                    disabled={status === 'correct'}
                    className={`card-lift font-display text-3xl font-bold rounded-2xl py-5 ring-1 shadow-soft transition-all ${
                      filled === opt && status === 'correct'
                        ? 'bg-mint-200 text-mint-500 ring-mint-300 scale-105'
                        : filled === opt && status === 'wrong'
                        ? 'bg-rose-200 text-rose-400 ring-rose-300'
                        : 'bg-white/80 text-ink-600 ring-white/70 hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Next */}
            {status === 'correct' && (
              <button
                onClick={next}
                className="btn-magic mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-peach-200 to-lavender-200 text-ink-600 ring-1 ring-white/70 shadow-soft animate-pop-in"
              >
                <span className="font-display font-semibold">Siguiente palabra</span>
                <span className="text-lg">→</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer hint */}
      {!allDone && (
        <div className="mt-4 text-center text-xs text-ink-400">
          Al acertar, la palabra completa se lee en voz alta automáticamente.
        </div>
      )}
    </div>
  );
}
