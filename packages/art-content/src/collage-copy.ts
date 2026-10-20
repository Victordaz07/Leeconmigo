import type { Background, Layer, PaperColor, Shape } from './collage.ts';
import type { ArtLang } from './project.ts';

/**
 * Textos del Taller de collage (ES/EN). Tono de acompañamiento: nada de «bien/mal» ni puntos; un cartón con pocas piezas también es un collage.
 * Los nombres de formas y colores sirven para los lectores de pantalla (el niño los ve, no solo los oye).
 */
export interface CollageCopy {
  newCollage: string;
  kind: string;
  title: string;
  defaultTitle: string;
  hint: string;
  empty: string;
  canvasLabel: string;
  piecesTitle: string;
  shapes: Record<Shape, string>;
  addShape: (shape: string) => string;
  colorsTitle: string;
  colors: Record<PaperColor, string>;
  colorLabel: (name: string) => string;
  backgroundTitle: string;
  backgrounds: Record<Background, string>;
  selectedTitle: string;
  selectedNone: string;
  pickNext: string;
  bigger: string;
  smaller: string;
  turnLeft: string;
  turnRight: string;
  layers: Record<Layer, string>;
  copy: string;
  remove: string;
  undo: string;
  redo: string;
  clearAll: string;
  clearAsk: string;
  clearYes: string;
  clearNo: string;
  full: string;
}

const ES: CollageCopy = {
  newCollage: 'Nuevo collage',
  kind: 'Collage',
  title: 'Taller de collage',
  defaultTitle: 'Mi collage',
  hint: 'Toca una forma para pegarla. Arrástrala con el dedo y cámbiala como quieras.',
  empty: 'Todavía no hay piezas. Toca una forma de abajo.',
  canvasLabel: 'Cartón del collage',
  piecesTitle: 'Formas de papel',
  shapes: { circle: 'Círculo', square: 'Cuadrado', triangle: 'Triángulo', strip: 'Tira', star: 'Estrella', leaf: 'Hoja' },
  addShape: (s) => `Pegar: ${s}`,
  colorsTitle: 'Color del papel',
  colors: { red: 'Rojo', orange: 'Naranja', yellow: 'Amarillo', green: 'Verde', teal: 'Verde azulado', blue: 'Azul', purple: 'Morado', pink: 'Rosa', brown: 'Café', black: 'Negro' },
  colorLabel: (n) => `Papel ${n.toLowerCase()}`,
  backgroundTitle: 'Fondo del cartón',
  backgrounds: { cream: 'Crema', white: 'Blanco', sky: 'Cielo', grass: 'Pasto', sand: 'Arena', night: 'Noche' },
  selectedTitle: 'La pieza que elegiste',
  selectedNone: 'Toca una pieza del cartón para cambiarla.',
  pickNext: 'Elegir otra pieza',
  bigger: 'Más grande',
  smaller: 'Más pequeña',
  turnLeft: '↺ Girar',
  turnRight: 'Girar ↻',
  layers: { front: 'Al frente', back: 'Al fondo', up: 'Subir una capa', down: 'Bajar una capa' },
  copy: 'Copiar',
  remove: 'Quitar pieza',
  undo: 'Deshacer',
  redo: 'Rehacer',
  clearAll: 'Quitar todas las piezas',
  clearAsk: '¿Quitar todas las piezas?',
  clearYes: 'Sí, quitarlas',
  clearNo: 'No, dejarlas',
  full: 'Ya hay muchas piezas. Quita alguna para pegar otra.',
};

const EN: CollageCopy = {
  newCollage: 'New collage',
  kind: 'Collage',
  title: 'Collage workshop',
  defaultTitle: 'My collage',
  hint: 'Tap a shape to stick it down. Drag it with your finger and change it however you like.',
  empty: 'No pieces yet. Tap a shape below.',
  canvasLabel: 'Collage board',
  piecesTitle: 'Paper shapes',
  shapes: { circle: 'Circle', square: 'Square', triangle: 'Triangle', strip: 'Strip', star: 'Star', leaf: 'Leaf' },
  addShape: (s) => `Stick: ${s}`,
  colorsTitle: 'Paper color',
  colors: { red: 'Red', orange: 'Orange', yellow: 'Yellow', green: 'Green', teal: 'Teal', blue: 'Blue', purple: 'Purple', pink: 'Pink', brown: 'Brown', black: 'Black' },
  colorLabel: (n) => `${n} paper`,
  backgroundTitle: 'Board color',
  backgrounds: { cream: 'Cream', white: 'White', sky: 'Sky', grass: 'Grass', sand: 'Sand', night: 'Night' },
  selectedTitle: 'The piece you picked',
  selectedNone: 'Tap a piece on the board to change it.',
  pickNext: 'Pick another piece',
  bigger: 'Bigger',
  smaller: 'Smaller',
  turnLeft: '↺ Turn',
  turnRight: 'Turn ↻',
  layers: { front: 'To the front', back: 'To the back', up: 'Up one layer', down: 'Down one layer' },
  copy: 'Copy',
  remove: 'Remove piece',
  undo: 'Undo',
  redo: 'Redo',
  clearAll: 'Remove all pieces',
  clearAsk: 'Remove all the pieces?',
  clearYes: 'Yes, remove them',
  clearNo: 'No, keep them',
  full: 'There are a lot of pieces. Remove one to stick another.',
};

export const COLLAGE_COPY: Record<ArtLang, CollageCopy> = { es: ES, en: EN };
