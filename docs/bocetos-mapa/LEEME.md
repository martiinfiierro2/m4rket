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

## Recomendación

Empezaría por A: encuadre y cámara, separación visual entre suelo y muebles, sombras discretas y marcadores legibles. Tomaría de C la paleta y el acabado de las piezas. B sirve para comparar un acabado con más detalle y mayor carga de recursos.

## Origen de los bocetos

A y B se generaron con la herramienta de imágenes integrada. A utiliza la captura local real como referencia; B explora otra vista 3D. Resumen de las instrucciones: conservar la escena como volumen 3D, mejorar cámara/materiales/contraste, mantener la lista y los pines, sin funciones nuevas. C se dibujó con el kit vectorial de anatomy-asset, siguiendo como referencia el escritorio personal del portafolio.

Los scripts y páginas temporales usados para dibujar y capturar permanecen en .local, ignorados por Git. Esta entrega contiene únicamente imágenes, el SVG y esta explicación. No se ha hecho ningún cambio de implementación.
