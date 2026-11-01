import { useState } from 'react';
import { SYLLABLE_GROUPS } from '@/data/content';
import { c } from '@/lib/colors';
import { SpeakButton } from '@/components/SpeakButton';
import { playPop, playCorrect } from '@/lib/sound';
import { speak } from '@/lib/tts';
import { burstConfetti } from '@/lib/confetti';

export function SyllablesSection() {
  const [active, setActive] = useState(0);
  const group = SYLLABLE_GROUPS[active];
  const cm = c(group.color);

  const selectGroup = (i: number) => {
    playPop();
    setActive(i);
  };

  const saySyllable = (syl: string) => {
    playPop();
    speak(syl, { rate: 0.7 });
  };

  const combine = () => {
    playCorrect();
    burstConfetti(45);
    speak(group.syllables.join(' ... '), { rate: 0.7, onEnd: () => speak(group.word, { rate: 0.85 }) });
  };

  return (
    <div className="flex flex-col">
      <div className="text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-600">Sílabas Mágicas</h2>
        <p className="mt-1 text-ink-500">Cada consonante se junta con las cinco vocales para formar sílabas.</p>
      </div>

      {/* Consonant tabs */}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {SYLLABLE_GROUPS.map((g, i) => {
          const gm = c(g.color);
          const isActive = i === active;
          return (
            <button
              key={g.consonant}
              onClick={() => selectGroup(i)}
              className={`btn-magic font-display text-xl font-bold w-12 h-12 sm:w-14 sm:h-14 rounded-2xl transition-all ${
                isActive ? `${gm.chip} text-ink-600 scale-110 shadow-glow ring-2 ring-white` : 'bg-white/70 text-ink-500 ring-1 ring-white/60'
              }`}
            >
              {g.consonant}
            </button>
          );
        })}
      </div>

      {/* Main panel */}
      <div className={`mt-6 rounded-[2rem] ${cm.bg} ring-1 ring-white/70 shadow-page p-5 sm:p-7 relative overflow-hidden animate-pop-in`} key={active}>
        <div className="absolute -right-4 -top-4 text-8xl opacity-15 animate-float-y">{group.emoji}</div>
        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          {/* Mascot */}
          <div className="shrink-0 text-center">
            <div className="grid place-items-center w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/70 shadow-inner">
              <span className="text-5xl sm:text-6xl animate-bob">{group.emoji}</span>
            </div>
            <div className="mt-2 font-display text-sm text-ink-500">ej: <strong className="text-ink-600">{group.word}</strong></div>
          </div>

          {/* Syllable family */}
          <div className="flex-1 w-full">
            <div className="font-display text-xl font-semibold text-ink-500 mb-3 text-center sm:text-left">
              La familia de la <span className="text-ink-600">{group.consonant}</span>
            </div>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {group.syllables.map((syl) => (
                <button
                  key={syl}
                  onClick={() => saySyllable(syl)}
                  className="card-lift font-display text-2xl sm:text-3xl font-bold text-ink-600 rounded-2xl bg-white/80 ring-1 ring-white/70 shadow-soft py-4 hover:bg-white"
                >
                  {syl}
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <SpeakButton text={group.word} label={`Escuchar ${group.word}`} size="md" rate={0.8} />
              <button
                onClick={combine}
                className="btn-magic flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/80 ring-1 ring-white/70 shadow-soft text-ink-600"
              >
                <span className="text-lg">🎶</span>
                <span className="font-display font-semibold text-sm">Leer todas</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-ink-400">
        Toca cada sílaba para escucharla. Luego intenta repetirla en voz alta.
      </div>
    </div>
  );
}
