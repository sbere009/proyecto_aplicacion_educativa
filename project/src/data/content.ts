export type Color = 'peach' | 'warmyellow' | 'mint' | 'lavender' | 'rose';

export interface LetterItem {
  letter: string;
  emoji: string;
  word: string;
  color: Color;
}

export interface VowelItem extends LetterItem {
  short: string; // phonetic example phrase
}

export const VOWELS: VowelItem[] = [
  { letter: 'A', emoji: '🍓', word: 'Arandano', short: 'A de Arandano', color: 'rose' },
  { letter: 'E', emoji: '🐘', word: 'Elefante', short: 'E de Elefante', color: 'mint' },
  { letter: 'I', emoji: '🏝️', word: 'Isla', short: 'I de Isla', color: 'warmyellow' },
  { letter: 'O', emoji: '🐻', word: 'Oso', short: 'O de Oso', color: 'peach' },
  { letter: 'U', emoji: '🍇', word: 'Uva', short: 'U de Uva', color: 'lavender' },
];

export const ALPHABET: LetterItem[] = [
  { letter: 'A', emoji: '🍓', word: 'Arandano', color: 'rose' },
  { letter: 'B', emoji: '🦋', word: 'Ballena', color: 'lavender' },
  { letter: 'C', emoji: '🐶', word: 'Casa', color: 'peach' },
  { letter: 'D', emoji: '🐬', word: 'Delfin', color: 'mint' },
  { letter: 'E', emoji: '🐘', word: 'Elefante', color: 'warmyellow' },
  { letter: 'F', emoji: '🌻', word: 'Flor', color: 'rose' },
  { letter: 'G', emoji: '🐱', word: 'Gato', color: 'warmyellow' },
  { letter: 'H', emoji: '🧸', word: 'Hueso', color: 'peach' },
  { letter: 'I', emoji: '🏝️', word: 'Isla', color: 'lavender' },
  { letter: 'J', emoji: '🧃', word: 'Jugo', color: 'mint' },
  { letter: 'K', emoji: '🥝', word: 'Kiwi', color: 'mint' },
  { letter: 'L', emoji: '🦁', word: 'Leon', color: 'warmyellow' },
  { letter: 'M', emoji: '🌙', word: 'Luna', color: 'lavender' },
  { letter: 'N', emoji: '☁️', word: 'Nube', color: 'rose' },
  { letter: 'Ñ', emoji: '🟢', word: 'Ñandu', color: 'mint' },
  { letter: 'O', emoji: '🐻', word: 'Oso', color: 'peach' },
  { letter: 'P', emoji: '🍕', word: 'Pizza', color: 'warmyellow' },
  { letter: 'Q', emoji: '🧀', word: 'Queso', color: 'warmyellow' },
  { letter: 'R', emoji: '🐸', word: 'Rana', color: 'mint' },
  { letter: 'S', emoji: '🌞', word: 'Sol', color: 'warmyellow' },
  { letter: 'T', emoji: '🐢', word: 'Tortuga', color: 'lavender' },
  { letter: 'U', emoji: '🍇', word: 'Uva', color: 'rose' },
  { letter: 'V', emoji: '🦋', word: 'Vaca', color: 'peach' },
  { letter: 'W', emoji: '💧', word: 'Agua', color: 'mint' },
  { letter: 'X', emoji: '🎷', word: 'Xilofono', color: 'lavender' },
  { letter: 'Y', emoji: '🪀', word: 'Yoyo', color: 'rose' },
  { letter: 'Z', emoji: '🦓', word: 'Zebra', color: 'lavender' },
];

export interface SyllableGroup {
  consonant: string;
  emoji: string;
  word: string; // example word using the consonant
  syllables: string[]; // e.g. [ma, me, mi, mo, mu]
  color: Color;
}

export const SYLLABLE_GROUPS: SyllableGroup[] = [
  { consonant: 'M', emoji: '🌙', word: 'Mano', syllables: ['ma', 'me', 'mi', 'mo', 'mu'], color: 'lavender' },
  { consonant: 'P', emoji: '🍕', word: 'Pato', syllables: ['pa', 'pe', 'pi', 'po', 'pu'], color: 'warmyellow' },
  { consonant: 'S', emoji: '🌞', word: 'Sol', syllables: ['sa', 'se', 'si', 'so', 'su'], color: 'peach' },
  { consonant: 'L', emoji: '🦁', word: 'Luna', syllables: ['la', 'le', 'li', 'lo', 'lu'], color: 'rose' },
  { consonant: 'T', emoji: '🐢', word: 'Tigre', syllables: ['ta', 'te', 'ti', 'to', 'tu'], color: 'mint' },
  { consonant: 'N', emoji: '☁️', word: 'Nube', syllables: ['na', 'ne', 'ni', 'no', 'nu'], color: 'lavender' },
  { consonant: 'D', emoji: '🐬', word: 'Dedo', syllables: ['da', 'de', 'di', 'do', 'du'], color: 'warmyellow' },
  { consonant: 'F', emoji: '🌻', word: 'Foca', syllables: ['fa', 'fe', 'fi', 'fo', 'fu'], color: 'peach' },
  { consonant: 'R', emoji: '🐸', word: 'Rosa', syllables: ['ra', 're', 'ri', 'ro', 'ru'], color: 'rose' },
  { consonant: 'B', emoji: '🦋', word: 'Barco', syllables: ['ba', 'be', 'bi', 'bo', 'bu'], color: 'mint' },
];

export interface SpecialTopic {
  id: string;
  title: string;
  emoji: string;
  rule: string;
  examples: { word: string; emoji: string; note: string }[];
  color: Color;
}

export const SPECIAL_TOPICS: SpecialTopic[] = [
  {
    id: 'h-muda',
    title: 'La H muda',
    emoji: '🤫',
    rule: 'La H no suena. La leemos en silencio, como un secreto.',
    examples: [
      { word: 'Hueso', emoji: '🦴', note: 'Suena como "ueso"' },
      { word: 'Hielo', emoji: '🧊', note: 'Suena como "ielo"' },
      { word: 'Huevo', emoji: '🥚', note: 'Suena como "uevo"' },
    ],
    color: 'lavender',
  },
  {
    id: 'c-g-suaves',
    title: 'C y G suaves',
    emoji: '🪶',
    rule: 'Antes de E o I, la C suena "ce-ci" y la G suena "je-ji" (suave).',
    examples: [
      { word: 'Cebra', emoji: '🦓', note: 'C suena suave' },
      { word: 'Cielo', emoji: '☁️', note: 'C suena suave' },
      { word: 'Gema', emoji: '💎', note: 'G suena "je"' },
      { word: 'Girasol', emoji: '🌻', note: 'G suena "ji"' },
    ],
    color: 'mint',
  },
  {
    id: 'sillabas-trabadas',
    title: 'Sílabas trabadas',
    emoji: '🧩',
    rule: 'Cuando dos consonantes se juntan, forman sílabas especiales como pla, bra, tre, cla.',
    examples: [
      { word: 'Plato', emoji: '🍽️', note: 'pla' },
      { word: 'Bravo', emoji: '🦁', note: 'bra' },
      { word: 'Tres', emoji: '3️⃣', note: 'tre' },
      { word: 'Clavo', emoji: '🔨', note: 'cla' },
      { word: 'Flor', emoji: '🌸', note: 'flo' },
      { word: 'Globo', emoji: '🎈', note: 'glo' },
    ],
    color: 'warmyellow',
  },
];

export interface CompleteWordItem {
  id: string;
  word: string;          // full word, e.g. "Mano"
  emoji: string;
  emoji2: string;        // illustration split parts
  syllables: string[];   // all syllables, e.g. ["ma","no"]
  blankIndex: number;    // which syllable index is the blank (to be filled)
  options: string[];     // candidate syllables to choose from
  color: Color;
}

export const COMPLETE_WORDS: CompleteWordItem[] = [
  { id: 'cw1', word: 'Pato', emoji: '🦆', emoji2: '🪶', syllables: ['pa', 'to'], blankIndex: 0, options: ['pa', 'ma', 'ta'], color: 'warmyellow' },
  { id: 'cw2', word: 'Gato', emoji: '🐱', emoji2: '🐾', syllables: ['ga', 'to'], blankIndex: 0, options: ['ga', 'ba', 'ta'], color: 'peach' },
  { id: 'cw3', word: 'Luna', emoji: '🌙', emoji2: '⭐', syllables: ['lu', 'na'], blankIndex: 1, options: ['na', 'ma', 'ta'], color: 'lavender' },
  { id: 'cw4', word: 'Sopa', emoji: '🍜', emoji2: '🥄', syllables: ['so', 'pa'], blankIndex: 1, options: ['pa', 'ma', 'sa'], color: 'mint' },
  { id: 'cw5', word: 'Rana', emoji: '🐸', emoji2: '🪷', syllables: ['ra', 'na'], blankIndex: 0, options: ['ra', 'la', 'ta'], color: 'rose' },
  { id: 'cw6', word: 'Casa', emoji: '🏠', emoji2: '🚪', syllables: ['ca', 'sa'], blankIndex: 1, options: ['sa', 'ma', 'pa'], color: 'warmyellow' },
];

export interface EchoItem {
  id: string;
  word: string;
  emoji: string;
  startSyllable: string; // the syllable the word starts with
  options: string[];      // syllable choices
  color: Color;
}

export const ECHO_ITEMS: EchoItem[] = [
  { id: 'e1', word: 'Mano', emoji: '✋', startSyllable: 'ma', options: ['ma', 'pa', 'ta'], color: 'lavender' },
  { id: 'e2', word: 'Pato', emoji: '🦆', startSyllable: 'pa', options: ['pa', 'sa', 'la'], color: 'warmyellow' },
  { id: 'e3', word: 'Sopa', emoji: '🍜', startSyllable: 'so', options: ['so', 'ma', 'no'], color: 'mint' },
  { id: 'e4', word: 'Rana', emoji: '🐸', startSyllable: 'ra', options: ['ra', 'la', 'ta'], color: 'rose' },
  { id: 'e5', word: 'Tigre', emoji: '🐯', startSyllable: 'ti', options: ['ti', 'si', 'pi'], color: 'peach' },
  { id: 'e6', word: 'Luna', emoji: '🌙', startSyllable: 'lu', options: ['lu', 'mu', 'nu'], color: 'lavender' },
];
