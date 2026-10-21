/**
 * Exportar el informe a PDF. El PDF se arma en la tableta (`expo-print`) y solo sale si el adulto elige dónde compartirlo en la hoja del sistema
 * (`expo-sharing`); la app no sube nada. En el navegador (desarrollo) abre el cuadro de imprimir.
 */
import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export type ExportResult = 'shared' | 'printed' | 'unavailable' | 'error';

export async function exportReportPdf(html: string, dialogTitle: string): Promise<ExportResult> {
  try {
    if (Platform.OS === 'web') {
      await Print.printAsync({ html });
      return 'printed';
    }
    const { uri } = await Print.printToFileAsync({ html });
    if (!(await Sharing.isAvailableAsync())) return 'unavailable';
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle, UTI: 'com.adobe.pdf' });
    return 'shared';
  } catch {
    return 'error';
  }
}
