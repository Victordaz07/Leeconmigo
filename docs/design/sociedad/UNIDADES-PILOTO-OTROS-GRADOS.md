# Unidades piloto de Sociedad — 1.º, 2.º, 4.º, 5.º y 6.º

Completa la familia de 6 unidades piloto (una por grado) junto con `UNIDAD-PILOTO-S3-U03.md`. Mismo elenco
(Inés, Teo), mismo motor de 6 pasos como mucho — pero no todas usan las mismas piezas: solo las unidades que
trabajan con fuentes históricas (2.º, 3.º, 4.º, 5.º) tienen los pasos "explicar"/"revisar"; las de puro
razonamiento cívico (1.º, 6.º) no los necesitan (ver `packages/social-content/src/validate.ts`).

Contenido completo (ES/EN, los 6 pasos de cada una) en `packages/social-content/content/{s1u01,s2u01,s4u03,s5u04,s6u02}.json`.

## 1.º — S1-U01 "Una regla para compartir" (CA HSS 1.1)

Inés y Teo tienen dos juegos de bloques, pero cuatro niños quieren jugar. Deciden entre tres propuestas
(turnos, parejas, que uno se quede con todo), enfrentan un caso donde alguien tiene que esperar, una condición
nueva (un amigo necesita más tiempo) y terminan reflexionando a quién ayuda la regla que armaron.

**Motor:** 5 pasos, todos `pregunta`/`elegir` — sin fuentes (es deliberación, no investigación con evidencia).
**Arte nueva necesaria: ninguna.** Usa solo las 4 poses de Teo que ya existen.

## 2.º — S2-U01 "Un cuaderno tiene historia" (CA HSS 2.1)

Inés encuentra un cuaderno viejo con "2005" escrito en la tapa y una tarjeta dentro. Distingue qué puede
*observar* (manchas, la fecha) de lo que sería una *inferencia* sin apoyo ("todos los niños usaban este
cuaderno"), usa las dos fuentes para explicar su historia y nombra qué sigue sin saberse (quién fue el dueño).

**Motor:** 5 pasos (`pregunta`, `fuente`, `testimonio`, `explicar`, `revisar`) — el mismo patrón de "observación
vs. inferencia" que pide `docs/research/sociedad-investigacion.md` §8 (Library of Congress).
**Arte nueva necesaria: 1 imagen** (`cuadernoViejo`) — ver pedido de imágenes.

## 4.º — S4-U03 "Un edificio y las voces que le faltan" (CA HSS 4.2)

Inés y Teo ven una misión de California *reconstruida* (ilustración original, no una fotografía real). El
edificio solo, por sí mismo, no explica la experiencia de las familias indígenas que vivían y trabajaban ahí —
hace falta otra fuente (un relato cuidadoso sobre su persistencia cultural) para empezar a entenderlo.

**Tratamiento cuidadoso (docs/research §10, §16):** no se reclama ninguna fuente real (Smithsonian NMAI u
otra) — el "relato" es texto original, escrito con cuidado, centrado en la continuidad cultural indígena, no en
escenas de coerción. Nunca se le asigna al niño un papel de misionero ni de persona sometida a trabajo forzado
(regla explícita de la investigación). `standardsReview.confidence: "lowSensitiveTopic"` para que quede marcado
como tema que de verdad necesita revisión de un maestro antes de publicar (SO-08), más que las demás.
**Arte nueva necesaria: 1 imagen** (`edificioMision`, reconstrucción ilustrada, sin personas).

## 5.º — S5-U04 "Un ideal escrito y una realidad histórica" (CA HSS 5.5–5.7)

Un documento fundacional promete que "todas las personas nacen iguales"; al mismo tiempo, millones de personas
estaban esclavizadas y la mayoría de las mujeres no podía votar. Inés y Teo clasifican afirmaciones como "ideal
escrito" o "realidad histórica" y explican por qué un documento no describe automáticamente cómo vivía todo el
mundo.

**Tratamiento cuidadoso:** las dos citas son **paráfrasis propias**, no la transcripción oficial de ningún
documento — evita cualquier problema de precisión/derechos y mantiene el tono cuidadoso que pide la
investigación ("no hacer debates donde el niño deba defender la esclavitud"). `confidence: "lowSensitiveTopic"`.
**Arte nueva necesaria: ninguna** — las dos fuentes son de texto (`art: null`), a propósito, para no necesitar
ninguna imagen sensible.

## 6.º — S6-U02 "Un asentamiento junto al río" (CA HSS 6.2)

Simulación **expresamente ficticia** (no es Uruk ni ningún lugar real): tres lugares posibles para un
asentamiento junto a un río. El niño elige uno y justifica — las tres opciones son válidas, lo que importa es
el razonamiento, no "acertar" — y luego nombra qué no se puede saber con una simulación tan simple (p. ej. qué
tan buena era el agua para beber).

**Motor:** 4 pasos (`pregunta`, `elegir` ×2, `revisar`) — sin fuentes.
**Arte nueva necesaria: 1 imagen** (`asentamientoMapa`, mapa ilustrado con 3 lugares, ficticio).

## Estrellas del cierre en unidades sin fuentes (1.º y 6.º)

`investigationStars`/`evaluateSession` (en `packages/social-content/src/session.ts`) se generalizaron: en
unidades sin fuentes, la 2.ª y 3.ª estrella dependen de qué tan seguido el niño quedó con una opción preferida
entre los pasos `elegir`/`fuente`/`testimonio` (`choiceQuality`), en vez de "usó ≥2 fuentes" / "identificó el
hueco". Elegir una opción no preferida nunca bloquea seguir — solo cambia cuántas estrellas se ganan.

## Qué falta para que las 6 se vean terminadas

- Las 3 imágenes nuevas (`cuadernoViejo`, `edificioMision`, `asentamientoMapa`) — pedido en
  `docs/design/sociedad/PEDIDO-IMAGENES-GRADOS-1-2-4-6.md`. Mientras no lleguen, esos pasos se ven sin imagen
  (solo el texto y Teo) — no rompe nada, pero se ve incompleto.
- SO-08 para las 6, con atención extra a 4.º y 5.º (`confidence: "lowSensitiveTopic"`).
- Verificación visual en equipo real (igual que S3-U03, pendiente).
