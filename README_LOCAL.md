# m4rket: recuperación para ejecución local

Rama: `feat/recuperacion-local`. Se conserva la aplicación original y su diseño; los commits por núcleo y sus pruebas están en el [README](./README.md#registro-de-recuperación). Esta guía corresponde al arranque local actual.

## Preparación

Se necesitan Node/npm instalados y una instancia de MariaDB. En esta máquina ya están instaladas las dependencias de API, Angular e Ionic. Los lockfiles originales fijan sus versiones; no se han actualizado Angular ni Ionic. Se han probado Node 20.20.1 y, para el arranque final, el Node 24.15.0 que ya tienes instalado. `.nvmrc` deja 20.20.1 como referencia opcional para un gestor de versiones, sin descargarlo ni sustituir el Node global.

La raíz actual del proyecto es `C:\Users\Martin\OneDrive\Documentos\Github\m4rket\local`. Abre esa carpeta en el editor. La carpeta contenedora `m4rket` no es un repositorio; `local` sí lo es.

Para una copia nueva, desde su raíz:

```powershell
npm run setup
```

Instala las dependencias de los tres proyectos con `npm ci --ignore-scripts` y crea `backend/.env.local` con una clave JWT aleatoria si aún no existe. Si existe, lo conserva. No instala ni inicia MariaDB, no importa datos y no cambia el Node global. Se omiten los scripts de instalación de SQLite porque el backend recuperado usa MariaDB/MySQL, y las compilaciones se han validado así.

## Tu MariaDB

**En este equipo ya está preparada (25/11/2026):** base `m4rket_local` en el MariaDB de XAMPP, `127.0.0.1:3306`, con el usuario de conexión `m4rket_app`. La importación y la conexión de la API están hechas. Para usar esta copia, arranca **MySQL** en XAMPP y ejecuta `npm start` desde la raíz del repositorio. La base permanece guardada al apagar el equipo; no hace falta volver a importarla.

Las instrucciones siguientes permiten repetir la instalación en otra copia:

1. Instala o inicia MariaDB, o el servicio MySQL/MariaDB de tu XAMPP. Se ha validado MariaDB 10.4.32.
2. En una consola SQL con permisos para crear bases, importa el fichero de este repositorio:

```sql
SOURCE C:/Users/Martin/OneDrive/Documentos/Github/m4rket/local/database/m4rket_local.sql;
```

También puedes importarlo desde HeidiSQL o phpMyAdmin. Crea `m4rket_local`, sus 10 tablas y los datos demo.

3. Abre `backend/.env.local` y configura `HOSTBD`, `PORTBD`, `BD`, `USERBD` y `PWDBD` con el usuario y la contraseña de tu instalación. El ejemplo usa `127.0.0.1:3306`, base `m4rket_local` y usuario `root` sin contraseña; sustituye esos valores por los tuyos. Conserva la clave JWT generada.

La configuración privada de esta copia ya apunta al puerto 3306 y al usuario `m4rket_app`, con contraseña generada en `backend/.env.local`. Esa cuenta solo tiene permisos de lectura y escritura sobre `m4rket_local`. La clave JWT anterior se conserva. No necesitas cambiar esos valores ni usar `root` para arrancar la API. Las credenciales y su copia de seguridad local están ignoradas por Git.

El SQL no contiene `DROP`, `TRUNCATE` ni actualizaciones de las filas existentes. Al importarlo de nuevo añade los IDs ausentes y conserva los existentes. No es una migración de una base anterior ni reinicia los datos: para una demostración limpia, importa en una base nueva. Las fechas demo se calculan en la primera importación; repetirla no mueve las fechas de filas ya existentes.

El backend lee primero `.env.local` y después el fichero heredado `.env`; las variables del proceso tienen prioridad sobre ambos. Los comandos de esta guía ejecutan la API desde `backend` para que `PATHUPLOAD=../uploads` resuelva las imágenes conservadas. Mantén el puerto de API 3030 salvo que ajustes también los proxies de ambos clientes.

## Arranque

Con MariaDB arrancada e importada:

```powershell
npm start
```

Se ejecutan los tres procesos en la misma terminal:

| Servicio | Dirección |
| --- | --- |
| Panel web para trabajadores | <http://127.0.0.1:4200> |
| Aplicación Ionic en navegador | <http://127.0.0.1:4201> |
| API | <http://127.0.0.1:3030/api> |

Espera a que ambos clientes indiquen que han compilado. Ctrl+C detiene los procesos iniciados por el comando; MariaDB sigue bajo tu control.

También puedes usar tres terminales con `npm run start:api`, `npm run start:web` y `npm run start:mobile`. El archivo `scripts/local.ps1` es un envoltorio opcional de estos comandos; ya no descarga Node ni administra bases de datos.

Los clientes usan `/api` y su proxy local. Abrir directamente un HTML de la compilación con `file://` o usar Live Server sin ese proxy no sustituye este arranque. Para una demostración Ionic en la red local, existe `npm --prefix frontend/user-view/VersionMovil run start:lan`; desde el teléfono se accede a la IP del ordenador en el puerto 4201. No se ha validado en un teléfono físico.

## Cuentas de demostración y roles

Contraseña compartida: **`M4rketDemo!2026`**.

| Correo | Rol y uso |
| --- | --- |
| `usuario@m4rket.test` | usuario; Ionic, con cuatro productos iniciales |
| `admin@m4rket.test` | admin; panel de trabajadores |
| `superadmin@m4rket.test` | superAdmin; panel y gestión de cuentas |
| `pablo@m4rket.test` | usuario |
| `sara@m4rket.test` | usuario |
| `diego@m4rket.test` | usuario |

Identidades ficticias con contraseñas bcrypt. Se conserva por indicación expresa el comportamiento original de permisos de la API, incluido el rol enviado al registro; los controles de la interfaz no son una política de autorización de servidor. La demostración se prepara para ejecución local, con el panel utilizado por trabajadores.

## Contenido recuperado

| Tabla | Filas iniciales |
| --- | ---: |
| usuarios | 6 |
| productos | 16 |
| ubicaciones | 41 |
| tipo_promocion | 3 |
| promociones | 3 |
| en_ubicacion | 16 |
| en_promocion | 5 |
| lista_compra | 10 |
| datos_contadores | 336 |
| datos_tiempo | 10 |

Ocho IDs de producto proceden de fichas históricas y otros ocho son ilustrativos. Los valores nutricionales, precios y stock son datos de demostración. Se usan las fotos recuperadas o `no-imagen.png` cuando no hay una disponible. No se recuperan las cuentas, compras ni estadísticas reales que residían en el servidor universitario.

Las 41 ubicaciones coinciden con los índices del motor original: A0–A9, B0–B9, C0–C9, D0–D9 y E0. Todos los productos demo tienen ubicación válida. Hay promociones activas y finalizadas, listas por usuario y eventos de los 28 días previos a la importación. [demo-manifest.json](./database/demo-manifest.json) contiene recuentos y asignaciones.

## Compilación y comprobación

```powershell
npm run build
# Con la API y una base demo arrancadas:
npm run check:api
```

Los builds actuales se generan en `dist/web/browser` y `dist/mobile`. `npm run build:web` y `npm run build:mobile` los ejecutan por separado. Las compilaciones antiguas versionadas dentro de los clientes no se usan ni se sobrescriben.

El verificador de API comprueba la base demo con peticiones reales, realiza altas/ediciones/borrados temporales y comprueba que los recuentos vuelven a su valor inicial. Debe usarse sobre la base demo, no sobre una base con trabajo propio: exige sus datos iniciales y actualiza temporalmente algunas filas demo. Deja evidencia sin credenciales en `.local/verification.json`.

El [informe de validación](./docs/validacion-local.md) recoge las versiones y resultados comprobados. Las compilaciones conservan los avisos de tamaño, CSS y CommonJS del proyecto. No se ha optimizado el peso ni actualizado sus dependencias. La web compila para navegador, sin el prerender que fallaba al acceder a `localStorage`. El build no descarga tipografías; los enlaces de fuentes/iconos externos que ya usa la interfaz permanecen y pueden necesitar Internet para mostrarse como en el original.

## Qué contiene .local y si hace falta

`local` es el nombre de esta copia Git; `.local`, con punto, es una carpeta ignorada de archivos de trabajo.

`npm start`, `npm run setup` y `npm run build` **no necesitan** `.local`. Usan Node/npm instalados, tu MariaDB y la salida `dist`. El verificador sí puede crear `.local` para guardar su informe.

Esta copia conserva dentro de `.local` el Node portable anterior, descargas y certificados de la preparación, la instancia antigua MariaDB con sus datos y configuración privada, una base e imágenes de prueba, checkpoints, capturas, logs e informes. No se suben al repositorio. No borres el directorio de datos MariaDB mientras quieras conservar esa base o mientras esté arrancada. El script antiguo de administración de la instancia se guarda como referencia en `.local/local-legacy-20261124.ps1`.

## Límites que se conservan

- La ficha pública del dataset solo tiene la cabecera y su buscador no está conectado. Se buscaron sus versiones en todas las ramas e historial y no apareció una implementación completa. El listado y las exportaciones CSV, XLSX y PDF sí funcionan. No se han inventado las partes ausentes.
- El filtro anual de estadísticas conserva su etiqueta original «2024»; su consulta usa el año actual. No se ha rediseñado la pantalla.
- Chatbot, OVH, Prometheus, dominio y compilación nativa Android/iOS quedan fuera. No se necesita contratar servicios para ejecutar esta copia local.
- Las pruebas de navegador no cubren todos los dispositivos, gestos posibles ni todas las combinaciones de datos. Se detallan los recorridos comprobados en el informe.
- El histórico heredado conserva credenciales, certificados y archivos antiguos. Antes de una publicación pública habrá que revisar ese material y decidir cómo sanear el historial. No se ha publicado ni reescrito; el único remoto actual es el espejo local original.
