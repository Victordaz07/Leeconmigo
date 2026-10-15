/**
 * "Probar micrófono": pantalla de diagnóstico SOLO DEV (nunca la ve un niño) para `WhisperSpeechEngine`
 * fuera del flujo de una historia. Nació de que Victor no tenía forma de saber si el micrófono
 * funcionaba de verdad ("no sé si está funcionando") — aquí se ve en vivo: el estado de carga, si está
 * "escuchando ahora" (VAD) y, sobre todo, el TEXTO que Whisper cree haber oído por cada frase, para
 * poder decir palabras concretas y comprobar si se reconocen bien.
 */
import { useEffect, useRef, useState } from 'react';
import type { LanguageCode } from '@lee-conmigo/contracts';
import { WhisperSpeechEngine, type WhisperStatus } from '@lee-conmigo/speech-engine';

interface Heard {
  text: string;
  atMs: number;
}

/**
 * Datos del dispositivo, SOLO para que Victor los pueda copiar en un reporte (p. ej. si un modelo falla
 * por memoria, como ya pasó: "Can't create a session. failed to allocate a buffer..."). Todo local, nunca
 * sale del dispositivo.
 */
function deviceInfoLine(): string {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const mem = nav.deviceMemory ? `${nav.deviceMemory} GB` : 'sin dato';
  return `RAM aprox.: ${mem} · núcleos: ${navigator.hardwareConcurrency} · aislamiento multihilo: ${window.crossOriginIsolated ? 'sí' : 'no'}`;
}

const STATUS_LABEL: Record<WhisperStatus, string> = {
  idle: 'Sin empezar',
  'requesting-mic': 'Pidiendo permiso de micrófono…',
  'loading-model': 'Cargando el modelo de voz… (la primera vez descarga ~41 MB, necesita internet)',
  ready: 'Escuchando de verdad',
  stopped: 'Detenido',
  error: 'Error',
};

const STATUS_COLOR: Record<WhisperStatus, string> = {
  idle: 'bg-slate-500',
  'requesting-mic': 'bg-amber-500',
  'loading-model': 'bg-amber-500',
  ready: 'bg-emerald-600',
  stopped: 'bg-slate-500',
  error: 'bg-red-600',
};

export function VoiceLab({ onExit }: { onExit: () => void }) {
  const [language, setLanguage] = useState<LanguageCode>('es');
  const [status, setStatus] = useState<WhisperStatus>('idle');
  const [listeningNow, setListeningNow] = useState(false);
  const [heard, setHeard] = useState<Heard[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const engineRef = useRef<WhisperSpeechEngine | null>(null);
  const startedAtRef = useRef(0);

  useEffect(() => {
    return () => {
      void engineRef.current?.stop();
    };
  }, []);

  const start = () => {
    setHeard([]);
    setErrorMsg(null);
    const engine = new WhisperSpeechEngine();
    engineRef.current = engine;
    startedAtRef.current = Date.now();
    engine.onStatus(setStatus);
    engine.onVoiceActivity(setListeningNow);
    engine.onFinalResult((r) => setHeard((list) => [{ text: r.text, atMs: Date.now() - startedAtRef.current }, ...list].slice(0, 30)));
    engine.onError((e) => setErrorMsg(`${e.code}: ${e.message}`));
    engine.start(language).catch(() => {
      /* el error ya llega por onError/onStatus */
    });
  };

  const stop = () => {
    void engineRef.current?.stop();
    engineRef.current = null;
    setListeningNow(false);
  };

  const running = status === 'requesting-mic' || status === 'loading-model' || status === 'ready';

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-slate-950 text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="text-sm font-extrabold">🎤 Probar micrófono — solo desarrollo</div>
        <button type="button" onClick={onExit} className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-bold hover:bg-white/20">
          Cerrar ✕
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="flex items-center gap-3">
          <span className={`h-3 w-3 rounded-full ${STATUS_COLOR[status]} ${listeningNow ? 'animate-pulse' : ''}`} />
          <span className="text-sm font-bold">{STATUS_LABEL[status]}</span>
          {status === 'ready' && <span className="text-xs opacity-70">{listeningNow ? '(oyendo voz ahora mismo)' : '(en silencio)'}</span>}
        </div>

        {errorMsg && <div className="rounded-lg bg-red-950 px-3 py-2 text-xs text-red-200">{errorMsg}</div>}

        <div className="text-[11px] opacity-40">{deviceInfoLine()}</div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-white/10 p-1">
            {(['es', 'en'] as const).map((l) => (
              <button
                key={l}
                type="button"
                disabled={running}
                onClick={() => setLanguage(l)}
                className={`rounded-md px-3 py-1.5 text-sm font-bold ${language === l ? 'bg-white text-slate-950' : 'opacity-70'}`}
              >
                {l === 'es' ? 'Español' : 'English'}
              </button>
            ))}
          </div>
          {!running ? (
            <button type="button" onClick={start} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-extrabold">
              Empezar a escuchar
            </button>
          ) : (
            <button type="button" onClick={stop} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-extrabold">
              Detener
            </button>
          )}
        </div>

        <div className="flex-1 rounded-xl bg-white/5 p-3">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide opacity-60">Lo que Whisper cree haber oído (más reciente arriba)</div>
          {heard.length === 0 ? (
            <div className="text-sm opacity-50">Di una palabra o frase concreta en voz alta y espera unos segundos.</div>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {heard.map((h, i) => (
                <li key={i} className="rounded-lg bg-white/10 px-3 py-2 text-sm">
                  <span className="mr-2 font-mono text-[11px] opacity-50">{(h.atMs / 1000).toFixed(1)}s</span>
                  {h.text || <span className="italic opacity-50">(vacío)</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
