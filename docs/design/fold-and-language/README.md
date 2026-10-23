# Pantallas plegables e idioma de interfaz

Petición de Victor (2026-10-22): depurar vertical/horizontal en Z Fold 7, conservar accesibles los botones del panel de padres y completar la interfaz inglesa. También se aprueba el concepto de lectura mostrado en dos imágenes.

## Cambios

- Lectura por escenas de los dos cuentos: cualquier ventana horizontal usa ilustración izquierda (38 %) y texto derecho con desplazamiento independiente. En vertical/cuadrado, arte arriba y texto debajo. El límite anterior de 960 puntos y la exclusión de ventanas bajas impedían usar columnas en teléfonos y plegables.
- Avance circular de 48 puntos, progreso fino, cabecera compacta y zona inferior reservada: el botón no tapa palabras. La letra continúa ajustable; se conserva el encuadre revisado de cada ilustración, sin estirarla ni inventar recortes.
- Panel de padres: cabecera y accesos fuera del contenido desplazable. Los accesos tienen una fila horizontal desplazable en ventanas estrechas; no desaparecen al bajar el informe. Botones compactos con área táctil de 48 puntos.
- Ajustes: columnas según el ancho disponible, no según una supuesta clase de dispositivo. Una columna bajo 900 puntos, anchos mínimos flexibles y altura del ScrollView acotada. El panel usa una columna bajo 1000 puntos; también el cuaderno de lectura evita la doble página estrecha. Guardar sigue accesible y el borrador del perfil sobrevive al redimensionamiento.
- Idioma: un contexto de interfaz sigue el idioma del perfil elegido y recuerda el último para el selector/PIN. Inicio, nombres de cuadernos, navegación, padres, ajustes, recordatorios, informe/PDF, ayuda de palabras, cierres y pantallas de diagnóstico usan ES/EN. Legal usa el idioma actual, sin modificar el idioma histórico del consentimiento. Nuevo texto del ajuste: «Idioma de la app y de lectura».
- No se traducen a ciegas cuentos, vocabulario ni escritos del niño: se mantienen sus versiones editoriales y datos originales. Pronunciación sigue pasando por `tts.ts`; no se cambia el motor de voz. El lector antiguo obtiene copia inglesa de preparación/estados/feedback cuando corresponde.
- La preferencia local `kitewise.v1.language` sobrevive a borrar progreso, pero se elimina al borrar todos los datos. Sin cambio del esquema de progreso ni dependencias nuevas.

## Verificación

`VERIFICATION.json` y capturas reales de la app web nativa en `previews/` (perfiles sintéticos).

- 1.843 pruebas / 126 archivos; TypeScript de todos los workspaces. Lint sin errores; permanecen tres avisos previos de dependencias de hooks del modelo de progreso y la prueba del lienzo.
- `npm run test:native-layout`: 168 portadas en 12 tamaños, mediante el Yoga C++ instalado con RN. Requiere C++20 y dependencias de desarrollo.
- `node scripts/fold-interface-smoke.mjs`: 24 comprobaciones de padres/ajustes/lector en ocho ventanas, cambiando tamaño sin recargar (360×800, 720×800, 800×720, 900×740, 740×900, 720×720, 844×390, 1280×800). Verifica acceso a botones tras desplazar, borrador conservado, geometría imagen/texto, avance compacto, ausencia de desborde, ayuda/TTS simulado, rutas inglesas y cambio EN→ES persistente al reiniciar.
- `node scripts/reading-pilot-smoke.mjs`: recorridos completos de ambos cuentos en ES/EN, cuatro tamaños, ayudas, reanudación, preguntas y repaso. Se corrigen las expectativas del script que antes asumían botones españoles en inglés.
- Exportación de PDF inglesa probada con escape de datos, fechas y títulos editoriales intactos.

No se dispone de un Z Fold físico. Los cambios de ventana en navegador y el motor Yoga no sustituyen la prueba del sistema Android, tacto, teclado y TTS audible en el equipo de Victor.

## Entrega

Código listo para versión 0.1.1 / versionCode 2. Mismo paquete y llave de pruebas: se instalará sobre el APK anterior para conservar datos. Compilación/publicación y comprobación de la nueva descarga pendientes; no confundir el APK anterior con esta corrección.
