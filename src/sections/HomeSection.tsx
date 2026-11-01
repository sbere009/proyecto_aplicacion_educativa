import { BookOpen, Sparkles, Heart, Mic } from 'lucide-react';
import type { SectionId } from '@/components/BookShell';
import { SECTIONS } from '@/components/BookShell';
import { c } from '@/lib/colors';
import { playClick, playPop } from '@/lib/sound';

interface HomeProps {
  onNavigate: (id: SectionId) => void;
}

export function HomeSection({ onNavigate }: HomeProps) {
  const featured = SECTIONS.filter((s) => s.id !== 'home');

  return (
    <div className="relative flex flex-col items-center text-center">
      {/* Floating mascot letters */}
      <div className="pointer-events-none absolute -top-4 inset-x-0 flex justify-center gap-2">
        {['A', 'E', 'I', 'O', 'U'].map((v, i) => (
          <span
            key={v}
            className="font-display text-3xl sm:text-4xl font-bold animate-bob"
            style={{ animationDelay: `${i * 0.18}s` }}
          >
            <span className={`inline-grid place-items-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-soft ${
              ['bg-rose-100 text-rose-400', 'bg-mint-100 text-mint-500', 'bg-warmyellow-100 text-amber-500', 'bg-peach-100 text-peach-500', 'bg-lavender-100 text-lavender-500'][i]
            }`}>
              {v}
            </span>
          </span>
        ))}
      </div>

      <div className="mt-16 sm:mt-20">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 ring-1 ring-white/60 shadow-soft">
          <Sparkles className="w-4 h-4 text-warmyellow-400" />
          <span className="font-display text-xs sm:text-sm text-ink-500 font-semibold">Para niños y niñas de 3 a 5 años</span>
        </div>

        <h1 className="mt-4 font-display text-4xl sm:text-6xl font-bold text-ink-600 leading-tight">
          Mi Libro <span className="bg-gradient-to-r from-peach-400 to-lavender-400 bg-clip-text text-transparent">Mágico</span>
          <br />de Lectura
        </h1>
        <p className="mt-4 max-w-xl text-base sm:text-lg text-ink-500 leading-relaxed">
          Un cuento interactivo donde cada letra cobra vida. Toca, escucha y juega
          para descubrir el mundo mágico de las palabras.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => { playPop(); onNavigate('vowels'); }}
            className="btn-magic flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-peach-300 to-lavender-300 text-white shadow-glow text-lg"
          >
            <BookOpen className="w-6 h-6" />
            Empezar a leer
          </button>
          <button
            onClick={() => { playClick(); onNavigate('parents'); }}
            className="btn-magic flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/80 ring-1 ring-white/70 text-ink-600 shadow-soft"
          >
            <Heart className="w-5 h-5 text-rose-400" />
            Guía para padres
          </button>
        </div>
      </div>

      {/* Chapter cards */}
      <div className="mt-12 w-full">
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-ink-600 mb-4 flex items-center gap-2 justify-center">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-lavender-200" />
          Explora los capítulos
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-peach-200" />
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {featured.map((s, i) => {
            const colors = [c('peach'), c('mint'), c('warmyellow'), c('lavender'), c('rose')];
            const cm = colors[i % colors.length];
            return (
              <button
                key={s.id}
                onClick={() => { playPop(); onNavigate(s.id); }}
                className={`card-lift group relative text-left rounded-3xl p-4 sm:p-5 ${cm.soft} ring-1 ring-white/60 shadow-soft overflow-hidden`}
              >
                <div className="absolute -right-3 -top-3 text-6xl opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all">
                  {s.emoji}
                </div>
                <span className={`inline-grid place-items-center w-12 h-12 rounded-2xl ${cm.chip} text-2xl shadow-inner`}>
                  {s.emoji}
                </span>
                <h3 className="mt-3 font-display text-base sm:text-lg font-semibold text-ink-600">{s.title}</h3>
                <p className="text-xs text-ink-400 mt-0.5 leading-snug">{s.tagline}</p>
                <span className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold ${cm.chipText}`}>
                  Abrir
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tip strip */}
      <div className="mt-8 w-full rounded-3xl bg-gradient-to-r from-mint-100 via-cream-100 to-lavender-100 ring-1 ring-white/60 p-4 sm:p-5 flex items-center gap-4 shadow-soft">
        <span className="grid place-items-center w-12 h-12 rounded-2xl bg-white/70 shrink-0">
          <Mic className="w-6 h-6 text-lavender-500" />
        </span>
        <p className="text-sm text-ink-500 text-left leading-relaxed">
          <strong className="font-display text-ink-600">Consejo:</strong> Usa auriculares con micrófono
          para aprovechar al máximo los juegos de voz. Acompaña a tu pequeño en cada página.
        </p>
      </div>
    </div>
  );
}
