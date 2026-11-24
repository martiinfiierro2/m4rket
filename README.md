# m4rket
[ABPGC23] Proyecto de Contenidos del grupo 4AM de ABP 2023/24

## Organización de las carpetas

Durante la recuperación se creó la carpeta `local` clonando el espejo `m4rket.git`. Es una copia de trabajo independiente con los archivos del proyecto, preparada para modificarlos y ejecutarlos. El espejo original se conserva intacto como referencia.

En la instalación actual, la carpeta contenedora tiene esta estructura:

```text
m4rket/
├── m4rket.git/   Espejo original: historial, ramas y objetos de Git.
└── local/        Copia de trabajo: código, scripts y base de demostración.
    └── .local/  Node portable, datos de MariaDB y archivos generados; ignorados por Git.
```

La carpeta `m4rket` que contiene ambas copias no es por sí misma un repositorio. Para ejecutar Git o los comandos de la aplicación, abre `local` en el editor o entra en ella desde PowerShell:

```powershell
cd "C:\Users\Martin\OneDrive\Documentos\Github\m4rket\local"
git branch
```

La rama de recuperación es `feat/recuperacion-local`. El nombre `local` es una elección para esta copia: si clonas el repositorio en otra ubicación, utiliza la carpeta que contenga su `README.md` y su directorio `.git`.

`local` y `.local` son carpetas distintas: la primera es el repositorio de trabajo; la segunda guarda su entorno generado y no se versiona.

Ejecución local y base de demostración: [README_LOCAL.md](./README_LOCAL.md).

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
