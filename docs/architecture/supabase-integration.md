# Arquitectura de integración Supabase

## Objetivo

Este documento define cómo `Sikim-pos` debería integrarse con Supabase y con el ecosistema de datos internos de Sikim.

La intención es preparar futuras tareas de implementación con una dirección clara sobre datos, permisos, seguridad, reservas y Cheffing. La base mínima de cliente Supabase ya existe, pero este documento no crea migraciones ni cambia flujos de negocio.

## Estado actual

El estado actual de `Sikim-pos` es:

- la aplicación tiene una base mínima de cliente Supabase, una base server-only para service role key y diagnóstico protegido en `/admin/supabase`;
- la interfaz POS actual funciona con datos mock/locales;
- la aplicación está protegida por una puerta global de contraseña;
- no existen migraciones POS en este repositorio;
- no existe autenticación real de usuarios POS;
- no existe persistencia real en base de datos;
- el despliegue en Vercel ya existe;
- las variables de entorno de la puerta de contraseña existen en el despliegue;
- las variables de entorno de Supabase pueden no estar configuradas y la aplicación debe seguir compilando.

La puerta de contraseña actual protege el acceso inicial al despliegue, pero no representa todavía un modelo de permisos por usuario, auditoría individual, caja, cobro o anulación.

## Decisiones ya tomadas

Las decisiones de producto y arquitectura ya fijadas son:

- POS usará principalmente el mismo ecosistema Supabase que `Sikim-gestio-reserves`;
- las migraciones específicas de POS deberían vivir en `Sikim-pos` cuando creen o modifiquen datos propios `pos_*`;
- las estructuras compartidas de reservas, Cheffing y usuarios deben coordinarse con `Sikim-gestio-reserves`;
- la puerta de contraseña es la capa inicial de acceso antes de escrituras Supabase;
- usuarios reales, sesiones y permisos POS vendrán después;
- las reservas deben aparecer dentro del POS durante el servicio;
- Cheffing sigue siendo la fuente de verdad para platos, cartas y menús;
- POS probablemente necesitará una capa operativa propia sobre Cheffing para visibilidad, nombres cortos, categorías, estación, disponibilidad y ruta de impresión.

Estas decisiones no significan que Supabase ya esté conectado en este repositorio.

## Principios de integración

Cuando empiece la integración, Supabase pasará a ser la fuente de verdad para los datos operativos persistentes.

Principios:

- no usar `localStorage` ni `sessionStorage` como fuente de verdad del POS;
- los pedidos, tickets y envíos a cocina/barra deben snapshotear nombre de producto, precio, impuesto y metadata relevante;
- los pedidos históricos no deben cambiar cuando cambien nombres, precios o metadata en Cheffing;
- el POS no debe reescribir históricos por cambios futuros de Cheffing;
- las operaciones POS deben ser auditables;
- las acciones sensibles requieren permisos explícitos;
- nunca exponer una clave `service-role` en el navegador;
- no crear políticas RLS públicas amplias de lectura o escritura;
- no introducir integraciones reales fiscales, de pagos o de impresión en el primer paso Supabase.

El objetivo inicial no es construir todo el backend, sino abrir una integración segura, pequeña y revisable.

## Entornos Supabase: producción y staging

Hay una decisión abierta sobre si Sikim tendrá un Supabase de staging separado.

En términos simples:

- Supabase de producción contiene datos reales de operación de Sikim;
- Supabase de staging sería un entorno seguro de pruebas con datos falsos o copias controladas.

### Option A — Direct shared production Supabase

Pros:

- datos realistas desde el primer momento;
- integración directa con reservas y Cheffing;
- menos configuración duplicada.

Riesgos:

- mayor riesgo operativo;
- migraciones y RLS deben ser muy cuidadosas;
- una mala escritura podría afectar datos reales.

### Option B — Separate staging Supabase first

Pros:

- pruebas de esquema más seguras;
- sin riesgo directo para reservas o Cheffing reales;
- más fácil probar tablas POS nuevas.

Riesgos:

- después hay que replicar configuración y migraciones;
- los datos falsos pueden alejarse de la realidad operativa.

### Option C — Hybrid

Usar staging o local/dev para trabajo arriesgado de esquema, y pasar después al Supabase compartido de producción con revisión explícita.

Dirección recomendada:

- el objetivo final es el ecosistema Supabase compartido;
- el primer trabajo de esquema/migraciones debe revisarse con cuidado y, si es posible, probarse fuera de producción;
- si staging aún no existe, compensar con migraciones muy pequeñas, revisión explícita y sin SQL destructivo.

## Propiedad de migraciones

Una migración es un archivo SQL que crea o cambia el esquema de la base de datos: tablas, columnas, índices, constraints, funciones, políticas RLS o triggers.

La propiedad de migraciones indica qué repositorio es responsable de proponer, revisar y mantener esos cambios.

Reglas:

- las migraciones POS propias pueden vivir en `Sikim-pos`;
- las migraciones compartidas que toquen reservas, Cheffing o usuarios existentes requieren coordinación con `Sikim-gestio-reserves`;
- se debe evitar que dos repositorios modifiquen independientemente las mismas tablas compartidas sin revisión;
- las tablas nuevas de POS deberían usar un prefijo claro, por ejemplo `pos_*`;
- este documento no crea ninguna migración.

Regla inicial recomendada:

- `Sikim-pos` será dueño de futuras tablas POS específicas `pos_*`;
- `Sikim-gestio-reserves` seguirá siendo la referencia canónica para tablas existentes de reservas, Cheffing y datos compartidos;
- cualquier cambio en tablas compartidas debe planificarse explícitamente antes de tocar SQL.

## Dominios de datos

| Domain | Example future tables/data | Likely owner | Notes |
| --- | --- | --- | --- |
| POS areas/tables/layout | `pos_areas`, `pos_tables`, `pos_table_layouts` | `Sikim-pos` | Configuración operativa de sala y disposición física. |
| Table sessions | `pos_table_sessions`, enlaces mesa-sesión | `Sikim-pos` | Unidad viva del servicio; puede enlazar reserva o walk-in. |
| Orders/order items | `pos_orders`, `pos_order_items`, snapshots de venta | `Sikim-pos` | Comandas y líneas; deben snapshotear datos críticos. |
| Production/kitchen lines | `pos_production_lines`, `pos_kitchen_sends` | `Sikim-pos` | Envíos idempotentes a cocina/barra y estados de producción. |
| Print jobs | `pos_print_jobs`, `pos_print_job_attempts` | `Sikim-pos` | Abstracción futura; no equivale a impresión real todavía. |
| Payments | `pos_payments` | `Sikim-pos` | Registro operativo auditable; no integración terminal/fiscal inicial. |
| Shifts/cash | `pos_shifts`, `pos_cash_movements`, `pos_shift_closures` | `Sikim-pos` | Apertura/cierre de turno, caja y diferencias. |
| Audit events | `pos_audit_events`, eventos por entidad | `Sikim-pos` | Trazabilidad de acciones sensibles. |
| Reservations/group events | `group_events`, `group_event_offerings`, asignaciones | `Sikim-gestio-reserves` | Reserva operativa compartida; POS consume y actúa con coordinación. |
| External reservation submissions | `external_reservation_submissions` | `Sikim-gestio-reserves` | Procedencia y metadata de solicitudes externas pendientes. |
| Customers | `customers`, campos `customer_*` asociados a reservas | Compartido / `Sikim-gestio-reserves` | POS puede necesitar lectura contextual; no debe crear CRM paralelo sin decisión. |
| Cheffing dishes/cards/menus | `cheffing_dishes`, `cheffing_cards`, `cheffing_menus` | `Sikim-gestio-reserves` | Fuente canónica de producto, carta y menú. |
| Users/permissions | Supabase Auth, `app_allowed_users`, permisos POS futuros | Compartido / coordinado | El POS necesitará capacidades explícitas, no solo acceso genérico interno. |

## Relación con reservas

Las reservas son operativamente importantes para Sikim y deben aparecer dentro del flujo POS.

Flujo esperado:

1. Una solicitud externa entra desde `Reserves_extern`.
2. La app interna crea o mantiene una reserva pendiente en el modelo operativo interno.
3. POS notifica durante el servicio que existe una solicitud externa nueva o pendiente.
4. El staff revisa la solicitud.
5. El staff acepta o rechaza la reserva si tiene permisos.
6. La reserva confirmada puede asignarse a una mesa.
7. Cuando llega el cliente, el staff lo sienta.
8. La sesión de mesa y la comanda POS se vinculan con la reserva.
9. No-show, cancelación y cierre a `0,00 €` quedan como acciones futuras explícitas y auditables.

En modo invierno:

- el restaurante puede trabajar principalmente con reservas;
- si no hay reservas, quizá no se abre;
- son habituales los menús cerrados;
- compras y producción se planifican desde reservas.

En modo verano:

- el restaurante abre diariamente;
- hay más walk-ins;
- pueden entrar reservas el mismo día;
- el staff puede estar sirviendo mientras llega una nueva solicitud externa;
- POS debería mostrar notificaciones o popups para solicitudes externas nuevas;
- el staff debería poder revisar, aceptar o rechazar desde POS cuando tenga permisos.

Límites:

- POS no debe rediseñar `Reserves_extern`;
- POS consume y actúa sobre el estado interno de reservas;
- el mecanismo de avisos sigue abierto: polling, Supabase Realtime o mecanismo interno de notificación.

## Relación con Cheffing

Cheffing sigue siendo la fuente canónica de platos, bebidas, cartas, menús, costes y metadata de producto.

POS necesita una capa operativa de catálogo para servicio. Un concepto futuro razonable es `pos_products`, referenciando datos de Cheffing cuando proceda.

La capa POS podría definir:

- visible en POS;
- nombre corto para botón;
- categoría POS;
- orden de aparición;
- color;
- estación de cocina/barra/postres;
- ruta de impresión;
- disponibilidad;
- precio POS o override de precio si se aprueba;
- disponibilidad por carta o menú.

POS no debería modificar de forma casual:

- recetas;
- costes;
- foodcost;
- importaciones;
- datos fuente de Cheffing.

Los productos vendidos o enviados deben guardar snapshot de los valores usados en ese momento. El histórico del POS no debe depender de futuras ediciones de Cheffing.

Decisiones abiertas:

- si POS puede editar directamente `cheffing_dishes.selling_price`;
- si POS debe guardar `pos_price_override`;
- si los cambios de precio deben aprobarse desde un flujo interno Cheffing/admin.

Postura inicial recomendada:

- empezar con overlay POS y snapshots;
- evitar mutaciones directas desde POS sobre recetas, costes, importaciones y datos maestros de Cheffing.

## Usuarios, acceso y permisos

Estado actual:

- existe una puerta global de contraseña;
- protege la aplicación completa;
- la sesión compartida puede durar alrededor de 3 días;
- no proporciona auditoría por usuario;
- no distingue cajero, cocina, sala, admin o responsable de turno.

La puerta de contraseña es útil antes de Supabase, pero no es suficiente para pagos, caja, anulaciones, cierres de turno o administración POS.

Futuro:

- integrar con Supabase Auth y/o con un modelo tipo `app_allowed_users`;
- definir permisos POS explícitos;
- registrar actor real en acciones sensibles.

Capacidades POS candidatas:

- `can_pos_access`;
- `can_pos_manage_orders`;
- `can_pos_send_kitchen`;
- `can_pos_void_items`;
- `can_pos_take_payments`;
- `can_pos_close_shift`;
- `can_pos_admin`.

Las acciones de cobro, caja y anulación no deberían depender indefinidamente de una contraseña compartida.

## Estrategia de acceso desde Sikim POS

Patrones posibles:

1. Lecturas directas a Supabase con RLS.
2. Server Actions o API routes para escrituras sensibles.
3. RPCs o funciones de base de datos para operaciones atómicas.

Recomendación:

- las lecturas simples pueden usar Supabase con RLS;
- las escrituras sensibles deben pasar por funciones o acciones server-side;
- el envío a cocina/barra debe ser idempotente;
- la creación de print-jobs debe ser idempotente;
- pagos y cierre de turno requieren permisos fuertes y auditoría;
- las operaciones transaccionales deberían concentrarse en RPCs o funciones server-side para evitar estados parciales.

Ejemplos de operaciones sensibles:

- aceptar o rechazar reserva desde POS;
- abrir/cerrar sesión de mesa;
- enviar líneas a cocina/barra;
- anular línea ya enviada;
- registrar pago;
- cerrar turno;
- cambiar configuración de catálogo POS.

## Variables de entorno

Variables públicas para cliente Supabase, sin valores reales:

- `NEXT_PUBLIC_SUPABASE_URL`;
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Variable server-only para futuras rutas o acciones protegidas:

- `SUPABASE_SERVICE_ROLE_KEY`.

Variables existentes de la puerta de contraseña:

- `POS_ACCESS_PASSWORD_HASH`;
- `POS_SESSION_SECRET`;
- `POS_SESSION_MAX_AGE_SECONDS`.

Reglas:

- no commitear `.env`, `.env.local` ni secretos reales;
- no añadir archivos de entorno en esta tarea;
- nunca exponer la clave `service-role` al navegador;
- los secretos server-only no deben usar prefijo `NEXT_PUBLIC_`;
- `SUPABASE_SERVICE_ROLE_KEY` solo debe configurarse como variable de servidor en Vercel o en `.env.local` local, sin commitear valores reales;
- su existencia no implementa consultas de negocio, reservas, Cheffing, POS persistence ni Supabase Auth;
- si faltan las variables Supabase, la aplicación muestra estado no configurado en `/admin/supabase`;
- tras configurar variables en Vercel hace falta redeploy.

## Seguridad y RLS

Cuando existan tablas POS:

- RLS debe estar activado;
- no deben existir políticas públicas amplias de lectura o escritura;
- se debe aplicar mínimo privilegio;
- las políticas deben poder identificar el actor;
- producción y staging deben tratarse con cautela distinta;
- la clave `service-role`, si algún día se necesita, solo puede usarse server-side;
- fixtures, ejemplos y capturas no deben contener datos reales de clientes;
- pagos, caja, anulaciones y cierre de turno requieren controles más estrictos.

RLS debe diseñarse junto con permisos POS, no como un añadido al final.

## Auditoría operativa

La implementación futura debe auditar al menos:

- apertura y cierre de sesión de mesa;
- creación de comanda;
- cambios de líneas de comanda;
- envío a cocina/barra;
- anulación o cancelación;
- intentos de impresión;
- registro de pago;
- movimiento de caja;
- cierre de turno;
- aceptación/rechazo de reserva;
- sentar cliente;
- asignación de mesa;
- cambios administrativos sensibles.

Cada evento debería registrar actor, timestamp, entidad afectada, acción, estado anterior/posterior cuando aplique y motivo si la acción lo requiere.

## Fases de implementación

Secuencia recomendada:

1. Documento de arquitectura Supabase. Hecho.
2. Decidir enfoque staging/producción.
3. Añadir documentación de variables Supabase / plan de variables Vercel. Hecho.
4. Añadir base mínima de cliente Supabase. Hecho.
5. Añadir base server-only para service role key sin consultas ni escrituras. Hecho.
6. Añadir ruta interna de health/check o estado si aporta valor. Hecho: `/admin/supabase`.
7. Plan de auth/sesión más allá de la puerta de contraseña.
8. Diseñar el primer esquema POS.
9. Revisar RLS y propiedad de migraciones.
10. Aplicar primeras migraciones POS-only.
11. Conectar panel de lectura/notificación de reservas.
12. Conectar catálogo Cheffing en solo lectura.
13. Implementar sesiones de mesa.
14. Implementar comandas y líneas.
15. Implementar líneas de producción de cocina/barra.
16. Implementar pagos y cierre de turno.
17. QA operativa.

Cada fase debe poder revisarse como PR pequeño y temático.

## Fuera de alcance

Fuera de alcance de este documento y de esta tarea:

- añadir archivos `.env` o `.env.local`;
- añadir migraciones;
- conectar autenticación;
- cambiar RLS;
- tocar datos de producción;
- integrar terminales de pago;
- integrar impresión real;
- implementar fiscalidad, VeriFactu, AEAT u Odoo;
- cambiar el motor público de reservas externas;
- cambiar la app interna de gestión;
- modificar UI o comportamiento runtime.

## Decisiones abiertas

Quedan abiertas:

- si habrá Supabase de staging;
- esquema exacto POS;
- alcance de la primera migración;
- integración exacta de usuarios/permisos;
- valor final del TTL de la puerta de contraseña;
- si POS puede editar directamente precio Cheffing;
- si se usará `pos_price_override`;
- cómo se disparan los popups de reservas;
- polling vs Supabase Realtime;
- cómo se enlazan reservas con sesiones de mesa;
- si se usará realtime para mesas y comandas;
- cómo resolver conflictos multi-dispositivo;
- cuándo introducir print-jobs;
- cuándo introducir fiscalidad y contabilidad;
- si ciertas operaciones compartidas deben vivir como RPCs en el esquema existente.

## Recomendación inicial

La recomendación inicial es:

- mantener la puerta de contraseña mientras POS todavía no escribe en Supabase;
- mantener documentadas las variables Supabase y el plan Vercel;
- usar la base mínima de cliente Supabase para futuros PRs de lectura revisados;
- hacer que el primer PR técnico de Supabase no cree tablas todavía;
- hacer que el primer PR de base de datos/migraciones sea POS-only y pequeño;
- mantener como objetivo final el mismo ecosistema Supabase que `Sikim-gestio-reserves`;
- usar staging cuando esté disponible, o migraciones extremadamente pequeñas y revisadas antes de cualquier escritura en producción;
- no tocar reservas, Cheffing, usuarios, pagos, impresión ni fiscalidad sin un plan explícito.
