# Diagnóstico fullstack de M4RKET

Fecha: 28/11/2026 · Rama revisada: `local` · Código de partida: `d3a4beda`.

## Conclusión

El núcleo de M4RKET funciona en local: app Ionic y motor 3D, panel Angular, API y MariaDB se comunican y permiten completar los recorridos principales. Es una base válida para evolucionar el proyecto como caso fullstack. La copia actual contiene también pantallas incompletas, errores de datos y deuda técnica; superar una compilación no significa que toda la aplicación esté terminada.

Esta entrega es un diagnóstico y una propuesta de trabajo. No aplica correcciones, actualizaciones ni rediseños. Los [ocho bocetos de interfaz](./bocetos-redisenio/LEEME.md) y las [referencias del supermercado 3D](./bocetos-mapa/LEEME.md) siguen siendo propuestas visuales.

## Cómo se ha comprobado

- Arranque real de MariaDB 10.4.32 de XAMPP, API 3030, web 4200 y app 4201 con Node 24.15.0. Lectura del catálogo a través de los tres puertos: HTTP 200 y 16 productos.
- Compilaciones actuales de producción de Angular e Ionic: ambas terminan con código 0.
- Creada una base temporal independiente con el SQL demo y fotografías copiadas; API de pruebas en 3031. Los navegadores se dirigieron a esa API mediante interceptación de las peticiones, conservando respuestas reales del backend y de MariaDB.
- Ejecutado el verificador existente: **61 comprobaciones de API y 16 de imagen** correctas. Incluye altas, ediciones y borrados temporales de los recursos principales.
- Completadas **12 comprobaciones del recorrido móvil y 13 del recorrido web**; además, pruebas negativas de login y nueve casos límite de API. Las pruebas funcionales correctas no cubren todos los dispositivos ni todas las combinaciones de entrada.
- Ejecutados los tests unitarios existentes, el lint móvil y `npm audit --omit=dev` en los tres proyectos.
- Conservados configuración y recuentos de las diez tablas de trabajo: 7 usuarios, 16 productos, 41 ubicaciones, 3 tipos y 3 promociones, 16 asociaciones de ubicación, 5 de promoción, 6 líneas de lista, 342 contadores y 10 intervalos. La base temporal se eliminó después; los servicios quedaron detenidos, como al comienzo.
- La activación del menú móvil dibujado con pseudoelementos se hizo mediante el clic nativo del elemento durante la automatización. No equivale a probar todos los gestos en un teléfono físico.

Evidencia estructurada, sin credenciales: [diagnostico-fullstack-20261128.json](./diagnostico-fullstack-20261128.json).

## Lo que funciona

| Área | Resultado observado |
| --- | --- |
| Instalación y arranque | Los scripts existentes arrancan los tres servicios usando Node instalado y MariaDB de XAMPP. No requieren infraestructura de la universidad. No se repitió una instalación limpia de dependencias en esta revisión. |
| API y datos | Catálogo, búsqueda básica, relaciones de productos, ubicaciones, promociones, listas y estadísticas; operaciones CRUD del verificador en base aislada. |
| Autenticación | Login correcto de los tres roles y renovación de token. La interfaz web rechaza el acceso de `usuario`; `admin` entra y `superAdmin` ve Cuentas. Esto describe la interfaz, no una autorización completa de la API. |
| App | Registro corregido, búsqueda, alta en lista, cambio de cantidades, comprado, persistencia al recargar, eliminación de comprados, lista completa y salida. |
| Motor | Contexto WebGL2, 41 posiciones del modelo, cuatro pines demo iniciales y cambios de pines coherentes con las acciones verificadas. Vaciar la lista conserva el supermercado. |
| Administración | Carga de stock, promociones, ubicaciones, estadísticas, datos y cuentas; alta administrativa con datos válidos. Las operaciones API probadas no implican que cada formulario web esté revisado exhaustivamente. |
| Estadísticas | Las consultas y los gráficos cargan; en el recorrido no aparecen NaN ni Infinity. Existe un error en la comparativa de fechas que se detalla abajo. |
| Dataset | Listado y paginación básicos; CSV y XLSX descargados y PDF abierto. Las descargas contienen los cuatro productos de la página actual, no el catálogo entero. |

Los favoritos de la app se obtienen del historial de búsquedas del usuario; no se ha verificado ni existe aquí una nueva función de favoritos manuales.

## Fallos y limitaciones concretos

### 1. Login móvil: error silencioso y estado de espera incorrecto — prioridad alta

Con una contraseña incorrecta, la API devuelve 400 y la pantalla no muestra «Campos incorrectos». Además, al retrasar la respuesta para observar el estado pendiente, el botón continúa habilitado. `avisoError` nunca se activa y `esperando` se desactiva antes de terminar la petición.

Corregiría el método existente para gestionar éxito, error y finalización; mostrar el mensaje de error y mantener un único envío pendiente. Retiraría también el log del formulario que incluye la contraseña.

Código: [login móvil](../frontend/user-view/VersionMovil/src/app/auth/login/login.component.ts#L29).

### 2. Precio por kilogramo equivocado — prioridad alta

En la ficha de «Macarrones 500 g» se muestra **0,95 €/kg**, aunque `precio_kg` vale **1,90**. La plantilla utiliza `precio` donde debería usar `precio_kg`. La rama de promoción también tiene un atributo `class` repetido.

Usaría el campo correcto, un formato monetario coherente y una presentación explícita cuando no exista precio unitario. No cambiaría los precios guardados.

Código: [ficha móvil, línea 164](../frontend/user-view/VersionMovil/src/app/components/drawer/drawer.component.html#L164).

### 3. Comparativa anual y etiqueta de estadísticas — prioridad alta

Para el periodo **28/11/2025–28/11/2026**, la comparación calculada es **28/11/2023–28/11/2024**. Salta el periodo inmediatamente anterior. La opción visible sigue llamándose «2024», aunque consulta los últimos doce meses. El cálculo mensual también mezcla días del mes con desplazamientos de fechas y merece pruebas en los cambios de mes.

Calcularía el periodo comparativo a partir del inicio y duración del periodo actual, y mostraría un rótulo que describa las fechas reales. Añadiría pruebas con fin de mes, cambio de año y año bisiesto.

Código: [cálculo de periodos](../frontend/admin-view/frontEnd/src/app/pages/estadisticas/estadisticas.component.ts#L157).

### 4. Cuentas: paginación incorrecta, búsqueda sin conectar y edición vacía — prioridad alta/parcial

Con **12 cuentas de prueba**, la API informa de 12 y la interfaz se queda en 10: usa la longitud de la página recibida como total y vuelve a paginar en cliente. Escribir un nombre inexistente no cambia el listado. El botón de edición llama a `irEditarUsu()`, que está vacío.

Corregiría la paginación utilizando `page.total` y el desplazamiento del backend, con filtros coherentes. La búsqueda y la edición requieren completar partes que no están implementadas: las trataría como decisiones de alcance antes de desarrollarlas.

Código: [listado de cuentas](../frontend/admin-view/frontEnd/src/app/pages/usuarios/usuarios.component.ts#L96), [edición vacía](../frontend/admin-view/frontEnd/src/app/pages/usuarios/usuarios.component.ts#L182).

### 5. Dataset público incompleto — pendiente de decidir

El buscador no hace ninguna petición ni filtra; permanecen cuatro artículos al buscar un término inexistente. La ficha individual solo muestra «M4RKET - Dataset». Sus carencias ya se habían buscado en el histórico durante la recuperación.

Las exportaciones funcionan, pero su alcance es la página visible. Mantendría ese comportamiento con un texto claro, o pediría aprobar una exportación completa. Completar la ficha y el buscador es implementar lo que falta, no una optimización interna.

Código: [dataset](../frontend/admin-view/frontEnd/src/app/pages/dataset/dataset.component.html#L8), [ficha](../frontend/admin-view/frontEnd/src/app/dataset/dataset-producto/dataset-producto.component.ts#L23).

### 6. Enlaces y recuperación de contraseña — incompletos

`/corp` y `/objetoAprendizaje` dejan la web sin contenido porque no tienen rutas declaradas. No se ha encontrado la web corporativa original; el usuario indicó que pudo quedar en el servidor universitario. El componente de recuperación de contraseña es una plantilla sin lógica ni ruta operativa.

Recuperaría primero los archivos originales. Crear esas páginas o un servicio de recuperación de contraseña requiere un acuerdo de alcance. Evitaría presentarlos como funciones terminadas en el portafolio.

Código: [rutas web](../frontend/admin-view/frontEnd/src/app/app.routes.ts), [plantilla de recuperación móvil](../frontend/user-view/VersionMovil/src/app/auth/recovery/recovery.component.ts).

### 7. Validación insuficiente en la API — prioridad alta

En la base aislada se han aceptado un correo sin formato válido, un producto con stock −10 y precio −5, y una línea de compra con cantidad 0. Los validadores comprueban principalmente que los campos no estén vacíos.

Reforzaría tipos, rangos, IDs existentes, fechas, correo y reglas de cantidad en los métodos/rutas actuales. Añadiría respuestas claras y pruebas negativas; la validación de Angular no sustituye la del servidor.

Código: [rutas de productos](../backend/routes/productos.js), [lista de compra](../backend/routes/listaCompra.js), [usuarios](../backend/routes/usuarios.js).

### 8. Duplicados y consistencia de la lista — prioridad alta

Dos altas simultáneas del mismo producto para un usuario generan **dos filas**. La tabla no impone una regla única para ese par y la app comprueba una copia local antes de enviar. Las cantidades se modifican en pantalla antes de confirmar el servidor, sin restauración en caso de fallo.

Serializaría las acciones pendientes por producto y restauraría el estado si falla la petición. Después de confirmar la regla «una fila por usuario y producto», prepararía limpieza de duplicados, índice único y operación transaccional. Cambiar la estructura de la base y resolver duplicados existentes exige revisar y aprobar una migración.

Código: [alta en la app](../frontend/user-view/VersionMovil/src/app/components/drawer/drawer.component.ts#L603), [esquema de listas](../database/m4rket_local.sql#L46).

### 9. Contratos de respuesta y conteos — prioridad media

Una búsqueda de Manzana devuelve un producto, pero informa de 16 resultados totales. Un ID inexistente devuelve HTTP 200 con `ok:false`; una petición sin token devuelve 400. El buscador también admite hasta 100.000 resultados por llamada.

Haría que el conteo use el mismo filtro que los resultados, acotaría la paginación y uniformaría errores y códigos HTTP con los clientes. Preservaría nombres y tipos de campos consumidos por ambas interfaces para evitar regresiones.

Código: [productos](../backend/controllers/productos.js#L149), [validación JWT](../backend/middleware/validar-jwt.js).

### 10. Datos sensibles y permisos — mejora condicionada

El alta devuelve el hash de contraseña dentro de `usuario`; las respuestas de edición/borrado también devuelven el modelo sin una salida pública explícita. Hay logs de formulario y de tokens en clientes.

Eliminaría `pwd` de las respuestas manteniendo `id` y los demás campos que usan los clientes, y retiraría los logs sensibles. El serializador actual renombra `id` como `uid`: reutilizarlo sin revisar rompería el registro móvil.

Se ha confirmado también que el registro público admite rol admin, un usuario normal crea productos y puede consultar listas ajenas. **Este comportamiento se conserva por tu decisión anterior para la demostración local.** No se ha endurecido. Si decides ofrecer una API accesible a otras personas, propondría aprobar un bloque específico de permisos por operación y propiedad de los datos. Que el panel sea para empleados no impone esa restricción en la API. La distinción está recogida en [OWASP sobre autorización por objeto](https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/).

Código: [respuestas de usuarios](../backend/controllers/usuarios.js#L88), [controladores de listas](../backend/controllers/listaCompra.js), [roles aceptados](../backend/middleware/validar-roles.js).

## Calidad y mantenimiento

| Comprobación actual | Resultado |
| --- | --- |
| Build web | Correcto. Bundle inicial de 4,30 MB, transferencia estimada de 1,20 MB; avisos de presupuesto, estilos y CommonJS. |
| Build Ionic | Correcto. Inicial de 584,27 kB y módulo home de 1,74 MB; avisos CSS de Ionic. |
| Tests web | Fallan antes de ejecutarse: importación `node:console` sin resolución en la configuración de pruebas. Además, hay un test de plantilla que aún espera «Hello, frontEnd» y deberá revisarse después de resolver la compilación. |
| Tests Ionic | Pasa un test básico de creación del componente. No representa cobertura de los flujos de negocio. |
| Lint Ionic | 10 errores y 3 avisos: métodos vacíos, comparaciones no estrictas e interfaces de ciclo de vida. |
| Regresión API | 61 comprobaciones correctas y 16 imágenes; el verificador presupone el dataset demo original y no debe ejecutarse sin aislamiento sobre tus datos de trabajo. |

### Dependencias

Resultado de `npm audit --omit=dev` del 28/11/2026:

| Proyecto | Bajas | Moderadas | Altas | Críticas | Total por proyecto |
| --- | ---: | ---: | ---: | ---: | ---: |
| API | 6 | 5 | 17 | 4 | 32 |
| Web | 4 | 8 | 14 | 2 | 28 |
| Ionic | 8 | 27 | 39 | 4 | 78 |

Estos son conteos del árbol de dependencias de cada proyecto: pueden compartir avisos y no equivalen a ese número de fallos explotables en la aplicación. Hay paquetes instalados de SSR y SQLite que no se utilizan en el arranque probado; el constructor de Angular aparece como dependencia de producción en Ionic.

Angular instalado: 17.3.6 en web y 17.1.2 en Ionic. Angular 17 está fuera de soporte y Node 24 queda fuera de su matriz histórica, aunque ambas compilaciones hayan funcionado aquí. Recomendaría planificar una actualización por etapas de Angular/Ionic y unificar las herramientas, conservando antes una regresión funcional. Referencia: [compatibilidad oficial de Angular](https://angular.dev/reference/versions).

Destacan avisos de mysql2, Sequelize, Express, Angular y xlsx. Para `xlsx@0.18.5`, audit no encuentra una corrección disponible en el paquete npm; [el aviso de SheetJS](https://github.com/advisories/GHSA-5pgg-2g8v-p4x9) explica esa distribución. Su uso observado es exportar datos propios, no importar ficheros externos; no se ha demostrado explotación. No se ha ejecutado `npm audit fix` ni se han cambiado lockfiles.

### Mejoras de código que haría después de los errores concretos

- **Estado y asincronía:** tipar los DTO compartidos con números y booleanos reales; sustituir `any`, tipos `Float32Array` usados para precios y `toPromise()` cuando corresponda. Encadenar las peticiones, cancelar búsquedas anteriores, codificar el término de búsqueda y evitar suscripciones internas que impiden esperar o manejar errores.
- **Una sesión coherente:** centralizar lectura y renovación de token, cabeceras y salida. Definir expresamente qué significa «Recordarme», que ahora principalmente controla conservar el correo. Mantener los roles existentes mientras no apruebes otra política.
- **Web más ligera:** cargar pantallas y librerías de gráficos/exportación cuando se necesitan. El router actual importa directamente muchas páginas. La [carga diferida de Angular](https://angular.dev/guide/routing/loading-strategies) permite separar ese coste de la landing pública.
- **Motor 3D:** conservar el motor propio y su comportamiento. Revisar el bucle de dibujo por malla, consolidar el render, compartir recursos y evitar volver a descargar texturas ya localizadas en caché. Liberar texturas y URLs de Blob explícitamente y gestionar listeners/temporizadores al salir o destruir vistas. Son hallazgos de código, no una medición de rendimiento en un móvil físico.
- **Coordenadas y ubicaciones:** comprobar picking al redimensionar y con distintas densidades de píxel. El motor contiene 41 posiciones fijas; crear otra ubicación en la administración no crea un mueble 3D y los índices desconocidos se omiten. Ampliar el supermercado requiere diseñar también esa correspondencia.
- **Modelo de datos:** evaluar importes DECIMAL o céntimos enteros con una migración y contrato JSON definidos; MariaDB documenta [DECIMAL como punto fijo exacto](https://mariadb.com/docs/server/reference/data-types/numeric-data-types/decimal). Mantener los tipos que esperan los clientes durante la transición.
- **Pruebas y reproducibilidad:** reparar los tests existentes, cubrir los errores descritos, hacer explícito el aislamiento del verificador y automatizar build/lint/regresión con MariaDB de pruebas. Limpiar código heredado y dependencias sin uso solo tras comprobar referencias.

## Orden de implementación propuesto

Cada núcleo tendría su explicación en README, un commit y push en la rama acordada.

| Orden | Núcleo | Entrega |
| --- | --- | --- |
| 1 | Errores de datos y validación | Precio unitario, fechas comparativas, paginación de cuentas, rangos numéricos/correo y respuestas sin hash de contraseña. Pruebas de regresión para cada corrección. |
| 2 | Interacción y sesión | Login con avisos y espera correcta, mutaciones sin carreras, recuperación tras error, búsquedas y cabeceras coherentes. |
| 3 | Base de calidad | Tests web operativos, lint y comprobaciones funcionales reproducibles sobre una base aislada. |
| 4 | Rediseño de interfaz | Aplicar una dirección de los bocetos a app, web y panel, conservando lo ya comprobado. Cámara/materiales y pines primero; cambios de geometría por separado. |
| 5 | Rendimiento y organización | Carga diferida, DTO, reutilización de datos, caché y gestión de recursos del motor, con comparación de comportamiento. |
| Decisión previa | Cambios mayores o funciones incompletas | Permisos, migraciones, actualización de frameworks, edición/búsqueda de cuentas, ficha/búsqueda del dataset, recuperación de contraseña y páginas ausentes. |

El orden refleja el alcance actual: ejecución local y portafolio. Una exposición pública de la API obligaría a revisar primero el bloque de permisos y dependencias. No se propone reconstruir OVH, Prometheus, chatbot ni publicación nativa.

## Bocetos que acompañan al diagnóstico

| Superficie | Referencias conservadas |
| --- | --- |
| App | [Mapa 3D](./bocetos-redisenio/01-app-mapa-3d.png), [acabado vectorial](./bocetos-redisenio/02-app-mapa-acabado-vectorial.png), [lista](./bocetos-redisenio/03-app-lista.png), [ficha](./bocetos-redisenio/04-app-ficha-producto.png). |
| Web pública | [Inicio](./bocetos-redisenio/05-web-inicio.png), [funcionamiento](./bocetos-redisenio/06-web-como-funciona.png). |
| Panel de empleados | [Estadísticas](./bocetos-redisenio/07-admin-estadisticas.png), [stock](./bocetos-redisenio/08-admin-stock.png). |
| Supermercado | [A, C, estanterías abastecidas y vistas](./bocetos-mapa/LEEME.md). |

La interfaz dibujada debe adaptarse a las funciones reales. Los mapas ampliados y abastecidos son referencias conceptuales; no garantizan las coordenadas del modelo recuperado ni implican una ampliación ya implementada. Las cifras de los bocetos son ilustrativas.

Para el portafolio fullstack presentaría el sistema desarrollado en equipo, la recuperación local y después las mejoras implementadas, diferenciando siempre demostración real y propuesta visual.
