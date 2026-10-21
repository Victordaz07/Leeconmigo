# Kitewise: investigación para un cuaderno de Arte y música con profundidad

**Para Victor. Consulta de fuentes: 21 de octubre de 2026.**

Base del producto: descripción facilitada por Victor y `GUIA_ARTE_IDENTIDAD_VISUAL.md`, versión 1 del 15-oct-2026. No se ha inspeccionado una compilación actual de Kitewise ni medido su Samsung. Los tiempos y presupuestos de rendimiento de este informe son propuestas, no resultados de pruebas.

## Resumen ejecutivo

1. Convertir los tres talleres en una **mesa de creación**: obra grande, pocas herramientas visibles y ayuda contextual.
2. Dar materialidad con papel, bordes rasgados, sombras discretas y tres trazos realmente distintos, sin depender de Skia.
3. Construir **Mi museo**, una galería privada que permita continuar, duplicar y comparar versiones.
4. Sustituir parte de las tarjetas por **observar → probar → decidir → crear → revisar**, con obras auténticas y preguntas abiertas.
5. Usar sonido y movimiento para explicar acciones; ofrecer Enfoque, reducir movimiento y silencio desde el principio.
6. Primera entrega: textura, bandeja de materiales, mejor selección, guardado claro y una miniatura de lo creado.
7. Después: galería editable, collage material, simetría y silencios visibles. Flipbook al final.
8. El salto principal debe sentirse también con sonidos y animaciones apagados.

## Cómo interpretar la evidencia

- **[D] Documentado:** función, dato, licencia o capacidad que aparece en una fuente primaria. Una descripción comercial no demuestra eficacia educativa.
- **[I] Investigación:** estudio empírico o síntesis académica; se indican sus límites al trasladarlo a Kitewise.
- **[E] Criterio experto:** orientación de educadores, museos o especialistas; no equivale a un ensayo experimental.
- **[P] Propuesta propia:** diseño sugerido para este producto, pendiente de probar con niños y con el dispositivo real.

Las estimaciones S/M/L son [P]: **S = una tarde de 2–4 h**, sobre una base que ya funciona; **M = aproximadamente 2–5 días de trabajo concentrado**; **L = 1–3 semanas o más**. Incluyen integración y una comprobación básica, pero no todo el proceso de revisión pedagógica, licencias y prueba en tres plataformas. No sumar todas las filas S como si cupieran en una tarde.

## 1. Lo que cambia al leer tu guía visual

La guía ya contiene una identidad aprovechable: gouache, lápiz, papel, crema `#F7EFE1`, tinta cálida `#3B2A20`, ocre, terracota, salvia y azul polvoso. Conviene evolucionarla, no sustituirla por un paquete de pegatinas de otra app.

**Ajustes [P] de mayor valor:**

1. **Dos bloques de estilo:** uno narrativo para escenas/personajes y otro material para texturas, recortes y marcos. Pedir luz dorada, perspectiva 3/4 y viñeta crema en una textura repetible genera manchas de luz y costuras.
2. **Personajes de interfaz y representación de artistas separados:** las herramientas pueden ser juguetonas; las obras históricas deben conservarse como reproducciones auténticas, sin repintarlas con IA para que combinen.
3. **Material rico, controles claros:** papel y cartón en la mesa; superficies limpias detrás del texto. No convertir todos los botones en ilustraciones.
4. **No congelar toda la app en proporciones de cuatro cabezas:** reservar el lenguaje de cuento para acompañamiento opcional. En 5.º–6.º, más cuaderno de artista, menos escenario infantil.
5. **Enfoque no es desenfocar toda la pantalla:** tu guía admite blur como atajo. Aquí es mejor retirar decoración y conservar nítidos la obra, el texto y los controles. Blur continuo añade costo y puede reducir legibilidad.
6. **No elegir un nuevo color de Arte sin revisar los tokens vigentes:** la guía no asigna ese color y varias materias ya existen. Mantener el color de producción si está establecido y añadir materialidad dentro del taller.

**Contraste calculado [D, cálculo propio con fórmula WCAG]:** tinta sobre crema ≈ **11,96:1**; blanco sobre ocre ≈ **2,25:1**; blanco sobre salvia ≈ **2,63:1**; tinta sobre ocre ≈ **6,07:1**; blanco sobre terracota ≈ **3,93:1**. Para texto normal, los tres ejemplos de blanco no llegan a 4,5:1. La textura y la transparencia pueden cambiar el resultado final. Usar tinta oscura en botones ocre/salvia y comprobar el estado real renderizado. [R12]

## 2. Referentes: qué estudiar y qué no copiar

No hay una clasificación objetiva de «mejor app». Esta selección se basa en funciones documentadas y material oficial. No he ejecutado ni cronometrado todas las versiones actuales; la columna de 30 segundos describe la secuencia de interacción que conviene estudiar o adaptar, no una medición de incorporación real.

| Referente y fuente | Qué permite estudiar durante los primeros 30 s | Qué llevar a Kitewise [P] | Qué dejar fuera |
|---|---|---|---|
| **Toca Boca / Toca Boca Jr** [D, R1] | Los objetos se presentan como cosas con las que actuar; crear historias y experimentar es parte de su propuesta. Jr se dirige a 2–6 años. | Tocar un instrumento produce una respuesta comprensible; mover papel cambia la composición inmediatamente. | Tiendas, compras, contenido de marca y apariencia preescolar como molde de sexto. No copiar personajes, sonidos ni assets. |
| **Tayasui Sketches / School** [D, R2] | Elegir una herramienta por su aspecto y por una muestra del trazo. La documentación muestra acuarela, mezcla, patrones y modo Zen. | Mostrar el resultado del pincel antes de elegirlo; esconder ajustes secundarios; tres familias de trazo al inicio. | Prometer todos los efectos profesionales en Android; paneles de docenas de pinceles; sincronización y suscripciones. La fuente localizada es School, no una edición independiente actual llamada «Sketches Kids». |
| **Pok Pok** [D, R3] | Exploración abierta, dibujo, secuenciador y respuestas suaves. La baja estimulación es una intención declarada por su creador. | Reacción ligada a la acción, sin ganadores ni urgencia; sonidos breves; libertad para salir y regresar. | Afirmar que una estética concreta calma a todos los niños; trasladar sin adaptación su enfoque de 2–8 años a 10–12. |
| **Chrome Music Lab / Song Maker** [D, R4] | Un gesto produce un patrón visible y escuchable; la cuadrícula es a la vez composición y representación. Google lo presenta sin necesidad de cuenta. | Escucha inmediata, columnas temporales claras y controles simples; una idea musical antes de leer teoría. | Micrófono, compartir por URL o dependencia de su web. No usarlo embebido como motor offline. |
| **Kid Pix** [D, R5] | Herramientas expresivas y ayuda accesible; el fabricante documenta recorte/redimensionado y presentaciones. Es una referencia histórica. | Sellos, variedad de marcas y posibilidad de deshacer una exploración atrevida. | La avalancha de sonidos, efectos destructivos y controles heredados de escritorio. No presentarlo como una app Android actual. |
| **Procreate Pocket** [D, R6] | Documento propio, trazo de calidad y galería; su manual explica pinceles por forma y grano. | Separar la obra de su miniatura; duplicar una versión; usar una punta y una textura como conceptos distintos. | La complejidad del Brush Studio y los gestos invisibles como único acceso. Pocket es referente de iPhone, no solución para Samsung. |
| **Paper** [D, R7] | Páginas organizadas en cuadernos con portadas reconocibles y collage sin presentar toda la complejidad de capas. | Carpeta tangible, continuidad entre sesiones y agrupación por proyecto. | Sincronización, importación de fotos y dependencia de gestos sin alternativa visible. La ficha actual se titula Paper: Sketch, Draw & Create; la marca histórica «by WeTransfer» no debe darse por inmutable. |
| **Sago Mini World** [D, R8] | Juego de construir y fingir, con objetos y personajes familiares. El sitio lo sitúa principalmente en edades preescolares. | Consecuencias divertidas y objetos legibles; una acción puede tener varias salidas interesantes. | Diseñar todos los grados como preescolar; trasladar el sistema comercial del catálogo. |
| **Drawing Desk, de 4Axis** [D, R9] | Ofrece herramientas y perfiles diferenciados para niños/adultos; combina práctica y stickers. | Complejidad progresiva y muestras de herramientas. Verificar editor: existen productos con nombres parecidos. | Concursos, premios, copias de personajes licenciados, «ofertas» y enseñanza basada solo en imitar un dibujo. |
| **Khan Academy Kids** [D, R10] | Acompañamiento consistente y actividades con instrucciones cortas para 2–8 años. | Ayuda disponible y predecible, con una sola instrucción a la vez. | Su apariencia temprana para sexto y cualquier flujo de cuenta/datos. Sus resultados de alfabetización no prueban eficacia para enseñar arte. |
| **Stop Motion Studio** [D, R11] | Escena grande arriba, secuencia de fotogramas abajo y reproducción para comprobar cambios. | Duplicar un cuadro, mover un recorte y reproducir; transparencia del cuadro anterior. | Cámara, grabación de voz, importaciones y publicación social. En Kitewise sería animación de dibujos/recortes, no captura de stop-motion físico. |

### Tres capturas oficiales descritas, realmente inspeccionadas

**A. Tayasui Sketches, imagen “Sketches-ipad-iphone-tips.png” de su web.** En la tablet se ve una obra casi a pantalla completa, una banda vertical con siluetas de herramientas a la izquierda y un panel blanco que enseña distintas marcas del marcador. La versión de teléfono desplaza la selección hacia una bandeja inferior. Lo valioso es la vista previa del trazo y el predominio de la obra. No hace falta copiar su cantidad de herramientas. [R2]

**B. Stop Motion Studio, imagen “stopmotion_movieeditor.png” de su web.** Una escena de un camaleón morado ocupa casi toda la tablet; abajo hay miniaturas que forman una secuencia. En el teléfono la secuencia conserva su posición inferior. La separación entre «escena» y «tiempo» es el patrón útil. Los iconos de cámara y micrófono de esa captura quedan fuera de Kitewise. [R11]

**C. Google, ilustración oficial del anuncio de Song Maker del 1-mar-2018.** En una cuadrícula de líneas azules tenues, celdas coloreadas forman tres figuras. La misma superficie sirve para hacer una imagen y representar notas. Es una imagen promocional de 2018, no una captura auditada de la interfaz actual. Inspiración: que el patrón musical sea visible; precaución: su código cromático necesita formas/estados adicionales. [R4, R12]

Las imágenes se inspeccionaron para esta investigación; no se redistribuyen como assets de Kitewise.

## 3. Qué respalda la investigación y qué sigue siendo una hipótesis

| Hallazgo | Tipo y límites | Consecuencia para Kitewise [P] |
|---|---|---|
| Hirsh-Pasek y colaboradores proponen aprendizaje activo, implicado, significativo y social dentro de una meta de aprendizaje. [R13] | [I] Síntesis de ciencia del aprendizaje, no ensayo sobre estos talleres ni prueba de que tocar más enseña más. | Una acción debe ayudar a escuchar, observar o tomar una decisión. El diálogo familiar puede ser presencial y no exige cuentas. |
| Project Zero describe ocho hábitos de estudio artístico: oficio, persistencia, imaginar, expresar, observar, reflexionar, explorar y comprender mundos del arte. [R14] | [E/I] Marco construido desde investigación de enseñanza artística; no algoritmo de calificación. Hay adaptación específica K–8. | Añadir observación de una obra, experimentación, decisión propia y reflexión. No ocho botones ni una puntuación por hábito. |
| NAEYC recomienda experiencias abiertas, materiales diversos y comentarios sobre lo observado. [R15] | [E] Orientación centrada en preescolar; útil para pequeños, insuficiente por sí sola para sexto. | Preguntar qué cambia o qué quiere expresar el niño, sin exigir una copia idéntica. |
| Fisher, Godwin y Seltman encontraron más distracción y menores ganancias en un aula de laboratorio muy decorada. [R16] | [I] Niños de kindergarten, seis lecciones de ciencias; no tablet, TDAH ni prueba de que toda decoración sea dañina. | Mantener la riqueza en el material que se manipula y reducir decoración ajena a la tarea. Validar el resultado en esta app. |
| NNG observa diferencias de habilidades y expectativas a distintas edades, y recomienda métodos de prueba adaptados a menores. [R17] | [E] Investigación aplicada de usabilidad, no ensayo curricular. | Ofrecer controles predecibles y probar con edades separadas. No asumir que un único diseño infantil sirve a 6 y 12 años. |
| Los estudios sobre Dyslexie y OpenDyslexic no justifican prometer una mejora universal por instalar una fuente especial. [R18] | [I] Estudios concretos con sus muestras y tareas. | Dar control sobre tamaño y espaciado; reducir carga de lectura. La dislexia no se resuelve con una tipografía. |

**Lo que no quedó establecido:** no localicé evidencia directa suficiente para afirmar que un rebote de 180 ms, sonidos de burbujas, un personaje parlante o vibración mejoren el aprendizaje artístico de niños de 6–12 años. Son decisiones de diseño [P], que pueden facilitar una acción o distraer. Tampoco hay una cifra universal de pinceles visibles, de duración ideal de encuentro o de saturación adecuada para todos los niños con TDAH.

## 4. Ideas ordenadas por impacto y viabilidad

Orden dentro de cada grupo: mayor valor probable primero. Todo el diseño concreto es [P]; la columna de fundamento distingue su base.

### Victorias rápidas: elegir una o dos por tarde

| Idea | Qué ve y hace el niño | Por qué / fuente | Esfuerzo | Necesidades técnicas | Riesgos | Aplica |
|---|---|---|---|---|---|---|
| **Q1. Papel y borde real** | Dibuja sobre papel ligeramente granulado, con margen claro. | [D] SVG admite imagen y recorte; [P] materialidad coherente con tu guía. [R19] | S | Una textura local; capa visual sin capturar toques. | Poco contraste o textura dominante. | Pintura/collage. |
| **Q2. Bandeja con muestras** | Ve tres trazos y seis papeles; abre el resto si quiere. | [D] Tayasui muestra preview; [P] revelación progresiva. [R2] | S | Reordenar herramientas existentes; icono + etiqueta. | Ocultar funciones esenciales. | Tres talleres. |
| **Q3. Selección clara** | La pieza activa tiene contorno y asas grandes; puede tocar y colocar. | [E] Accesibilidad de arrastre y objetivos táctiles. [R12] | S | Estado seleccionado; hitSlop sin solapamientos; borde doble. | Confundir marco de selección con parte de la obra. | Collage. |
| **Q4. Muestra al tocar** | Prueba brevemente un sonido o ve la marca del pincel elegido. | [D] Referentes ofrecen feedback ligado a herramientas. [R2–4] | S | Reutilizar motor actual; controlar volumen y repetición. | Sonido inoportuno o retrasado. | Ritmo/pintura. |
| **Q5. Vacío legible** | Celda vacía con borde y posición visible; al reproducir comprende cuándo hay pausa. | [D] Secuenciación visual; [P] pausa como decisión. [R4] | S | Contorno, playhead discreto, etiqueta accesible. | Identificar silencio como «falta por completar». | Banda. |
| **Q6. Guardado honesto** | Aparece su miniatura y «Guardado en este dispositivo» después de guardar. | [E] Documentar proceso y ver el resultado. [R15] | S* | Reutilizar persistencia/miniatura ya existentes. | Confirmar antes de que termine la escritura. | Todos. |
| **Q7. Movimiento tranquilo** | Al soltar, la pieza se asienta una vez; en reducir movimiento cambia directamente. | [E] W3C permite desactivar movimiento no esencial. [R12] | S | Transform/opacity; preferencias combinadas. | Rebote, mareo, vibración repetida. | Todos. |
| **Q8. Consigna junto a la obra** | Una frase, ayuda opcional y un ejemplo; puede empezar sin una cadena de tarjetas. | [I/E] Actividad significativa y proceso abierto. [R13, R15] | S por encuentro | Reutilizar el taller, conservar estado del encuentro. | Una tarde no alcanza para convertir 18 encuentros. | Unidades. |

*Q6 solo es S si el guardado y la miniatura existen. Si hay que crear modelo de proyecto, recuperación y render de miniatura, es M.*

### Apuestas medianas

| Idea | Qué ve y hace el niño | Por qué / fuente | Esfuerzo | Necesidades técnicas | Riesgos | Aplica |
|---|---|---|---|---|---|---|
| **M1. Mi museo editable** | Abre sus obras, continúa o duplica para probar otra idea. | [D] Galerías/cuadernos en Procreate y Paper; [E] documentación del proceso. [R6–7, R15] | M | Archivo de proyecto + miniatura + índice local. | Pérdida de datos, crecimiento de disco. | Todos. |
| **M2. Recortes materiales** | Arrastra papel rasgado, kraft o translúcido; el borde y sombra permanecen al girar. | [E] Exploración material; [D] SVG ClipPath/Image. [R15, R19] | M | Paths deterministas; textura recortada; sombra por pieza. | Demasiados nodos o filtros. | Historia de recortes. |
| **M3. Tres pinceles distintos** | Marcador opaco, crayón quebrado y lavado translúcido. | [D] Referentes distinguen forma/grano; [P] tres conductas suficientes para probar. [R2, R6] | M | Render activo aislado, path suavizado, grano sencillo. | Cambiar solo el icono sin cambiar el trazo. | Colores. |
| **M4. Simetría y duplicar** | Activa espejo; duplica un papel o motivo y descubre variaciones. | [D] Herramientas documentadas; [E] explorar y revisar. [R2, R14] | M | Transformación de coordenadas y comandos reversibles. | Deshacer una sola mitad; imponer simetría. | Pintura/collage. |
| **M5. Mirar una obra real** | Amplía un detalle y elige qué quiere explorar después. | [E] Observar y comprender mundos del arte. [R14, R24–33] | M | Reproducción empaquetada, créditos, texto ES/EN. | Licencia o contexto inadecuado. | Tres unidades. |
| **M6. Guía contextual** | Una guía ofrece ayuda al tocarla; no habla sin parar. | [E] Andamiaje y autonomía; no eficacia demostrada del personaje. [R13–15] | M | Poses propias, frases breves y opcionales; locución local si se produce. | Infantilizar, ocupar lienzo, elogiar automáticamente. | Todos. |
| **M7. Ensayo A/B musical** | Duplica patrón, quita dos eventos y escucha la diferencia. | [P] Aplica reflexión y exploración a un motor que ya existe. [R14] | M | Dos patrones, solo/silencio por fila, reloj estable. | Cambiar tempo al comparar o introducir desfase. | Banda. |
| **M8. Exposición de proceso** | Elige una versión anterior y una actual, y escribe o selecciona qué cambió. | [E] Documentación y reflexión. [R14–15] | M | Snapshots con límite visible; restaurar como copia. | Confundir versión anterior con «peor». | Todos. |

### Apuestas grandes: solo después del museo y del rendimiento

| Idea | Qué ve y hace el niño | Por qué / fuente | Esfuerzo | Necesidades técnicas | Riesgos | Aplica |
|---|---|---|---|---|---|---|
| **L1. Flipbook de recortes** | Duplica cuadro, mueve una pieza, reproduce 6–12 cuadros. | [D] Timeline y onion skin de Stop Motion Studio. [R11] | L | Estado por cuadro; thumbnails; reloj; papel cebolla opcional. | RAM, pérdida de versiones, navegación compleja. | Collage + ritmo. |
| **L2. Relleno de regiones** | Toca una zona cerrada de su propio dibujo para llenarla. | [P] Reduce trabajo repetitivo, pero añade poca profundidad por sí solo. | L | Flood fill raster o geometría de regiones; tolerancia a huecos. | Fugas, bloqueo JS, falsa promesa de «es fácil en SVG». | Pintura. |
| **L3. Recorte libre editable** | Dibuja un contorno, lo ajusta y convierte en papel. | [E] Expresión material; [P] mayor libertad. [R15] | L | Simplificación de curvas, cierre y edición accesible. | Trazos autointersectados y precisión fina. | Collage. |
| **L4. Color físico avanzado** | Explora mezclas plausibles de pigmentos y superposición. | [D] Luz y pigmento son modelos diferentes. [R23] | L | Modelo definido de mezcla y pruebas; no solo promedio RGB. | Enseñar como física una aproximación arbitraria. | Colores. |
| **L5. Colaboraciones culturales** | Conoce a una persona creadora actual y responde a una invitación autorizada. | [E] Contexto y autoridad cultural. [R34–35] | L | Relación, remuneración, derechos y revisión ES/EN. | Tratar una comunidad como estética de stickers. | Futuras unidades. |

## 5. Plan por etapas y condiciones para avanzar

**Etapa 0 — base recuperable.** Confirmar deshacer/rehacer, guardado, reapertura, Enfoque y tamaños táctiles. Crear una obra de prueba larga en Samsung y comprobar que el estado sobreviva a cerrar y reabrir la app. No aumentar complejidad antes de recuperar el trabajo con fiabilidad.

**Etapa 1 — materialidad y claridad, 2–3 tardes [P].** Q1, Q2 y Q3; después Q5 y una respuesta discreta al soltar. Aplicar a un solo taller antes de extender. Criterio: al apagar efectos, sigue siendo claro qué se puede tocar y qué está seleccionado.

**Etapa 2 — propiedad y continuidad, aproximadamente una semana [P].** Museo editable, duplicado y guardado claro. Criterio: un niño puede crear, salir, reconocer y continuar su proyecto sin ayuda.

**Etapa 3 — profundidad, 1–2 semanas [P].** Una obra auténtica por unidad al inicio; tres pinceles, dos papeles y comparación musical A/B. Transformar encuentros gradualmente. Criterio: el niño puede mostrar una decisión expresiva y cómo cambia el resultado, sin buscar una respuesta del adulto.

**Etapa 4 — ampliar, por entregas independientes [P].** Flipbook, recorte libre o mezcla avanzada. Elegir una, no tres. Cada una debe demostrar valor con pocos niños y no degradar el taller básico.

## 6. Cómo construir materialidad sin repetir el problema de Skia

### Tres capas de representación

**A. Assets prehechos:** papel, kraft, cartón, una tela y bordes especiales. Producir imágenes locales; separar la sombra cuando deba cambiar al levantar la pieza. Un fondo de madera debe ser discreto y estar fuera del área central de dibujo. Evitar mesas ilustradas en perspectiva debajo de piezas que el niño manipula en vista cenital.

**B. Geometría editable:** trazos, recortes, transformaciones y selección con `react-native-svg`. SVG documenta `Path`, `ClipPath`, `Image`, máscaras y patrones; es una base disponible, no una garantía de rendimiento ilimitado. Probar la combinación elegida en la versión instalada. No basar la primera entrega en filtros complejos, desenfoque por pieza o sombras dinámicas de cientos de objetos. [D, R19]

**C. Microinteracción:** animar posición, escala y opacidad del contenedor, sin recalcular la forma en cada frame. React Native documenta la diferencia entre carga JS y UI; medir una compilación de producción, no inferir rendimiento a partir del simulador. Si ya se usa Reanimated/Gesture Handler, reutilizar sus versiones compatibles; no añadirlos solo para mover un botón. [D/P, R20]

### Receta de collage [P]

Guardar por pieza: `id`, `shapePath`, `materialId`, `textureSeed`, posición, escala, giro y orden. El borde irregular se genera una vez y se conserva. Cambiarlo durante el arrastre produce parpadeo y una falsa sensación de material que se deshace.

Para un recorte simple: textura dentro de un clip; debajo, una copia oscura del contorno desplazada 1–3 unidades de diseño. Es una sombra aproximada, no un blur físicamente realista. Para PNG/WebP recortado con borde propio: sombra horneada si no se necesita levantarlo; sombra independiente si sí. Evitar sombra rectangular alrededor de una hoja transparente.

Un kit inicial suficiente: papel liso coloreado, kraft, papel de fibras y translúcido. Seis formas existentes × tres bordes ya ofrecen variedad sin producir cientos de pegatinas figurativas.

### Pinceles [P]

- **Marcador:** path opaco, extremos redondeados; conducta estable con dedo.
- **Crayón:** silueta con irregularidad determinista y textura recortada; empezar con una variante sencilla. Muchos stamps a lo largo del trazo pueden multiplicar nodos: medir antes de llamarlo barato.
- **Lavado translúcido:** opacidad moderada y dos variaciones del trazo. Etiquetarlo «lavado» o «pincel suave», no «acuarela física» si no simula difusión y pigmento. Las superposiciones pueden producir bandas; revisar.
- **Tiza:** incorporación posterior, especialmente para fondo oscuro; no es prioritaria frente a guardar y revisar.

Una textura global de papel da soporte; no convierte por sí sola una línea lisa en crayón. Tampoco hace falta un motor profesional para que tres herramientas se distingan honestamente.

### Presupuestos de prueba, no promesas [P]

Probar 30 piezas con textura, 200 trazos y 12 cuadros sencillos como escenarios de estrés iniciales; ajustar al dispositivo real. Una imagen RGBA de 1024 × 1024 requiere aproximadamente 4 MiB sin comprimir: el peso pequeño de un WebP en disco no equivale a bajo consumo de memoria.

Mantener el trazo activo separado de los ya terminados, simplificar puntos al terminar, agrupar geometría repetida y limitar las imágenes simultáneas. Medir fluidez, retraso al tocar, memoria y guardado. No cambiar el motor completo para conseguir una textura. Sin registros del cierre de Skia no puede determinarse si fue versión, GPU, memoria u otra causa; el incidente no demuestra incompatibilidad de todas las Samsung.

### Sonido y reloj

Conservar el motor musical que ya funciona mientras se mejora su interfaz. Para foley y locuciones locales, `expo-audio` ofrece reproducción. No asumir que llamadas repetidas desde un temporizador JS aportan precisión musical. Si el reloj actual deriva, tratarlo como problema independiente antes de ampliar pistas. Un motor nativo con programación precisa sería una apuesta aparte. [D/P, R21]

**Hallazgo importante [D]:** la documentación actual de Expo indica que el muestreo de audio para análisis/visualización requiere `RECORD_AUDIO` en Android. Aquí conviene visualizar eventos del secuenciador o una envolvente calculada previamente, sin ese muestreo. Si el paquete se configura para reproducción únicamente, revisar opciones como `recordAudioAndroid: false` y `microphonePermission: false` contra la versión instalada. No habilitar grabación ni pedir ese permiso desde Arte. Si otra materia ya usa micrófono, la revisión debe ser por flujo y módulo, no borrar a ciegas sus permisos globales. [R21]

## 7. Jugo que informa, sin sobreestimular

Todos estos valores son propuestas de prototipo, no umbrales científicos.

| Acción | Respuesta normal [P] | Enfoque / reducir movimiento / sonido apagado |
|---|---|---|
| Elegir papel | Contorno, nombre y muestra; un roce opcional. | Misma información visual; sin voz automática. |
| Levantar recorte | Escala aproximada 1,02 y sombra algo mayor. | Sin cambio de escala; contorno estable. |
| Soltar | Asentarse en 120–180 ms; un roce breve. | Colocación directa; sin rebote ni partículas. |
| Encajar | Línea de alineación temporal; imán opcional desactivable. | Misma línea; sin vibración. No mover la pieza lejos de la intención. |
| Mezclar gotas | El resultado aparece y puede guardarse en una muestra. | Cambio directo. No esperar una animación para seguir. |
| Reproducir ritmo | Playhead discreto y estado activo por fila. | Resaltado estático por columna; sin personajes saltando. |
| Guardar | Miniatura actualizada y confirmación después de escribir. | Igual confirmación sin vuelo del papel hacia una estantería. |
| Pasar de encuentro | Cambio breve de superficie o desvanecimiento. | Cambio directo; misma ubicación de controles. |

Haptics: `expo-haptics` permite feedback nativo; el hardware varía y no todas las tablets responderán. Aplicar, como máximo inicial, al terminar un gesto importante, no a cada pulso ni a cada punto del trazo. En Android, la documentación recomienda `performAndroidHapticsAsync` para ese tipo de respuesta cuando está disponible en la versión instalada. Su ausencia no debe ocultar información. [D/P, R22]

Controles independientes: efectos sonoros, música creada, vibración y movimiento decorativo. «Silenciar efectos» no debería silenciar por sorpresa la composición del niño. Reducir movimiento del sistema prevalece sobre una animación decorativa activada en la app. No equiparar Enfoque con una etiqueta diagnóstica ni activarlo automáticamente por edad. [R12, R20]

Foley: producir fuera de la app 4–6 sonidos propios de papel, selección, soltar y guardar. Guardarlos localmente; jamás grabar al niño para obtenerlos. Variación discreta, volumen relativo bajo y límite de frecuencia para no disparar sonidos superpuestos durante un arrastre. No añadir música ambiental encima del taller de ritmo.

## 8. Más herramientas con menos interfaz

| Taller | Primero | Después | Posponer |
|---|---|---|---|
| Pintura | Tres conductas de trazo; muestra de color guardada; cuentagotas sobre la obra; simetría opcional. | Sellos de marcas abstractas, stencil propio y cambio de papel. | Relleno libre, simulación húmeda y decenas de sliders. |
| Collage | Papel material; duplicar; voltear; delante/detrás con dos acciones claras. | Corte por un path sencillo; patrones; rasgado por presets. | Lazo complejo, booleanas, edición de cientos de puntos. |
| Ritmo | Audición, solo/silencio, borrado reversible y comparación A/B. | Duplicar un compás; intensidad sencilla si el motor la soporta; forma A–B. | Más instrumentos como sustituto de composición; editor de síntesis; grabación. |
| Animación | Experimento posterior: 6–12 cuadros de recortes con duplicado y reproducción. | Cambiar duración y papel cebolla opcional. | Cámara, video HD y exportación multimedia profesional. |

**Para seis años:** una acción por vez, botones visibles, seis materiales iniciales y una bandeja «Más». No una rueda de herramientas escondida tras pulsación larga. Para mayores, abrir más opciones por elección del niño; no bloquearlas detrás de estrellas.

**La mezcla actual necesita una revisión conceptual:** rojo/amarillo/azul es una paleta artística tradicional, no la única base universal del color. RGB describe luz; CMY es útil para explicar tintas/pigmentos ideales, y los pigmentos reales tampoco se comportan como una simple media de tres canales. Mantener RYB es defendible si se presenta como «los colores de este taller», no «los tres únicos primarios». Una primera mejora es una tabla de mezclas coherente y documentada; no prometer realismo físico. [D/P, R23]

## 9. Guía, historia y profundidad de los 18 encuentros

**Guía sugerida [P]: Ms. Rosa, provisionalmente.** Ya existe en la guía visual y su papel adulto puede servir tanto a pequeños como a mayores. Esto requiere confirmar que siga siendo parte del elenco vigente; no sustituir a Maya ni inventar otra niña casi idéntica. Alternativa económica: la cometa existente como señal de ayuda, sin cara ni voz permanente en el lienzo para mayores.

La guía no analiza con IA la obra del niño: todo funciona offline. Puede reconocer acciones reales —«guardaste dos versiones»— y formular preguntas. No puede afirmar «veo tristeza en tu pintura» ni deducir esfuerzo emocional a partir de tiempo, número de trazos o uso de deshacer.

| Evitar | Proponer ES / EN |
|---|---|
| «¡Eres un genio!» | «Probaste otra forma de hacerlo.» / “You tried another way.” |
| «Te quedó perfecto.» | «¿Qué parte quieres conservar?» / “Which part would you keep?” |
| «Ese color es incorrecto.» | «¿Qué cambia si lo pones junto al otro?» / “What changes next to the other color?” |
| «Te falta llenar esas casillas.» | «Ese espacio también se puede escuchar.» / “You can hear that space, too.” |
| «Haz tres versiones para ganar.» | «Puedes guardar esta idea y probar otra.» / “You can save this idea and try another.” |

Las estrellas existentes deben permanecer separadas de calidad estética, cantidad de pintura y rapidez. No convertirlas en moneda, llave de herramientas o incentivo para permanecer más tiempo. No asumir que «por esfuerzo» elimina automáticamente toda presión; comprobar cómo las interpreta el niño.

### Secuencia común [P]

Una misión plantea un problema expresivo; una obra o ejemplo breve ofrece algo que observar; el taller permite probar; el niño decide y puede revisar. El cierre muestra lo creado y una pregunta opcional. No exigir respuesta oral grabada, ni escribir un párrafo para poder salir.

### «Mi banda deja respirar al silencio» — 1.º

| Encuentro | Aprendizaje e interacción propuesta |
|---|---|
| 1. Escucha el espacio | Un patrón breve y su versión con pausas. El niño toca qué cambia; puede repetir sin nota. |
| 2. Mi primer motivo | Elige dos sonidos entre una selección pequeña y coloca eventos en ocho posiciones. |
| 3. La pausa decide | Duplica su patrón y quita eventos. Escucha ambas versiones al mismo tempo. |
| 4. Una respuesta | Una fila propone un motivo y otra responde dejando espacio. No imponer un único patrón. |
| 5. Nuestra forma | Une una parte A y una B si el motor admite duplicado; si no, alterna las dos versiones manualmente. |
| 6. Pequeña escucha | Guarda una composición y, opcionalmente, señala el momento que quiere que otro escuche. |

No exigir síncopa de ragtime a un niño de primero porque aparezca Joplin. Usar el fragmento elegido como escucha cultural y las tareas de ocho pulsos como exploración propia, claramente diferenciadas.

### «Colores que se relacionan» — 2.º

| Encuentro | Aprendizaje e interacción propuesta |
|---|---|
| 1. Vecinos | Poner la misma muestra junto a dos fondos y observar una diferencia de apariencia. |
| 2. Dos familias | Hacer dos paletas con intención distinta; evitar «azul siempre triste». |
| 3. Una mezcla propia | Guardar receta de gotas y nombre opcional; volver a producirla. |
| 4. Huella y soporte | Comparar marcador y lavado sobre el mismo papel; no atribuir al color un efecto del pincel. |
| 5. Obra con una decisión | Crear con una paleta elegida, pudiendo cambiarla; mirar una reproducción sin copiar su imagen. |
| 6. Otra posibilidad | Duplicar, cambiar una relación y comparar. Conservar ambas versiones sin jerarquía. |

### «Una historia de recortes» — 1.º

| Encuentro | Aprendizaje e interacción propuesta |
|---|---|
| 1. Una pieza puede ser muchas cosas | Convertir una forma existente en objeto, personaje o lugar. |
| 2. Delante y detrás | Cambiar orden de dos piezas y ver qué parece tapar a qué. |
| 3. Grande, pequeño, lejos | Transformar una pieza con controles táctiles alternativos al pellizco. |
| 4. El material cuenta | Probar kraft, papel suave y fibras; elegir uno por intención. |
| 5. Algo sucede | Construir dos escenas que sugieran un cambio; no convertirlo todavía en requisito de animación. |
| 6. Mi pequeña exposición | Elegir una obra o pareja de escenas y montar una página de museo privado. |

La profundidad viene de la decisión expresiva, la revisión y el contexto, no de una tarjeta de teoría antes de cada herramienta. Son propuestas de secuencia, todavía no una validación curricular completa.

## 10. Mi museo: orgullo sin red social

**Versión mínima [P]:** tres entradas permanentes —Crear, Continuar, Mi museo—. La galería muestra la obra del niño a mayor escala que el marco. Cada tarjeta: miniatura, título opcional, taller y «Continuar». Acciones secundarias: duplicar, cambiar marco y borrar con confirmación. Ningún contador de visitas, corazones, seguidores, ranking ni «obra de la semana» elegida por la app.

**Exposiciones:** el niño escoge 3–5 obras para «Azules que descubrí», «Recortes que cuentan» o un título propio. También puede no exponer nada. Marcos desbloqueados desde el inicio; no son premios por rendimiento.

**Versiones:** guardar proyecto editable y miniatura por separado. Duplicar conserva la primera obra. Restaurar una versión crea otra copia y no destruye la actual. Un historial local limitado y visible evita crecimiento indefinido; no borrar silenciosamente obras antiguas para liberar espacio. «Guardado» solo después de persistir; ante error mantener la obra abierta y ofrecer reintentar.

**Modelo local sugerido:** identificador aleatorio, versión del esquema, dimensiones lógicas, materiales y pinceles por ID/version, trazos o piezas, eventos musicales, semilla de textura, referencia de unidad y preferencias visuales. SQLite puede indexar proyectos; FileSystem puede guardar documentos y miniaturas. No usar una captura plana como único formato si se quiere continuar editando. [D/P, R36]

«Mostrar a mi familia» puede ser simplemente una presentación en el dispositivo. Exportación o transferencia de archivos sería una decisión posterior bajo control adulto. Sin cámara/micrófono tampoco hay que guardar explicaciones grabadas. Si se ofrecen títulos escritos, no pedir nombre completo ni otros datos personales.

## 11. Obras reales: selección y condiciones de uso

### Regla editorial

Una API pública no es permiso de imagen. «Uso educativo» no vuelve automáticamente libre una reproducción para una app comercial. Se verifican el archivo, la obra, su procedencia y la licencia por separado. La condición CC0 de algunos metadatos tampoco transforma toda imagen o texto curatorial en CC0. [D, R24, R28, R33]

En cada asset conservar: autor, título original, título de presentación ES/EN, fecha aproximada cuando corresponda, colección/número, URL de ficha, URL del archivo usado, licencia y URL, crédito, fecha de verificación, modificaciones y hash. Guardar una copia de la declaración de derechos consultada. Incluir todo offline y dejar enlaces externos, si se ofrecen, en adultos.

**Textos dentro de obras auténticas:** la regla de no generar letras es adecuada para interfaz/ilustración. Una partitura o una obra firmada puede contener texto original. No borrarlo ni sustituirlo para fingir que es una imagen bilingüe. Victor debe decidir si acepta ese contenido como documento cultural en una vista separada. Si la regla es absoluta, seleccionar obras sin esas inscripciones visibles o usar la referencia solo para el adulto; no falsear el original.

### «Mi banda deja respirar al silencio»: tres referencias

| Autor / obra y fuente | Derechos comprobados y límite | Uso propuesto para primero |
|---|---|---|
| **Scott Joplin, Maple Leaf Rag (1899)**. [LOC, partitura](https://www.loc.gov/item/ihas.200033265/) y [contexto de LOC](https://www.loc.gov/item/n50039880/scott-joplin-1868-1917/). | Composición y edición histórica de 1899 en dominio público en EE. UU.; no implica licencia de cualquier interpretación moderna. Acceso directo a algunas fichas LOC fue bloqueado durante esta consulta; la identificación también está corroborada por su material docente oficial de 2020 [R27]. | Un fragmento interpretado/producido por Kitewise, a partir de la edición histórica. Escuchar contraste y repetición; adaptación identificada, no «el audio original de Joplin». La partitura no es una actividad de lectura obligatoria. |
| **Edgar Degas, The Dancing Class, ca. 1870**. [Met, 436141](https://www.metmuseum.org/art/collection/search/436141). | Ficha individual: Public Domain; reproducción Open Access CC0 del Met. [R25] | Imaginar cuándo empieza o se detiene un movimiento. Es un puente entre danza y música, no evidencia de qué sonido exacto había ni una grabación histórica. |
| **Paul Klee, Persische Nachtigallen / Persian Nightingales, 1917**. [National Gallery of Art, 71551](https://www.nga.gov/artworks/71551-persische-nachtigallen-persian-nightingales). | Ficha: medios libres y en dominio público. No etiquetar automáticamente como CC0 si la ficha usa dominio público. [R26] | Inventar una respuesta sonora para un ave representada. Aclarar que la pintura es de Klee y no una representación documental autorizada de la música persa. Contiene inscripciones originales: su inclusión depende de la decisión editorial anterior. |

No se encontró una grabación moderna lista para empaquetar con todos sus derechos verificados dentro de esta selección. La alternativa realizable es producir el fragmento propio o licenciar expresamente una interpretación. No muestrear Spotify, YouTube ni previews de museos.

### «Colores que se relacionan»: tres obras y una ampliación

| Autor / obra y fuente | Derechos comprobados | Invitación de observación [P] |
|---|---|---|
| **Claude Monet, Water Lilies, 1906**. [AIC, 16568](https://www.artic.edu/artworks/16568/water-lilies). | Imagen de dominio público bajo la política CC0 de AIC. API individual consultada: `is_public_domain: true`. [R28] | Buscar dos colores cercanos y una marca que se distingue; crear relaciones propias, no rellenar una copia. |
| **Vincent van Gogh, The Bedroom, 1889**. [AIC, 28560](https://www.artic.edu/artworks/28560/the-bedroom). | Dominio público / imagen CC0; API individual: `is_public_domain: true`. [R29] | Comparar pared, cama y suelo. No afirmar que los colores digitales reproducen exactamente los originales históricos. |
| **Georges Seurat, A Sunday on La Grande Jatte — 1884, 1884–86; borde añadido 1888–89**. [AIC, 27992](https://www.artic.edu/artworks/27992/a-sunday-on-la-grande-jatte-1884). | Dominio público / imagen CC0; API individual: `is_public_domain: true`. [R30] | Mirar un detalle ampliado y luego alejarlo. Diferenciar marcas vecinas de mezclar gotas; no confundir mezcla óptica y pigmentaria. |
| **Ampliación: Katsushika Hokusai, Under the Wave off Kanagawa, ca. 1830–32**. [Met, 45434](https://www.metmuseum.org/art/collection/search/45434). | Ficha Public Domain; imagen CC0 del Met. [R31] | Comparar azules y blanco del papel; nombrar Japón y técnica de xilografía. No llamarla acuarela ni usarla como ejemplo de toda una cultura. Tiene escritura original. |

La ficha web de AIC dio 403 en algunas aperturas automatizadas; sus respuestas oficiales de API sí permitieron verificar título, fecha, autor, indicador de dominio público y `image_id` de las tres piezas. Esa comprobación no sustituye descargar y conservar el archivo exacto al integrarlo. Los textos curatoriales de su API pueden tener licencia CC BY distinta de los metadatos: escribir un texto infantil propio, no copiar el ensayo. [R28–30, R33]

### «Una historia de recortes»: tres propuestas iniciales y dos ampliaciones condicionadas

| Autor / obra y fuente | Derechos y límite | Invitación de observación [P] |
|---|---|---|
| **Mary Delany, Botanical Study, ca. 1772–82**. [Met, 360446](https://www.metmuseum.org/art/collection/search/360446). | Ficha Public Domain, imagen CC0. Es collage de papel, no pintura botánica. [R32] | Construir una planta inventada con tres piezas; distinguir «parece pintado» de «está hecho con papel». |
| **Philipp Otto Runge, Red Currant, finales del XVIII–principios del XIX**. [Met, 392333](https://www.metmuseum.org/art/collection/search/392333). | Ficha Public Domain, imagen CC0 del Met. Clasificación Cut Paper, técnica silhouette. [R32e] | Descubrir la figura y el espacio que queda alrededor; inventar una silueta sencilla sin copiar el recorte minucioso. |
| **Atribuido a The Hon. Booth Grey, Monarda didyma / Scarlet Lion’s Tail, ca. 1791 (?)**. [Met, 368383](https://www.metmuseum.org/art/collection/search/368383). | Ficha Public Domain, imagen CC0 del Met. Conservar atribución y fecha inciertas; mosaico de papel con color, no una autoría confirmada. [R32e] | Comparar papeles coloreados y su soporte oscuro; crear una flor imaginaria con piezas grandes. La etiqueta original no se convierte en texto de interfaz. |
| **Paul Klee, Temple Gardens, 1920**. [Met, ficha 484870](https://www.metmuseum.org/art/collection/search/484870); [archivo concreto en Commons](https://commons.wikimedia.org/wiki/File:Temple_Gardens,_1920_-_Paul_Klee,_MET_DT1372.jpg). | **Caso condicionado:** la ficha actual del Met no ofrece descarga; el archivo histórico de Commons consultado identifica donación del Met y CC0. Si se usa, documentar ese archivo/licencia concretos, no afirmar que hoy la ficha Met lo distribuye abierto. [R32b] | Explorar cómo cambia una composición al reordenar tres partes. El comentario del museo sobre su motivación es hipotético: no convertirlo en certeza biográfica. |
| **Harriet Powers, Bible Quilt, 1885–86**. [Smithsonian, nmah_556462](https://www.si.edu/object/1885-1886-harriet-powerss-bible-quilt%3Anmah_556462); [NMAH](https://americanhistory.si.edu/collections/nmah_556462). | La ficha indexada de Smithsonian muestra CC0 Usage Conditions. **Antes de empaquetar:** confirmar el asset exacto; la ficha completa falló al abrirse en esta sesión. Es aplicación textil, no collage de papel. [R32c] | Observar narración por paneles y formas aplicadas. Presentar autora afroamericana y contexto; contiene historias bíblicas, por lo que debe ser opción contextualizada, no requisito religioso. |

Para una entrega inicial de collage, Delany, Runge y la pieza atribuida a Grey tienen ficha individual Public Domain. Para evitar una selección solo botánica y europea, ampliar después: Klee exige conservar la procedencia del archivo alternativo y Powers requiere una comprobación adicional del asset. No presentar estas condiciones como ya resueltas; tampoco confundir la facilidad de licencias de la selección inicial con representación cultural suficiente.

**Descartes útiles:** las fichas actuales del Met de Schwitters `Ohne Titel (PELIKAN)`, 1925, y Gris `The Man at the Café`, 1914, no ofrecen descarga libre. No se recomiendan como assets abiertos por aparecer en el sitio del Met. `Cutout of Animals` de NGA tiene medio en dominio público, pero su descripción y la representación de figuras con tocados ameritan revisión cultural; no es una sustitución automática para primero. [R32d]

### Repositorios: cómo usarlos

| Repositorio | Comprobar | Uso recomendado |
|---|---|---|
| Met Open Access | Public Domain/OA y archivo exacto; texto curatorial por separado. | Primera opción para reproducciones CC0 verificadas. |
| Smithsonian Open Access | CC0 en el medio, no solo en datos; condiciones culturales. | Textiles, diseño, objetos e historias; no asumir que Folkways es CC0. |
| Art Institute of Chicago | `is_public_domain`, política de imágenes y `image_id`. | Buen flujo de selección mediante API en producción editorial, nunca petición desde la app infantil. |
| Rijksmuseum / RijksData | Declaración de derechos de la imagen/servicio actual. | Paisaje, diseño y detalles; no asumir que toda API o foto es CC0. |
| Wikimedia Commons | Página del archivo, autor, licencia, procedencia y modificaciones. | Útil como archivo alternativo; no basta una miniatura o un resultado de búsqueda. |
| Library of Congress | Rights & Access por objeto; separar partitura, composición y grabación. | Fuentes históricas y música; no asignar CC0 a todo LOC. |

Fuentes de políticas: [R24, R33].

### Culturas vivas y cultura popular

No reducir un pueblo a un patrón o un instrumento. Dar nombre al creador, comunidad cuando corresponda, lugar, fecha y uso, y mostrar también prácticas actuales. No hay un «ritmo africano», una «pintura indígena» o un «instrumento asiático» únicos. Local Contexts explica que materiales con circulación digital pueden tener protocolos comunitarios específicos; una etiqueta TK no la inventa Kitewise para autorizarse a sí misma. [D/E, R34]

Para colaborar: pedir permiso escrito sobre reproducción offline, app comercial o gratuita, territorios, duración, traducción ES/EN, adaptación, crédito, remuneración, posibles recortes/derivados y revisión del texto. Para saberes culturales, identificar quién tiene autoridad para consentir y qué no debe compartirse. La disponibilidad legal y el respeto cultural son comprobaciones diferentes.

**Música:** la obra musical y el fonograma son derechos distintos. Smithsonian Folkways aclara que controla sus masters y que las composiciones pueden pertenecer a otros titulares; escuchar una pista en su web no habilita incorporarla a una app. [D, R35]

**Cultura popular realizable [P]:** carátula inventada para la banda, cartel de un concierto imaginario, personaje original de recortes, loop rítmico propio y animación de un objeto cotidiano. Enseñar cómo funcionan portada, autoría, público, tipografía añadida por la app y crédito. No pedir «copia a tu héroe de Marvel» ni construir el taller alrededor de celebridades o logos. Para ampliar con creadores dominicanos, latinos y de la Bahía actuales, reservar un pequeño presupuesto de colaboración; la selección abierta inicial no representa por sí sola todo ese mundo.

## 12. Adaptación por edad y accesibilidad

Los grupos siguientes son puntos de partida [P], no compartimentos rígidos. Ofrecer ajustes de complejidad y presentación elegibles por la familia/niño; no pedir fecha de nacimiento ni inferir una capacidad a partir del grado.

| Aspecto | 1.º–2.º | 3.º–4.º | 5.º–6.º |
|---|---|---|---|
| Apariencia | Objetos grandes, pocas piezas de interfaz y guía visible al pedirla. | Cuaderno de experimentos, más espacio para comparar. | Estudio editorial sobrio, títulos directos y portada hecha por el niño. |
| Lenguaje | «Prueba dos sonidos. Deja un espacio.» | «Cambia una decisión y compara.» | «Construye un contraste y explica tu intención si quieres.» |
| Herramientas | Tres opciones principales; controles directos. | Duplicado, simetría, capas simplificadas. | Capas y formas A–B, ajustes de intensidad/tiempo si existen. |
| Referentes | Un detalle y una pregunta. | Comparar dos detalles o técnicas. | Contexto de autoría, audiencia, material y transformación. |
| Guía | Demuestra una sola acción, opcionalmente con voz local. | Interviene ante solicitud o tarea nueva. | Se reduce a ayuda; sin aplausos ni diminutivos por defecto. |
| Museo | Reconocer y abrir la propia obra. | Series y parejas de versiones. | Colecciones con intención y nota de artista opcional. |

**Motricidad:** adoptar al menos 48 dp de área táctil para controles Android, con 56–64 dp como hipótesis para los controles iniciales de pequeños, no como obligación universal. Separar objetivos y hacer selección tolerante. Para una pieza pequeña, ampliar el área de interacción o permitir seleccionarla desde una lista sin tapar la pieza vecina. [E/P, R12]

**Arrastre, giro y tamaño:** además del gesto, ofrecer tocar pieza → tocar destino, botones de mover, giro por pasos y ± tamaño. No exigir pellizco ni arrastre preciso para completar la tarea; W3C distingue esta alternativa de simplemente permitir teclado. Aplicarlo como criterio de diseño nativo, no afirmar que una app RN queda certificada WCAG por cumplir una fila. [R12]

**Dislexia:** tipografía clara, texto breve alineado a la izquierda, tamaño escalable y espacio suficiente. No poner instrucciones sobre la fibra del papel. Ofrecer repetir una locución ya empaquetada si se produce; TTS solo si se comprueba que las voces necesarias funcionan offline. No asumir que «Sans serif» o una fuente especializada funciona igual para todos. [R18]

**Daltonismo:** nombre y forma/posición de cada color; muestras seleccionadas con doble contorno, no solo cambio cromático. En ritmo, filas con instrumento/forma y estados vacío/activo distinguibles sin color. No introducir estampados obligatorios dentro de la obra para «corregir» la visión del niño: las ayudas pertenecen a la interfaz. [R12]

**Baja visión:** ampliar interfaz, zoom del lienzo, buen contraste en selección y texto; comprobar 200 % de texto sin cortar instrucciones. TalkBack/VoiceOver debe anunciar herramienta, color, selección y posición de una pieza. Un dibujo libre no se vuelve plenamente accesible solo por etiquetar botones: proporcionar también caminos compositivos con piezas seleccionables y reconocer las limitaciones del trazo libre.

**TDAH y sensibilidad sensorial:** Enfoque retira decoración, avisos y movimientos ajenos a la tarea. Mantiene los mismos lugares para acciones y no elimina herramientas esenciales. Silencio, vibración y movimiento se ajustan por separado. No prometer tratamiento ni «modo para todos los TDAH».

**Lateralidad y lápiz:** bandeja trasladable a izquierda/derecha y controles fuera del apoyo de la mano. Distinguir dibujar, mover y hacer zoom sin que un scroll del padre robe el trazo. Ofrecer dedo y lápiz; no hacer depender una herramienta de presión/inclinación. Samsung S Pen, Apple Pencil, rechazo de palma y presión necesitan pruebas en hardware/API reales; no se garantizan por instalar SVG.

## 13. Tres pantallas antes → después

Son propuestas de diseño [P], no capturas de una app ya implementada.

### A. Taller de collage: de formulario a mesa

**Antes:** fondo liso, seis formas limpias y botones de transformar alrededor. Todas las partes tienen peso parecido.

**Después, tablet apaisada:** obra en la zona central, aproximadamente dos tercios del ancho; bandeja estrecha y trasladable a un lado. Se ven papel crema, kraft y color; seis muestras, no un catálogo infinito. El lienzo tiene borde físico tenue. El recorte elegido muestra asas grandes en color oscuro y un borde blanco interior; el resto permanece quieto. Arriba solo volver, deshacer/rehacer y estado de guardado. Al soltar, roce opcional y asentamiento corto. En Enfoque desaparecen la madera periférica y el acompañante; no cambia la geometría del documento.

**Teléfono:** obra arriba, bandeja inferior plegable, un panel contextual a la vez. Mantener la misma disposición interna de la obra, sin convertir el cambio de pantalla en una transformación del proyecto.

### B. Banda: de tabla de celdas a instrumento comprensible

**Antes:** 8 × 4, nombres/selector de sonidos por fila y un botón de reproducir, todos parecidos a un panel de configuración.

**Después:** conservar la cuadrícula, dar identidad a las cuatro filas con icono propio, forma y nombre de sonido. Una cabecera compacta muestra ocho posiciones temporales; cada cuarto pulso se separa visualmente si eso corresponde a la consigna, sin alterar la métrica implícitamente. Play es grande y estable; tempo queda en un cajón secundario. La columna actual recibe un contorno; las pausas no parecen celdas pendientes. «Escuchar esta fila» y «Silenciar» aparecen al seleccionarla. Un cajón compara Mi idea A / Mi idea B. Durante escucha no hay música de fondo ni vibraciones por pulso. En Enfoque, iconos estáticos y resaltado simple.

### C. Encuentro de color: de tarjeta a experiencia con cierre propio

**Antes:** tarjeta con un párrafo, opciones y Siguiente. La creación parece un premio posterior a leer.

**Después:** una reproducción auténtica a un lado y el papel del niño al otro; una pregunta corta encima, en superficie lisa. «Mira este detalle» amplía una zona identificada como detalle. Debajo hay dos espacios para probar el mismo color sobre fondos distintos. La guía se abre al tocar su pequeño retrato. Después el niño crea en grande. El cierre no muestra una rúbrica: aparece su miniatura en Mi museo y «¿Qué quieres probar después?», con Saltar. Al guardar, confirmación discreta; no confeti ni juicio de gusto. En teléfono, referencia y obra se alternan mediante dos pestañas claras, sin superponer tarjetas sobre el dibujo.

## 14. Producción de imágenes con IA: tandas que aportan más

No generar pantallas enteras. El estado interactivo, los botones y las etiquetas son código. IA para material y escenas propias; geometría repetible para formas; obras de museos como reproducciones auténticas. La guía adjunta es referencia de dirección, no un contrato técnico de texturas.

### Tandas propuestas [P]

| Tanda | Piezas | Cantidad inicial | Qué resuelve |
|---|---|---|---|
| **A. Materiales** | Papel de dibujo, fibras, kraft fino, cartón; variante neutra y una translúcida. | 6 | Mayor salto visual compartido por pintura/collage. |
| **B. Bordes y montaje** | Papeles rasgados aislados; cinta de papel; esquina doblada; soporte de marco. | 8 | Papel convincente, selección y galería. No cientos de combinaciones color × forma. |
| **C. Museo** | Cuatro marcos sobrios sin obra dentro; dos cubiertas de carpeta; una pared tranquila. | 7 | Reconocer y cuidar la obra creada. |
| **D. Guía confirmada** | Hoja canónica; saluda, observa, prueba, se aparta. | 1 hoja + 4 poses | Acompañamiento coherente; producir después de validar elenco. |
| **E. Herramientas y ritmo** | Tres muestras de trazo; cuatro retratos de sonidos/instrumentos originales. | 7 | Diferenciar herramientas sin más botones. Los iconos pequeños continúan en SVG. |
| **F. Escenas opcionales** | Mesa de arte y rincón de escucha, con variantes Enfoque solo si aportan valor. | 2 + hasta 2 | Ambiente periférico, después de probar que no distrae. |

No generar automáticamente cada combinación de material, color y forma: la app puede reutilizar textura y geometría. No hace falta reemplazar todos los dibujos de sonido que ya funcionan.

### Prompt base para materiales

```text
Kitewise material asset. Warm handmade gouache and colored-pencil sensibility, subtle natural paper fibers, restrained cream, ochre, terracotta, sage and dusty-blue palette. Straight-on orthographic view, consistent scale, calm tactile finish, fine irregular edges when requested. No plastic 3D gloss, no neon, no distressed stains. No people unless explicitly requested. No text, letters, numbers, logos, symbols resembling writing, or watermarks. This is a production material asset, not a complete app screen. Keep surface detail quiet enough for a child's artwork to remain the focus. Follow the attached approved material reference.
```

Para una textura repetible añadir instrucciones de iluminación uniforme, sin sombras ni viñeta. Para objetos aislados pedir transparencia real como parámetro del generador, no solo decir «checkerboard» o confiar en quitar después un fondo crema. Para personajes usar el bloque narrativo de tu guía y hoja aprobada; no usar este bloque cenital.

### Cinco prompts completos de ejemplo

**1. Papel repetible — `art_paper_drawing_v1`**

```text
Create one square seamless tile of warm off-white drawing paper for a children's creative app. Straight-on orthographic scan-like view, uniform diffuse lighting, no vignette, no gradient, no objects, no cast shadows. Very subtle natural fibers, sparse small irregularities, no strong directional grain. All four edges must match when tiled in a 3 by 3 repeat. Opaque background. Kitewise material asset: warm handmade gouache and colored-pencil sensibility, restrained cream palette, calm tactile finish. No text, letters, numbers, logos, marks resembling writing, watermarks, plastic gloss, or neon. Keep the texture quiet enough for thin dark drawing lines to remain readable.
```

**2. Papel rasgado — `art_cutout_kraft_leaf_v1`**

```text
One single leaf-shaped piece cut and gently torn from thin warm kraft paper, centered and isolated on a fully transparent background. Top-down orthographic view, visible but restrained paper fibers, slightly irregular torn edge, no stem drawn on the surface. Flat material with no cast shadow; the app will create the shadow. Generous transparent margin, no additional scraps, no scene, no label. Kitewise handmade gouache and colored-pencil material language, warm muted palette, no black outline, no plastic gloss. No text, letters, numbers, logos, watermark, or checkerboard drawn into the image.
```

**3. Marco — `art_frame_ochre_v1`**

```text
One simple handmade rectangular picture-frame border in matte warm ochre painted wood, front-facing orthographic view, gently rounded corners, subtle small brush texture. Completely transparent central opening and completely transparent outside the frame. No artwork, backing board, glass reflections, cast shadow, hanging cord, wall, decoration, or plaque. Spacious inner opening; the frame must not compete with a child's artwork. Kitewise calm handmade gouache look, restrained material detail, no neon or plastic gloss. No text, letters, numbers, logos, or watermark.
```

**4. Guía — `art_rosa_observe_v1`, si Victor confirma Ms. Rosa**

```text
Use the attached approved Ms. Rosa character sheet; preserve her exact face, skin tone, shoulder-length locs, plum cardigan, proportions and outfit. Ms. Rosa, a kind Afro-Latina art mentor in her 40s, is quietly observing a small blank paper sample held in one hand. Warm, attentive expression, no applause, no pointing at the viewer, no exaggerated grin. Waist-up isolated pose on a fully transparent background, clean soft edges and generous margin. Warm hand-painted children's picture-book illustration, digital gouache with soft colored-pencil texture, thin warm dark-brown irregular outlines, gentle warm light, calm inviting mood. No scene, no speech bubble, no text, letters, numbers, logos or watermark.
```

**5. Mesa — `art_workspace_table_v1`**

```text
Wide landscape top-down orthographic background of a quiet creative worktable for Kitewise, not a full interface. A subtle pale warm wooden surface with a few handmade paper scraps at the far outer edges only. Keep the central seventy percent calm and nearly uniform for the app to place an editable canvas. No tools, hands, characters, buttons, page outline or other objects in the central area. Warm gouache and colored-pencil material sensibility, very restrained paper and wood texture, uniform soft lighting, no strong shadows, no dramatic perspective or vignette. No text, letters, numbers, logos, watermarks or decorative symbols.
```

### Flujo y control de calidad

Una hoja de estilo y un «asset dorado» por categoría; adjuntar esas referencias en cada lote. Una sola pieza por archivo. Registrar prompt, referencias, modelo/versión cuando se disponga, tamaño y retoques humanos. Revisar alpha en fondo blanco y oscuro; no aprobar transparencia a partir de una cuadrícula pintada. Comprobar 3 × 3 para tiles y tamaño pequeño para pegatinas/marcos. Probar una textura con una línea fina oscura y otra clara encima.

Crear masters aproximadamente 1024 px para material y hasta 1536 px para fondos es un punto de partida, no un límite universal. Exportar WebP/PNG según alpha y compatibilidad; conservar master. No usar un atlas de 20 personajes como entrega final: separar y revisar cada asset. La IA no garantiza continuidad por repetir un prompt; los lotes necesitan selección y edición.

**Riesgos:** similitudes no deseadas, personajes que cambian de edad, manos defectuosas, patrones culturales inventados y el acabado «IA genérica» de luz excesiva, brillos y microdetalle. Describir propiedades en lugar del nombre de un artista vivo o estudio; eso ayuda a dirección y respeto, pero no garantiza ausencia de infracción. La Copyright Office de EE. UU. concluye que los prompts por sí solos no bastan para establecer autoría humana protegible; documentar selección, composición y modificaciones creativas humanas sin prometer exclusividad jurídica sobre un output bruto. [D/P, R37]

## 15. Qué quitar o simplificar hoy

1. La obligación de leer y contestar varias tarjetas antes de poder crear. Mantener contexto y ayuda, retirar el trámite.
2. Los 16 sonidos visibles simultáneamente. Mantenerlos disponibles en una bandeja; empezar con pocos contrastes claros.
3. Selectores completos de giro, tamaño y capas siempre abiertos. Mostrar opciones para la pieza seleccionada y conservar alternativas a gestos.
4. Decoración repetida en cada tarjeta. Un material coherente vale más que diez adornos.
5. Fondos con textura bajo párrafos o muestras cuya comparación requiere neutralidad.
6. Globos de guía automáticos y elogios en cada acción. No interrumpir el flujo.
7. Confeti, rebotes continuos, vibración por pulso y música ambiental superpuesta.
8. Cierres que se centran en estrellas y ocultan la obra. La primera imagen del cierre debe ser su creación.
9. Suposición de que toda forma debe «pegarse» al sitio correcto. La composición libre necesita encaje opcional.
10. Réplicas de interfaces profesionales: 30 capas, 40 pinceles, controles avanzados de síntesis. Profundidad no exige densidad.
11. Exportar solo una imagen plana si se promete continuar editando.
12. Generar más fondos antes de resolver guardado, selección y legibilidad.

## 16. Prueba con 3–5 niños, sin telemetría

**Objetivo:** detectar problemas de claridad, autonomía y continuidad; no demostrar eficacia educativa, accesibilidad para todas las condiciones ni preferencia estadística del mercado. Tres a cinco participantes es un piloto de diseño, no una muestra representativa. [E/P, R17]

Buscar, si es posible, al menos un niño por banda de edad y variedad de destreza/idioma. El permiso del adulto y el asentimiento del niño no requieren grabarlo. Presentar: «Estamos probando el taller, no a ti. Puedes parar cuando quieras». Nada de micrófono, cámara, identificación, analíticas ni sesiones subidas. Tomar notas de problemas de interfaz sin nombres; si se exige literalmente cero datos, conversar y resumir problemas sin conservar registros individuales.

**Sesión sugerida [P], 15–20 minutos:**

1. «Haz algo con estos materiales» sin enseñar botones. Observar qué toca primero y cuándo obtiene un resultado propio.
2. «Prueba otra manera sin perder esta idea». Observar deshacer, duplicar y comprensión de versiones.
3. «Sal y vuelve a encontrar lo que estabas haciendo». Observar guardado, reconocimiento y reapertura.
4. «Elige algo que te gustaría enseñarme». Observar qué considera suyo y por qué.
5. Ofrecer la versión tranquila y preguntar cuál prefiere para esta tarea, sin sugerir una respuesta correcta.

Si se comparan antes/después, alternar qué versión se prueba primero y usar consignas de dificultad similar; la novedad y la práctica pueden sesgar la comparación. Con 3–5 niños, usar conteos descriptivos, no porcentajes que parezcan una validación. No pedir a los pequeños que verbalicen continuamente mientras dibujan; preguntar brevemente después de una acción. NNG contempla pruebas en parejas para algunos niños de 6–8, pero para esta primera comparación un niño con acompañante conocido puede facilitar la observación sin competir por el control. [R17]

| Observar | Buena señal | Señal para revisar |
|---|---|---|
| Inicio | Hace una marca, coloca papel o compone sin una explicación larga. | Pulsa decoración que no responde; espera permiso para empezar. |
| Herramientas | Puede anticipar qué hará una muestra. | Elige tres pinceles y no distingue su efecto. |
| Error reversible | Prueba algo y encuentra cómo volver. | Borra todo por accidente; deja de explorar por miedo. |
| Atención | La mayor parte de sus acciones modifica o examina la obra. | Repite un sonido decorativo y abandona la tarea artística. No interpretar eso automáticamente como mal comportamiento. |
| Profundidad | Muestra una decisión: «dejé espacio», «cambié el fondo». | Busca que el adulto le diga qué color era el correcto. |
| Museo | Reconoce y reabre su proyecto. | No distingue una plantilla de su obra o cree que guardar publica. |
| Edad | El mayor acepta la presentación y usa herramientas con intención. | Dice «esto es de bebés», oculta la guía o abandona por aspecto. |
| Motricidad | Ajusta una pieza con gesto o botones alternativos. | Asas pequeñas, scroll robado, mano tapando herramientas. |

Preguntas: «¿Qué pensabas que iba a pasar?», «¿Qué parte cambiarías?», «¿Dónde buscarías tu trabajo mañana?», «¿Qué decidiste tú?», «¿Cómo te gustaría que se viera este taller?». Evitar «¿Te gustó?», que suele producir respuestas poco informativas.

**Criterios de salida propuestos:** todos recuperan su trabajo; ningún control provoca pérdida irrecuperable; el niño mayor reconoce el espacio como propio; la primera acción creativa no depende de una explicación larga; cada taller permite mostrar al menos una decisión expresiva. Si falla el guardado, no continuar añadiendo adornos.

## 17. Offline y privacidad: convertir la promesa en comprobación

Empaquetar fuentes tipográficas, texturas, obras, traducciones, foley y audios. No hacer peticiones a museos, CDNs o servicios de generación desde la app infantil. La IA pertenece a la producción editorial, no al análisis del dibujo del niño.

Las bibliotecas locales de dibujo, accesibilidad o audio no equivalen por sí mismas a un SDK de seguimiento; revisar dependencias y configuración. Desactivar cualquier carga remota automática no necesaria en esta edición y comprobar la app instalada con conectividad desactivada, incluido el primer inicio.

**Matiz [D]:** «guardo en SQLite/archivos» no garantiza «nunca va a nube». Android puede incluir datos de app en Auto Backup. Definir exclusiones/desactivación y probar respaldo/restauración; `allowBackup: false` tiene matices de transferencia entre dispositivos según versión/fabricante. Revisar también el comportamiento de backup al preparar iPad. [R38]

**COPPA:** la FTC vincula su aplicación a recogida de información personal online y servicios dirigidos a menores. Este diseño reduce mecanismos de recogida, pero no certifica por sí solo cumplimiento de COPPA ni de requisitos de California o tiendas. El PIN de adultos de la interfaz no es automáticamente consentimiento parental verificable. El objetivo práctico de esta entrega es que Arte funcione sin recoger ni enviar datos, no incorporar un sistema de consentimiento. [R39]

## 18. Fuentes consultadas y fecha

Consulta: **21-oct-2026**. Las páginas de producto/SDK son documentación viva; fijar versión al implementar. Fuentes académicas se identifican por año. Se usaron descripciones de proveedores para constatar funciones, no como prueba independiente de beneficios. No se incluyen precios ni una recomendación de comprar suscripciones.

### Productos y capturas oficiales

- **R1. Toca Boca.** [Toca Boca Jr](https://www.tocaboca.com/toca-boca-jr) y [catálogo oficial](https://www.tocaboca.com/apps). Sin fecha editorial visible; consulta 2026.
- **R2. Tayasui.** [Sketches](https://www.tayasui.com/sketches/), [herramientas](https://www.tayasui.com/sketches/tools.html), [tutoriales](https://www.tayasui.com/sketches/tutorials/), [School e instituciones](https://www.tayasui.com/landing-institutional/institutional). Captura inspeccionada: imagen de herramientas tablet/teléfono de la página Sketches.
- **R3. Pok Pok.** [Sitio oficial y juguetes](https://playpokpok.com/). Las afirmaciones de calma corresponden al proveedor.
- **R4. Google, Alexander Chen.** [Simple music-making for everyone](https://blog.google/products-and-platforms/products/education/simple-music-making-everyone/), **1-mar-2018**. [Chrome Music Lab](https://musiclab.chromeexperiments.com/). Ilustración oficial de cuadrícula inspeccionada.
- **R5. Software MacKiev.** [Kid Pix Deluxe 3X](https://www.mackiev.com/kid_pix.html), [funciones](https://www.mackiev.com/kp_key_features.html), [ayuda](https://www.mackiev.com/kp_gentle_help.html). Referencia histórica; la disponibilidad actual no se ha auditado por plataforma.
- **R6. Procreate.** [Pocket: Gallery](https://help.procreate.com/pocket/handbook/5.0/gallery), [Brush Studio Settings](https://help.procreate.com/pocket/handbook/5.0/brushes/brush-studio-settings). Manual 5.0.
- **R7. Paper.** [Ficha del editor en App Store](https://apps.apple.com/us/app/paper-sketch-draw-create/id506003812), título actual Paper: Sketch, Draw & Create; [historia editorial de Apple](https://apps.apple.com/ca/story/id1313007801).
- **R8. Sago Mini.** [World](https://sagomini.com/world/) y [Learning Through Play](https://sagomini.com/article/learning-through-play-build-real-world-skills-with-sago-mini-world/).
- **R9. Drawing Desk, 4Axis.** [Sitio oficial](https://drawingdesk.com/) y [contenido digital](https://drawingdesk.com/blog/digital-content-on-drawing-desk). Diferenciar de apps homónimas.
- **R10. Khan Academy.** [Khan Academy Kids](https://www.khanacademy.org/kids). Funciones y franja de edad, no extrapolación de eficacia artística.
- **R11. Cateater.** [Stop Motion Studio](https://www.stopmotionstudio.com/). Captura oficial del editor con secuencia inspeccionada.

### Pedagogía, accesibilidad y técnica

- **R12. W3C y Android Developers.** [Dragging Movements, WCAG 2.2, AA](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html), [Animation from Interactions, AAA](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html), [Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html), [Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [Make apps more accessible](https://developer.android.com/guide/topics/ui/accessibility/apps). Criterios web utilizados como referencia para diseño nativo, sin declaración de certificación.
- **R13. Hirsh-Pasek et al., 2015.** [Putting Education in “Educational” Apps: Lessons From the Science of Learning](https://pubmed.ncbi.nlm.nih.gov/25985468/), *Psychological Science in the Public Interest*, DOI [10.1177/1529100615569721](https://doi.org/10.1177/1529100615569721).
- **R14. Harvard Project Zero.** [Eight Habits of Mind](https://pz.harvard.edu/resources/eight-habits-of-mind), recurso fechado 2003; [Studio Thinking from the Start: The K–8 Art Educator’s Handbook](https://pz.harvard.edu/resources/studio-thinking-from-the-start-the-k%E2%80%938-art-educator%E2%80%99s-handbook).
- **R15. NAEYC.** [How Process-Focused Art Experiences Support Preschoolers](https://www.naeyc.org/resources/pubs/tyc/feb2014/process-art-experiences), **feb-2014**; [The Value of Documenting Process Art](https://www.naeyc.org/resources/blog/process-art), **13-ene-2023**.
- **R16. Fisher, Godwin y Seltman, 2014.** [Visual Environment, Attention Allocation, and Learning in Young Children](https://pubmed.ncbi.nlm.nih.gov/24855019/), DOI [10.1177/0956797614533801](https://doi.org/10.1177/0956797614533801).
- **R17. Nielsen Norman Group.** [Children’s UX: Usability Issues in Designing for Young People](https://www.nngroup.com/articles/childrens-websites-usability-issues/), **13-ene-2019**; [Designing for Kids: Cognitive Considerations](https://www.nngroup.com/articles/kids-cognition/), **16-dic-2018**; [Usability Testing with Minors: 16 Tips](https://www.nngroup.com/articles/usability-testing-minors/), **28-abr-2019**.
- **R18. Kuster et al., 2018.** [Dyslexie font does not benefit reading in children with or without dyslexia](https://pmc.ncbi.nlm.nih.gov/articles/PMC5934461/), DOI 10.1007/s11881-017-0154-6. **Wery y Diliberto, 2017:** [The effect of a specialized dyslexia font, OpenDyslexic, on reading rate and accuracy](https://pmc.ncbi.nlm.nih.gov/articles/PMC5629233/). Las recomendaciones generales de legibilidad son diseño accesible, no tratamiento.
- **R19. Expo / Software Mansion.** [react-native-svg](https://docs.expo.dev/versions/latest/sdk/svg/), [USAGE del mantenedor](https://github.com/software-mansion/react-native-svg/blob/main/USAGE.md).
- **R20. React Native.** [Performance Overview](https://reactnative.dev/docs/performance), [AccessibilityInfo](https://reactnative.dev/docs/accessibilityinfo). Documentación viva; comprobar la versión del proyecto.
- **R21. Expo.** [Audio, expo-audio](https://docs.expo.dev/versions/latest/sdk/audio/), incluida configuración de permisos y muestreo de audio.
- **R22. Expo.** [Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/).
- **R23. Exploratorium.** [The Three Little Pigments](https://www.exploratorium.edu/snacks/three-little-pigments), [Poking Fun at Color Mixing](https://www.exploratorium.edu/snacks/poking-fun-at-color-mixing). Se consultan conceptos; no se propone copiar su material con licencia no comercial a una app comercial.

### Obras y derechos

- **R24. The Met.** [Open Access](https://www.metmuseum.org/hubs/open-access), iniciativa **2017**, y [Image and Data Resources](https://www.metmuseum.org/policies/image-resources).
- **R25. Met.** [Degas: The Dancing Class](https://www.metmuseum.org/art/collection/search/436141), ca. 1870; ficha y Public Domain.
- **R26. National Gallery of Art.** [Klee: Persian Nightingales](https://www.nga.gov/artworks/71551-persische-nachtigallen-persian-nightingales), 1917; medio declarado en dominio público.
- **R27. Library of Congress.** [Maple Leaf Rag](https://www.loc.gov/item/ihas.200033265/); [Scott Joplin](https://www.loc.gov/item/n50039880/scott-joplin-1868-1917/); [material docente de Ragtime y recursos digitales](https://www.loc.gov/static/programs/teachers/professional-development/online-office-hours/documents/2020-07-21_Ragtime-Collection-and-Digital-Music-Resources.pdf), **21-jul-2020**. Acceso a ficha individual limitado en esta sesión.
- **R28. AIC.** [Monet: Water Lilies](https://www.artic.edu/artworks/16568/water-lilies), 1906; [API del objeto](https://api.artic.edu/api/v1/artworks/16568), consultada directamente.
- **R29. AIC.** [Van Gogh: The Bedroom](https://www.artic.edu/artworks/28560/the-bedroom), 1889; [API del objeto](https://api.artic.edu/api/v1/artworks/28560), consultada directamente.
- **R30. AIC.** [Seurat: A Sunday on La Grande Jatte — 1884](https://www.artic.edu/artworks/27992/a-sunday-on-la-grande-jatte-1884); [API del objeto](https://api.artic.edu/api/v1/artworks/27992), consultada directamente.
- **R31. Met.** [Hokusai: Under the Wave off Kanagawa](https://www.metmuseum.org/art/collection/search/45434), ca. 1830–32.
- **R32. Met.** [Mary Delany: Botanical Study](https://www.metmuseum.org/art/collection/search/360446), ca. 1772–82; [archivo CC0 en Commons](https://commons.wikimedia.org/wiki/File:Botanical_Study_MET_DP801159.jpg).
- **R32b. Met / Commons.** [Klee: Temple Gardens](https://www.metmuseum.org/art/collection/search/484870), 1920; [archivo histórico CC0](https://commons.wikimedia.org/wiki/File:Temple_Gardens,_1920_-_Paul_Klee,_MET_DT1372.jpg). Diferencia de disponibilidad entre ficha actual y archivo histórico indicada en el informe.
- **R32c. Smithsonian.** [Harriet Powers: Bible Quilt, 1885–86](https://www.si.edu/object/1885-1886-harriet-powerss-bible-quilt%3Anmah_556462), [NMAH](https://americanhistory.si.edu/collections/nmah_556462). CC0 visible en ficha indexada; verificación del archivo individual pendiente antes de inclusión.
- **R32d. Descartes.** [Schwitters: PELIKAN](https://www.metmuseum.org/art/collection/search/904858), [Gris: The Man at the Café](https://www.metmuseum.org/art/collection/search/500421), [Cutout of Animals, NGA](https://www.nga.gov/artworks/50833-cutout-animals).
- **R32e. Met.** [Runge: Red Currant](https://www.metmuseum.org/art/collection/search/392333), finales del XVIII–principios del XIX; [atribuido a Booth Grey: Monarda didyma / Scarlet Lion’s Tail](https://www.metmuseum.org/art/collection/search/368383), ca. 1791 (?). Ambas fichas indican Public Domain y descarga.
- **R33. Políticas de otras colecciones.** [AIC Open Access Images](https://www.artic.edu/open-access/open-access-images), [documentación API de AIC](https://aggregator-data.artic.edu/docs/), [Smithsonian Open Access FAQ](https://www.si.edu/openaccess/faq), [Smithsonian Learning Lab Open Access](https://learninglab.si.edu/openaccess), [Rijksmuseum Data](https://www.rijksmuseum.nl/en/research/conduct-research/data), [LOC Free to Use and Reuse](https://www.loc.gov/free-to-use/). Algunas páginas devolvieron error al abrirse; no se usaron como aprobación individual de un asset.
- **R34. Local Contexts.** [Traditional Knowledge Labels](https://localcontexts.org/labels/traditional-knowledge-labels/). Protocolos y autoridad cultural, no licencia automática para terceros.
- **R35. Smithsonian Folkways.** [Frequently Asked Questions](https://folkways.si.edu/faq); **U.S. Copyright Office:** [Sound Recording / Musical Composition](https://www.copyright.gov/prereg/sound.html).
- **R36. Expo.** [SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) y [FileSystem](https://docs.expo.dev/versions/latest/sdk/filesystem/). APIs locales, no garantía sobre backups del sistema.
- **R37. U.S. Copyright Office.** [Copyright and Artificial Intelligence, Part 2: Copyrightability](https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-2-Copyrightability-Report.pdf), **29-ene-2025**; [resumen oficial](https://www.copyright.gov/newsnet/2025/1060.html).
- **R38. Android Developers.** [Back up user data with Auto Backup](https://developer.android.com/identity/data/autobackup) y [Test backup and restore](https://developer.android.com/identity/data/testingbackup).
- **R39. Federal Trade Commission.** [Complying with COPPA: Frequently Asked Questions](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions). No constituye certificación de Kitewise.

## Preguntas que debería responder yo (Victor) antes de decidir

1. ¿Cuál es el modelo Samsung concreto, RAM, versión Android y versión Expo que debe marcar el mínimo real?
2. ¿Qué pesa más en la primera entrega: que el collage se sienta material o que el niño tenga un museo donde continuar sus obras? Recomiendo cubrir ambos de forma pequeña antes de añadir otro taller.
3. ¿Ms. Rosa sigue siendo parte del elenco y puede acompañar Arte, o prefieres la cometa/otro personaje ya aprobado?
4. ¿Quieres una presentación «mesa de cuento» opcional y otra «estudio» para mayores, elegibles sin bloquear por grado?
5. ¿La prohibición de texto en imágenes permite firmas, inscripciones y notación de una obra histórica auténtica en una vista cultural separada?
6. ¿Aceptas una selección inicial de reproducciones abiertas y un presupuesto posterior para creadores dominicanos, latinos, de la Bahía y comunidades vivas?
7. ¿Qué modelo de color declara hoy el mezclador? ¿Priorizarás coherencia didáctica o simulación de pigmentos más avanzada?
8. ¿Mi museo será estrictamente para mirar en el dispositivo, o habrá exportación de un archivo bajo control adulto?
9. ¿Cuánto almacenamiento local reservarás y qué debe ocurrir al acercarse al límite, sin borrar obras silenciosamente?
10. ¿Quién puede revisar los tres encuentros piloto de cada nueva interacción y acompañar pruebas con 3–5 niños de edades distintas?
