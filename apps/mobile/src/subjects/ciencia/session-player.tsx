import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { FocusSupports } from '@lee-conmigo/contracts';
import {
  bandCount,
  comparisonAdequate,
  evaluateTask,
  LADERA_DATASETS,
  PRACTICE_MAPS,
  quakesByZone,
  type LabSetup,
  type ScienceUnit,
  type StepChoice,
  type TaskDone,
  type TaskResult,
  type UnitSession,
  type UnitStep,
  type UnitTask,
} from '@lee-conmigo/science-content';
import { CIENCIA_COPY, LADERA_ZONES, chartDescription, scienceStars, scienceStarsReason, type CienciaLang } from '@lee-conmigo/ui-core';
import {
  BarChart,
  Button,
  ChevronLeftIcon,
  ClosingCard,
  colors,
  DataTable,
  FILL_IMAGE,
  fontFamily,
  gradients,
  GradientView,
  LabBoard,
  LayerToggle,
  MayaSays,
  OptionList,
  PracticeMap,
  radius,
  RoundButton,
  Scale,
  SceneZones,
  shadows,
  SpeakerIcon,
  useLayout,
  type Bar,
  type MapCell,
  type MapLayers,
} from '@lee-conmigo/ui-native';
import type { ChildProfile } from '../../app-state';
import { MovementBreakScreen } from '../../screens/movement-break-screen';
import { useMovementBreak } from '../../movement';
import { speak, stopSpeaking } from '../../tts';
import { today } from '../../today';
import { CIENCIA_BACKGROUNDS, CIENCIA_PROPS, CIENCIA_SCENES, MAYA, type MayaPose } from './art';
import { gramsFor, LADERA_ZONES_LAYOUT, mapView, MAX_GRAMS, trayViews, trialsFor, type Side } from './lab-model';
import { TaskPanel, type Picks } from './task-panel';

const SIDES: Side[] = ['a', 'b'];
const BAR_COLOR: Record<Side, string> = { a: '#c9824f', b: '#5aa66b' };

interface SessionPlayerProps {
  profile: ChildProfile;
  lang: CienciaLang;
  focus: FocusSupports;
  unit: ScienceUnit;
  session: UnitSession;
  /** Paso donde retomar («guardar y seguir después»). */
  startStep: number;
  /** Lo que ya eligió en preguntas sueltas (su idea de al principio). */
  savedChoices: Record<string, string[]>;
  onTaskDone: (task: UnitTask, done: TaskDone) => void;
  onChoice: (choiceId: string, ids: string[]) => void;
  /** Cada vez que avanza de paso (para poder retomar si cierra la app). */
  onStep: (index: number) => void;
  /** Sale sin terminar: el avance queda guardado en el paso donde iba. */
  onLeave: (index: number) => void;
  /** Llegó al final: guarda las estrellas por esfuerzo. */
  onFinish: (stars: number) => void;
  /** Cierra la tarjeta de cierre y vuelve al cuaderno de la unidad. */
  onDone: () => void;
}

interface Local {
  trial: number;
  watering: boolean;
  weighing?: { side: Side; col: number };
  layers: MapLayers;
  marks: MapCell[];
  /** Pulsó «Comprobar» en una pregunta suelta. */
  checked: boolean;
  skipped: boolean;
}

/** Al entrar a un paso: las capas del mapa (en «observa» empiezan apagadas para que el niño las encienda) y todo en cero. */
function freshLocal(step: UnitStep | undefined): Local {
  const observing = step?.taskId === 't2';
  const m = step?.map;
  return { trial: 0, watering: false, layers: { relief: !!m && !observing, volcanoes: !!m && !observing, quakes: !!m && !observing && !m.hideQuakes }, marks: [], checked: false, skipped: false };
}

const POSE: Record<UnitStep['phase'], MayaPose> = { observa: 'investiga', explora: 'apunta', explica: 'piensa', usa: 'apunta' };

/**
 * Una sesión de la unidad (≈ 15 min): observa → explora → explica → usa. Cada paso es una escena + algo que HACER (tocar,
 * predecir, regar, pesar, graficar, contar, explicar). Los modelos y los números vienen del paquete de contenido; aquí solo se
 * dibujan y se guarda lo derivado. Nunca bloquea (siempre hay «Lo veo luego») y nunca dice «incorrecto» (docs/06).
 */
export function SessionPlayer({ profile, lang, focus, unit, session, startStep, savedChoices, onTaskDone, onChoice, onStep, onLeave, onFinish, onDone }: SessionPlayerProps) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const c = CIENCIA_COPY;
  const steps = session.steps;
  const calm = focus.reducedMotion;
  const [index, setIndex] = useState(Math.min(Math.max(0, startStep), steps.length - 1));
  const step = steps[index];
  const [local, setLocal] = useState<Local>(() => freshLocal(step));
  const patch = (p: Partial<Local>) => setLocal((l) => ({ ...l, ...p }));

  // Estado de toda la sesión (lo que cruza de un paso al siguiente).
  const [picks, setPicks] = useState<Record<string, Picks>>({});
  const [hints, setHints] = useState<Record<string, 0 | 1 | 2 | 3>>({});
  const [results, setResults] = useState<Record<string, TaskResult | undefined>>({});
  const [done, setDone] = useState<Record<string, 'ok' | 'skipped'>>({});
  const [choices, setChoices] = useState<Record<string, string[]>>(savedChoices);
  const [table, setTable] = useState<Record<Side, (number | null)[]>>({ a: [null, null, null], b: [null, null, null] });
  const [bars, setBars] = useState<Record<string, number | null>>({});
  const [triedAgain, setTriedAgain] = useState(false);
  const [listened, setListened] = useState(false);
  const [closing, setClosing] = useState<{ stars: 0 | 1 | 2 | 3; reason: string } | undefined>();
  const [resting, setResting] = useState(false);
  const movement = useMovementBreak(focus.movementBreaks, profile.id, !closing);
  const scroll = useRef<ScrollView>(null);
  useEffect(() => scroll.current?.scrollTo({ y: 0, animated: false }), [index]);
  useEffect(() => () => stopSpeaking(), []);
  const wateringTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(wateringTimer.current), []);

  const task = step.taskId ? unit.tasks.find((t) => t.id === step.taskId) : undefined;
  const allSteps = useMemo(() => unit.sessions.flatMap((s) => s.steps), [unit]);
  const fix = picks.t7?.arreglo?.[0];
  const fixedLabs = allSteps.find((s) => s.labFixed)?.labFixed;
  const fixedLab: LabSetup | undefined = fixedLabs ? fixedLabs[fix ?? 'pendiente'] ?? fixedLabs.pendiente : undefined;
  const choice: StepChoice | undefined = step.choiceByFix?.[fix ?? ''] ?? step.choice;

  // ---- lo que se ve en cada bandeja y en cada tabla
  const lab: LabSetup | undefined = step.kind === 'arreglar' ? (task && done[task.id] === 'ok' && fixedLab ? fixedLab : step.lab) : step.id === 's6.3' && fixedLab ? fixedLab : step.lab;
  const trials = lab?.trials ?? 1;
  const staticLab = !!lab?.static;
  const shown = lab ? (staticLab || step.kind === 'registrar' || step.kind === 'graficar' ? 3 : local.trial) : 0;
  const effTable = (side: Side, col: number): number | null => table[side][col] ?? (lab && (staticLab || step.kind === 'graficar') ? gramsFor(lab, side, col) : null);
  const rowsFor = (l: LabSetup, own: boolean) =>
    SIDES.map((side) => ({
      id: side,
      label: `${c.tray[side === 'a' ? 'A' : 'B'][lang]}: ${c.cover[l[side].cover][lang]}, ${c.slope[l[side].slope][lang].toLowerCase()}`,
      cells: [0, 1, 2].map((col) => (own ? table[side][col] : trialsFor(l, side)[col])),
    }));

  // ---- ¿ya puede seguir?
  const taskDone = task ? done[task.id] !== undefined : true;
  const allWeighed = SIDES.every((s) => table[s].every((v) => v !== null));
  const barKeys = SIDES.flatMap((s) => [0, 1, 2].map((i) => `${s}${i}`));
  const barsSet = barKeys.every((k) => bars[k] != null);
  const flaggedBars = lab && step.kind === 'graficar' ? barKeys.filter((k) => bars[k] != null && Math.abs((bars[k] as number) - (effTable(k[0] as Side, Number(k[1])) ?? 0)) > 1) : [];
  const picked = choice ? choices[choice.id] ?? [] : [];
  const expected = choice?.options.filter((o) => o.expected).map((o) => o.id) ?? [];
  const compare = choice?.compareWith;
  const compareTask = compare ? unit.tasks.find((t) => t.id === compare.taskId) : undefined;
  const predicted = compare ? picks[compare.taskId]?.[compare.partId]?.[0] : undefined;
  const choiceGood = !choice
    ? true
    : compareTask && compare
      ? picked[0] !== undefined && (predicted === undefined || comparisonAdequate(compareTask, compare.partId, predicted, picked[0] as 'coincidio' | 'nocoincidio'))
      : expected.length
        ? picked.length === expected.length && expected.every((e) => picked.includes(e))
        : picked.length > 0;
  const needsCheck = !!choice && (expected.length > 0 || !!compare);
  const choiceReady = !choice || local.skipped || (needsCheck ? local.checked && choiceGood : picked.length > 0);

  let ready = taskDone && choiceReady;
  if (step.kind === 'probar') ready = ready && (local.trial >= trials || local.skipped);
  if (step.kind === 'registrar') ready = ready && (allWeighed || local.skipped);
  if (step.kind === 'graficar') ready = ready && ((barsSet && flaggedBars.length === 0) || local.skipped);

  // ---- acciones
  const complete = (t: UnitTask, outcome: TaskDone['outcome']) => {
    setDone((d) => ({ ...d, [t.id]: outcome === 'skipped' ? 'skipped' : 'ok' }));
    onTaskDone(t, { outcome, day: today(), maxHintLevel: hints[t.id] ?? 0, picks: picks[t.id] ?? {}, ...(listened ? { accessSupports: ['audio'] } : {}) });
  };
  const checkTask = (t: UnitTask) => {
    const r = evaluateTask(t, picks[t.id] ?? {});
    setResults((x) => ({ ...x, [t.id]: r }));
    if (r.outcome === 'ok') complete(t, 'ok');
    else setTriedAgain(true);
  };
  const water = () => {
    if (local.watering) return;
    const again = local.trial >= trials;
    if (again) setTriedAgain(true);
    const next = again ? 1 : local.trial + 1;
    if (calm) return patch({ trial: next });
    patch({ watering: true });
    wateringTimer.current = setTimeout(() => patch({ watering: false, trial: next }), 1200);
  };
  const weigh = (side: string, col: number) => patch({ weighing: { side: side as Side, col } });
  const writeDown = () => {
    const w = local.weighing;
    if (!w || !lab) return;
    setTable((t) => ({ ...t, [w.side]: t[w.side].map((v, i) => (i === w.col ? gramsFor(lab, w.side, w.col) : v)) }));
    patch({ weighing: undefined });
  };
  const setChoice = (ids: string[]) => {
    if (!choice) return;
    setChoices((x) => ({ ...x, [choice.id]: ids }));
    patch({ checked: false });
    if (!needsCheck) onChoice(choice.id, ids);
  };
  const toggleChoice = (id: string) => setChoice(choice?.multi ? (picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id]) : [id]);
  const goNext = () => {
    stopSpeaking();
    if (index + 1 < steps.length) {
      const nextStep = steps[index + 1];
      setIndex(index + 1);
      setLocal(freshLocal(nextStep));
      onStep(index + 1);
      if (movement.due) setResting(true); // límite natural: entre un paso y otro
      return;
    }
    const usedHintOrRevised = Object.values(hints).some((h) => h > 0) || picks.t8?.idea?.[0] === 'cambio';
    const stars = scienceStars({ finished: true, usedHintOrRevised, triedAgain });
    onFinish(stars);
    setClosing({ stars, reason: scienceStarsReason({ usedHintOrRevised, triedAgain })[lang] });
  };
  const listen = () => {
    setListened(true);
    speak(step.text[lang], lang);
  };
  const replay = () => {
    setClosing(undefined);
    setIndex(0);
    setLocal(freshLocal(steps[0]));
    setPicks({});
    setHints({});
    setResults({});
    setDone({});
    setTable({ a: [null, null, null], b: [null, null, null] });
    setBars({});
  };

  // ---- distribución
  const contentWidth = Math.min(layout.width - layout.gutter * 2, 1000);
  const split = !layout.narrow;
  const visualWidth = split ? Math.floor(contentWidth * 0.55) : contentWidth;
  const small = layout.phone;
  const lastStep = index + 1 >= steps.length;
  const art = { bandeja: CIENCIA_PROPS.bandeja, tierra: CIENCIA_PROPS.tierra, cobertura: CIENCIA_PROPS.cobertura, regadera: CIENCIA_PROPS.regadera };
  const bg = calm ? undefined : step.scene === 'humedal' ? CIENCIA_BACKGROUNDS.humedal : step.scene === 'laboratorio' ? CIENCIA_BACKGROUNDS.laboratorio : undefined;
  const bgSource = bg ? (layout.portrait ? bg.vertical : bg.horizontal) : undefined;
  const pose: MayaPose = task && done[task.id] === 'ok' ? 'celebra' : POSE[step.phase];

  // ---- piezas visuales
  const badge = (text: string) => (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
  const labPiece = (l: LabSetup, shownTrials: number, own = false) => (
    <View style={styles.stack}>
      <LabBoard trays={trayViews(l, shownTrials, lang)} art={art} width={visualWidth} watering={local.watering} calm={calm} />
      {l.static || step.kind === 'registrar' || step.kind === 'graficar' ? (
        <>
          <DataTable title={c.table.title[lang]} headers={[1, 2, 3].map((n) => c.trial(n)[lang])} rows={rowsFor(l, own)} unit={LADERA_DATASETS.base.unit[lang]} emptyLabel={c.table.empty[lang]} onCellPress={step.kind === 'registrar' ? weigh : undefined} active={local.weighing ? { rowId: local.weighing.side, col: local.weighing.col } : undefined} />
          {badge(c.badge.practiceData[lang])}
        </>
      ) : null}
    </View>
  );

  const visual: ReactNode = (() => {
    if (step.map) {
      const map = PRACTICE_MAPS[step.map.id];
      const { inside, total } = bandCount(map);
      const view = mapView(map, step.map.tool === 'band');
      const mapWidth = visualWidth - 24;
      const toggle = (k: keyof MapLayers) => patch({ layers: { ...local.layers, [k]: !local.layers[k] } });
      const hidden = step.map.hideQuakes && !(task && done[task.id]);
      const layers = hidden ? { ...local.layers, quakes: false } : step.map.hideQuakes ? { ...local.layers, quakes: true } : local.layers;
      const zone = quakesByZone(map);
      return (
        <View style={styles.stack}>
          <PracticeMap
            map={step.map.hideQuakes && !hidden ? { ...view, band: mapView(map, true).band } : view}
            layers={layers}
            width={mapWidth}
            marks={local.marks}
            description={c.screen.mapDescription[lang]}
            disclaimer={map.disclaimer[lang]}
            onCell={
              step.kind === 'mapa' && step.map.tool === 'band' && choice
                ? (cell) => {
                    if (!map.earthquakes.some((q) => q.col === cell.col && q.row === cell.row)) return;
                    patch({ marks: local.marks.some((m) => m.col === cell.col && m.row === cell.row) ? local.marks.filter((m) => !(m.col === cell.col && m.row === cell.row)) : [...local.marks, cell] });
                  }
                : undefined
            }
          />
          {step.taskId === 't2' ? (
            <View style={styles.toggles}>
              <LayerToggle label={c.map.relief[lang]} glyph="relief" on={local.layers.relief} onPress={() => toggle('relief')} />
              <LayerToggle label={c.map.volcanoes[lang]} glyph="volcano" on={local.layers.volcanoes} onPress={() => toggle('volcanoes')} />
              <LayerToggle label={c.map.quakes[lang]} glyph="quake" on={local.layers.quakes} onPress={() => toggle('quakes')} />
            </View>
          ) : null}
          {step.map.tool === 'band' && choice ? <Text style={styles.helper}>{`${c.map.bandHint[lang]} ${c.screen.countPrompt[lang]} ${c.screen.counted(local.marks.length)[lang]}`}</Text> : null}
          {step.map.hideQuakes && !hidden ? (
            <View style={styles.reveal}>
              <Text style={styles.revealText}>{`${c.screen.revealNow[lang]} ${c.map.revealed(zone.cerca, zone.llanura + zone.mar)[lang]}`}</Text>
            </View>
          ) : null}
          {step.kind === 'mapa' && choice && local.checked && choiceGood ? <Text style={styles.helper}>{c.map.quakesIn(inside, total)[lang]}</Text> : null}
        </View>
      );
    }
    if (lab && step.kind === 'probar') {
      return (
        <View style={styles.stack}>
          {labPiece(lab, local.trial)}
          <View style={styles.buttonsRow}>
            <Button label={(local.trial === 0 ? c.button.water : c.button.waterAgain)[lang]} onPress={water} disabled={local.watering} />
            <Text style={styles.helper}>{local.trial === 0 ? c.screen.rainPrompt[lang] : local.trial >= trials ? c.screen.trialsDone[lang] : c.trialOf(local.trial, trials)[lang]}</Text>
          </View>
        </View>
      );
    }
    if (lab && step.kind === 'registrar') {
      const w = local.weighing;
      return (
        <View style={styles.stack}>
          <LabBoard trays={trayViews(lab, 3, lang)} art={art} width={visualWidth} calm={calm} />
          <View style={styles.weighRow}>
            <Scale title={c.scale.title[lang]} grams={w ? gramsFor(lab, w.side, w.col) : null} unit="g" />
            <View style={styles.flex}>
              <Text style={styles.helper}>{w ? c.screen.weighing(c.tray[w.side === 'a' ? 'A' : 'B'][lang], w.col + 1)[lang] : allWeighed ? c.screen.tableDone[lang] : c.screen.weighPrompt[lang]}</Text>
              {w ? <View style={styles.alignStart}>
                  <Button label={c.button.writeDown[lang]} onPress={writeDown} />
                </View> : null}
            </View>
          </View>
          <DataTable title={c.table.title[lang]} headers={[1, 2, 3].map((n) => c.trial(n)[lang])} rows={rowsFor(lab, true)} unit={LADERA_DATASETS.base.unit[lang]} emptyLabel={c.table.empty[lang]} onCellPress={weigh} active={w ? { rowId: w.side, col: w.col } : undefined} />
          {badge(c.badge.practiceData[lang])}
        </View>
      );
    }
    if (lab && step.kind === 'graficar') {
      const barList: Bar[] = barKeys.map((k) => ({ id: k, label: `${k[0].toUpperCase()}${Number(k[1]) + 1}`, color: BAR_COLOR[k[0] as Side], value: bars[k] ?? null }));
      const rows = rowsFor(lab, false).map((r) => ({ label: r.label, values: r.cells.map((v, i) => v ?? effTable(r.id as Side, i) ?? 0) }));
      return (
        <View style={styles.stack}>
          <DataTable title={c.table.title[lang]} headers={[1, 2, 3].map((n) => c.trial(n)[lang])} rows={rowsFor(lab, false).map((r) => ({ ...r, cells: r.cells.map((v, i) => effTable(r.id as Side, i) ?? v) }))} unit="g" emptyLabel={c.table.empty[lang]} />
          <BarChart title={c.chart.title[lang]} axisLabel={c.chart.axis[lang]} bars={barList} max={MAX_GRAMS} width={visualWidth} onSet={(id, g) => setBars((b) => ({ ...b, [id]: g }))} description={chartDescription(rows, lang)} flagged={flaggedBars} />
          <Text style={styles.helper}>{barsSet ? (flaggedBars.length ? c.chart.differs[lang] : c.chart.matches[lang]) : `${c.screen.chartPrompt[lang]} ${c.screen.chartHelp[lang]}`}</Text>
          {badge(c.badge.practiceData[lang])}
        </View>
      );
    }
    if (lab) {
      return (
        <View style={styles.stack}>
          {step.kind === 'arreglar' && task && done[task.id] === 'ok' ? <Text style={styles.helper}>{c.screen.fixedPrompt[lang]}</Text> : null}
          {labPiece(lab, shown)}
        </View>
      );
    }
    if (step.scene === 'ladera') {
      const interactive = step.taskId === 't1';
      const zones = interactive ? LADERA_ZONES_LAYOUT.map((z) => ({ ...z, label: LADERA_ZONES[z.id][lang] })) : [];
      const sel = picks.t1?.observaciones ?? [];
      return (
        <SceneZones
          source={CIENCIA_SCENES.ladera}
          aspect={1536 / 1024}
          width={visualWidth}
          zones={zones}
          selected={sel}
          imageLabel={step.text[lang]}
          onToggle={(id) => {
            if (!task || done[task.id]) return;
            const cur = picks.t1?.observaciones ?? [];
            setPicks((p) => ({ ...p, t1: { ...p.t1, observaciones: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] } }));
          }}
        />
      );
    }
    if (step.scene === 'humedal') return <Image source={CIENCIA_BACKGROUNDS.humedal.horizontal} style={{ width: visualWidth, height: visualWidth * 0.62, borderRadius: radius.card }} resizeMode="cover" accessible={false} />;
    return null;
  })();

  // ---- lo que el niño hace en este paso
  const interact: ReactNode = (
    <View style={styles.stack}>
      {step.id === 's6.4' ? <IdeaRecap lang={lang} unit={unit} chosen={choices.ideaInicial?.[0]} /> : null}
      {step.glossary ? (
        <View style={styles.glossary}>
          {step.glossary.map((g) => {
            const e = unit.glossary.find((x) => x.es === g);
            return e ? (
              <View key={g} style={styles.word}>
                <Text style={styles.wordTitle}>{lang === 'es' ? e.es : e.en}</Text>
                <Text style={styles.wordNote}>{e.note[lang]}</Text>
              </View>
            ) : null;
          })}
        </View>
      ) : null}
      {task ? (
        <TaskPanel
          task={task}
          lang={lang}
          small={small}
          picks={picks[task.id] ?? {}}
          onPicks={(next) => setPicks((p) => ({ ...p, [task.id]: next }))}
          hintLevel={hints[task.id] ?? 0}
          onHint={() => setHints((h) => ({ ...h, [task.id]: Math.min(3, (h[task.id] ?? 0) + 1) as 1 | 2 | 3 }))}
          result={results[task.id]}
          done={done[task.id]}
          onCheck={() => checkTask(task)}
          onSkip={() => complete(task, 'skipped')}
        />
      ) : null}
      {choice ? (
        <View style={styles.stack}>
          {compareTask && compare ? <CompareRecap lang={lang} task={compareTask} partId={compare.partId} predicted={predicted} /> : null}
          <OptionList small={small} compact={choice.options.every((o) => o.text[lang].length <= 3)} multi={choice.multi} options={choice.options.map((o) => ({ id: o.id, text: o.text[lang], state: local.checked && !choiceGood && needsCheck && picked.includes(o.id) && !o.expected && expected.length > 0 ? ('rejected' as const) : undefined }))} selected={picked} onToggle={toggleChoice} disabled={local.skipped || (local.checked && choiceGood)} />
          {needsCheck && !local.skipped && !(local.checked && choiceGood) ? (
            <View style={styles.buttonsRow}>
              <Button label={c.button.check[lang]} disabled={picked.length === 0} onPress={() => patch({ checked: true })} />
              <Button label={c.button.later[lang]} variant="secondary" onPress={() => patch({ skipped: true })} />
            </View>
          ) : null}
          {local.checked && needsCheck ? (
            <View style={[styles.note, choiceGood && styles.noteOk]} accessibilityLiveRegion="polite">
              <Text style={styles.noteText}>{choiceGood ? c.guide.wellDone[lang] : c.screen.tryAgainNote[lang]}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
      {(step.kind === 'probar' || step.kind === 'registrar' || step.kind === 'graficar') && !(choice && needsCheck) && !local.skipped && !ready ? (
        <Button label={c.button.later[lang]} variant="secondary" onPress={() => patch({ skipped: true })} />
      ) : null}
    </View>
  );

  return (
    <View style={styles.screen}>
      {bgSource ? <Image source={bgSource} style={[FILL_IMAGE, styles.bg]} resizeMode="cover" accessible={false} /> : null}
      <View style={[styles.header, { paddingTop: insets.top + 12, paddingHorizontal: layout.gutter }]}>
        <View style={styles.headerRow}>
          <RoundButton onPress={() => onLeave(index)} label={c.screen.leave[lang]}>
            <ChevronLeftIcon />
          </RoundButton>
          <GradientView gradient={gradients.subjCiencia} style={styles.pill}>
            <Text style={styles.pillText}>🔬 {c.subject[lang]}</Text>
          </GradientView>
          {!layout.narrow ? <Phases current={step.phase} lang={lang} /> : null}
          <View style={styles.flex} />
          <Text style={styles.meta}>{c.screen.stepOf(index + 1, steps.length)[lang]}</Text>
        </View>
        {layout.narrow ? <Phases current={step.phase} lang={lang} /> : null}
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${Math.round(((index + 1) / steps.length) * 100)}%` }]} />
        </View>
      </View>
      <ScrollView ref={scroll} contentContainerStyle={[styles.content, { paddingHorizontal: layout.gutter, paddingBottom: insets.bottom + 24 }]}>
        <View style={{ width: contentWidth, alignSelf: 'center', gap: 16 }}>
          <View style={styles.sayRow}>
            <View style={styles.flex}>
              <MayaSays pose={calm ? undefined : MAYA[pose]} height={small ? 88 : 118} text={step.text[lang]} />
            </View>
            <RoundButton onPress={listen} label={c.screen.listen[lang]}>
              <SpeakerIcon />
            </RoundButton>
          </View>
          <View style={[styles.body, split && styles.bodySplit]}>
            {visual ? <View style={split ? { width: visualWidth } : undefined}>{visual}</View> : null}
            <View style={styles.flex}>{interact}</View>
          </View>
          <View style={styles.footer}>
            <Button label={c.button.saveLater[lang]} variant="secondary" onPress={() => onLeave(index)} />
            <Button label={(lastStep ? c.button.done : c.button.next)[lang]} large disabled={!ready} onPress={goNext} />
          </View>
        </View>
      </ScrollView>
      {resting ? (
        <MovementBreakScreen
          n={movement.count}
          lang={lang}
          onDone={() => {
            movement.taken();
            setResting(false);
          }}
        />
      ) : null}
      {closing ? (
        <ClosingCard
          name={profile.name}
          stars={closing.stars}
          reason={closing.reason}
          stats={[
            { label: c.notebook.sessionOf(unit.sessions.findIndex((s) => s.id === session.id) + 1, unit.sessions.length)[lang], value: '✓' },
            { label: c.screen.steps[lang], value: String(steps.length) },
          ]}
          onAgain={replay}
          onDone={() => onDone()}
        />
      ) : null}
    </View>
  );
}

/** Las cuatro píldoras de la sesión: la actual resaltada, las anteriores con ✓. */
function Phases({ current, lang }: { current: UnitStep['phase']; lang: CienciaLang }) {
  const order: UnitStep['phase'][] = ['observa', 'explora', 'explica', 'usa'];
  const at = order.indexOf(current);
  return (
    <View style={styles.phases}>
      {order.map((p, i) => (
        <View key={p} style={[styles.phase, i < at && styles.phaseDone, i === at && styles.phaseNow]}>
          <Text style={[styles.phaseText, i === at && styles.phaseTextNow]}>{i < at ? '✓ ' : `${i + 1} `}{CIENCIA_COPY.phase[p][lang]}</Text>
        </View>
      ))}
    </View>
  );
}

/** «Tu idea de al principio»: se la devuelve al niño para que la revise con sus datos (S6). */
function IdeaRecap({ lang, unit, chosen }: { lang: CienciaLang; unit: ScienceUnit; chosen: string | undefined }) {
  const step = unit.sessions.flatMap((s) => s.steps).find((s) => s.choice?.id === 'ideaInicial');
  const option = step?.choice?.options.find((o) => o.id === chosen);
  if (!step || !option) return null;
  return (
    <View style={styles.recap}>
      <Text style={styles.recapKicker}>{CIENCIA_COPY.screen.initialIdea[lang]}</Text>
      <Text style={styles.recapText}>{`${step.text[lang]} ${option.text[lang]}`}</Text>
    </View>
  );
}

/** Lo que predijo y lo que se vio, lado a lado, para comparar con honestidad. */
function CompareRecap({ lang, task, partId, predicted }: { lang: CienciaLang; task: UnitTask; partId: string; predicted: string | undefined }) {
  const part = task.parts.find((p) => p.id === partId);
  const guess = part?.options.find((o) => o.id === predicted);
  const seen = part?.options.find((o) => o.id === part.observedOptionId);
  return (
    <View style={styles.recap}>
      {guess ? <Text style={styles.recapText}>{`${CIENCIA_COPY.screen.predicted[lang]}: ${guess.text[lang]}`}</Text> : null}
      {seen ? <Text style={styles.recapText}>{`${CIENCIA_COPY.screen.observed[lang]}: ${seen.text[lang]}`}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  bg: { opacity: 0.4 },
  header: { gap: 10, paddingBottom: 10, backgroundColor: 'rgba(255,253,248,0.94)', zIndex: 2 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pill: { borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 8 },
  pillText: { fontFamily: fontFamily.ui.black, fontSize: 16, color: '#ffffff' },
  flex: { flex: 1 },
  meta: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.muted },
  bar: { height: 8, borderRadius: 4, backgroundColor: colors.track, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.ok, borderRadius: 4 },
  content: { paddingTop: 18, flexGrow: 1 },
  sayRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  body: { gap: 16 },
  bodySplit: { flexDirection: 'row', alignItems: 'flex-start' },
  stack: { gap: 12 },
  buttonsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' },
  toggles: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  alignStart: { alignSelf: 'flex-start' },
  weighRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  helper: { fontFamily: fontFamily.ui.bold, fontSize: 16, lineHeight: 22, color: colors.inkSoft, flexShrink: 1 },
  badge: { alignSelf: 'center', backgroundColor: colors.warnTint, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 5 },
  badgeText: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.orangeDeep },
  reveal: { backgroundColor: colors.violet50, borderRadius: radius.tile, padding: 12 },
  revealText: { fontFamily: fontFamily.ui.bold, fontSize: 16, lineHeight: 22, color: colors.violetDeep },
  note: { backgroundColor: colors.warnTint, borderRadius: radius.tile, padding: 14 },
  noteOk: { backgroundColor: colors.okTint },
  noteText: { fontFamily: fontFamily.ui.bold, fontSize: 17, lineHeight: 24, color: colors.ink },
  glossary: { gap: 10 },
  word: { backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 14, gap: 2, boxShadow: shadows.soft },
  wordTitle: { fontFamily: fontFamily.ui.black, fontSize: 19, color: colors.navy },
  wordNote: { fontFamily: fontFamily.ui.bold, fontSize: 16, lineHeight: 22, color: colors.inkSoft },
  recap: { backgroundColor: colors.focusTint, borderRadius: radius.tile, padding: 14, gap: 4 },
  recapKicker: { fontFamily: fontFamily.ui.black, fontSize: 13, color: colors.orangeDeep, textTransform: 'uppercase' },
  recapText: { fontFamily: fontFamily.ui.bold, fontSize: 17, lineHeight: 24, color: colors.ink },
  footer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  phases: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  phase: { borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5, backgroundColor: colors.chip },
  phaseDone: { backgroundColor: colors.okTint },
  phaseNow: { backgroundColor: colors.phaseAprender, boxShadow: `inset 0px -3px 0px ${colors.phaseAprenderLedge}` },
  phaseText: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.muted },
  phaseTextNow: { color: colors.ink },
});
