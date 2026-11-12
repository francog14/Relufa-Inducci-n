# Relufa · Inducción de reparto

Simulador web responsive para la inducción de repartidores.

Incluye asignación de ruta, cinco pedidos ficticios, cierre exitoso o fallido, firma de práctica, cámara completamente simulada e historial local.

## Publicación

GitHub Pages publica desde `main`, carpeta raíz. No requiere compilación ni dependencias.

## Uso local

Abre `index.html` o ejecuta `python -m http.server 4173` en esta carpeta.

Los pedidos, fotos y ubicaciones son simulados. El progreso se guarda en el navegador. El contenido del manual debe validarse con el equipo de Relufa antes de utilizarlo como procedimiento oficial.

## Inducción guiada con voz

Pulsa Iniciar inducción. La guía explica cada acción, resalta el control y avanza cuando completas el paso. Incluye subtítulos, pausa, repetir y silenciar. Usa SpeechSynthesis con una voz en español del dispositivo; si no está disponible, los subtítulos permiten continuar. Al ocultar la pestaña se pausa la guía. No requiere API keys ni un servicio de audio propio.

