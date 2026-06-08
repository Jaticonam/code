\# WOOLY HUB — ARTICLES SCHEMA



\## Objetivo



La hoja Articles será la base central del contenido SEO, comercial y estratégico de Wooly Hub.



Cada fila representa una guía, artículo o recurso que puede generar tráfico orgánico, conectar con productos del catálogo y llevar al usuario hacia una acción comercial.



\---



\## Categorías oficiales



\### Productos

Contenido relacionado con productos físicos del catálogo Wooly.



Subcategorías:

\- Flores

\- Papeles

\- Cajas

\- Peluches

\- Globos

\- Cintas

\- Accesorios

\- Hot Wheels



\### Ventas

Contenido orientado a vender mejor, aumentar ticket promedio y mejorar conversión.



Subcategorías:

\- WhatsApp

\- Redes Sociales

\- Precios

\- Clientes

\- Promociones

\- Atención



\### Tendencias

Contenido sobre señales del mercado, modas comerciales y oportunidades emergentes.



Subcategorías:

\- Packaging

\- Flores

\- Regalos

\- Coleccionables

\- Decoración

\- Personalización



\### Campañas

Contenido relacionado con fechas comerciales fuertes.



Subcategorías:

\- San Valentín

\- Día Mujer

\- Día Madre

\- Día Padre

\- Graduaciones

\- Flores Amarillas

\- Navidad

\- Escolar



\### Negocios

Contenido para modelos de negocio, emprendimientos y oportunidades comerciales.



Subcategorías:

\- Florería

\- Regalería

\- Hot Wheels

\- Detalles Personalizados

\- Nuevos Negocios



\### Estrategias

Contenido sobre tácticas comerciales y crecimiento.



Subcategorías:

\- Combos

\- Cross Selling

\- Upselling

\- Catálogos

\- Fidelización

\- Automatización



\---



\## Columnas de la hoja Articles



\### Identidad



| Campo | Descripción | Ejemplo |

|---|---|---|

| id | Código único del artículo | ART-0001 |

| slug | URL amigable | como-usar-papel-coreano |

| title | Título principal | Cómo usar papel coreano para envolver flores |

| excerpt | Resumen corto | Aprende técnicas simples para mejorar tus arreglos. |

| image | Imagen principal | https://... |

| author | Autor o marca | Wooly Team |



\---



\### Clasificación



| Campo | Descripción | Valores |

|---|---|---|

| category | Categoría principal | Productos, Ventas, Tendencias, Campañas, Negocios, Estrategias |

| subcategory | Subcategoría | Papeles, WhatsApp, San Valentín, etc. |

| campaign | Campaña asociada si aplica | San Valentín, Día Madre, Flores Amarillas |



\---



\### SEO



| Campo | Descripción | Ejemplo |

|---|---|---|

| meta\_title | Título SEO | Cómo usar papel coreano para flores \\| Wooly |

| meta\_description | Descripción SEO | Aprende a usar papel coreano para mejorar tus arreglos florales. |

| keywords | Palabras clave separadas por coma | papel coreano, flores, arreglos, florería |



\---



\### Contenido



| Campo | Descripción |

|---|---|

| content | Contenido principal en JSON o texto estructurado |

| faq | Preguntas frecuentes en JSON |

| read\_time | Tiempo estimado de lectura |



\---



\### Relaciones comerciales



| Campo | Descripción | Formato |

|---|---|---|

| related\_products | Productos relacionados | SKU001\\|SKU002\\|SKU003 |

| related\_categories | Categorías del catálogo relacionadas | Papeles\\|Cintas\\|Flores |

| related\_articles | Artículos relacionados | ART-0002\\|ART-0005 |



\---



\### Configuración comercial



| Campo | Descripción | Valores |

|---|---|---|

| intent | Intención del contenido | Informacional, Comercial, Transaccional, Comparativo |

| level | Nivel del lector | Inicio, Intermedio, Avanzado |

| featured | Destacado | TRUE, FALSE |

| popular | Popular | TRUE, FALSE |

| priority | Prioridad de orden | 0 a 100 |



\---



\### Estado



| Campo | Descripción | Valores |

|---|---|---|

| status | Estado del artículo | Borrador, Publicado, Oculto |

| published | Fecha de publicación | 2026-06-07 |

| updated\_at | Última actualización | 2026-06-07 |



\---



\## Reglas



1\. Cada artículo debe tener un `id` único.

2\. Cada artículo debe tener un `slug` único.

3\. Todo artículo publicado debe tener `title`, `excerpt`, `image`, `category`, `subcategory`, `meta\_title`, `meta\_description` y `status`.

4\. La categoría debe pertenecer a las categorías oficiales.

5\. La subcategoría debe pertenecer a la categoría elegida.

6\. Si un artículo busca vender, debe incluir `related\_products`.

7\. Si un artículo pertenece a una fecha comercial, debe llenar `campaign`.

8\. `keywords` debe incluir términos comerciales y términos de búsqueda.

9\. `priority` define qué aparece primero en páginas de biblioteca.

10\. `status=Oculto` no debe mostrarse en el sitio.



\---



\## Flujo comercial



Google  

↓  

Artículo SEO  

↓  

Productos relacionados  

↓  

Catálogo  

↓  

WhatsApp  

↓  

Venta



\---



\## Visión



Catálogo = Inventario  

Blog = Tráfico  

WhatsApp = Cierre  

Wooly Hub = Máquina de adquisición de clientes

