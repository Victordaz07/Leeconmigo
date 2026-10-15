# 12 — Legal, privacidad y publicación (lista de control)

**DECISIÓN (Victor, 2026-10-15, `docs/DECISIONS.md` D8):** la app se va a publicar para otras familias. Esto
cierra `docs/09` #13 y activa la revisión legal que `docs/07` pedía antes de cualquier lanzamiento.

> ⚠️ **Esto NO es asesoría legal.** Es una lista de lo que hay que revisar, escrita para no olvidar nada.
> Una app para niños menores de 13 en EE. UU. (y en California) tiene reglas estrictas. **Antes de publicar,
> un abogado con experiencia en privacidad infantil (COPPA) debe revisar esta lista, la política de
> privacidad y los textos de la app.** Las leyes y las políticas de las tiendas cambian; verificar la versión
> vigente al momento de publicar.

## La ventaja que ya tenemos

El diseño de Lee Conmigo ya es el más fácil de defender legalmente:
- La voz del niño **nunca se graba ni sale del dispositivo** (`docs/07`, D1).
- **Sin cuentas, sin servidor, sin nube** en v1: todo se guarda en el dispositivo.
- Sin anuncios, sin chat, sin compartir con desconocidos.

**Mantener eso es la mejor protección legal.** Cada cosa que mande datos fuera del dispositivo (analítica,
reporte de errores, cuentas, sincronización en la nube, pagos) cambia el análisis legal y debe pasar por esta
lista antes de agregarse.

## 1. Leyes a revisar (con abogado)

- [ ] **COPPA** (EE. UU., FTC): reglas para apps dirigidas a menores de 13 que recopilan información personal.
      Confirmar si, sin recopilar nada fuera del dispositivo, aplica algún requisito (y cuáles de la versión
      actualizada de la regla). Si algún día se recopila algo: consentimiento verificable de los padres.
- [ ] **Leyes de California** (Noah y la mayoría de usuarios iniciales están ahí): CalOPPA (política de
      privacidad visible), CCPA/CPRA, y el estado actual del California Age-Appropriate Design Code (ha estado
      en litigio — verificar si está vigente).
- [ ] Si se publica fuera de EE. UU.: GDPR-K (Europa) y leyes locales — fuera de alcance hasta decidirlo.
- [ ] **Forma legal**: ¿se publica a nombre personal o de una LLC? (protege el patrimonio familiar ante
      reclamos). Decisión pendiente C11.

## 2. Documentos que hay que tener

- [ ] **Política de privacidad** en una URL pública (las dos tiendas la exigen) y dentro de la app. En
      lenguaje claro: qué se guarda (solo estadísticas en el dispositivo), qué NO (audio, texto reconocido),
      que nada sale del dispositivo, cómo borrar todo, contacto.
- [ ] **Términos de uso.**
- [ ] **Aviso para padres** al primer uso (antes de pedir el micrófono): qué hace la app con la voz.
      Ya existe la frase de `docs/01`: "La voz de tu hijo nunca se graba ni se almacena."
- [ ] **Descargos** (disclaimers):
  - [ ] Herramienta de práctica de lectura; **no es tratamiento, diagnóstico ni terapia** (D3). Nunca
        mencionar TDAH ni condiciones médicas en la tienda ni en la app del niño; el "Modo Enfoque" se
        describe por lo que hace (menos distracciones, bloques cortos), no por un diagnóstico.
  - [ ] El reconocimiento de voz puede equivocarse; no es una evaluación oficial de lectura.
  - [ ] No reemplaza a la escuela ni al maestro.
- [ ] Contacto de soporte (correo) visible.

## 3. Google Play (Android, primero)

- [ ] Cuenta de desarrollador de Google Play (pago único). Las cuentas personales nuevas deben hacer una
      prueba cerrada con testers durante un período antes de publicar — planearlo (las familias que ya
      quieren la app son perfectas como testers).
- [ ] **Política de Familias** (Designed for Families): declarar público objetivo con menores de 13 → obliga
      a cumplir sus requisitos (sin SDKs no certificados para niños, anuncios, etc.).
- [ ] Formulario de **Seguridad de los datos** (Data safety): coherente con la política de privacidad.
- [ ] Declaración del permiso de **micrófono** y por qué se usa.
- [ ] Clasificación de contenido (cuestionario IARC).

## 4. App Store (iOS, después)

- [ ] Apple Developer Program (pago anual).
- [ ] Si va en la **categoría Niños (Kids)**: sin analítica ni anuncios de terceros, y **"parental gate"**
      antes de enlaces externos, compras o ajustes. Confirmar si el PIN de padres actual cumple lo que pide
      Apple o hace falta otro tipo de candado.
- [ ] Etiquetas de privacidad ("privacy nutrition labels").
- [ ] Texto de permiso de micrófono (`NSMicrophoneUsageDescription`) y, si se usa el reconocimiento del
      sistema, `NSSpeechRecognitionUsageDescription`.

## 5. Contenido y marca

- [ ] **Ilustraciones generadas con IA**: revisar los términos de cada herramienta usada (uso comercial
      permitido, quién es dueño de las imágenes).
- [ ] Historias originales: confirmar que ninguna copia personajes o textos con derechos de terceros.
- [ ] Nombre **"Lee Conmigo"**: buscar si ya existe una marca o app con ese nombre (USPTO, tiendas).
- [ ] Fuentes (Andika, Nunito): licencia OFL, permite uso en apps — incluir el aviso de licencia.
- [ ] Revisión humana de todo el contenido para niños (ya es regla en F7).

## 6. Técnicas (las hace Claude Code, se verifican en revisión)

- [ ] Cero SDKs de terceros que recojan datos (analítica, anuncios, reporte de errores, "attribution").
- [ ] Permisos de red: la app no necesita internet para leer. Si en el futuro descarga contenido, solo
      descarga, nunca sube datos del niño.
- [ ] Botón en Modo padres: **"Borrar todos los datos"**.
- [ ] Sin enlaces externos accesibles al niño sin pasar por el candado de padres.
- [ ] Prueba automática que falle si aparece código que suba audio o archivos de audio (`*.wav`, etc. ya
      están en `.gitignore`).

## 7. Pendientes de decidir (en `docs/DECISIONS.md`)

- C10 — **Modelo de negocio**: ¿gratis, pago único, suscripción? Cobrar agrega reglas (compras dentro de la
  app con candado de padres, impuestos, cuenta de comerciante).
- C11 — **Forma legal**: persona física o LLC.
