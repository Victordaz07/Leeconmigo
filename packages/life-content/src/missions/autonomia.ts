import { ch, exp, L, opt, sp } from '../dsl.ts';
import type { LifeMission } from '../types.ts';

/**
 * V6 «Puedo hacerlo paso a paso»: planificación, secuencia y comprobación sobre una mochila y una mesa de trabajo (sin calor, herramientas, limpieza ni alimentos:
 * esas actividades necesitan revisión específica antes de publicarse, vida-8-modulos §V6). No se asume qué objetos tiene cada hogar.
 */
export const AUTONOMIA_MISSION: LifeMission = {
  id: 'AU-M01',
  module: 'autonomia',
  grade: 3,
  title: L('Preparo mi mochila paso a paso', 'I get my backpack ready step by step'),
  blurb: L('Ordena los pasos de una tarea sencilla, nota lo que falta y decide cuándo pedir ayuda a un adulto.', 'Put the steps of a simple task in order, notice what is missing and decide when to ask a grown-up for help.'),
  safety: L('Aquí solo se piensa y se ordena. Si algo implica calor, herramientas, productos de limpieza o comida, lo hace un adulto contigo.', 'Here you only think and put things in order. If something involves heat, tools, cleaning products or food, a grown-up does it with you.'),
  offScreen: L('Hoy, prepara tus cosas de mañana con tu propia lista (puede ser un dibujo) y comprueba que no falte nada.', 'Today, get tomorrow’s things ready with your own list (it can be a drawing) and check nothing is missing.'),
  steps: [
    {
      kind: 'sort',
      id: 'mochila',
      title: L('Los pasos de una tarea', 'The steps of a task'),
      learn: L('Una tarea sencilla sale mejor con un orden: mirar qué hace falta, reunir, comprobar y guardar.', 'A simple task works better with an order: look at what is needed, gather, check and put away.'),
      example: L('Iván mira su lista, junta lo que necesita, comprueba que esté todo y recién entonces cierra la mochila.', 'Ivan looks at his list, gathers what he needs, checks everything is there and only then closes the backpack.'),
      prompt: L('Ordena los pasos para preparar tu mochila de mañana.', 'Put in order the steps to get tomorrow’s backpack ready.'),
      items: [
        ch('list', 'Miro la lista de lo que necesito mañana.', 'I look at the list of what I need tomorrow.'),
        ch('gather', 'Junto los materiales en un lugar.', 'I gather the materials in one place.'),
        ch('check', 'Compruebo que no falte nada.', 'I check that nothing is missing.'),
        ch('pack', 'Lo guardo y dejo la mochila junto a la puerta.', 'I put it away and leave the backpack by the door.'),
      ],
      hint: L('Comprobar va antes de guardar.', 'Checking comes before putting away.'),
      solvedNote: L('Con este orden es menos probable que se te olvide algo.', 'With this order you are less likely to forget something.'),
      explain: exp('¿Para qué sirve comprobar antes de guardar?', 'What is checking before packing for?',
        ch('time', 'Para encontrar a tiempo lo que falta.', 'To find in time what is missing.'),
        ch('slow', 'Para tardar más.', 'To take longer.'),
        ch('none', 'No sirve de nada.', 'It is no use.')),
    },
    {
      kind: 'spot',
      id: 'olvidos',
      title: L('¿Qué falta?', 'What is missing?'),
      learn: L('Comprobar es comparar lo que hay con lo que dice la lista. Si algo falta, se busca o se pide ayuda a tiempo.', 'Checking means comparing what is there with what the list says. If something is missing, you look for it or ask for help in time.'),
      example: L('La lista dice: cuaderno, lápiz, regla y botella. En la mesa hay cuaderno y regla. Faltan el lápiz y la botella.', 'The list says: notebook, pencil, ruler and bottle. On the table there are a notebook and a ruler. The pencil and the bottle are missing.'),
      prompt: L('La lista dice: cuaderno, lápiz, regla y botella de agua. Marca lo que FALTA en la mesa.', 'The list says: notebook, pencil, ruler and water bottle. Mark what is MISSING on the table.'),
      context: L('Esta es la mesa de trabajo de mañana, casi lista.', 'This is tomorrow’s work table, almost ready.'),
      items: [
        sp('pencil', 'No hay ningún lápiz sobre la mesa.', 'There is no pencil on the table.', true, 'Está en la lista y no está en la mesa.', 'It is on the list and not on the table.'),
        sp('bottle', 'No hay botella de agua.', 'There is no water bottle.', true, 'Está en la lista y no está en la mesa.', 'It is on the list and not on the table.'),
        sp('notebook', 'El cuaderno está sobre la mesa.', 'The notebook is on the table.', false, 'Está en la lista y ya está en la mesa.', 'It is on the list and already on the table.'),
        sp('ruler', 'La regla está sobre la mesa.', 'The ruler is on the table.', false, 'Está en la lista y ya está en la mesa.', 'It is on the list and already on the table.'),
        sp('toy', 'Hay un juguete que no está en la lista.', 'There is a toy that is not on the list.', false, 'No hace falta para mañana; se puede guardar aparte.', 'It is not needed for tomorrow; it can be put away.'),
      ],
      explain: exp('Si noto que falta algo, ¿qué hago?', 'If I notice something is missing, what do I do?',
        ch('look', 'Lo busco o pido ayuda a tiempo.', 'I look for it or ask for help in time.'),
        ch('later', 'Lo dejo para después sin avisar.', 'I leave it for later without telling anyone.'),
        ch('pretend', 'Hago como que no falta.', 'I pretend it is not missing.')),
    },
    {
      kind: 'choose',
      id: 'adulto',
      title: L('¿Cuándo pido a un adulto?', 'When do I ask a grown-up?'),
      learn: L('Ser autónomo también es saber cuándo hace falta un adulto: cuando hay algo que puede lastimar o que no sabes hacer con seguridad.', 'Being independent also means knowing when a grown-up is needed: when something could hurt or you do not know how to do it safely.'),
      example: L('Sofía ve agua derramada cerca de un enchufe. No lo toca: se aleja y avisa enseguida.', 'Sofia sees spilled water near a plug. She does not touch it: she steps away and tells a grown-up right away.'),
      prompt: L('Mientras preparas tu espacio ves que se derramó agua en el suelo cerca de un enchufe. Mira qué pasa con cada camino.', 'While getting your space ready you see water spilled on the floor near a plug. See what happens with each path.'),
      scenario: L('Hay agua cerca de un enchufe y tú estás solo en la habitación.', 'There is water near a plug and you are alone in the room.'),
      minTried: 3,
      options: [
        opt('touch', 'Tocar el enchufe para secarlo', 'Touch the plug to dry it', 'Agua y electricidad no se mezclan: es peligroso. Un adulto se encarga.', 'Water and electricity do not mix: it is dangerous. A grown-up handles it.', false),
        opt('tell', 'Alejarte y avisar enseguida a un adulto', 'Step away and tell a grown-up right away', 'El adulto puede resolverlo con seguridad. Avisar a tiempo es lo más sensato.', 'The grown-up can fix it safely. Telling in time is the wisest thing.', true),
        opt('wait', 'Esperar a ver si se seca solo', 'Wait to see if it dries on its own', 'Puede ser peligroso mientras tanto: avisar es más seguro.', 'It could be dangerous in the meantime: telling is safer.', false),
        opt('warn', 'Avisar y pedir que nadie pise ahí hasta que llegue el adulto', 'Tell someone and ask nobody to step there until the grown-up arrives', 'Cuidas a los demás mientras llega la ayuda.', 'You look after others while help arrives.', true),
      ],
      explain: exp('¿Pedir ayuda a un adulto es ser menos autónomo?', 'Is asking a grown-up for help being less independent?',
        ch('no', 'No: saber cuándo pedir ayuda es parte de ser autónomo.', 'No: knowing when to ask for help is part of being independent.'),
        ch('yes', 'Sí, siempre.', 'Yes, always.'),
        ch('never', 'Nunca debo pedir ayuda.', 'I should never ask for help.')),
    },
  ],
};
