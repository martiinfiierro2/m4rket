# m4rket
[ABPGC23] Proyecto de Contenidos del grupo 4AM de ABP 2023/24

## Organización de las carpetas

El repositorio y sus archivos están directamente en `C:\Users\Martin\OneDrive\Documentos\Github\m4rket`. Abre esa carpeta en el editor y ejecuta los comandos desde ella:

```powershell
cd "C:\Users\Martin\OneDrive\Documentos\Github\m4rket"
git branch
```

La estructura de esta instalación es:

```text
m4rket/
├── .git/       Metadatos Git y respaldo original privado en respaldo-original.git.
├── backend/    API y configuración local.
├── frontend/   Panel Angular y aplicación Ionic.
├── database/   SQL con esquema y datos de demostración.
├── scripts/    Preparación, arranque y comprobación.
├── uploads/    Fotografías recuperadas.
├── dist/       Compilaciones generadas; ignoradas por Git.
└── .local/     Archivos auxiliares y pruebas; opcional, ignorado por Git.
```

La rama de recuperación se llama `local`, separada de `main`. Las ramas se seleccionan con Git dentro de esta misma carpeta. El espejo original se conserva en `.git/respaldo-original.git` como archivo privado de esta instalación, y el remoto `espejo-local` apunta a él.

`.local`, con punto, guarda los archivos de preparación anteriores. El arranque normal usa Node/npm instalados y MariaDB de XAMPP. La [guía local](./README_LOCAL.md) detalla el entorno y las cuentas demo.

## Ramas y sincronización con GitHub

Destino personal público: [martiinfiierro2/m4rket](https://github.com/martiinfiierro2/m4rket). La copia histórica contiene 21 ramas originales, con sus commits, autores y fechas. `main` conserva la línea histórica del proyecto; el espejo local mantiene el commit original `70c9d37a`. La copia pública retira credenciales y, por ello, sus hashes difieren. La recuperación se desarrolla en `local`. `local` identifica la rama de recuperación y `m4rket` la carpeta del proyecto.

En esta copia, `origin` apunta al repositorio personal y `espejo-local` al respaldo privado `.git/respaldo-original.git`. En GitHub se conservan las 21 ramas históricas de la copia revisada y la rama de recuperación `local`, separada de `main`.

Se acuerda terminar cada apartado con su explicación en el README, un commit y un push de `local`. Se informará de si la subida se ha completado. Tras el primer push con seguimiento, los siguientes usan `git push`; `git pull --ff-only` sirve para traer cambios publicados desde otra copia. Los cambios hechos en esta misma carpeta ya aparecen directamente.

El espejo local conserva íntegro el original universitario. La copia preparada para GitHub mantiene las ramas, autores, fechas, mensajes y relaciones entre commits, retirando credenciales, claves y archivos empaquetados que podían incluirlas. Sus hashes cambian y seis firmas originales no se trasladan. La configuración actual de MariaDB y JWT se guarda en `backend/.env.local`, ignorado por Git.

Ejecución local y base de demostración: [README_LOCAL.md](./README_LOCAL.md).

## Arranque local

Instala o inicia MariaDB e importa [database/m4rket_local.sql](./database/m4rket_local.sql). La configuración se guarda en `backend/.env.local`; el ejemplo usa MariaDB en el puerto 3306.

Desde la raíz del repositorio, con Node y npm disponibles:

```powershell
npm run setup
# Configura tu MariaDB en backend/.env.local e importa el SQL.
npm start
```

`npm start` ejecuta la API (3030), el panel de trabajadores (4200) e Ionic (4201). Para una copia ya preparada, basta arrancar MariaDB y ejecutar `npm start`. Detén los procesos con Ctrl+C. La guía completa, los usuarios demo y los límites conocidos están en [README_LOCAL.md](./README_LOCAL.md).

## Registro de recuperación

La recuperación se realiza por núcleos y con un commit y un push por bloque en la rama `local`. Se conservan las funcionalidades y el diseño existentes; los cambios de mayor alcance se consultan antes de aplicarlos.

### Núcleo 1 — API y base de datos (24/11/2026)

Commit: `fix(api): recuperar las peticiones existentes y el esquema local`.

- Incorporado el esquema MariaDB de 10 tablas y los datos de demostración ya preparados.
- Recuperadas las consultas estadísticas que ya utiliza la web: rankings por producto, series por fecha, consultas sin rango y filtro inclusivo del último día.
- Corregidas las ediciones de usuarios y ubicaciones que se rechazaban a sí mismas como duplicados, y el cambio de nombre de los tipos de promoción.
- Conservadas las correcciones de paginación de usuarios, relación de promociones y autoincremento de promociones de la preparación anterior.
- Corregida la sustitución de fotografías para conservar la imagen por defecto y las fotos compartidas por otros productos. El lector de imágenes rechaza rutas que salgan de la carpeta prevista.
- Conservado el comportamiento original de permisos de la API por indicación expresa del usuario: la web se utilizará internamente por trabajadores de la empresa. No se ha implantado una política nueva de roles.
- Verificación en una base y carpeta de imágenes de prueba, separadas de los datos de trabajo: **61 comprobaciones de API y 16 de imágenes superadas**. Las filas temporales se eliminan y los recuentos iniciales se conservan.

Detalle de instalación actual en [README_LOCAL.md](./README_LOCAL.md). Los bloques siguientes dejarán aquí sus cambios y pruebas.

### Núcleo 2 — Web Angular (24/11/2026)

Commit: `fix(web): recuperar el panel y los gráficos existentes`.

- Conservadas las pantallas y el diseño; conectados los entornos y el proxy a la API local.
- Recuperados los cambios de listado estadístico (se asignaba en lugar de comparar), los rankings con menos de siete resultados, las medias y las peticiones que enviaban IDs inexistentes. Los porcentajes sin periodo previo ya no muestran infinito.
- Compilación en navegador, sin prerender ni hidratación de servidor, y scripts de salida coherentes con el entorno local. El build no descarga las tipografías de Google; los estilos y fuentes solicitados por la página se conservan.
- Probados en navegador: acceso al panel, productos, promociones, ubicaciones, cuentas, filtros y gráficos de estadísticas; alta y edición de producto con foto y limpieza del dato temporal; exportaciones CSV, XLSX y apertura de PDF.
- Compilación de producción correcta con Node 20. Se mantienen los avisos de tamaño, CSS y CommonJS del proyecto existente.
- Se buscaron en todas las ramas y versiones históricas la ficha pública del dataset y su buscador: no hay una implementación funcional completa. Se conservan los archivos originales y se documenta esta limitación; no se inventan funciones nuevas.

### Núcleo 3 — Aplicación Ionic y mapa (24/11/2026)

Commit: `fix(mobile): recuperar la lista y los pines del mapa local`.

- Conectados ambos entornos de Ionic y las fotos del motor a la API local; conservados el diseño y los recursos originales del supermercado.
- Corregidos los métodos existentes de pines: conservan el estado comprado al recargar, desmarcan correctamente, eliminan solo los pines previstos y mantienen las estanterías. Los productos sin ubicación válida no interrumpen la carga del mapa.
- Corregida la recarga de fotografías compartidas tras borrar un pin. Las fotos de producto se solicitan a la API, también cuando ya no están en la caché del motor.
- La lista espera las respuestas antes de las operaciones que dependen de ellas; los favoritos no se acumulan en cada actualización y vaciar el buscador no provoca un error.
- Renovación y cierre de sesión coherentes entre almacenamiento de sesión y local, incluido el registro seguido de salir y entrar con otra cuenta.
- Desactivada la carga del chatbot externo, excluido expresamente de esta recuperación. Su código histórico se conserva.
- Verificados en navegador de escritorio a 390 × 844: acceso, registro, búsqueda, alta en lista, cantidades, marcar/desmarcar compra, persistencia tras recarga, borrado individual, solo comprados y lista completa. Lista y pines coinciden y se conservan las 41 ubicaciones.
- Verificados WebGL2 y selección de ficha tocando un pin; gestos táctiles simulados de desplazamiento y zoom y control de rotación. No equivale a una prueba en un dispositivo físico ni a una compilación nativa.
- TypeScript y compilación de producción correctos con Node 20; última regresión móvil sin errores de JavaScript. Pruebas realizadas en la base temporal, sin modificar la base de trabajo.

### Núcleo 4 — Preparación y arranque local (24/11/2026)

Commit: `chore(local): preparar el arranque npm y la guia de MariaDB`.

- Incorporados comandos raíz: `setup`, `start`, arranques individuales, builds y verificación de API. Se usa el Node/npm instalado; no se descarga Node portable ni se inicia/importa MariaDB automáticamente.
- `setup` instala las dependencias fijadas, genera configuración y JWT solo si falta el fichero y conserva la configuración ya existente. El ejemplo usa MariaDB externa en 3306.
- Builds nuevos en `dist/web/browser` y `dist/mobile`, ignorados por Git; los artefactos históricos permanecen intactos.
- Actualizadas las instrucciones de importación SQL, conexión MariaDB, usuarios/roles demo, arranque, parada y comprobación. Explicado el contenido de `.local` y que es opcional para el arranque normal; se conservan sus datos anteriores.
- Verificados setup, preservación de configuración, ambas compilaciones, arranque conjunto y parada con Node 24.15.0 instalado. El catálogo y el mapa cargan sin errores en el recorrido final; la API vuelve a superar 61 comprobaciones y 16 imágenes.
- Informe actualizado en [docs/validacion-local.md](./docs/validacion-local.md), con evidencia de API sin credenciales. No se ha hecho push; el único remoto sigue siendo el espejo local.

### Núcleo 5 — Bocetos del aspecto del motor 3D (24/11/2026)

Commit: `docs(design): añadir referencias visuales para el supermercado 3d`.

- Preparadas tres referencias visuales en [docs/bocetos-mapa](./docs/bocetos-mapa/LEEME.md): mejora sobre la captura del motor actual, maqueta 3D más detallada y ejemplo vectorial con la misma skill del escritorio del portafolio.
- Entregadas imágenes PNG y un SVG real para la referencia vectorial. Comprobadas apertura del SVG como imagen y validez XML.
- Solo bocetos: no se modifica el motor, la interfaz, sus funcionalidades ni el arranque. Las distribuciones dibujadas son ilustrativas y no constituyen una recuperación exacta de las posiciones originales.

#### Revisión de los bocetos A y C — fotos de producto (24/11/2026)

Commit: `docs(design): incorporar fotos reales a los bocetos A y C`.

Incorporadas las fotos de productos del repositorio a los marcadores y fichas de los bocetos A y C, según la aclaración del usuario. Se entregan PNG y un SVG híbrido para C, conservando los bocetos iniciales. No cambia ningún archivo de la aplicación ni del motor. Referencias en [docs/bocetos-mapa](./docs/bocetos-mapa/LEEME.md).

#### Revisión geométrica de C y vistas de A (24/11/2026)

Commit: `docs(design): corregir la maqueta vectorial y añadir vistas de A`.

Entregados C revisada, su SVG y un detalle ampliado: corregidos apoyos, penetraciones y orden de dibujo de las 112 piezas de la maqueta. Añadida una lámina conceptual de A con vista frontal, trasera y ambos laterales. Se conservan las fotos de producto y las versiones anteriores. Solo referencias visuales; no se modifica la aplicación ni su motor.

#### Mapa 3D ampliado por secciones (24/11/2026)

Commit: `docs(design): añadir boceto ampliado del mapa por secciones`.

Entregadas una vista limpia y una lámina explicativa del supermercado 3D ampliado, con siete departamentos y las zonas de cajas y acceso. Las etiquetas de sección están fuera del plano y solo pertenecen al boceto; no se incorporan al motor. Propuesta visual sin cambios de código ni de base de datos. Archivos en [docs/bocetos-mapa](./docs/bocetos-mapa/LEEME.md).

#### Estanterías abastecidas en el boceto (24/11/2026)

Commit: `docs(design): llenar las estanterias de los bocetos del mapa`.

Actualizadas las dos referencias del mapa ampliado con mercancía coherente con cada sección. Se mantienen las fotos de producto, la vista 3D y las etiquetas exteriores de la lámina explicativa. Solo imágenes de boceto: no se modifican la aplicación, el motor ni el inventario de MariaDB. Archivos en [docs/bocetos-mapa](./docs/bocetos-mapa/LEEME.md).

#### Propuestas visuales conservadas (25/11/2026)

Guardadas las vistas pendientes y las opciones de aspecto en [docs/bocetos-mapa](./docs/bocetos-mapa/LEEME.md). El usuario aplaza la mejora visual y prioriza el despliegue de la base de datos local. No hay cambios en la aplicación.

### Núcleo 6 — Despliegue de MariaDB local (25/11/2026)

Commit: `chore(database): desplegar MariaDB local y documentar la conexion`.

- Importado `database/m4rket_local.sql` en el MariaDB 10.4.32 de XAMPP, puerto 3306: 10 tablas InnoDB, 9 claves foráneas, 6 usuarios, 16 productos y 41 ubicaciones, además de promociones, listas y estadísticas demo.
- Creada la cuenta de conexión `m4rket_app` con permisos SELECT, INSERT, UPDATE y DELETE solo sobre `m4rket_local`. La API ya utiliza esa cuenta y el puerto 3306.
- Conservada la clave JWT y guardada la configuración anterior en un checkpoint local privado. Las contraseñas de MariaDB permanecen fuera del repositorio.
- Verificadas **61 peticiones de API y 16 imágenes** contra la base recién desplegada, incluidos los accesos de los tres roles y las operaciones temporales de alta, edición y borrado. Los recuentos finales coinciden con los importados.
- Actualizadas la [guía de arranque](./README_LOCAL.md) y la [validación](./docs/validacion-local.md). Para esta copia basta iniciar MySQL en XAMPP y ejecutar `npm start`; la instancia de pruebas en 3307 queda fuera del arranque.

### Núcleo 7 — Histórico original y remoto personal (25/11/2026)

Commit: `docs(git): aclarar el historico y la rama de recuperacion`.

- Comprobadas las 21 ramas del espejo original y su integridad; `main` de la copia de trabajo coincide con el original, sin incorporar la recuperación.
- Configurado `origin` con `https://github.com/martiinfiierro2/m4rket.git` y conservado el acceso al espejo como `espejo-local`. En el espejo, `personal` identifica el destino de publicación.
- Documentada la diferencia entre carpeta de trabajo, espejo y rama, y el flujo de commit y push por apartado. La publicación se prepara conservando el historial original y la recuperación en una rama aparte.
- Conservado el carácter público del repositorio por indicación expresa del usuario. La configuración actual de conexión local permanece ignorada por Git.
- Configurado Git de esta copia para usar los certificados de Windows y la cuenta `martiinfiierro2`. Comprobación de objetos Git correcta; este bloque solo modifica documentación y configuración local de Git.

### Núcleo 8 — Copia histórica preparada para publicación pública (25/11/2026)

Commit: `docs(publicacion): documentar el historico sin credenciales`.

- Preparada una copia aislada para publicar el proyecto como referencia de portafolio. El espejo y la copia de recuperación originales permanecen guardados localmente.
- Conservados los 504 commits anteriores: 492 del original y 12 de recuperación/documentación. Verificados sus autores, fechas, mensajes y relaciones entre padres, además de las 21 ramas originales y `local`. Esta nota se añade como un commit posterior.
- Retirados archivos `.env`, claves, certificados y copias empaquetadas antiguas; también ejemplos de claves en documentación y pruebas de dependencias históricas. Sustituidos los dos valores de configuración heredados y un token fijo antiguo. Las rutas retiradas figuran en [el informe](./docs/publicacion-historico.json).
- Los archivos actuales de lógica de API, Angular, Ionic y motor coinciden con los de la recuperación anterior. En su última versión solo se retiran seis archivos heredados; este commit añade documentación y reglas para ignorar esos archivos privados.
- Comprobados 22.462 objetos Git: ningún valor secreto conocido ni cabecera de clave privada restante. Las 2.056 alertas genéricas de Gitleaks se han verificado como identificadores VDOM y expresiones de código compilado; quedan cero alertas sin clasificar.
- La limpieza cambia los hashes de los commits afectados y no puede conservar sus seis firmas criptográficas originales. La referencia exacta continúa en el espejo local, sin publicar.

### Núcleo 9 — Rama de recuperación llamada local (25/11/2026)

Commit: `docs(git): usar local como rama de recuperacion`.

- La recuperación se continúa en la rama `local`, separada de `main`, con seguimiento de `origin/local`. Se publican también las 21 ramas históricas de la copia revisada.
- `local` es una rama de Git; el nombre de la carpeta donde se guardan los archivos en el ordenador es independiente. GitHub muestra los archivos directamente en cada rama, sin una carpeta contenedora `local`.
- Conservados el espejo original y una copia de respaldo de la recuperación anterior a la publicación. La copia de trabajo habitual utiliza el historial revisado, manteniendo la configuración de MariaDB, los datos y las dependencias instaladas.
- El cierre de cada apartado incluye su explicación en el README, commit y push a esta rama.

### Núcleo 10 — Proyecto directamente en Github/m4rket (26/11/2026)

Commit: `chore(local): dejar el proyecto en la raiz de m4rket`.

- Movido el repositorio completo a `Github/m4rket`, con la rama `local` y seguimiento de `origin/local`. Eliminada la subcarpeta contenedora anterior.
- Conservado el espejo original íntegro dentro de `.git/respaldo-original.git`, como archivo privado, y actualizada su referencia `espejo-local`. Reparadas las rutas de las herramientas auxiliares y del entorno MariaDB anterior.
- Actualizadas la guía, las instrucciones de clonación de la rama `local` y la ruta de importación SQL. Conservados Node/npm, dependencias, configuración privada, datos, fotos y la edición previa del usuario en el README local.
- Compilaciones de Angular e Ionic correctas con Node 24.15.0 desde la nueva raíz. Arranque conjunto mediante `npm start` comprobado: API 3030, web 4200 e Ionic 4201, con HTTP 200, proxies funcionales, catálogo de 16 productos e imagen recuperada. MariaDB responde en 3306.
- Comprobaciones de lectura; detenidos los tres procesos de aplicación al terminar. No se modifican los archivos de lógica de la aplicación.

### Núcleo 11 — Acceso de la API a MariaDB (27/11/2026)

Commit: `fix(local): recuperar la conexion de la API a MariaDB`.

- Localizado el fallo de consultas: MariaDB rechazaba la cuenta de conexión `m4rket_app`, que no existía. La API y los dos clientes estaban arrancados y sus proxies funcionaban.
- Restaurada la cuenta para localhost y 127.0.0.1, reutilizando la contraseña privada existente, con SELECT, INSERT, UPDATE y DELETE solo sobre `m4rket_local`. Conservada la configuración de la API y su JWT.
- Detectada corrupción Aria en `mysql.proxies_priv` y en el archivo de datos de `mysql.db`. Guardados respaldos privados; reparada la primera tabla y, con autorización del usuario, reconstruida la segunda. Las siete tablas internas de permisos comprobadas pasan CHECK TABLE EXTENDED y FLUSH PRIVILEGES vuelve a funcionar.
- El motor descartó cinco filas ilegibles de permisos. Se conservan los respaldos, se han verificado los permisos disponibles de las seis cuentas y se han repuesto los permisos conocidos de m4rket. No se pudo recuperar el contenido exacto de las filas descartadas.
- Verificados acceso y consulta autenticada con los tres roles, catálogo directo y a través de ambos proxies, y lectura de imagen, todos con HTTP 200. Conservados los recuentos de las diez tablas de la aplicación, incluidos 7 usuarios y 16 productos. Sin reiniciar los servicios en uso.
- Documentada la ruta real de prueba de la API y la diferencia entre las cuentas de conexión y de aplicación. La lógica y el diseño de API, web, Ionic y motor se mantienen. Evidencia en [docs/verificacion-api-20261127.json](./docs/verificacion-api-20261127.json).
