# m4rket
[ABPGC23] Proyecto de Contenidos del grupo 4AM de ABP 2023/24

## Organización de las carpetas

Durante la recuperación se creó la carpeta `local` clonando el espejo `m4rket.git`. Es una copia de trabajo independiente con los archivos del proyecto, preparada para modificarlos y ejecutarlos. El espejo original se conserva intacto como referencia.

En la instalación actual, la carpeta contenedora tiene esta estructura:

```text
m4rket/
├── m4rket.git/   Espejo original: historial, ramas y objetos de Git.
└── local/        Copia de trabajo: código, scripts y base de demostración.
    ├── database/  SQL con esquema y datos de demostración.
    ├── dist/      Compilaciones generadas; ignoradas por Git.
    └── .local/    Pruebas y entorno aislado anterior; opcional, ignorado por Git.
```

La carpeta `m4rket` que contiene ambas copias no es por sí misma un repositorio. Para ejecutar Git o los comandos de la aplicación, abre `local` en el editor o entra en ella desde PowerShell:

```powershell
cd "C:\Users\Martin\OneDrive\Documentos\Github\m4rket\local"
git branch
```

La rama de recuperación es `feat/recuperacion-local`. El nombre `local` es una elección para esta copia: si clonas el repositorio en otra ubicación, utiliza la carpeta que contenga su `README.md` y su directorio `.git`.

`local` y `.local` son carpetas distintas: la primera es el repositorio de trabajo; la segunda guarda pruebas y archivos de la preparación anterior y no se versiona. El arranque normal usa Node/npm instalados y tu propia MariaDB, sin depender de `.local`. No borres su antiguo directorio MariaDB si quieres conservar esos datos.

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

La recuperación se realiza por núcleos y con un commit por bloque en la rama `feat/recuperacion-local`. Se conservan las funcionalidades y el diseño existentes; los cambios de mayor alcance se consultan antes de aplicarlos.

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
