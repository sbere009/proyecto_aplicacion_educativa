import { useState } from 'react';
import { Mic, Check, X } from 'lucide-react';
import { ALPHABET } from '@/data/content';
import { c } from '@/lib/colors';
import { SpeakButton } from '@/components/SpeakButton';
import { playPop, playCorrect, playWrong } from '@/lib/sound';
import { speak } from '@/lib/tts';
import { burstConfetti } from '@/lib/confetti';
import { useVoiceRepeat } from '@/lib/useVoiceRepeat';

const PAGE_SIZE = 9;

export function AlphabetSection() {
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(0);
  const pageCount = Math.ceil(ALPHABET.length / PAGE_SIZE);
  const start = page * PAGE_SIZE;
  const pageLetters = ALPHABET.slice(start, start + PAGE_SIZE);
  const current = ALPHABET[selected];
  const cm = c(current.color);

  const voice = useVoiceRepeat({ expected: [current.letter, current.word] });

  const selectLetter = (globalIndex: number) => {
    playPop();
    voice.reset();
    setSelected(globalIndex);
    speak(ALPHABET[globalIndex].word, { rate: 0.85 });
  };

  const startRepeat = () => {
    playPop();
    voice.listen({
      onCorrect: () => {
        playCorrect();
        burstConfetti(45);
        speak(`¡Muy bien! ${current.letter} de ${current.word}`, { rate: 0.85 });
      },
      onWrong: () => playWrong(),
    });
  };

  return (
    <div className="flex flex-col">
      <div className="text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-600">El Abecedario</h2>
        <p className="mt-1 text-ink-500">Toca una letra para ver su dibujo y escuchar su nombre.</p>
      </div>

      {/* Detail card */}
      <div className={`mt-5 rounded-[2rem] ${cm.bg} ring-1 ring-white/70 shadow-page p-5 sm:p-6 flex items-center gap-5 sm:gap-8 overflow-hidden relative animate-pop-in`} key={selected}>
        <div className="absolute -right-3 -bottom-3 text-9xl opacity-15">{current.emoji}</div>
        <div className="shrink-0 relative">
          <div className="grid place-items-center w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white/70 shadow-inner">
            <span className="text-5xl sm:text-7xl animate-bob">{current.emoji}</span>
          </div>
        </div>
        <div className="relative min-w-0 flex-1">
          <div className="font-display text-7xl sm:text-8xl font-bold text-ink-600 leading-none">{current.letter}</div>
          <div className="mt-1 font-display text-xl sm:text-2xl font-semibold text-ink-500">
            {current.letter.toLowerCase()} de {current.word}
          </div>
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <SpeakButton text={current.letter} label={`Escuchar la letra ${current.letter}`} size="md" rate={0.7} />
            <SpeakButton text={current.word} label={`Escuchar la palabra ${current.word}`} size="md" rate={0.8} />
            <button
              onClick={startRepeat}
              disabled={voice.state === 'listening'}
              className={`btn-magic flex items-center gap-2 px-4 py-2.5 rounded-2xl ring-1 shadow-soft text-ink-600 transition-all ${
                voice.state === 'listening'
                  ? 'bg-rose-200 ring-rose-300 text-rose-400 animate-pulse'
                  : voice.state === 'correct'
                  ? 'bg-mint-200 ring-mint-300 text-mint-500'
                  : voice.state === 'wrong'
                  ? 'bg-rose-100 ring-rose-200 text-rose-400 animate-jello'
                  : 'bg-white/80 ring-white/70'
              }`}
            >
              <RepeatIcon state={voice.state} />
              <span className="font-display font-semibold text-sm">
                {voice.state === 'listening' ? 'Escuchando...' : voice.state === 'correct' ? '¡Muy bien!' : voice.state === 'wrong' ? 'Otra vez' : 'Repetir'}
              </span>
            </button>
            <button
              onClick={() => { playCorrect(); burstConfetti(40); speak(`${current.letter} de ${current.word}`, { rate: 0.85 }); }}
              className="btn-magic flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-peach-200 to-lavender-200 ring-1 ring-white/70 shadow-soft text-ink-600"
            >
              <span>🎉</span>
              <span className="font-display font-semibold text-sm">Celebrar</span>
            </button>
          </div>

          {/* Feedback */}
          <div className="mt-3">
            <RepeatFeedback voice={voice} word={current.word} />
          </div>
        </div>
      </div>

      {/* Letter grid */}
      <div className="mt-5 grid grid-cols-3 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {pageLetters.map((l) => {
          const globalIndex = start + pageLetters.indexOf(l);
          const lm = c(l.color);
          const isActive = globalIndex === selected;
          return (
            <button
              key={l.letter + globalIndex}
              onClick={() => selectLetter(globalIndex)}
              className={`card-lift relative rounded-2xl p-3 text-center ring-1 transition-all ${
                isActive ? `${lm.chip} ring-white shadow-glow scale-[1.03]` : 'bg-white/70 ring-white/60 shadow-soft'
              }`}
            >
              <span className="text-2xl sm:text-3xl block">{l.emoji}</span>
              <span className="font-display text-2xl font-bold text-ink-600">{l.letter}</span>
              <span className="block text-xs text-ink-400 truncate">{l.word}</span>
            </button>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          onClick={() => { playPop(); setPage((p) => Math.max(0, p - 1)); }}
          disabled={page === 0}
          className="btn-magic px-4 py-2 rounded-2xl bg-white/80 ring-1 ring-white/70 shadow-soft text-ink-600 disabled:opacity-40"
        >
          ← Atrás
        </button>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => { playPop(); setPage(i); }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === page ? 'bg-lavender-400 w-6' : 'bg-white/70 ring-1 ring-lavender-200'}`}
              aria-label={`Página ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => { playPop(); setPage((p) => Math.min(pageCount - 1, p + 1)); }}
          disabled={page === pageCount - 1}
          className="btn-magic px-4 py-2 rounded-2xl bg-white/80 ring-1 ring-white/70 shadow-soft text-ink-600 disabled:opacity-40"
        >
          Sigue →
        </button>
      </div>
    </div>
  );
}

function RepeatIcon({ state }: { state: string }) {
  if (state === 'listening') return <span className="flex gap-1 items-end">
    <span className="w-1 h-3 bg-rose-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
    <span className="w-1 h-5 bg-rose-400 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
    <span className="w-1 h-4 bg-rose-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
  </span>;
  if (state === 'correct') return <Check className="w-4 h-4" />;
  if (state === 'wrong') return <X className="w-4 h-4" />;
  return <Mic className="w-4 h-4" />;
}

function RepeatFeedback({ voice, word }: { voice: ReturnType<typeof useVoiceRepeat>; word: string }) {
  if (voice.state === 'idle' || voice.state === 'listening') {
    if (!voice.supported) {
      return (
        <div className="text-xs text-ink-400 leading-relaxed">
          Tu navegador no soporta reconocimiento de voz. Toca «Escuchar» para oír la letra.
        </div>
      );
    }
    return (
      <div className="text-xs text-ink-400 leading-relaxed">
        Toca «Repetir» y di en voz alta: <strong className="text-ink-500">{word}</strong>
      </div>
    );
  }
  if (voice.state === 'correct') {
    return (
      <div className="inline-flex items-center gap-2 rounded-2xl bg-mint-100 ring-1 ring-mint-200 px-4 py-2 shadow-soft animate-pop-in">
        <Check className="w-4 h-4 text-mint-500" />
        <span className="font-display text-sm font-semibold text-mint-500">
          ¡Correcto! Dijiste «{voice.heard || word}»
        </span>
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-2 rounded-2xl bg-rose-100 ring-1 ring-rose-200 px-4 py-2 shadow-soft">
      <X className="w-4 h-4 text-rose-400" />
      <span className="font-display text-sm text-rose-400">
        No te escuché bien. ¡Inténtalo de nuevo!
      </span>
    </div>
  );
}
