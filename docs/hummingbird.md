# Colibrí interactivo de ThaLú

La experiencia usa Three.js en una capa `pointer-events: none` para no bloquear enlaces, botones ni formularios. El colibrí se mueve mediante curvas Catmull-Rom, reacciona a clics y toques, pausa cerca del destino y respeta `prefers-reduced-motion`.

## Modelo y licencia

Se evaluó el modelo **Animated Hovering Flying Hummingbird Loop** de LasquetiSpice, publicado en Sketchfab bajo **CC BY**: https://sketchfab.com/3d-models/animated-hovering-flying-hummingbird-loop-102884713a2742ce829e368d2a790c45

Sketchfab requiere autenticación para descargar el archivo GLB. La implementación actual usa una representación Three.js ligera como fallback autónomo hasta incorporar el GLB descargado con su atribución y archivo de licencia.
