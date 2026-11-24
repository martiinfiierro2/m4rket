# m4rket: entorno local recuperado

Trabajo en la rama `feat/recuperacion-local`. Código original de `main` (`70c9d37a`), con configuración para ejecución local, base MariaDB reconstruida y datos de demostración. La licencia y los créditos del equipo se conservan.

## Carpeta desde la que se ejecutan los comandos

La carpeta `local` se creó clonando el espejo original `m4rket.git` para disponer de una copia de trabajo. En esta instalación, la raíz del proyecto es `C:\Users\Martin\OneDrive\Documentos\Github\m4rket\local`. Entra en esa carpeta antes de ejecutar los comandos de esta guía o abre directamente esa carpeta en el editor.

El espejo original se conserva en la carpeta contenedora. Dentro de la copia de trabajo, `.local` (con punto) guarda Node portable, MariaDB y artefactos generados; está ignorada por Git. La estructura completa se explica en el [README principal](./README.md#organización-de-las-carpetas).

## Preparación en Windows

Se necesita PowerShell, Git, conexión para descargar dependencias y los binarios de MariaDB incluidos en XAMPP. Se ha validado MariaDB 10.4.32 de `C:\xampp\mysql\bin`. No hace falta arrancar el servicio MySQL de XAMPP.

Desde la raíz del proyecto:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/local.ps1 -Action Setup
```

Este comando descarga Node **20.20.1 portable**, comprueba su SHA-256 oficial, instala las dependencias de los tres proyectos desde sus lockfiles e importa la base de demostración. No cambia el Node global.

La instancia MariaDB usa `127.0.0.1:3307` y guarda sus datos en `.local/mariadb`. Es independiente del directorio de datos de XAMPP. No registra un servicio de Windows. Las contraseñas de base de datos y la clave JWT se generan localmente y se guardan en archivos ignorados. No las compartas en Git.

Para otra ubicación de los binarios:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/local.ps1 -Action Setup -MariaDbBin C:\ruta\mariadb\bin
```

La instalación usa `npm ci --ignore-scripts`: las dependencias web se han validado así y el backend usa MySQL, no los módulos nativos de SQLite que también figuraban en el manifiesto original.

## Arranque

Después del setup, abre tres terminales en la raíz y ejecuta un comando en cada una:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/local.ps1 -Action Api
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/local.ps1 -Action Web
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/local.ps1 -Action Mobile
```

- Web/panel: <http://127.0.0.1:4200>.
- Ionic: <http://127.0.0.1:4201>.
- API: <http://127.0.0.1:3030/api>.

Los servidores de desarrollo reenvían `/api` al backend mediante sus archivos `proxy.conf.json`. También se ha configurado el cargador de texturas del motor para usar esa ruta local. Los comandos ejecutan el backend desde su carpeta, de modo que `../uploads` apunta a las imágenes conservadas.

Para volver a iniciar únicamente MariaDB e importar de nuevo el SQL sin sobrescribir filas existentes:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/local.ps1 -Action Database
```

Para detener la instancia MariaDB del proyecto:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/local.ps1 -Action StopDatabase
```

Detén API y clientes con Ctrl+C en sus terminales. La ejecución en un teléfono por Wi-Fi puede hacerse con el script npm `start:lan` de Ionic usando el mismo Node portable; la validación nativa de Android/iOS queda fuera de esta fase.

## Usuarios de demostración

Contraseña compartida de estas cuentas de prueba: **`M4rketDemo!2026`**.

| Correo | Rol |
| --- | --- |
| `usuario@m4rket.test` | usuario, con lista de compra inicial |
| `admin@m4rket.test` | admin |
| `superadmin@m4rket.test` | superAdmin |
| `pablo@m4rket.test` | usuario |
| `sara@m4rket.test` | usuario |
| `diego@m4rket.test` | usuario |

Son identidades ficticias. Las contraseñas están almacenadas como hashes bcrypt en SQL. La contraseña demo es pública y sirve exclusivamente para esta demostración local.

## Importación SQL directa en otra MariaDB

`database/m4rket_local.sql` se puede importar desde la consola de MariaDB, HeidiSQL o phpMyAdmin. Crea `m4rket_local`, sus 10 tablas y los datos. Por ejemplo, dentro de la consola SQL:

```sql
SOURCE C:/proyectos/m4rket/database/m4rket_local.sql;
```

Para usar esa instancia, copia `backend/.env.example` a `backend/.env.local` y configura host, puerto, usuario, contraseña y una clave JWT nueva. El backend da prioridad a `.env.local`; las variables que ya existan en el proceso mantienen la prioridad habitual de dotenv. `scripts/local.ps1 -Action Database` está reservado a la instancia aislada del proyecto en 3307; una instancia propia se importa manualmente.

El SQL no contiene `DROP`, `TRUNCATE` ni actualizaciones destructivas. En importaciones posteriores conserva las filas que ya existen y añade las ausentes. No sirve como migración de una base antigua con un esquema distinto ni como reinicio a valores iniciales: para una demostración limpia, utiliza una base nueva con el esquema documentado.

## Contenido de la demostración

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

Ocho IDs de producto parten de fichas históricas recuperadas. Se completan con datos ilustrativos y ocho productos adicionales para tener un catálogo coherente. Los valores nutricionales, el stock y los precios son de demostración, no fichas comerciales verificadas. Se usan las fotografías que sí existen; los productos sin foto disponible usan `no-imagen.png`.

Las ubicaciones corresponden a los 41 índices que utiliza el motor: A0–A9, B0–B9, C0–C9, D0–D9 y E0. Cada producto demo tiene una ubicación válida. Las fechas de las promociones y estadísticas se calculan respecto al día de la importación. Hay promociones activas y una finalizada, listas por usuario y eventos de los últimos 28 días.

Los datos no reconstruyen las cuentas, compras ni estadísticas reales de la universidad. `database/demo-manifest.json` documenta recuentos y asignaciones.

## Compilación y verificación

Con MariaDB y la API arrancadas:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/local.ps1 -Action Build
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/local.ps1 -Action Check
```

Los builds se guardan en `.local/build/web/browser` y `.local/build/mobile`. No sobrescriben las compilaciones antiguas versionadas. El build de la web se ejecuta en el navegador: se ha retirado la configuración SSR/prerender que fallaba por accesos a `localStorage`, junto con la hidratación y los scripts de posprocesado que no correspondían a esta salida.

La web conserva un aviso de tamaño de 500 kB y un límite de error de 5 MB para admitir su paquete actual de aproximadamente 4.31 MB. La compilación no implica que se haya optimizado ese peso. Permanecen avisos de CSS y dependencias CommonJS. Ionic conserva avisos del optimizador de selectores RTL. No se ha modificado el diseño.

El verificador ejecuta peticiones reales contra la API y MariaDB: login de los tres roles, renovación del token, catálogo, paginación, búsqueda, datos nutricionales, relaciones, estadísticas, imágenes y altas/modificaciones/borrados temporales. Elimina las filas creadas por las pruebas y comprueba que todos los recuentos finales coinciden con los iniciales. Escribe evidencia sin tokens ni contraseñas en `.local/verification.json`.

Se han corregido dos errores detectados al verificar las peticiones: la variable de total de usuarios que se ocultaba dentro de un bloque y un identificador equivocado al consultar una relación de promoción por ID. El modelo de promociones declara ahora el autoincremento que necesita su alta existente.

Esta fase prepara la base y el entorno y valida las compilaciones y el acceso a datos. No es una auditoría completa de la lógica ni una validación de todas las interacciones del mapa. El informe de resultados concreta qué se ha comprobado en navegador.

## Archivos locales

`.local/`, las dependencias y `backend/.env.local` están ignorados. El espejo original y `main` permanecen como referencia. El repositorio heredado todavía conserva credenciales y copias históricas que deberán sanearse antes de una publicación pública; esta fase no publica ni reescribe el historial.