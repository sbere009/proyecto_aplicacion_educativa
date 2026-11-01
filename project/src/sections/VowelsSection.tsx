import { useState } from 'react';
import { Mic, Check, X } from 'lucide-react';
import { VOWELS } from '@/data/content';
import type { VowelItem } from '@/data/content';
import { c } from '@/lib/colors';
import { SpeakButton } from '@/components/SpeakButton';
import { playPop, playCorrect, playWrong } from '@/lib/sound';
import { speak } from '@/lib/tts';
import { burstConfetti } from '@/lib/confetti';
import { useVoiceRepeat } from '@/lib/useVoiceRepeat';

export function VowelsSection() {
  const [active, setActive] = useState(0);
  const vowel = VOWELS[active];
  const cm = c(vowel.color);

  const voice = useVoiceRepeat({ expected: [vowel.letter, vowel.word, vowel.short.split(' de ')[1] ?? vowel.word] });

  const select = (i: number) => {
    playPop();
    voice.reset();
    setActive(i);
    speak(VOWELS[i].word, { rate: 0.85 });
  };

  const startRepeat = () => {
    playPop();
    voice.listen({
      onCorrect: () => {
        playCorrect();
        burstConfetti(55);
        speak(`¡Muy bien! ${vowel.letter} de ${vowel.word}`, { rate: 0.85 });
      },
      onWrong: () => playWrong(),
    });
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-600 text-center">Las 5 Vocales</h2>
      <p className="mt-1 text-ink-500 text-center">Toca cada vocal para escucharla y ver su dibujo.</p>

      {/* Vowel selector */}
      <div className="mt-5 flex flex-wrap justify-center gap-2 sm:gap-3">
        {VOWELS.map((v, i) => {
          const vm = c(v.color);
          const isActive = i === active;
          return (
            <button
              key={v.letter}
              onClick={() => select(i)}
              className={`btn-magic font-display text-2xl sm:text-3xl font-bold w-14 h-14 sm:w-16 sm:h-16 rounded-2xl transition-all ${
                isActive ? `${vm.chip} text-ink-600 scale-110 shadow-glow ring-2 ring-white` : 'bg-white/70 text-ink-500 ring-1 ring-white/60'
              }`}
            >
              {v.letter}
            </button>
          );
        })}
      </div>

      {/* Big vowel card */}
      <div className={`mt-8 w-full max-w-md rounded-[2rem] ${cm.bg} ring-1 ring-white/70 shadow-page p-6 sm:p-8 text-center relative overflow-hidden animate-pop-in`} key={active}>
        <div className="absolute -right-4 -top-4 text-8xl opacity-20 animate-float-y">{vowel.emoji}</div>
        <div className="relative">
          <div className={`inline-grid place-items-center w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white/70 shadow-inner`}>
            <span className="text-6xl sm:text-7xl animate-bob">{vowel.emoji}</span>
          </div>
          <div className="mt-4 font-display text-7xl sm:text-8xl font-bold text-ink-600 drop-shadow-sm">
            {vowel.letter}
          </div>
          <div className="mt-1 font-display text-2xl font-semibold text-ink-500">
            {vowel.letter.toLowerCase()} de {vowel.word}
          </div>

          <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
            <SpeakButton text={vowel.letter} label={`Escuchar la letra ${vowel.letter}`} size="lg" rate={0.7} />
            <button
              onClick={startRepeat}
              disabled={voice.state === 'listening'}
              className={`btn-magic flex items-center gap-2 px-5 py-3 rounded-2xl ring-1 shadow-soft text-ink-600 transition-all ${
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
              <span className="font-display font-semibold">
                {voice.state === 'listening' ? 'Escuchando...' : voice.state === 'correct' ? '¡Muy bien!' : voice.state === 'wrong' ? 'Intenta otra vez' : 'Repetir'}
              </span>
            </button>
            <button
              onClick={() => { playCorrect(); burstConfetti(50); speak(`${vowel.letter}. ${vowel.short}`, { rate: 0.85 }); }}
              className="btn-magic flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-peach-200 to-lavender-200 ring-1 ring-white/70 shadow-soft text-ink-600"
            >
              <span className="text-xl">🎉</span>
              <span className="font-display font-semibold">Celebrar</span>
            </button>
          </div>

          {/* Feedback strip */}
          <RepeatFeedback voice={voice} word={vowel.word} />
        </div>
      </div>

      {/* Mini vowel rhyme */}
      <div className="mt-6 max-w-md text-center rounded-3xl bg-white/70 ring-1 ring-white/60 p-4 shadow-soft">
        <p className="font-display text-ink-500 text-sm leading-relaxed">
          «A, E, I, O, U — cinco vocales para empezar a leer contigo.»
        </p>
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
  if (state === 'correct') return <Check className="w-5 h-5" />;
  if (state === 'wrong') return <X className="w-5 h-5" />;
  return <Mic className="w-5 h-5" />;
}

function RepeatFeedback({ voice, word }: { voice: ReturnType<typeof useVoiceRepeat>; word: string }) {
  if (voice.state === 'idle' || voice.state === 'listening') {
    if (!voice.supported) {
      return (
        <div className="mt-4 text-xs text-ink-400 leading-relaxed">
          Tu navegador no soporta reconocimiento de voz. Toca «Escuchar» para oír la vocal.
        </div>
      );
    }
    return (
      <div className="mt-4 text-xs text-ink-400 leading-relaxed">
        Toca «Repetir» y di en voz alta: <strong className="text-ink-500">{word}</strong>
      </div>
    );
  }
  if (voice.state === 'correct') {
    return (
      <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-mint-100 ring-1 ring-mint-200 px-4 py-2 shadow-soft animate-pop-in">
        <Check className="w-4 h-4 text-mint-500" />
        <span className="font-display text-sm font-semibold text-mint-500">
          ¡Correcto! Dijiste «{voice.heard || word}»
        </span>
      </div>
    );
  }
  return (
    <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-rose-100 ring-1 ring-rose-200 px-4 py-2 shadow-soft">
      <X className="w-4 h-4 text-rose-400" />
      <span className="font-display text-sm text-rose-400">
        No te escuché bien. ¡Inténtalo de nuevo!
      </span>
    </div>
  );
}
