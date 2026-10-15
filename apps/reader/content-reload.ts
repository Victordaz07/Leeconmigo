/**
 * Recarga en desarrollo cuando se AGREGA o se BORRA una historia (`stories/<idioma>/<id>.json`) o un archivo de ajustes del editor
 * (`layouts/*.layout.json`). `import.meta.glob` de Vite calcula su lista de archivos al transformar el módulo y no la refresca
 * cuando aparece uno nuevo: sin esto había que reiniciar el servidor para ver una historia recién soltada en la carpeta o los
 * ajustes que el editor acaba de guardar por primera vez.
 */
import { normalizePath, type Plugin } from 'vite';

export function contentReloadPlugin(dirs: string[], importerFile: string): Plugin {
  const roots = dirs.map((d) => normalizePath(d));
  const importer = normalizePath(importerFile);
  return {
    name: 'lee-conmigo-content-reload',
    apply: 'serve',
    configureServer(server) {
      server.watcher.add(roots);
      const onFile = (file: string) => {
        const f = normalizePath(file);
        if (!f.endsWith('.json') || !roots.some((r) => f.startsWith(`${r}/`))) return;
        server.moduleGraph.getModulesByFile(importer)?.forEach((m) => server.moduleGraph.invalidateModule(m));
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', onFile);
      server.watcher.on('unlink', onFile);
    },
  };
}
