/**
 * Textos de la interfaz del cuaderno de Sociedad, en los dos idiomas (cada unidad trae los suyos propios: la
 * pregunta, las fuentes, las opciones). Tono de acompañamiento: nunca "incorrecto" (docs/06); una opción no
 * preferida invita a mirar de nuevo, nunca bloquea seguir. El dominio (`@lee-conmigo/social-content`) devuelve
 * CLAVES; este archivo las vuelve frases (docs/design/subjects/PATRON-MATEMATICAS.md §2 paso 5).
 */
import type { MathLang as SocialLang } from '../math-copy.ts';

export type { SocialLang };

/** Mismas claves que `InvestigationReasonKey` de `@lee-conmigo/social-content` (sin depender del paquete de
 * contenido desde ui-core, igual dirección que `MathLang`). */
export type SocialReasonKey = 'sourcesAndGap' | 'sources' | 'gap' | 'reasoningAndCare' | 'reasoning' | 'completed';

const L = <T>(es: T, en: T) => ({ es, en });

export const SOCIAL_COPY = {
  subject: L('Sociedad', 'Social Studies'),
  notebook: {
    title: L('Cuaderno de Sociedad', 'Social Studies notebook'),
    unit: L('Unidad', 'Unit'),
    start: L((name: string) => `Empezar: ${name} ›`, (name: string) => `Start: ${name} ›`),
    again: L((name: string) => `Investigar de nuevo: ${name} ›`, (name: string) => `Investigate again: ${name} ›`),
    draft: L('Estándares en borrador: los revisa un docente.', 'Standards are a draft: a teacher reviews them.'),
    castNote: L('Seis investigaciones piloto, una por grado, con Inés y Teo (de "El mapa de la puerta desaparecida").', 'Six pilot investigations, one per grade, with Inés and Teo (from "The Map of the Missing Door").'),
    hereLabel: L('¡Empieza aquí!', 'Start here!'),
  },
  stepOf: L((n: number, total: number) => `Paso ${n} de ${total}`, (n: number, total: number) => `Step ${n} of ${total}`),
  next: L('Seguir ›', 'Next ›'),
  back: L('‹ Atrás', '‹ Back'),
  listen: L('Escuchar', 'Listen'),
  /** Pasos "comparar": clasificar una afirmación. */
  classify: {
    igual: L('Sigue igual', 'Still the same'),
    nuevo: L('Es nuevo', "It's new"),
    prompt: L('¿Sigue igual o es nuevo?', 'Still the same, or new?'),
  },
  /** Pasos "fuente"/"testimonio": retroalimentación nunca "incorrecta". */
  feedback: {
    affirm: L('¡Eso es! Esa fuente lo cuenta.', "That's it! This source tells us that."),
    gentle: L('Mira otra vez esta fuente. ¿Qué más cuenta?', 'Take another look at this source. What else does it tell us?'),
  },
  /** Paso "explicar" (Mesa de fuentes). */
  explain: {
    instructions: L((n: number) => `Toca al menos ${n} fuentes que te ayuden a explicar el cambio.`, (n: number) => `Tap at least ${n} sources that help explain the change.`),
    selected: L((n: number) => `${n} elegidas`, (n: number) => `${n} selected`),
  },
  /** Paso "revisar". */
  review: {
    instructions: L('Elige lo que todavía no sabemos.', "Pick what we still don't know."),
  },
  /** Cierre de sesión (razón de las estrellas, D11 — mismo principio de `effortReason`, propio de Sociedad). */
  closingReason: {
    sourcesAndGap: L('por usar varias fuentes y notar qué falta por saber', 'for using several sources and noticing what we still need to find out'),
    sources: L('por usar varias fuentes para explicar el cambio', 'for using several sources to explain the change'),
    gap: L('por notar qué falta por saber', 'for noticing what we still need to find out'),
    reasoningAndCare: L('por pensar cada paso con cuidado, de principio a fin', 'for thinking each step through carefully, from start to finish'),
    reasoning: L('por pensar con cuidado en esta investigación', 'for thinking carefully through this investigation'),
    completed: L('por terminar la investigación', 'for finishing the investigation'),
  } satisfies Record<SocialReasonKey, { es: string; en: string }>,
  sourceKind: {
    mapa: L('Mapa', 'Map'),
    foto: L('Fotografía', 'Photograph'),
    testimonio: L('Testimonio', 'Account'),
  },
} as const;
