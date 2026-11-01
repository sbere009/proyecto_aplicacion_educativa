import { useState } from 'react';
import { SPECIAL_TOPICS } from '@/data/content';
import { c } from '@/lib/colors';
import { SpeakButton } from '@/components/SpeakButton';
import { playPop, playCorrect } from '@/lib/sound';
import { speak } from '@/lib/tts';
import { burstConfetti } from '@/lib/confetti';

export function SpecialSection() {
  const [active, setActive] = useState(0);
  const topic = SPECIAL_TOPICS[active];
  const cm = c(topic.color);

  const selectTopic = (i: number) => {
    playPop();
    setActive(i);
  };

  return (
    <div className="flex flex-col">
      <div className="text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-600">Letras Especiales</h2>
        <p className="mt-1 text-ink-500">Algunas letras guardan secretos. ¡Vamos a descubrirlos!</p>
      </div>

      {/* Topic tabs */}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {SPECIAL_TOPICS.map((t, i) => {
          const tm = c(t.color);
          const isActive = i === active;
          return (
            <button
              key={t.id}
              onClick={() => selectTopic(i)}
              className={`btn-magic flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all ${
                isActive ? `${tm.chip} text-ink-600 scale-105 shadow-glow ring-2 ring-white` : 'bg-white/70 text-ink-500 ring-1 ring-white/60'
              }`}
            >
              <span className="text-lg">{t.emoji}</span>
              <span className="font-display text-sm font-semibold">{t.title}</span>
            </button>
          );
        })}
      </div>

      {/* Topic panel */}
      <div className={`mt-6 rounded-[2rem] ${cm.bg} ring-1 ring-white/70 shadow-page p-5 sm:p-7 relative overflow-hidden animate-pop-in`} key={active}>
        <div className="absolute -right-3 -top-3 text-7xl opacity-15">{topic.emoji}</div>
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-14 h-14 rounded-2xl bg-white/70 shadow-inner text-3xl">{topic.emoji}</span>
            <div>
              <h3 className="font-display text-2xl font-bold text-ink-600">{topic.title}</h3>
            </div>
          </div>
          <p className="mt-4 rounded-2xl bg-white/70 p-4 text-ink-500 leading-relaxed">
            {topic.rule}
          </p>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {topic.examples.map((ex) => (
              <div key={ex.word} className="rounded-2xl bg-white/80 ring-1 ring-white/70 p-4 text-center shadow-soft card-lift">
                <span className="text-4xl block">{ex.emoji}</span>
                <div className="mt-2 font-display text-2xl font-bold text-ink-600">{ex.word}</div>
                <div className="text-xs text-ink-400 mt-0.5">{ex.note}</div>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <SpeakButton text={ex.word} label={`Escuchar ${ex.word}`} size="sm" rate={0.8} />
                  <button
                    onClick={() => { playCorrect(); burstConfetti(30); speak(ex.word, { rate: 0.8 }); }}
                    className="btn-magic text-xs font-display font-semibold px-3 py-2 rounded-xl bg-white ring-1 ring-white/70 text-ink-600"
                  >
                    🎉 Leer
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-center">
            <button
              onClick={() => { playPop(); speak(topic.rule, { rate: 0.92 }); }}
              className="btn-magic flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/80 ring-1 ring-white/70 shadow-soft text-ink-600"
            >
              <span className="text-lg">🔊</span>
              <span className="font-display font-semibold text-sm">Escuchar la regla</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
