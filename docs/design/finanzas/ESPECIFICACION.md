# Finanzas — «Mi dinero, mis decisiones» (cuaderno `finanzas`, primer módulo de «Para la vida»)

Especificación adaptada al repo a partir de `docs/research/vida-01-economia-finanzas.md` (el manual que entregó Victor: 48 lecciones, 12 talleres de
inversión, 6 proyectos y 6 experiencias «sandbox») y de `docs/research/vida-8-modulos.md` (propuesta V1). D14: **cada módulo de «Para la vida» es un cuaderno
separado**, con su módulo de app, su paquete de contenido (`packages/finance-content`) y su relevo (`docs/handoff/finanzas.md`, filas `FI-xx` del ROADMAP).
Las decisiones `DF-n` son **propuestas** hasta que Victor las confirme (docs/14).

## 1. Qué es y qué NO es
- Aprender a **decidir con recursos limitados**: prioridades, comparar, registrar, planificar, ajustar ante un imprevisto, detectar ofertas engañosas.
  Más funciones ejecutivas y hábitos que «hacer cuentas» (marco CFPB que cita el manual).
- **Todo es dinero ficticio:** «UM» (unidades monetarias). Sin dinero real, sin cuentas, sin productos bancarios ni marcas, sin pedir datos de la familia.
  Las UM **nunca** se mezclan con las estrellas o recompensas de Kitewise (D5, D11).
- Equidad y sin vergüenza: no se presupone mesada, cuenta bancaria ni empleo familiar; tener poco no es falta de esfuerzo; un imprevisto no es culpa del niño.
- **No es asesoría financiera.** La ruta de inversión (I01–I12) y el sandbox «Laboratorio de inversión» quedan FUERA de la v1 hasta una revisión de contenido y legal (docs/12).
- No premia el que termina con más «riqueza»: dos planes válidos se comparan por lo que protegen, no por el saldo.

## 2. Estructura (del manual)
6 grados × 8 lecciones (F1.1–F6.8, la 8.ª es el proyecto) + talleres I01–I12 + sandbox S01–S06. Dificultad según el dominio real del niño (nivel ≠ grado, como DC-1).
Una unidad de la app = un grado (o un bloque de seis encuentros de un grado), como en Ciencia/Sociedad.

## 3. Unidad piloto — F4-U01 «Un evento que resiste cambios» (4.º; el grado de Noah)
Seis encuentros (todo abre, en cualquier orden; el proyecto va mejor al final). Cada uno: ejemplo resuelto → «inténtalo» manipulando → explicar la decisión con marcos de frase.
| # | Lección del manual | Qué se manipula | Evidencia | Motor (`packages/finance-content`) |
|---|---|---|---|---|
| 1 | F4.1 Prioridades con contexto | Mismo escenario con condiciones que cambian (¿hay otra protección? ¿bajo techo?) | Cambia la decisión cuando cambia la condición y lo explica | `plan` (sobres), claves de condición |
| 2 | F4.2 Comparar alternativas de verdad | Tarjetas de talleres con precio; separar «no cabe» de «cabe pero lo dejé» | Nombra la mejor alternativa VIABLE descartada; sabe que las UM que sobran no desaparecen | `opportunity.ts` |
| 3 | F4.3 Un registro en orden | Libro de movimientos que se completa y se corrige | Reconstruye el saldo; ve si había dinero al pagar; dice si el saldo anotado queda arriba o abajo si falta una compra | `ledger.ts` |
| 4 | F4.4 Una reserva para imprevistos | Sobres vivos: se guarda un plan y DESPUÉS aparece un imprevisto | Usa la reserva, actualiza el saldo, decide si reconstruirla; si falta, elige un ajuste sin culparse | `plan.ts` (`payUnexpected`, `freeable`) |
| 5 | F4.7 Una oferta sospechosa | Buzón FICTICIO con 3–4 mensajes | Marca señales (urgencia, secreto, pago previo, pide código/datos, demasiado bueno) y elige una acción segura; «pedir ayuda» siempre es válido | `offers.ts` |
| 6 | F4.8 Proyecto: un evento que resiste cambios | 100 UM: esenciales 45 y 20, decoración 15, reserva 20; llega un gasto necesario de 25 | Plan inicial, plan revisado y explicación de lo que protege y lo que cambia; comparar dos planes válidos | `plan.ts` (`isValidPlan`, `protects`) |
**Estrellas por esfuerzo (D11):** ★ terminó un encuentro de práctica con ayuda si la pidió, ★ **ajustó su plan** ante el imprevisto (en vez de rendirse), ★ **explicó** una decisión. Nunca por tener más dinero ni por rapidez.

## 4. Reglas de interacción
- Estructurado (como DC-8): tocar, arrastrar fichas/sobres, elegir marcos de frase. Sin escribir libre en la v1; sin voz.
- Retroalimentación que enseña, nunca «incorrecto»: claves → textos ES/EN en `ui-core/src/finanzas/` (una pista, otra oportunidad, y qué faltó).
- Reparar siempre es posible: un plan se ajusta, un registro se corrige, una simulación se repite.
- Pausar y pedir ayuda: botón «Quiero ayuda de un adulto» disponible en toda la unidad. Las actividades fuera de pantalla son opcionales (transferencia de 4.º).
- Modo Enfoque: se leen apoyos (D4), un sobre/paso a la vez; sin cronómetro.
- Precios y condiciones siempre etiquetados «para aprender, no son precios reales».

## 5. Decisiones propuestas (DF-n; las confirma Victor)
- **DF-1** Cuaderno propio `finanzas` (D14), en una fila nueva «Para la vida» de la estantería; la moneda de los ejercicios son las UM, separadas de las estrellas.
- **DF-2** Piloto: **4.º F4-U01** (grado de Noah). Después 3.º (presupuesto y precio por unidad), 2.º (cambio y comparar) y 1.º, luego 5.º y 6.º.
- **DF-3** Nivel ≠ grado: todo abre; lo sugerido se destaca.
- **DF-4** Sin ruta de inversión en la v1; el módulo no menciona productos, marcas ni rendimientos reales.
- **DF-5** ES primero (el manual está en ES); EN con el glosario del manual como base, revisado por una persona.
- **DF-6** Estrellas por esfuerzo: terminó, ajustó el plan, explicó (D11).
- **DF-7** v1 estructurada: sin escritura libre ni voz.
- **DF-8** Equidad: ningún escenario supone mesada, cuenta ni empleo familiar; los imprevistos no se atribuyen a falta de disciplina.

## 6. Arte (por tandas; Victor genera, el prompt se muestra en el chat)
Lo que se dibuja en código (sin imagen): fichas de UM, sobres, libro de movimientos, tarjetas, buzón y botones. Lo que se pide como imagen (pocas): portada del
cuaderno, ilustraciones de escena del evento y de los talleres, y la guía de Finanzas. Lista y prompts: `docs/design/finanzas/PEDIDO-IMAGENES.md` (al confirmar DF-1…DF-8).

## 7. Orden de trabajo (docs/14)
1. Investigación ✅ (Victor). 2. Esta especificación ✅. 3. Lista de imágenes (siguiente). 4. **Dominio puro y probado** ✅ para el piloto
(`packages/finance-content`: dinero, libro, sobres, costo de oportunidad, ofertas; 21 pruebas). 5. Unidad en JSON validado + textos ES/EN + pantallas
(`apps/mobile/src/subjects/finanzas/`). 6. Verificar en 4 tamaños. 7. Revisión de un educador financiero.
