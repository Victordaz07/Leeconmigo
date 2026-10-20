# Modelo de mezcla de pintura (AR-05)

Lo pide la investigación (`docs/research/artes-investigacion.md` §6): *«paleta limitada de pigmentos virtuales con mezclas revisadas y etiquetadas como
aproximación didáctica. Documentar sus resultados y limitaciones»*, y *«no enseñar mezclas de pintura mediante un simple promedio RGB sin explicarlo»*.
Código: `packages/art-content/src/mixing.ts` (con pruebas en `tests/mixing.test.ts`).

## Qué es
Cinco pinturas virtuales: **rojo, amarillo, azul** (los tres primarios), **blanco** y **negro**. Una mezcla es una **receta de gotas** (como en una
paleta real), de 1 a 8 gotas. La paleta de partida de cada pintura son esas cinco pinturas puras; el niño guarda sus mezclas como colores nuevos
(hasta 12). Cada color guarda su **receta**, no el color: el color se calcula siempre desde la receta, así nunca se contradicen.

## Cómo se calcula
1. **Primarios (rojo, amarillo, azul):** se interpolan en el **cubo RYB** (rojo-amarillo-azul) con interpolación trilineal entre sus 8 esquinas
   (Gossett y Chen, *Paint Inspired Color Mixing*, 2004):

   | Esquina (R,Y,B) | Color RGB (0–1) |
   |---|---|
   | (0,0,0) blanco | 1, 1, 1 |
   | (1,0,0) rojo | 1, 0, 0 |
   | (0,1,0) amarillo | 1, 1, 0 |
   | (0,0,1) azul | 0.163, 0.373, 0.6 |
   | (1,1,0) naranja | 1, 0.5, 0 |
   | (0,1,1) verde | 0, 0.66, 0.2 |
   | (1,0,1) violeta | 0.5, 0, 0.5 |
   | (1,1,1) marrón muy oscuro | 0.2, 0.094, 0 |

   La proporción de gotas de cada primario se escala para que la mayor valga 1 (la mezcla mantiene su intensidad): 1 rojo + 1 amarillo → (1,1,0) =
   naranja; 2 rojo + 1 amarillo → (1, 0.5, 0) = naranja rojizo; 1 de cada → (1,1,1) = marrón muy oscuro.
2. **Blanco y negro:** entran con el peso de sus gotas junto a las gotas de color, mezclando en sRGB (aclarar = «tinte», oscurecer = «sombra»). 1 rojo +
   1 blanco → `#FF8080` (rosa); 1 blanco + 1 negro → `#808080` (gris).
3. El resultado **no depende del orden** de las gotas y las mismas gotas dan **siempre** el mismo color.

## Por qué no un promedio RGB
Promediar RGB da colores apagados que no se parecen a lo que los niños ven al mezclar pintura: amarillo + azul puro daría gris, y con nuestro azul un
verde oliva apagado. El cubo RYB da el verde vivo que se espera. (Hay una prueba que lo comprueba.)

## Qué NO es (limitaciones, a decirle al niño y a los adultos)
- **Es un juego, no física de pigmentos.** Una pintura de verdad puede salir un poco distinta según la marca, el papel y el agua. La pantalla lo dice:
  *«Esta mezcla es un juego: la pintura de verdad puede salir un poco distinta, y está bien.»*
- Los tres primarios de pintura del cubo RYB no son los de la luz: la **mezcla de luz** (RGB aditivo: rojo+verde = amarillo) es **otro modelo** y no se
  mezcla aquí. Si se hace un taller de luz, será un espacio aparte con su propio nombre («Luz»), explicado como distinto (investigación §6, F16).
- No simula opacidad, transparencia, textura ni mezcla húmeda. El «valor» (claro/oscuro) se controla solo con blanco y negro.
- Un modelo espectral más avanzado (Kubelka-Munk con curvas de reflectancia) queda para después, con su licencia y su costo; no hace falta para el taller.
- No hay mezclas «correctas»: cualquier receta es válida y el niño decide qué color le gusta. No se asocian colores a emociones (azul ≠ tristeza).

## Accesibilidad
- Cada color de la paleta se **lee con su receta** («1 gota de rojo + 1 gota de amarillo»); el color nunca es la única señal. El color elegido lleva una marca ✓.
- Las gotas se manejan con botones grandes (+ / −), no con arrastrar.

## Retos que este modelo permite (investigación §6, para la unidad A2-U02 «Colores que se relacionan»)
Crear tres colores relacionados · dos imágenes con la misma paleta y distinto contraste · comparar mezclas con más o menos blanco o negro · representar
una misma escena con dos intenciones. (La unidad guiada A2-U02 es el siguiente paso; AR-05 entrega el taller libre y el mezclador.)
