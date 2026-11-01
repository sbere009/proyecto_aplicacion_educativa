import { useEffect, useState } from 'react';
import { Volume2, Loader2 } from 'lucide-react';
import { speak } from '@/lib/tts';
import { playPop } from '@/lib/sound';

interface SpeakButtonProps {
  text: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  rate?: number;
}

export function SpeakButton({ text, label, className = '', size = 'md', rate }: SpeakButtonProps) {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (!speaking) return;
    const t = window.setTimeout(() => setSpeaking(false), Math.max(900, text.length * 90));
    return () => window.clearTimeout(t);
  }, [speaking, text]);

  const sizes = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
  };
  const icon = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const handle = () => {
    playPop();
    setSpeaking(true);
    speak(text, {
      rate,
      onEnd: () => setSpeaking(false),
    });
  };

  return (
    <button
      onClick={handle}
      aria-label={label ?? `Escuchar ${text}`}
      className={`btn-magic grid place-items-center rounded-2xl bg-white/80 ring-1 ring-white/70 shadow-soft text-lavender-500 hover:bg-cream-100 ${sizes[size]} ${className}`}
    >
      {speaking ? <Loader2 className={`${icon[size]} animate-spin`} /> : <Volume2 className={icon[size]} />}
    </button>
  );
}
