# Pedido de imágenes — Matemáticas visuales (para generar con GPT)

> **Estado (2026-10-16):** llegaron 22 de 26 (Prioridad A y B), revisadas: sin texto ni números, centro despejado. Están
> en `apps/mobile/assets/math/` como WebP (fondos 1536×1024 / 1024×1536, 22–53 KB; objetos recortados a su silueta,
> 256×256 con transparencia, 10–17 KB). Lista original con SHA-256: `arte/manifest-original.json`.
> **Faltan las 4 poses de Mila** (`char_mila_*`): GPT necesita una imagen de referencia de Mila. Ver las ilustraciones de
> "Mila, Pipo y la noche en que se apagaron las luciérnagas" en `apps/reader/public/stories/`.

**Para quién:** Victor genera las imágenes y las sube al chat; Claude las convierte a WebP, las nombra y las conecta.
**Regla de oro:** las imágenes son **decorado**. Los números, las cantidades y las fichas que se cuentan los dibuja la app
con código (`docs/design/math-visual`, §2: "la IA no decide cuántos objetos hay"). Por eso:

- **Nada de texto, letras ni números** dentro de ninguna imagen.
- **Ningún objeto que se pueda confundir con algo que hay que contar** en los fondos (nada de galletas, semillas o
  plantas sueltas en la zona central).
- Cada objeto suelto (prop) es **una sola pieza** en fondo transparente: la app la repite las veces que haga falta.

## Estilo común (pégalo al inicio de cada pedido)

> Ilustración 2D plana, alegre y clara para una app educativa infantil (6–12 años). Formas redondeadas, contornos suaves
> en azul oscuro (#233447), sombras mínimas, pocos detalles. Paleta: crema #FAF5EA, azul #467B9C, coral #D77754, verde
> #769E72, amarillo #E5B74F, violeta #9A7DAB. Sin texto, sin letras, sin números, sin marcas de agua.

Si usas a Mila o a Pipo (personajes de las historias de lectura), **adjunta su imagen de referencia** de
`apps/reader/public/stories/` para que salgan iguales.

## Prioridad A — lo que uso ya (fase 1: bandejas, grupos, reparto)

### Fondos (2 tamaños cada uno: 1536×1024 horizontal y 1024×1536 vertical)

| Archivo | Pedido (después del estilo común) |
|---|---|
| `bg_mate_huerto` | Un huerto escolar soleado visto de frente, con cerca de madera y cielo claro en el borde superior. **El centro y la parte de abajo quedan despejados** (pasto liso o tierra lisa) porque ahí la app dibuja las parcelas. Nada de plantas sueltas en el centro. Colores suaves, poco contraste. |
| `bg_mate_merienda` | Una mesa de cocina de madera clara vista desde un poco arriba, con una ventana y una planta en una esquina superior. **La superficie de la mesa queda vacía y ocupa el centro** (ahí van los platos y las galletas). Nada de comida sobre la mesa. |
| `bg_mate_semillero` | Un rincón de invernadero / mesa de jardinería con macetas y herramientas solo en los bordes laterales. **El centro es una superficie lisa de madera** (ahí va la bandeja de semillas). |

### Personaje guía (fondo transparente, 1024×1024, cuerpo entero)

| Archivo | Pedido |
|---|---|
| `char_mila_saluda` | Mila (con referencia) de pie, saludando con la mano, sonriendo. |
| `char_mila_piensa` | Mila con un dedo en la barbilla, mirando hacia arriba, pensando. |
| `char_mila_apunta` | Mila señalando hacia un lado (como mostrando algo), amable. |
| `char_mila_celebra` | Mila con los brazos arriba, contenta (sin confeti que parezca algo para contar). |

Se usan en una esquina, pequeñas. En Modo Enfoque se ocultan.

### Objetos sueltos (fondo transparente, 1024×1024, una sola pieza centrada, vista de frente o desde arriba)

Deben reconocerse **muy pequeños** (32 px): silueta simple, sin detalles finos. Todos con la misma luz y el mismo grosor
de contorno.

| Archivo | Pedido |
|---|---|
| `prop_semilla` | Una semilla grande color coral, vista desde arriba. |
| `prop_brote` | Un brote de planta con dos hojas verdes y un poquito de tierra en la base. |
| `prop_galleta` | Una galleta redonda dorada con 2–3 chispas de chocolate. |
| `prop_plato` | Un plato redondo vacío visto desde arriba, azul muy claro. |
| `prop_bolsa` | Una bolsa de papel abierta, vista de frente, vacía. |
| `prop_parcela` | Un cuadro de tierra con borde de madera visto desde arriba, vacío. |

> Mientras no lleguen, la app usa formas dibujadas con código (las de la lámina). Cuando lleguen, se cambian sin tocar la
> lógica.

## Prioridad B — siguientes familias (fase 2–3, no urgentes)

| Archivo | Para | Pedido |
|---|---|---|
| `bg_mate_camino` | Recta numérica | Un sendero recto que cruza un parque de izquierda a derecha, en la mitad inferior; el resto, césped liso y cielo. Sin señales ni marcas en el sendero (las marcas las pone la app). |
| `bg_mate_mosaico` | Fracciones | Una pared de taller de arte con estantes de pintura en los bordes; el centro, una pared lisa clara. |
| `bg_mate_jardin_plano` | Área y perímetro | Un patio visto desde arriba con pasto liso; flores solo en los bordes. |
| `bg_mate_mapa` | Coordenadas | Un mapa del tesoro de fantasía en tonos crema y azul, **sin cuadrícula, sin letras, sin números**; islas y árboles pequeños solo en los bordes. |
| `bg_mate_feria` | Datos y gráficas | Un puesto de frutas de una feria escolar, con toldo; el mostrador vacío en el centro. |
| `bg_mate_laboratorio` | Razones y mezclas | Un taller de pintura con frascos en estantes laterales; mesa vacía al centro. |
| `prop_fruta_mango` / `_pera` / `_uva` | Encuesta | Una fruta sola, mismo estilo que los props de arriba. |
| `prop_reloj_vacio` | Reloj | Solo el marco del reloj de pared (aro y fondo), **sin números, sin marcas y sin agujas** (eso lo dibuja la app). |

## Cómo entregarlas

- Súbelas al chat tal como salen de GPT (PNG). Si GPT no deja fondo transparente, pide "PNG con fondo transparente"; si
  aun así sale con fondo, súbela igual y lo recorto.
- El nombre del archivo da igual: dime cuál es cuál en el mensaje, o usa los nombres de arriba.
- Antes de publicar en la tienda hay que revisar los términos de uso de la herramienta (docs/12 §5: uso comercial y
  dueño de las imágenes).

## Cómo las reviso al llegar

Sin texto ni números · se reconoce a 32 px (props) · la zona central del fondo está despejada · mismo estilo entre
piezas · peso final < 350 KB (fondos) y < 40 KB (props) en WebP.
