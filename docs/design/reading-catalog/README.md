# Lectura: ilustraciones ampliables y resto del catálogo

2026-10-22 · LE-08 / LE-09 · pedido de Victor después de probar los dos cuentos del piloto.

## Experiencia

Tocar una ilustración (lupa discreta en una esquina) abre un visor independiente. Permite ampliar entre 1× y 4× con dos dedos o botones de 48 dp, arrastrar dentro de los límites de la imagen y volver a ajustar. «Volver a leer», Atrás de Android y Escape en web cierran el visor y conservan el fragmento. Al cambiar las dimensiones del visor se ajusta de nuevo el arte completo; el visor sigue abierto al girar o plegar/desplegar. Controles y ayuda ES/EN según el cuento.

La imagen utiliza el archivo original y el encuadre de la escena; no se genera arte de reemplazo ni se incrusta texto. La pronunciación por palabra y la ficha de vocabulario siguen en el lector. Los gestos de la imagen quedan dentro del visor para no competir con las palabras o el desplazamiento del texto. No se añade ninguna dependencia.

## Catálogo adaptado

Las 23 familias restantes se incorporan al lector por escenas, junto a las dos del piloto: **25 familias, 81 variantes originales de idioma/nivel, 362 asociaciones de escena**. El prototipo del conejo solo existe en español. Los dos cuentos DEV quedan fuera. La integración sigue siendo la lectura libre; el lector con simulador anterior se conserva.

Se conservan todos los párrafos en orden, vocabulario, preguntas, identidad y anclas originales. Los pasajes largos se separan únicamente entre párrafos. Las 67 escenas que usan el recurso editorial vacío `reading-pause.webp` muestran solo el texto: sin columna vacía ni lupa para una imagen inexistente.

Los manifiestos `packages/story-engine/reading-editions/*.json` explicitan encuadres y textos alternativos. `scripts/prepare-reading-catalog.mjs` reproduce los 23 nuevos a partir de los diseños existentes; mantiene intactas las dos ediciones piloto. Se revisaron las páginas originales y las seis láminas de encuadres en `previews/`. Las viñetas diagonales y explosiones conservan su panel para no perder acción al intentar excluir un globo irregular. En el tren, la página 2 dibuja tres columnas aunque la plantilla antigua declaraba otra división; la nueva edición usa sus tres regiones correspondientes. Las cuatro imágenes repetidas de la cúpula reutilizan la descripción de su original, que faltaba en esas páginas. Las excepciones sin plantilla de «La puerta que dejé entreabierta» usan encuadres explícitos.

Inventario de escenas y fragmentos por variante: [CATALOG.json](CATALOG.json).

| Cuento | Variantes originales conservadas | Escenas |
|---|---|---|
| El puente de las luciérnagas | es N1, es N2, es N3, en N1, en N2, en N3 | 10 |
| El puente de Lolo | es N1, es N2, es N3, en N1, en N2, en N3 | 20 |
| El puente que desaparecía | es N6, en N6 | 12 |
| 1. La pista que no caminaba | es N1, es N2, es N3, en N1, en N2, en N3 | 12 |
| 2. La sombra que engañaba | es N1, es N2, es N3, en N1, en N2, en N3 | 12 |
| 3. Lo que ocurrió de verdad | es N1, es N2, es N3, en N1, en N2, en N3 | 12 |
| La cometa roja | es N3, en N3 | 6 |
| La cúpula que parpadeaba | es N6, en N6 | 16 |
| La isla que caminaba | es N6, en N6 | 12 |
| La luna y la puerta azul | es N1 | 10 |
| La luz que no estaba en el mapa | es N6, en N6 | 12 |
| La mañana de los doce minutos | es N6, en N6 | 12 |
| La misión que perdió la Tierra | es N6, en N6 | 12 |
| Mila, Pipo y la noche en que se apagaron las luciérnagas | es N1, es N2, es N3, en N1, en N2, en N3 | 40 |
| La octava linterna | es N5, en N5 | 8 |
| La pregunta que guardé en el bolsillo | es N6, en N6 | 12 |
| La puerta que dejé entreabierta | es N6, en N6 | 12 |
| La salida que nadie contaba | es N6, en N6 | 12 |
| La torre que se volvió bosque | es N6, en N6 | 12 |
| Luna y el tren de los objetos perdidos | es N1, es N2, es N3, en N1, en N2, en N3 | 51 |
| El mapa de la puerta desaparecida | es N6, en N6 | 20 |
| Mi mochila hace ¡achís! | es N1, es N2, es N3, en N1, en N2, en N3 | 7 |
| 1. La puerta de papel | es N6, en N6 | 10 |
| 2. El último nivel | es N6, en N6 | 10 |
| 3. El héroe fuera del libro | es N6, en N6 | 10 |

## Comprobación

- Suite: 1.943 pruebas, 127 archivos. Preservación de texto, vocabulario, preguntas y reanudación en las 81 variantes; correspondencia de dimensiones con los recursos reales y cobertura del catálogo publicado.
- TypeScript en todos los workspaces; lint de los archivos modificados sin errores ni avisos.
- Yoga real de RN 0.86.3: 168 portadas en 12 tamaños.
- Visor: 12 casos ES/EN en 390×844, 844×390, 800×1280, 1280×800, 853×690 y 690×853; botones, límites, pellizco con eventos táctiles de Chromium, arrastre, giro sin recargar, cierre, Escape y pronunciación simulada posterior. `ZOOM-VERIFICATION.json`, capturas en `previews/zoom-*`.
- 49 recorridos completos (cada familia ES/EN disponible, nivel mayor) en cuatro tamaños, 991 fragmentos y 145 preguntas: ayuda/pronunciación simulada, definición/sinónimo/ejemplo cuando existen, reintento, repaso, reanudación tras recargar y un único cierre guardado. Exportación Android: 2.255 módulos / 501 recursos, bundle Hermes generado. Resultados: `VERIFICATION.json`.

Verificación de navegador y geometría nativa; no sustituye una prueba física de gestos/TTS audible en el Fold. Esta tarea no genera ni publica un APK: la descarga anterior 0.1.1 todavía no incluye estos cambios.

Para repetir (Expo web en `http://localhost:8082`):

```sh
npm test
npm run typecheck
npm run test:native-layout
node scripts/illustration-zoom-smoke.mjs
node scripts/reading-pilot-smoke.mjs http://localhost:8082 <familia>
```
