import { Heart, BookOpen, Clock, Smile, Repeat, Volume2, Gamepad2, Sparkles, AlertCircle } from 'lucide-react';
import { speak } from '@/lib/tts';
import { playPop } from '@/lib/sound';

interface TipCardProps {
  icon: React.ReactNode;
  title: string;
  text: string;
  color: string;
}

function TipCard({ icon, title, text, color }: TipCardProps) {
  return (
    <div className="card-lift rounded-3xl bg-white/70 backdrop-blur ring-1 ring-white/60 p-5 shadow-soft">
      <span className={`inline-grid place-items-center w-12 h-12 rounded-2xl ${color} text-ink-600 shadow-inner`}>
        {icon}
      </span>
      <h3 className="mt-3 font-display text-lg font-semibold text-ink-600">{title}</h3>
      <p className="mt-1 text-sm text-ink-500 leading-relaxed">{text}</p>
    </div>
  );
}

export function ParentsSection() {
  const speakIntro = () => {
    playPop();
    speak(
      'Bienvenidos, papas y mamas. Acompaar a tus hijos a leer es un regalo para toda la vida. ' +
      'Usa este libro magico unos minutos al dia, junto a ellos.',
      { rate: 0.95 }
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center">
        <div className="inline-grid place-items-center w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-200 to-peach-200 shadow-soft animate-float-y">
          <Heart className="w-8 h-8 text-rose-400" />
        </div>
        <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-ink-600">Guía para Padres</h2>
        <p className="mt-2 text-ink-500 max-w-xl mx-auto">
          Acompañar a tus hijos a leer es uno de los regalos más grandes que puedes darles.
          Aquí tienes ideas sencillas para usar este libro mágico juntos.
        </p>
        <button
          onClick={speakIntro}
          className="btn-magic mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/80 ring-1 ring-white/60 shadow-soft text-ink-600"
        >
          <Volume2 className="w-5 h-5 text-lavender-500" />
          Escuchar la guía
        </button>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <TipCard
          icon={<Clock className="w-6 h-6" />}
          title="Poco tiempo, cada día"
          text="Diez o quince minutos diarios valen más que una hora de vez en cuando. La constancia construye el hábito."
          color="bg-warmyellow-100"
        />
        <TipCard
          icon={<Smile className="w-6 h-6" />}
          title="Hazlo divertido"
          text="Si el niño se cansa o se distrae, cambia de página o pausa. Lo importante es disfrutar, no presionar."
          color="bg-peach-100"
        />
        <TipCard
          icon={<BookOpen className="w-6 h-6" />}
          title="Lee con él"
          text="Toca las letras y repite los sonidos juntos. Tu voz es el mejor modelo de pronunciación."
          color="bg-mint-100"
        />
        <TipCard
          icon={<Repeat className="w-6 h-6" />}
          title="Repite y celebra"
          text="Cada acierto merece un aplauso. Repetir las palabras favoritas refuerza el aprendizaje."
          color="bg-lavender-100"
        />
        <TipCard
          icon={<Volume2 className="w-6 h-6" />}
          title="Usa la locución"
          text="Cada letra y palabra se puede escuchar. Pulsa el botón del altavoz y repite en voz alta junto a tu pequeño."
          color="bg-rose-100"
        />
        <TipCard
          icon={<Gamepad2 className="w-6 h-6" />}
          title="Juega con los juegos"
          text='Las secciones "Completa la Palabra" y "Eco y Repetición" practican lo aprendido. Acompáñalo en los juegos de voz.'
          color="bg-warmyellow-100"
        />
      </div>

      {/* Stages */}
      <div className="mt-8 rounded-3xl bg-gradient-to-br from-cream-100 to-lavender-100 ring-1 ring-white/60 p-5 shadow-soft">
        <h3 className="font-display text-xl font-semibold text-ink-600 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-warmyellow-400" />
          Etapas recomendadas
        </h3>
        <ol className="mt-3 space-y-3">
          {[
            ['3 años', 'Explora las vocales y el abecedario. Escucha los sonidos y nombra los dibujos.'],
            ['4 años', 'Practica las sílabas y las letras especiales. Juega a "Completa la Palabra" con ayuda.'],
            ['5 años', 'Usa "Eco y Repetición" con el micrófono. Intenta leer palabras simples en voz alta.'],
          ].map(([age, desc]) => (
            <li key={age} className="flex gap-3 items-start">
              <span className="shrink-0 grid place-items-center min-w-[3.5rem] px-2 h-10 rounded-xl bg-white/70 font-display text-sm font-semibold text-ink-600">
                {age}
              </span>
              <p className="text-sm text-ink-500 leading-relaxed pt-1.5">{desc}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Note */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl bg-white/70 ring-1 ring-warmyellow-200 p-4">
        <AlertCircle className="w-5 h-5 text-warmyellow-400 shrink-0 mt-0.5" />
        <p className="text-sm text-ink-500 leading-relaxed">
          La función de reconocimiento de voz funciona mejor en el navegador Chrome y con permiso
          concedido al micrófono. Si no está disponible, los juegos se pueden resolver también
          tocando la sílaba correcta.
        </p>
      </div>
    </div>
  );
}
