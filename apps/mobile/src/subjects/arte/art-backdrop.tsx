import { Image, StyleSheet } from 'react-native';
import { useLayout } from '@lee-conmigo/ui-native';
import { ARTE_ART } from './art';

/** Fondo ilustrado de un taller (ritmo o pintura), detrás de todo. Elige la versión horizontal o vertical según la pantalla. No recibe toques. */
export function ArtBackdrop({ kind }: { kind: 'ritmo' | 'pintura' }) {
  const layout = useLayout();
  const art = ARTE_ART[kind];
  return <Image source={layout.portrait ? art.vertical : art.horizontal} resizeMode="cover" accessible={false} style={styles.fill} />;
}

const styles = StyleSheet.create({ fill: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' } });
