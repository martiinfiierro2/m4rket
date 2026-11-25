# Bocetos de mejora del supermercado 3D

Son referencias visuales. No se ha modificado el motor gráfico, sus métodos, los modelos, las cámaras ni la aplicación.

| Boceto | Qué propone | Alcance |
| --- | --- | --- |
| [A · Motor actual mejorado](./A-motor-3d-mejorado.png) | Mantener una disposición reconocible de la captura actual, con cámara algo más alta, mejor encuadre, materiales marfil/salvia, contraste y pines numerados. | La referencia recomendada para evolucionar el proyecto conservando su identidad. La imagen generada no garantiza medidas ni coordenadas exactas. |
| [B · Maqueta 3D más detallada](./B-maqueta-3d.png) | Cámara más cenital pero con volumen 3D, muebles bajos, productos y acabados más elaborados. | Alternativa estética con mayor trabajo de modelado y recursos; no es un cambio ya aplicado. |
| [C · Maqueta vectorial](./C-maqueta-vectorial.png) | El acabado isométrico del escritorio del portafolio aplicado a una maqueta de supermercado: caras sólidas, biseles y una paleta contenida. | Referencia de estilo para el aspecto del motor 3D. El SVG no sustituye al motor. |

El [SVG de C](./C-maqueta-vectorial.svg) es vectorial real: 112 piezas sólidas, cuatro tonos de sombreado y ningún mapa de bits incrustado. Está realizado con **anatomy-asset**, la misma skill y kit utilizados en el escritorio del portafolio. Se entrega también el PNG para verlo fácilmente.

Las distribuciones de B y C son ilustrativas: no reproducen exactamente las 41 ubicaciones de la base recuperada. Las tres propuestas mantienen la idea de localizar productos de la lista en una escena 3D; no proponen navegación, GPS, rutas ni chatbot.

## Revisión con las fotos reales de productos

- [A v2 · con fotos](./A-v2-con-fotos.png): los marcadores y el listado usan como referencia las fotografías del catálogo de Valor, Dulcesol, Lay’s y Gillette. Generado con la herramienta de imágenes a partir del boceto A y esas cuatro fotografías; el cambio solicitado se centra en reconocer el producto por su envase.
- [C v2 · con fotos](./C-v2-con-fotos.png): conserva la maqueta vectorial e incorpora las cuatro fotografías originales en los marcadores, más la foto de chocolate en la ficha. Los números han sido sustituidos por las imágenes.
- [SVG de C v2](./C-v2-con-fotos.svg): composición híbrida de geometría vectorial y fotografías PNG originales incrustadas, sin enlaces externos. La primera versión de C sigue siendo vectorial pura.

Ambas son bocetos. La aplicación, su motor y sus datos permanecen intactos. Se conservan las versiones iniciales para comparar.

## Revisión geométrica de C y vistas de A

- [C v3 · revisada](./C-v3-revisada.png), [SVG](./C-v3-revisada.svg) y [detalle ampliado](./C-v3-detalle.png): baldas y paneles ya no se penetran; las tapas apoyan sobre los laterales; las puertas de los frigoríficos están unidas a sus cuerpos; los soportes de monitores quedan bajo las pantallas. Los marcadores conservan las fotos originales y terminan en su punto de anclaje.
- El orden de dibujo se ha resuelto por la superposición de las piezas individuales, en lugar de ordenar cada mueble por su centro. Esto recupera elementos que quedaban ocultos por superficies que debían estar detrás.
- Comprobadas las 112 piezas del boceto: sin piezas sin apoyo, penetraciones ni conflictos de profundidad en la vista entregada. Comprobado también un detalle ampliado de baldas y caja.
- [A · cuatro vistas](./A-vistas-frontal-trasera-laterales.png): frontal, trasera y los dos laterales en una lámina. Son vistas conceptuales generadas usando A como referencia; no son giros matemáticos del modelo original ni planos técnicos.

No hay cambios de implementación. Las fotos y los bocetos anteriores se conservan.

## Mapa 3D ampliado por secciones

- [Lámina con secciones](./Mapa-3D-ampliado-secciones.png): propuesta de supermercado más grande, dividida en frutas y verduras, lácteos y frío, despensa, snacks y chocolates, pan y bollería, bebidas, higiene, cajas y acceso/salida.
- [Vista limpia](./Mapa-3D-ampliado-limpio.png): la misma propuesta sin rótulos de departamento, con los marcadores fotográficos.

Los nombres y las líneas de las secciones son anotaciones exteriores del boceto: no se añaden al motor. Se conservan el volumen 3D y las fotos de productos usadas como referencia. Es una propuesta de ampliación visual, no la distribución exacta de las 41 ubicaciones recuperadas; no cambia geometría, datos ni código de la aplicación.

Las imágenes se generaron con la herramienta integrada a partir del estilo A y las fotografías del catálogo. Instrucciones principales: ampliar la superficie y agrupar muebles por departamento, conservar el estilo 3D marfil/salvia y las fotos, y colocar los rótulos únicamente fuera del mapa en la lámina explicativa.

## Estanterías llenas

- [Vista limpia con mercancía](./Mapa-3D-estanterias-llenas-limpio.png).
- [Lámina por secciones con mercancía](./Mapa-3D-estanterias-llenas-secciones.png).

Revisión visual del mapa ampliado: estanterías abastecidas según su departamento, conservando la distribución general y las fotos de los marcadores. Despensa contiene arroz, pasta y conservas; snacks incluye referencias visuales de Valor y Lay’s; higiene incluye Gillette y otros envases; bollería incorpora Dulcesol junto al pan existente. La mercancía adicional es ilustrativa, no un inventario recuperado ni nuevos datos de la base.

Edición realizada con la herramienta de imágenes integrada, usando cada lámina como destino y las cuatro fotos del catálogo como referencia. Se conservan las versiones anteriores. No hay cambios en el motor ni en la aplicación.

## Recomendación

Empezaría por A: encuadre y cámara, separación visual entre suelo y muebles, sombras discretas y marcadores legibles. Tomaría de C la paleta y el acabado de las piezas. B sirve para comparar un acabado con más detalle y mayor carga de recursos.

## Origen de los bocetos

A y B se generaron con la herramienta de imágenes integrada. A utiliza la captura local real como referencia; B explora otra vista 3D. Resumen de las instrucciones: conservar la escena como volumen 3D, mejorar cámara/materiales/contraste, mantener la lista y los pines, sin funciones nuevas. C se dibujó con el kit vectorial de anatomy-asset, siguiendo como referencia el escritorio personal del portafolio.

Los scripts y páginas temporales usados para dibujar y capturar permanecen en .local, ignorados por Git. Esta entrega contiene únicamente imágenes, el SVG y esta explicación. No se ha hecho ningún cambio de implementación.

## Punto de recuperación de las propuestas (25/11/2026)

Se conservan como opciones la maqueta 3D A y el acabado vectorial C, ambos con fotos, así como las dos últimas láminas del mapa ampliado abastecido: limpia y con secciones. Las mejoras visuales quedan aplazadas mientras se prepara la base de datos local. No se ha implementado ningún cambio gráfico.

Las vistas generadas desde esquinas, lados y arriba están guardadas en [vistas-completas](./vistas-completas). Son referencias conceptuales, no capturas del motor real; no garantizan una geometría idéntica entre imágenes.
