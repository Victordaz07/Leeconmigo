import type { MathLang } from '@lee-conmigo/ui-core';

/** Mensajes de los avisos. Cortos, cálidos y sin culpa: una invitación, nunca una presión (D5). Sin datos del niño en la pantalla bloqueada. */
export const REMINDER_COPY: Record<MathLang, { childTitle: string; childBodies: string[]; named: (name: string, body: string) => string; parentTitle: string; parentBody: string }> = {
  es: {
    childTitle: 'Kitewise',
    childBodies: ['Una historia te está esperando.', '¿Seguimos con tu aventura?', 'Unos minutitos de lectura y listo.', 'Tu cometa quiere volar un rato contigo.', '¿Leemos juntos un poquito?'],
    named: (name, body) => `${name}: ${body}`,
    parentTitle: 'Resumen semanal de Kitewise',
    parentBody: 'El resumen de la semana está listo. Ábrelo en Modo padres.',
  },
  en: {
    childTitle: 'Kitewise',
    childBodies: ['A story is waiting for you.', 'Shall we keep going on your adventure?', 'A few minutes of reading and you are done.', 'Your kite wants to fly with you for a while.', 'Shall we read together for a bit?'],
    named: (name, body) => `${name}: ${body}`,
    parentTitle: 'Kitewise weekly summary',
    parentBody: 'This week’s summary is ready. Open it in Parent mode.',
  },
};
