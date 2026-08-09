# Wooly — Catálogos PDF V3
## Cierre técnico

Fecha: 2026-08-08

Repositorio:
`D:\JUNG\code\wooly\wooly-web`

Rama:
`main`

HEAD de referencia:
`44fe4ed`

---

## Estado

Catálogos PDF V3 queda cerrado para el alcance actual.

Se implementó y validó el Compositor Comercial de Catálogos Wooly con:

- modo automático;
- modo híbrido;
- modo manual;
- selección múltiple por categorías;
- selección múltiple por campañas;
- inclusión manual;
- exclusión manual;
- Product Explorer;
- preview comercial;
- preview cliente;
- persistencia local de borradores;
- abrir, guardar, duplicar y archivar;
- identidad comercial;
- título y descripción;
- portada automática;
- portada personalizada;
- publicación local;
- vigencia estándar de 7 días;
- publicación dinámica para automatic;
- publicación fija para hybrid/manual;
- bloqueo de edición después de publicar.

---

## Regla de portada

Fallback aprobado:

1. imagen personalizada;
2. imagen de campaña disponible;
3. `/og/og-catalogo.jpg`.

Las imágenes por categoría no participan en este fallback.

La gestión general de OGs queda fuera de este alcance.

---

## Persistencia actual

Actualmente:

`CatalogCompositionProvider`
→ `LocalCatalogCompositionProvider`
→ `localStorage`

Esto permite trabajar y validar el compositor en el navegador.

No constituye persistencia pública entre dispositivos.

---

## Identificadores

Los IDs actuales con formato:

`CAT-2026-XXXXXXXX`

son identificadores locales del workspace actual.

No deben asumirse como Public Catalog ID definitivo.

La próxima versión deberá separar:

`Draft ID`
→ publicación
→ `Public Catalog ID`

---

## Hosting actual

Wooly Web continúa como aplicación Vite estática.

Flujo productivo actual:

`npm run build`
→ `dist`
→ copia manual a Hostinger.

No existe actualmente un backend runtime dentro de wooly-web.

---

## Lo que NO se implementará ahora

Para evitar deuda antes de JUNG CORE, quedan fuera:

- backend temporal para publicaciones;
- API pública provisional;
- Google Sheets como base de publicaciones;
- escritura runtime dentro de `public/api`;
- publicación remota mediante localStorage;
- conexión real con JUNG CORE;
- SSR provisional;
- OG dinámico provisional.

---

## Frontera futura con JUNG CORE

La próxima evolución deberá estudiar una arquitectura equivalente a:

Wooly Web
→ CatalogPublicationProvider
→ JUNG CORE
→ PostgreSQL / publicación central
→ Public Catalog ID

Wooly deberá seguir dependiendo de contratos/providers,
no directamente de Prisma ni PostgreSQL.

---

## Ruta pública futura

Objetivo:

`/catalogo/pdf?id=<PUBLIC_CATALOG_ID>`

No activar esta ruta hasta disponer de persistencia compartida.

Los enlaces V2 actuales deben conservarse intactos:

- `/catalogo/pdf?v=1`
- `/catalogo/pdf?v=1&cat=...`
- `/catalogo/pdf?v=1&cpg=...`
- `/catalogo/pdf?v=1&cat=...&cpg=...`

---

## Punto exacto de reanudación

Cuando se retome esta funcionalidad:

1. auditar el módulo/API disponible de JUNG CORE;
2. diseñar `CatalogPublicationProvider`;
3. separar Draft ID y Public Catalog ID;
4. persistir publicaciones en CORE;
5. leer publicación por Public Catalog ID;
6. activar `/catalogo/pdf?id=...`;
7. resolver seguridad, vigencia e historial;
8. resolver OG dinámico si sigue siendo requerido.

---

## Última validación funcional registrada

- ESLint: PASS
- TypeScript: PASS
- Test Files: 13/13 PASS
- Tests: 129/129 PASS
- git diff --check: PASS
- Build productivo: PASS
- PDF V2 intacto
- StorageEnvelope intacto
- HTML inicial intacto

No se realizó staging, commit, push ni deploy.

---

## Cierre

Catálogos PDF V3 queda listo para ser retomado en una versión futura
sin reconstruir el compositor actualmente validado.