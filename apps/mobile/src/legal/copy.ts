/**
 * Textos legales de Kitewise (ES/EN): Aviso para padres, Política de privacidad y Términos de uso.
 * ⚠️ BORRADOR escrito por Claude Code a partir de lo que la app REALMENTE hace (docs/07, docs/12). NO es asesoría legal: un abogado con experiencia en
 * privacidad infantil (COPPA, leyes de California) debe revisarlo y adaptarlo antes de publicar (docs/legal/REVISION-ABOGADO.md).
 * Este archivo no importa nada de React Native: lo lee también `scripts/legal-docs.mjs` para generar `docs/legal/*.md` con los mismos textos.
 * Regla: si la app cambia lo que guarda o a dónde manda datos, ESTOS TEXTOS cambian primero (y `LEGAL_VERSION`).
 */
import type { LegalConfig } from './config';

export type LegalLang = 'es' | 'en';
export interface LegalSection {
  title: string;
  /** Párrafos. Los que empiezan con «• » son viñetas. */
  body: string[];
}
export interface LegalDoc {
  title: string;
  sections: LegalSection[];
}
export interface LegalDocs {
  notice: LegalDoc;
  privacy: LegalDoc;
  terms: LegalDoc;
}

export const PENDING: Record<LegalLang, string> = { es: '[PENDIENTE]', en: '[PENDING]' };
const val = (v: string | null, lang: LegalLang) => (v && v.trim() ? v.trim() : PENDING[lang]);

export function legalDocs(lang: LegalLang, c: LegalConfig): LegalDocs {
  const who = val(c.publisherName, lang);
  const mail = val(c.contactEmail, lang);
  const law = val(c.governingLaw, lang);
  return lang === 'es' ? es(who, mail, law) : en(who, mail, law);
}

function es(who: string, mail: string, law: string): LegalDocs {
  return {
    notice: {
      title: 'Avisos importantes',
      sections: [
        {
          title: 'Qué es Kitewise',
          body: ['Kitewise es una herramienta de práctica escolar (lectura, matemáticas, ciencia, sociedad, arte y música) para niños, pensada para usarse con un adulto cerca.'],
        },
        {
          title: 'Lo que Kitewise NO es',
          body: [
            '• No es un tratamiento, terapia, diagnóstico ni «entrenamiento cerebral». No sustituye a un profesional de la salud, de la educación ni a un tutor.',
            '• No es una evaluación oficial. Las estrellas premian el esfuerzo, no son una calificación, y ningún resultado de la app sirve para decidir un nivel escolar.',
            '• No reemplaza a la escuela ni al maestro. Los estándares educativos que se mencionen son orientativos y pueden contener errores.',
            '• El «Modo Enfoque» solo reduce distracciones y organiza la práctica en bloques cortos. No trata ni diagnostica ninguna condición.',
          ],
        },
        {
          title: 'Reconocimiento de voz',
          body: ['El reconocimiento de voz puede equivocarse (acentos, ruido, voces infantiles). Un error de la app no significa que el niño haya leído mal. La voz se procesa solo en el dispositivo y nunca se graba ni se guarda.'],
        },
        {
          title: 'Supervisión y salud',
          body: [
            '• Recomendamos que un adulto supervise el uso y decida cuánto tiempo de pantalla es adecuado. Haz pausas, muévete y cuida la postura y la vista.',
            '• El adulto controla el Modo padres con un PIN: guárdalo bien. No hay forma de recuperarlo sin borrar los datos de la app.',
          ],
        },
        {
          title: 'Contenido e ilustraciones',
          body: ['Las historias y actividades pueden tener errores; si ves alguno, avísanos. Algunas ilustraciones se crearon con ayuda de herramientas de inteligencia artificial y fueron revisadas por personas.'],
        },
      ],
    },
    privacy: {
      title: 'Política de privacidad',
      sections: [
        {
          title: '1. Resumen',
          body: [
            `Kitewise está hecha para que la información del niño se quede en el dispositivo. No tiene cuentas, no tiene anuncios, no tiene análisis ni rastreo, y no vende ni comparte datos. La publica ${who}.`,
          ],
        },
        {
          title: '2. Qué guarda la app, solo en este dispositivo',
          body: [
            '• El nombre o apodo del niño que el adulto escribe, su avatar, su nivel y sus metas.',
            '• Estadísticas de práctica: minutos de lectura, historias, preguntas contestadas, palabras que necesitaron ayuda, estrellas y cómo dijo el niño que sintió su enfoque.',
            '• El avance en cada materia.',
            '• Lo que el niño crea o escribe en la app: ritmos, pinturas, collages e ideas cortas en «Mi cuaderno».',
            '• Los ajustes del adulto: PIN, recordatorios, Modo Enfoque y la aceptación de estos textos.',
          ],
        },
        {
          title: '3. La voz del niño',
          body: [
            'El micrófono se usa solo mientras el niño lee en voz alta dentro de la app. El audio se convierte en texto dentro del dispositivo, con un modelo que viene incluido en la app, y ambos viven únicamente en la memoria temporal mientras dura la lectura.',
            'La voz nunca se graba, nunca se guarda en archivos y nunca sale del dispositivo. De la lectura solo se guardan las estadísticas del punto 2.',
          ],
        },
        {
          title: '4. Lo que no hacemos',
          body: [
            '• No recopilamos información personal en servidores nuestros: no tenemos servidores para eso.',
            '• No usamos anuncios, analítica, reporte de errores de terceros ni herramientas de rastreo.',
            '• No hay cuentas, chat ni contacto con desconocidos.',
            '• La app no usa la cámara, la ubicación ni los contactos.',
            '• No vendemos ni compartimos datos de nadie.',
          ],
        },
        {
          title: '5. Internet',
          body: ['La app funciona sin conexión y no envía datos del niño a ningún servidor. La tienda de aplicaciones y el sistema del dispositivo pueden tener sus propias políticas sobre la instalación y el uso, que no controlamos.'],
        },
        {
          title: '6. Recordatorios',
          body: ['Si el adulto los activa, los recordatorios son notificaciones locales programadas en el dispositivo. No usamos envío remoto («push»), ni ningún servidor para avisar. El adulto puede apagarlos en Modo padres o en los ajustes del teléfono.'],
        },
        {
          title: '7. Informe semanal en PDF',
          body: ['El informe se crea en el dispositivo y no lleva voz ni imágenes. Solo sale del dispositivo si el adulto elige compartirlo con la hoja de compartir del sistema; el adulto decide con quién. Lo que pase después depende de la aplicación que elija.'],
        },
        {
          title: '8. Copias de seguridad',
          body: ['Kitewise no participa en las copias de seguridad automáticas de Android: sus datos no se suben a tu cuenta de Google. Por eso, si cambias de teléfono, el progreso no se transfiere.'],
        },
        {
          title: '9. Control y borrado',
          body: [
            '• En Modo padres (con PIN) puedes borrar el progreso de un niño o borrar todos los datos de la app.',
            '• Desinstalar la app borra todo lo guardado.',
            '• Como los datos están solo en este dispositivo, no tenemos copia que pedirnos ni que borrar en servidores.',
          ],
        },
        {
          title: '10. Niños',
          body: ['Kitewise es para niños de primaria (aprox. 6 a 12 años) y se instala y configura por un adulto, que acepta estos textos en nombre del niño. Como no recopilamos información personal de los niños, no hay datos suyos en nuestro poder.'],
        },
        { title: '11. Cambios', body: ['Si cambiamos qué datos guarda la app o cómo los usa, actualizaremos este texto y la app pedirá al adulto que lo lea y lo acepte de nuevo antes de continuar.'] },
        { title: '12. Contacto', body: [`${who} · ${mail}`] },
      ],
    },
    terms: {
      title: 'Términos de uso',
      sections: [
        { title: '1. Quién puede aceptar', body: [`Estos términos los acepta un adulto (madre, padre o tutor legal, con la mayoría de edad de su lugar), en su nombre y en el de los menores a su cargo. La app la publica ${who}.`] },
        { title: '2. Qué ofrece Kitewise', body: ['Una herramienta de práctica escolar para niños. Puede cambiar, mejorar o dejar de ofrecer funciones con el tiempo.'] },
        { title: '3. No es tratamiento ni evaluación oficial', body: ['Kitewise no es terapia, tratamiento ni diagnóstico, y no sustituye a la escuela, a un tutor ni a un profesional. Sus resultados son orientativos. Lee también «Avisos importantes».'] },
        { title: '4. Supervisión', body: ['El adulto es responsable de supervisar el uso del niño, de limitar el tiempo de pantalla y de proteger su PIN de Modo padres.'] },
        { title: '5. Reconocimiento de voz y contenido', body: ['El reconocimiento de voz y el contenido pueden tener errores. Kitewise no garantiza que sean exactos ni que produzcan un resultado de aprendizaje determinado.'] },
        { title: '6. Uso permitido', body: ['Puedes usar la app para uso personal y familiar, no comercial. No puedes copiar, revender ni redistribuir la app o su contenido, ni intentar extraer su código, salvo donde la ley lo permita.'] },
        {
          title: '7. Propiedad y licencias',
          body: [
            'La app, las historias, las ilustraciones y el resto del contenido pertenecen a quien los publica o a sus licenciantes; se te da una licencia personal, limitada y revocable para usarlos.',
            'La app incluye componentes de código abierto, entre ellos el modelo de reconocimiento de voz Whisper y la detección de voz Silero (licencia MIT) y las fuentes Nunito y Andika (SIL Open Font License), con sus licencias respectivas.',
          ],
        },
        { title: '8. Sin garantías', body: ['En la máxima medida que permite la ley, la app se ofrece «tal cual» y «según disponibilidad», sin garantías de ningún tipo, expresas o implícitas.'] },
        { title: '9. Limitación de responsabilidad', body: ['En la máxima medida que permite la ley, quien publica la app no responde por daños indirectos, incidentales o consecuentes derivados del uso de la app, ni por pérdida de datos del dispositivo. Nada de esto limita derechos que la ley no permite limitar.'] },
        { title: '10. Cambios y terminación', body: ['Podemos actualizar estos términos; la app pedirá aceptarlos de nuevo si cambian. Puedes dejar de usar la app en cualquier momento desinstalándola.'] },
        { title: '11. Ley aplicable', body: [`Estos términos se rigen por las leyes de ${law}.`] },
        { title: '12. Contacto', body: [`${who} · ${mail}`] },
      ],
    },
  };
}

function en(who: string, mail: string, law: string): LegalDocs {
  return {
    notice: {
      title: 'Important notices',
      sections: [
        { title: 'What Kitewise is', body: ['Kitewise is a school practice tool (reading, math, science, social studies, art and music) for children, meant to be used with an adult nearby.'] },
        {
          title: 'What Kitewise is NOT',
          body: [
            '• It is not treatment, therapy, a diagnosis or “brain training”. It does not replace a health professional, an educator or a tutor.',
            '• It is not an official assessment. Stars reward effort, they are not a grade, and no result in the app should be used to decide a school level.',
            '• It does not replace school or the teacher. Any educational standards mentioned are indicative and may contain errors.',
            '• “Focus Mode” only reduces distractions and organizes practice in short blocks. It does not treat or diagnose any condition.',
          ],
        },
        {
          title: 'Speech recognition',
          body: ['Speech recognition can make mistakes (accents, noise, children’s voices). An error in the app does not mean the child read incorrectly. Voice is processed only on the device and is never recorded or stored.'],
        },
        {
          title: 'Supervision and health',
          body: [
            '• We recommend that an adult supervises use and decides how much screen time is appropriate. Take breaks, move around and look after posture and eyesight.',
            '• The adult controls Parent mode with a PIN: keep it safe. It cannot be recovered without erasing the app’s data.',
          ],
        },
        {
          title: 'Content and illustrations',
          body: ['Stories and activities may contain errors; if you find one, tell us. Some illustrations were created with the help of artificial intelligence tools and reviewed by people.'],
        },
      ],
    },
    privacy: {
      title: 'Privacy policy',
      sections: [
        { title: '1. Summary', body: [`Kitewise is built so that a child’s information stays on the device. It has no accounts, no ads, no analytics or tracking, and it does not sell or share data. It is published by ${who}.`] },
        {
          title: '2. What the app stores, only on this device',
          body: [
            '• The child’s name or nickname as typed by the adult, their avatar, level and goals.',
            '• Practice statistics: reading minutes, stories, questions answered, words that needed help, stars, and how the child said their focus felt.',
            '• Progress in each subject.',
            '• What the child creates or writes in the app: rhythms, paintings, collages and short ideas in “My notebook”.',
            '• The adult’s settings: PIN, reminders, Focus Mode and the acceptance of these texts.',
          ],
        },
        {
          title: '3. The child’s voice',
          body: [
            'The microphone is used only while the child reads aloud inside the app. Audio is turned into text inside the device, with a model that ships with the app, and both live only in temporary memory while the reading lasts.',
            'Voice is never recorded, never saved to files and never leaves the device. Only the statistics in item 2 are kept from a reading.',
          ],
        },
        {
          title: '4. What we do not do',
          body: [
            '• We do not collect personal information on servers of ours: we have no servers for that.',
            '• We do not use ads, analytics, third-party error reporting or tracking tools.',
            '• There are no accounts, chat or contact with strangers.',
            '• The app does not use the camera, location or contacts.',
            '• We do not sell or share anyone’s data.',
          ],
        },
        { title: '5. Internet', body: ['The app works offline and sends no child data to any server. The app store and the device’s system may have their own policies about installing and using apps, which we do not control.'] },
        { title: '6. Reminders', body: ['If the adult turns them on, reminders are local notifications scheduled on the device. We use no remote (“push”) delivery and no server to notify. The adult can turn them off in Parent mode or in the phone’s settings.'] },
        { title: '7. Weekly PDF report', body: ['The report is created on the device and contains no voice or images. It only leaves the device if the adult chooses to share it with the system share sheet; the adult decides with whom. What happens next depends on the app they choose.'] },
        { title: '8. Backups', body: ['Kitewise does not take part in Android’s automatic backups: its data is not uploaded to your Google account. So if you change phones, progress does not transfer.'] },
        {
          title: '9. Control and deletion',
          body: [
            '• In Parent mode (with the PIN) you can erase a child’s progress or erase all of the app’s data.',
            '• Uninstalling the app deletes everything stored.',
            '• Because the data is only on this device, we hold no copy to request or delete on servers.',
          ],
        },
        { title: '10. Children', body: ['Kitewise is for elementary-school children (about ages 6 to 12) and is installed and set up by an adult, who accepts these texts on the child’s behalf. Because we do not collect children’s personal information, we hold none of their data.'] },
        { title: '11. Changes', body: ['If we change what data the app stores or how it is used, we will update this text and the app will ask the adult to read and accept it again before continuing.'] },
        { title: '12. Contact', body: [`${who} · ${mail}`] },
      ],
    },
    terms: {
      title: 'Terms of use',
      sections: [
        { title: '1. Who may accept', body: [`These terms are accepted by an adult (parent or legal guardian, of legal age where they live), for themselves and for the minors in their care. The app is published by ${who}.`] },
        { title: '2. What Kitewise offers', body: ['A school practice tool for children. Features may change, improve or be discontinued over time.'] },
        { title: '3. Not treatment or an official assessment', body: ['Kitewise is not therapy, treatment or a diagnosis, and does not replace school, a tutor or a professional. Its results are indicative. Please also read “Important notices”.'] },
        { title: '4. Supervision', body: ['The adult is responsible for supervising the child’s use, limiting screen time and protecting their Parent mode PIN.'] },
        { title: '5. Speech recognition and content', body: ['Speech recognition and content may contain errors. Kitewise does not guarantee that they are accurate or that they will produce any particular learning outcome.'] },
        { title: '6. Permitted use', body: ['You may use the app for personal, family, non-commercial purposes. You may not copy, resell or redistribute the app or its content, or try to extract its code, except where the law allows it.'] },
        {
          title: '7. Ownership and licenses',
          body: [
            'The app, the stories, the illustrations and the rest of the content belong to the publisher or its licensors; you are given a personal, limited, revocable license to use them.',
            'The app includes open-source components, among them the Whisper speech recognition model and Silero voice detection (MIT license) and the Nunito and Andika fonts (SIL Open Font License), under their respective licenses.',
          ],
        },
        { title: '8. No warranties', body: ['To the maximum extent permitted by law, the app is provided “as is” and “as available”, without warranties of any kind, express or implied.'] },
        { title: '9. Limitation of liability', body: ['To the maximum extent permitted by law, the publisher is not liable for indirect, incidental or consequential damages arising from use of the app, or for loss of data on the device. Nothing here limits rights that the law does not allow to be limited.'] },
        { title: '10. Changes and termination', body: ['We may update these terms; the app will ask you to accept them again if they change. You can stop using the app at any time by uninstalling it.'] },
        { title: '11. Governing law', body: [`These terms are governed by the laws of ${law}.`] },
        { title: '12. Contact', body: [`${who} · ${mail}`] },
      ],
    },
  };
}

/** Textos de las pantallas (no son documentos legales). */
export const LEGAL_UI = {
  es: {
    welcomeTitle: 'Antes de empezar',
    welcomeKicker: 'Para el adulto',
    welcomeIntro: 'Kitewise es una herramienta de práctica para niños. Un adulto debe leer esto y aceptarlo antes de usarla.',
    bullets: [
      'La voz del niño nunca se graba ni sale del dispositivo.',
      'Sin cuentas, sin anuncios y sin rastreo: todo se guarda solo en este dispositivo.',
      'Es práctica escolar: no es terapia, diagnóstico ni evaluación oficial.',
      'El reconocimiento de voz puede equivocarse.',
      'Un adulto debe supervisar el uso y decidir el tiempo de pantalla.',
    ],
    gateTitle: 'Pregunta para adultos',
    gateHint: (a: number, b: number) => `¿Cuánto es ${a} × ${b}?`,
    gateWrong: 'No es esa. Inténtalo otra vez.',
    read: { notice: 'Leer los avisos importantes', privacy: 'Leer la política de privacidad', terms: 'Leer los términos de uso' },
    checkbox: 'Soy madre, padre o tutor legal, tengo la mayoría de edad y acepto los avisos, los términos de uso y la política de privacidad, en mi nombre y en el del menor a mi cargo.',
    accept: 'Aceptar y continuar',
    needGate: 'Resuelve la pregunta y marca la casilla para continuar.',
    langButton: 'English',
    back: 'Volver',
    draftBanner: 'Borrador pendiente de revisión legal: faltan datos del editor y el correo de contacto.',
    version: (v: string) => `Versión de los textos: ${v}`,
    legalTitle: 'Legal y privacidad',
    legalIntro: 'Los textos que aceptaste y el control de tus datos.',
    contact: 'Contacto',
    eraseTitle: 'Borrar todos los datos',
    eraseBody: 'Borra los perfiles, el progreso de todos los niños, lo que crearon, el PIN y los recordatorios de este dispositivo. No se puede deshacer. La app volverá a empezar desde cero.',
    eraseButton: 'Borrar todos los datos…',
    eraseConfirm: '¿Seguro? Se borrará todo en este dispositivo.',
    eraseYes: 'Sí, borrar todo',
    eraseNo: 'No, conservar',
    erased: 'Listo. Se borró todo.',
  },
  en: {
    welcomeTitle: 'Before you start',
    welcomeKicker: 'For the adult',
    welcomeIntro: 'Kitewise is a practice tool for children. An adult must read and accept this before using it.',
    bullets: [
      'The child’s voice is never recorded and never leaves the device.',
      'No accounts, no ads and no tracking: everything is stored only on this device.',
      'It is school practice: not therapy, diagnosis or an official assessment.',
      'Speech recognition can make mistakes.',
      'An adult should supervise use and decide screen time.',
    ],
    gateTitle: 'Question for adults',
    gateHint: (a: number, b: number) => `What is ${a} × ${b}?`,
    gateWrong: 'That is not it. Try again.',
    read: { notice: 'Read the important notices', privacy: 'Read the privacy policy', terms: 'Read the terms of use' },
    checkbox: 'I am a parent or legal guardian, of legal age, and I accept the notices, the terms of use and the privacy policy, for myself and for the minor in my care.',
    accept: 'Accept and continue',
    needGate: 'Answer the question and tick the box to continue.',
    langButton: 'Español',
    back: 'Back',
    draftBanner: 'Draft pending legal review: the publisher’s details and the contact email are missing.',
    version: (v: string) => `Text version: ${v}`,
    legalTitle: 'Legal and privacy',
    legalIntro: 'The texts you accepted and control over your data.',
    contact: 'Contact',
    eraseTitle: 'Erase all data',
    eraseBody: 'Erases the profiles, every child’s progress, what they created, the PIN and the reminders on this device. It cannot be undone. The app will start over from scratch.',
    eraseButton: 'Erase all data…',
    eraseConfirm: 'Are you sure? Everything on this device will be erased.',
    eraseYes: 'Yes, erase everything',
    eraseNo: 'No, keep it',
    erased: 'Done. Everything was erased.',
  },
} as const;
