import type { Color } from '@/data/content';

type ClassMap = Record<Color, {
  bg: string;       // page/panel background
  soft: string;     // soft tinted background
  ring: string;     // ring/border accent
  text: string;     // text accent
  chip: string;     // chip/pill background
  chipText: string;
  grad: string;     // gradient background
  dot: string;      // solid color dot
}>;

export const colorMap: ClassMap = {
  peach: {
    bg: 'bg-peach-100',
    soft: 'bg-peach-50',
    ring: 'ring-peach-300',
    text: 'text-peach-500',
    chip: 'bg-peach-200',
    chipText: 'text-peach-500',
    grad: 'from-peach-200 to-rose-200',
    dot: 'bg-peach-400',
  },
  warmyellow: {
    bg: 'bg-warmyellow-100',
    soft: 'bg-warmyellow-50',
    ring: 'ring-warmyellow-300',
    text: 'text-warmyellow-400',
    chip: 'bg-warmyellow-200',
    chipText: 'text-amber-600',
    grad: 'from-warmyellow-200 to-peach-200',
    dot: 'bg-warmyellow-400',
  },
  mint: {
    bg: 'bg-mint-100',
    soft: 'bg-mint-50',
    ring: 'ring-mint-300',
    text: 'text-mint-500',
    chip: 'bg-mint-200',
    chipText: 'text-mint-500',
    grad: 'from-mint-200 to-lavender-200',
    dot: 'bg-mint-400',
  },
  lavender: {
    bg: 'bg-lavender-100',
    soft: 'bg-lavender-50',
    ring: 'ring-lavender-300',
    text: 'text-lavender-500',
    chip: 'bg-lavender-200',
    chipText: 'text-lavender-500',
    grad: 'from-lavender-200 to-rose-200',
    dot: 'bg-lavender-400',
  },
  rose: {
    bg: 'bg-rose-100',
    soft: 'bg-rose-50',
    ring: 'ring-rose-300',
    text: 'text-rose-400',
    chip: 'bg-rose-200',
    chipText: 'text-rose-400',
    grad: 'from-rose-200 to-peach-200',
    dot: 'bg-rose-400',
  },
};

export function c(color: Color) {
  return colorMap[color];
}
