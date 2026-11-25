# Validación de la recuperación local

Validación inicial: 24 de noviembre de 2026. Despliegue local comprobado: 25 de noviembre de 2026. Rama: `feat/recuperacion-local`. La preparación inicial del 4 de noviembre se amplió con las correcciones y pruebas descritas aquí. El registro por commit está en el [README](../README.md#registro-de-recuperación).

## Entorno probado

- Windows, MariaDB 10.4.32 y SQL importado en una base separada: `m4rket_test_20261124` en 127.0.0.1:3307. Fotografías de prueba en una carpeta separada. La base de trabajo `m4rket_local` y las imágenes originales no se utilizaron para los borrados de prueba.
- Node 20.20.1 durante la recuperación de API, web e Ionic; Node 24.15.0 instalado en Windows y npm 10.5.0 para la preparación, compilaciones y arranque finales. Los tres puertos se comprobaron asociados a `C:\Program Files\nodejs\node.exe`.
- Dependencias de los tres lockfiles instaladas con `npm ci --ignore-scripts`. Hubo cortes de red y se completó la instalación tras reintentar, sin cambiar versiones ni desactivar TLS.
- Los comandos actuales no descargan ni necesitan Node portable ni inician MariaDB. `.nvmrc` conserva 20.20.1 como referencia opcional para gestores de versiones; no cambia el Node del equipo.

## Resultados

| Comprobación | Resultado |
| --- | --- |
| SQL | 10 tablas y datos demo coherentes con los modelos y relaciones; segunda importación sin duplicar ni sobrescribir filas existentes. |
| Preparación npm | Dependencias de API, Angular e Ionic instaladas. El contenido de `backend/.env.local` coincide antes y después. |
| Configuración de copia nueva | Comprobadas generación de JWT y configuración 3306 en un directorio de prueba, y conservación del fichero al repetir preparación. |
| Web: producción | Correcta con Node 20 y con Node 24; salida actual `dist/web/browser`. |
| Ionic: TypeScript y producción | Correctos con Node 20; compilación final también correcta con Node 24 en `dist/mobile`. |
| Arranque conjunto | `npm start`: API 3030, panel 4200 e Ionic 4201, los tres con Node instalado. |
| Parada | Ctrl+C dejó 0 listeners de aplicación y mantuvo MariaDB en 3307. En npm.cmd, Windows puede pedir confirmar el fin del trabajo por lotes. |
| API y MariaDB | **61 comprobaciones superadas** con el lanzador definitivo. |
| Fotografías | **16 respuestas de imagen correctas**, una por producto demo; subida temporal y conservación de fotos compartidas/default comprobadas. |
| Limpieza | Mismos recuentos en las 10 tablas antes y después del verificador. Cuenta y datos de la prueba móvil eliminados de la base temporal. |
| Navegador: arranque final | Catálogo web y mapa Ionic cargados, sin errores de JavaScript/console ni respuestas HTTP fallidas de la aplicación en ese recorrido. |

## Peticiones de API comprobadas

Acceso con los tres roles y renovación de token; catálogo, búsqueda y paginación; datos nutricionales y asociaciones con ubicaciones/promociones; consultas estadísticas por fecha, medias, rankings y alias que usan los clientes; edición de usuario y ubicación sin falso duplicado; renombrado de tipo de promoción; creación/edición/borrado temporal de producto, promociones, relaciones, lista de compra, cantidades, estado comprado, contadores e intervalos; lectura/subida de fotos y rechazo de rutas que salen del directorio permitido.

La evidencia de rutas y recuentos está en [verificacion-local.json](./verificacion-local.json). `npm run check:api` repite la prueba con MariaDB y API ya arrancadas. Requiere una base demo con sus datos iniciales y hace escrituras temporales: no se utiliza sobre una base de trabajo propia.

## Web Angular en navegador

Acceso de superadministrador y pantallas de productos, promociones, ubicaciones, cuentas, estadísticas y dataset; alta mediante el formulario de tres pasos con foto, edición de producto y limpieza del dato temporal; exportaciones CSV y XLSX descargadas y PDF abierto; cambio de listado estadístico y filtros de 7 días, mes y año sin IDs indefinidos ni valores NaN/Infinity.

La ficha pública del dataset y su buscador no tienen implementación completa en ninguna versión histórica de esos archivos. Se conservan como estaban, tras la búsqueda solicitada por el usuario. No se ha añadido esa funcionalidad.

## Ionic y motor en navegador

Comprobaciones en Chromium con viewport 390 × 844:

- Login, registro, salida y acceso posterior con otra cuenta; tokens de sesión y local coherentes.
- Búsqueda, alta en lista, incremento/decremento, marcar y desmarcar comprado, recarga con persistencia, eliminación individual, solo comprados y lista completa.
- Tras quitar comprados queda el producto pendiente tanto en la lista como en el mapa. Tras vaciar la lista no quedan pines y siguen existiendo las 41 ubicaciones del supermercado.
- Contexto WebGL2 real, 4 pines de la lista inicial y estado comprado del producto 62 recuperado desde MariaDB.
- Tocar un pin abre la ficha de su producto. Desplazamiento y zoom con eventos táctiles simulados y control de rotación comprobados.
- Regresión final de las ocho acciones de lista/sesión sin errores de JavaScript. Prueba final de arranque con Node 24 sin errores de consola ni peticiones locales fallidas.

Estas pruebas no equivalen a una validación en un teléfono físico ni a una compilación Android/iOS. No cubren todas las combinaciones de datos o dispositivos.

## Alcance conservado

Se mantienen el diseño y las funciones originales. No se han actualizado frameworks ni optimizado sus paquetes. Continúan los avisos de tamaño, CSS/CommonJS y algunas deprecaciones de dependencias antiguas; no impiden las compilaciones comprobadas. La etiqueta anual «2024» permanece aunque el filtro consulta el año actual.

Los permisos originales de la API se conservan por decisión expresa del usuario. Chatbot, infraestructura OVH/Prometheus, dominio y builds nativos quedan fuera. La carga del chatbot externo está desactivada.

En la validación del 24/11/2026 el remoto era el espejo local y no se había publicado el histórico. El 25/11/2026 se configura el destino personal público `martiinfiierro2/m4rket`; el usuario indica conservar el historial original y mantener la recuperación en `feat/recuperacion-local`. La configuración actual de MariaDB y JWT continúa en el fichero local ignorado por Git.

## Despliegue en el MariaDB habitual de XAMPP (25/11/2026)

Importado el SQL de demostración en una base nueva `m4rket_local`, en `127.0.0.1:3306` con MariaDB 10.4.32. Comprobados UTF-8 (`utf8mb4_unicode_ci`), las 10 tablas InnoDB, las 9 claves foráneas y los recuentos del manifiesto. La cuenta `m4rket_app` conecta con permisos SELECT, INSERT, UPDATE y DELETE limitados a esa base; la configuración y su copia anterior permanecen privadas. La clave JWT se ha conservado.

`npm run check:api` ha superado 61 comprobaciones de API y 16 imágenes utilizando la conexión definitiva del backend. Los accesos de usuario, admin y superAdmin, las asociaciones del catálogo, listas, estadísticas y operaciones temporales funcionan. El verificador ha limpiado sus filas y su imagen temporal, y las diez tablas mantienen los recuentos iniciales.

La API usada para verificar se ha detenido al terminar; MariaDB permanece arrancada. El arranque habitual es MySQL en XAMPP y `npm start` desde la raíz del repositorio. No se reinstalan dependencias ni se reimporta el SQL para cada arranque.

Evidencia de este despliegue, sin credenciales: [despliegue-mariadb-local.json](./despliegue-mariadb-local.json). El informe de [peticiones](./verificacion-local.json) corresponde ahora a esta comprobación en el puerto 3306. Las compilaciones y los recorridos de navegador descritos arriba son los realizados el 24/11/2026.
