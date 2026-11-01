import { useCallback, useEffect, useState } from 'react';
import { BookShell } from '@/components/BookShell';
import type { SectionId } from '@/components/BookShell';
import { HomeSection } from '@/sections/HomeSection';
import { ParentsSection } from '@/sections/ParentsSection';
import { VowelsSection } from '@/sections/VowelsSection';
import { AlphabetSection } from '@/sections/AlphabetSection';
import { SyllablesSection } from '@/sections/SyllablesSection';
import { SpecialSection } from '@/sections/SpecialSection';
import { CompleteSection } from '@/sections/CompleteSection';
import { EchoSection } from '@/sections/EchoSection';
import { unlockAudio, setMuted as setSoundMuted } from '@/lib/sound';
import { stopSpeak, setMuted as setTtsMuted } from '@/lib/tts';

export default function App() {
  const [active, setActive] = useState<SectionId>('home');
  const [muted, setMuted] = useState(false);

  // Persist mute preference locally.
  useEffect(() => {
    const saved = sessionStorage.getItem('muted');
    if (saved === '1') setMuted(true);
  }, []);
  useEffect(() => {
    sessionStorage.setItem('muted', muted ? '1' : '0');
    setSoundMuted(muted);
    setTtsMuted(muted);
    if (muted) stopSpeak();
  }, [muted]);

  // Unlock audio context on first interaction.
  useEffect(() => {
    const handler = () => unlockAudio();
    window.addEventListener('pointerdown', handler, { once: true });
    return () => window.removeEventListener('pointerdown', handler);
  }, []);

  const handleNavigate = useCallback((id: SectionId) => {
    setActive(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const render = () => {
    switch (active) {
      case 'home': return <HomeSection onNavigate={handleNavigate} />;
      case 'parents': return <ParentsSection />;
      case 'vowels': return <VowelsSection />;
      case 'alphabet': return <AlphabetSection />;
      case 'syllables': return <SyllablesSection />;
      case 'special': return <SpecialSection />;
      case 'complete': return <CompleteSection />;
      case 'echo': return <EchoSection />;
      default: return <HomeSection onNavigate={handleNavigate} />;
    }
  };

  return (
    <BookShell active={active} onNavigate={handleNavigate} muted={muted} onToggleMute={() => setMuted((m) => !m)}>
      {render()}
    </BookShell>
  );
}
