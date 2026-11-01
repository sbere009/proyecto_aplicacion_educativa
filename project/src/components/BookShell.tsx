import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, BookOpen, Volume2, VolumeX, Menu } from 'lucide-react';
import { playClick, playFlip, unlockAudio } from '@/lib/sound';
import { stopSpeak } from '@/lib/tts';

export type SectionId =
  | 'home'
  | 'parents'
  | 'vowels'
  | 'alphabet'
  | 'syllables'
  | 'special'
  | 'complete'
  | 'echo';

export interface SectionMeta {
  id: SectionId;
  title: string;
  short: string;
  emoji: string;
  tagline: string;
}

export const SECTIONS: SectionMeta[] = [
  { id: 'home', title: 'Inicio', short: 'Inicio', emoji: '✨', tagline: 'La portada del libro' },
  { id: 'parents', title: 'Guia para Padres', short: 'Padres', emoji: '👩‍👧', tagline: 'Como acompanar la lectura' },
  { id: 'vowels', title: 'Las Vocales', short: 'Vocales', emoji: '🌟', tagline: 'A, E, I, O, U' },
  { id: 'alphabet', title: 'El Abecedario', short: 'Abecedario', emoji: '🔤', tagline: 'Las 27 letras' },
  { id: 'syllables', title: 'Sílabas', short: 'Sílabas', emoji: '🧩', tagline: 'Juntamos consonantes con vocales' },
  { id: 'special', title: 'Letras Especiales', short: 'Especiales', emoji: '🤫', tagline: 'H muda, C/G suaves, sílabas trabadas' },
  { id: 'complete', title: 'Completa la Palabra', short: 'Completa', emoji: '🧩', tagline: 'Arrastra la sílaba correcta' },
  { id: 'echo', title: 'Eco y Repetición', short: 'Eco', emoji: '🎙️', tagline: 'Con qué sílaba inicia' },
];

interface BookShellProps {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
  muted: boolean;
  onToggleMute: () => void;
  children: React.ReactNode;
}

export function BookShell({ active, onNavigate, muted, onToggleMute, children }: BookShellProps) {
  const [flipping, setFlipping] = useState<'next' | 'prev' | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const activeIndex = SECTIONS.findIndex((s) => s.id === active);
  const activeSection = SECTIONS[activeIndex];

  // Progress bar across the book.
  useEffect(() => {
    setProgress(((activeIndex + 1) / SECTIONS.length) * 100);
  }, [activeIndex]);

  // Close menu on outside click.
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const goTo = (id: SectionId, dir?: 'next' | 'prev') => {
    unlockAudio();
    playClick();
    stopSpeak();
    if (dir) {
      setFlipping(dir);
      window.setTimeout(() => {
        onNavigate(id);
        setFlipping(null);
      }, 240);
    } else {
      onNavigate(id);
    }
    setMenuOpen(false);
  };

  const goPrev = () => {
    if (activeIndex <= 0) return;
    playFlip();
    goTo(SECTIONS[activeIndex - 1].id, 'prev');
  };
  const goNext = () => {
    if (activeIndex >= SECTIONS.length - 1) return;
    playFlip();
    goTo(SECTIONS[activeIndex + 1].id, 'next');
  };

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < SECTIONS.length - 1;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-3 sm:px-6">
          <div className="mt-3 rounded-3xl bg-white/70 backdrop-blur-md shadow-soft ring-1 ring-white/60 px-3 sm:px-5 py-2.5 flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => goTo('home')}
              className="flex items-center gap-2 btn-magic px-2 sm:px-3 py-1.5 hover:bg-cream-100 rounded-2xl"
              aria-label="Ir al inicio"
            >
              <span className="grid place-items-center w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-peach-200 via-warmyellow-200 to-lavender-200 shadow-inner">
                <BookOpen className="w-5 h-5 text-ink-600" />
              </span>
              <span className="hidden sm:flex flex-col leading-tight text-left">
                <span className="font-display text-ink-600 text-base font-semibold">Mi Libro Mágico</span>
                <span className="text-xs text-ink-400">Aprender a leer jugando</span>
              </span>
            </button>

            <div className="flex-1" />

            {/* Mute toggle */}
            <button
              onClick={() => { unlockAudio(); playClick(); onToggleMute(); }}
              className="btn-magic grid place-items-center w-10 h-10 rounded-2xl bg-white/80 hover:bg-cream-100 ring-1 ring-white/60"
              aria-label={muted ? 'Activar sonido' : 'Silenciar'}
              title={muted ? 'Activar sonido' : 'Silenciar'}
            >
              {muted ? <VolumeX className="w-5 h-5 text-ink-400" /> : <Volume2 className="w-5 h-5 text-ink-500" />}
            </button>

            {/* Dropdown menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => { playClick(); setMenuOpen((v) => !v); }}
                className="btn-magic flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-peach-200 to-lavender-200 text-ink-600 ring-1 ring-white/60 hover:brightness-105"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <Menu className="w-5 h-5" />
                <span className="hidden sm:inline font-display text-sm font-semibold">Capítulos</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 max-h-[70vh] overflow-y-auto rounded-3xl bg-white/95 backdrop-blur-md shadow-page ring-1 ring-white/70 p-2 animate-pop-in origin-top-right"
                >
                  {SECTIONS.map((s) => {
                    const isActive = s.id === active;
                    return (
                      <button
                        key={s.id}
                        role="menuitem"
                        onClick={() => goTo(s.id)}
                        className={`w-full text-left rounded-2xl px-3 py-2.5 flex items-center gap-3 transition-colors ${
                          isActive ? 'bg-gradient-to-r from-peach-100 to-lavender-100 ring-1 ring-lavender-200' : 'hover:bg-cream-100'
                        }`}
                      >
                        <span className="grid place-items-center w-10 h-10 rounded-xl bg-cream-100 text-xl shrink-0">
                          {s.emoji}
                        </span>
                        <span className="flex flex-col min-w-0">
                          <span className="font-display text-sm font-semibold text-ink-600 truncate">{s.title}</span>
                          <span className="text-xs text-ink-400 truncate">{s.tagline}</span>
                        </span>
                        {isActive && <span className="ml-auto w-2.5 h-2.5 rounded-full bg-lavender-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Progress bar — like a bookmark ribbon */}
          <div className="px-2 mt-1.5">
            <div className="h-1.5 rounded-full bg-white/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-peach-300 via-warmyellow-300 to-lavender-300 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Book stage */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-3 sm:px-6 py-4 sm:py-6">
        <div className="relative">
          {/* Ambient sparkles */}
          <Sparkles />

          <div
            className={`relative rounded-[2rem] sm:rounded-[2.5rem] bg-white/80 backdrop-blur-sm shadow-page ring-1 ring-white/70 overflow-hidden transition-transform ${
              flipping === 'next' ? 'animate-page-flip' : flipping === 'prev' ? 'animate-page-enter' : ''
            }`}
          >
            {/* Section label ribbon */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-3 py-1.5 shadow-soft">
              <span className="text-lg">{activeSection.emoji}</span>
              <span className="font-display text-sm font-semibold text-ink-600">{activeSection.title}</span>
            </div>

            <div className="book-page min-h-[62vh] sm:min-h-[64vh] p-5 sm:p-8 pt-16 sm:pt-20">
              {children}
            </div>

            {/* Book spine center line for wide screens */}
            <div className="book-spine hidden sm:block" />
          </div>

          {/* Page navigation */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              onClick={goPrev}
              disabled={!canPrev}
              className="btn-magic group flex items-center gap-2 px-5 sm:px-7 py-3 rounded-2xl bg-white/85 backdrop-blur ring-1 ring-white/70 shadow-soft text-ink-600 disabled:opacity-40"
            >
              <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" />
              <span className="font-display text-base font-semibold">Anterior</span>
            </button>

            <div className="text-center px-2">
              <div className="font-display text-ink-500 text-sm font-semibold">
                Página {activeIndex + 1} <span className="text-ink-400">de {SECTIONS.length}</span>
              </div>
              <div className="text-xs text-ink-400">{activeSection.short}</div>
            </div>

            <button
              onClick={goNext}
              disabled={!canNext}
              className="btn-magic group flex items-center gap-2 px-5 sm:px-7 py-3 rounded-2xl bg-gradient-to-r from-peach-200 to-lavender-200 ring-1 ring-white/70 shadow-soft text-ink-600 hover:brightness-105 disabled:opacity-40"
            >
              <span className="font-display text-base font-semibold">Siguiente</span>
              <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-6xl w-full px-6 py-4 text-center">
        <p className="text-xs text-ink-400">
          Hecho con cariño para lectores pequeños · Mi Libro Mágico de Lectura
        </p>
      </footer>
    </div>
  );
}

function Sparkles() {
  const dots = Array.from({ length: 14 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((i) => {
        const left = (i * 37) % 100;
        const top = (i * 53) % 100;
        const delay = (i % 7) * 0.3;
        const size = 6 + (i % 4) * 3;
        return (
          <span
            key={i}
            className="sparkle-dot animate-sparkle"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              animationDelay: `${delay}s`,
              opacity: 0.3,
            }}
          />
        );
      })}
    </div>
  );
}
