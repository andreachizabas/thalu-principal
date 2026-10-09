# Colibrí interactivo de ThaLú

La experiencia usa Three.js en una capa `pointer-events: none` para no bloquear enlaces, botones ni formularios. El ave se construye con mallas tridimensionales articuladas para cuerpo, cabeza, ojos, pico, alas con plumas, cola y patas. Las alas baten durante el vuelo y la suspensión. El colibrí detecta decoraciones florales de la página, vuela hacia ellas con curvas Catmull-Rom, orienta el pico, simula la alimentación y después reanuda su recorrido. También responde a clics y toques, y respeta `prefers-reduced-motion`.

## Modelo y licencia

Se evaluó el modelo **Animated Hovering Flying Hummingbird Loop** de LasquetiSpice, publicado en Sketchfab bajo **CC BY**: https://sketchfab.com/3d-models/animated-hovering-flying-hummingbird-loop-102884713a2742ce829e368d2a790c45

Sketchfab requiere autenticación para descargar el archivo GLB. La versión actual usa una malla Three.js propia, ligera y animada, inspirada en la referencia visual de ThaLú. El modelo externo no está incorporado.
