/**
 * Fuentes de docs/05 (Andika para leer, Nunito para la interfaz), empaquetadas dentro de la app: no se descargan de
 * internet. Licencia SIL Open Font License (ver `LICENSE_FONT` en cada paquete `@expo-google-fonts`). Los nombres que
 * registra `useFonts` son los de `fontFamily` en `@lee-conmigo/ui-native/tokens`.
 */
import { Andika_400Regular, Andika_700Bold } from '@expo-google-fonts/andika';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black } from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';

export function useAppFonts(): boolean {
  const [loaded] = useFonts({
    Andika_400Regular,
    Andika_700Bold,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });
  return loaded;
}
