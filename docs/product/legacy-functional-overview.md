# Mapa funcional del POS Sikim

> Nota de alcance:
>
> - Este documento resume las referencias legacy/mock del POS y los documentos de auditoria disponibles.
> - No es una implementacion.
> - No significa que todas las funciones descritas ya sean reales en la app Next.js actual.
> - Las referencias legacy son `MOCK_ONLY`.

## Objetivo del documento

Pau dejo una cantidad util de documentacion, auditorias, capturas y prototipos del POS Sikim, pero el material esta repartido entre rutas legacy, PDFs, matrices de botones, contratos mock, capturas y proyectos de referencia. Es valioso para entender el producto, pero dificil de leer si se quiere decidir que construir primero.

Este documento reorganiza esa informacion en un mapa funcional claro. La intencion es que Uri, Pau, operaciones y desarrollo puedan hablar del mismo POS sin tener que leer todos los ficheros tecnicos legacy.

El documento traduce las referencias `MOCK_ONLY` a lenguaje de producto:

- que pantallas existen o se esperan;
- que hace cada modulo;
- que acciones son importantes durante el servicio;
- que partes son mock/local;
- que partes deberian convertirse en backend real;
- que decisiones siguen abiertas antes de implementar datos sensibles.

## Visión general del producto

El POS Sikim debe cubrir el circuito operativo del restaurante:

`reserva o walk-in -> mesa/sesion -> comanda -> cocina/barra -> ticket -> cobro -> cierre de turno`

La idea no es crear una demo bonita, sino avanzar desde prototipo hacia una herramienta profesional de sala. El POS tiene que servir en servicio real: rapido, claro, dificil de usar mal y conectado con la forma en que Sikim ya trabaja con reservas, Cheffing, cocina y caja.

Hay una distincion importante:

- El prototipo legacy muestra muchas pantallas y estados, pero funciona con datos mock/local.
- La app Next.js actual ya tiene un shell navegable de POS/admin, pero no tiene todavia Supabase configurado, migraciones POS, auth real, cobros reales, impresoras reales ni fiscalidad real.
- La direccion futura es usar el mismo ecosistema Supabase que `Sikim-gestio-reserves`, con tablas POS especificas para mesas, sesiones, comandas, envios a cocina, pagos, caja y auditoria.

El POS debe permanecer como aplicacion separada, pero no como sistema aislado. Debe integrarse con reservas, Cheffing, usuarios internos y futuros contratos compartidos sin copiar toda la app interna.

## Modos de operación de Sikim

Sikim no opera igual todo el año. El POS debe reflejar esa realidad en la forma de priorizar reservas, walk-ins, cocina y compras.

### Winter / reservation-driven mode

En invierno el restaurante puede abrir principalmente cuando hay reservas. En este modo:

- las reservas tienen mucho peso operativo;
- son mas frecuentes menus cerrados o servicios planificados;
- la compra de comida puede prepararse a partir de reservas confirmadas;
- hay menos walk-ins espontaneos;
- interesa saber con antelacion personas, hora, menu previsto y necesidades especiales;
- el POS debe ayudar a convertir una reserva confirmada en sesion de mesa y comanda sin friccion.

En este modo, el panel de reservas y la preparacion de servicio son mas importantes que la entrada rapida de mesas espontaneas.

### Summer / daily open mode

En verano el restaurante esta abierto a diario y la operacion es mas dinamica:

- hay mas walk-ins;
- las reservas pueden entrar el mismo dia desde el motor publico externo;
- el equipo puede estar atendiendo mesas cuando llega una nueva solicitud externa;
- el POS deberia mostrar una notificacion o pop-up de nuevas solicitudes externas;
- el staff deberia poder aceptar, rechazar o revisar la solicitud desde el POS sin abandonar el flujo de servicio.

Esto no significa redisenar el motor publico de reservas. El POS debe consumir o actuar sobre el estado de reserva cuando exista integracion, especialmente para solicitudes pendientes y reservas confirmadas del dia.

## Estructura general de la aplicación

La aplicacion se entiende en dos grandes bloques: operacion de sala y administracion.

Areas principales:

- Frontoffice / POS sala: pantalla de uso durante servicio, con zonas, mesas, reservas y acceso a comanda/cobro.
- Comanda: seleccion de productos, notas, modificadores, menus y envio a cocina/barra.
- Cobro: cuenta completa, pago separado, cuenta dividida y metodos de pago mock/futuros.
- Cocina/barra: tablero de produccion con lineas enviadas, estados y reclamaciones.
- Ticket: vista del ticket operativo de cliente, no factura fiscal final.
- Turno/caja: apertura, movimientos, cierre e informe diario operativo.
- Backoffice/admin: configuracion y supervision de catalogo, mesas, reservas, produccion, caja, informes, fiscal/Odoo, usuarios y SIKIM APP.
- Ayuda: ayuda contextual para operador y base de conocimiento admin.

El objetivo de V1 debe ser operativo: poder abrir turno, sentar mesa o reserva, tomar comanda, enviar a cocina/barra, cobrar, emitir ticket operativo y cerrar caja.

## Frontoffice / TPV de sala

El frontoffice es la pantalla principal del servicio. Debe funcionar bien en tablet y permitir operar rapidamente.

Responsabilidades esperadas:

- entrar al POS despues de una puerta de caja/sesion o password gate;
- mostrar zonas y mesas;
- mostrar estados de mesa;
- seleccionar una mesa;
- abrir una sesion de mesa;
- abrir una comanda directa sin mesa cuando sea necesario;
- mostrar panel de reservas del dia;
- avisar de nuevas solicitudes externas cuando haya integracion;
- mostrar ayuda contextual;
- agrupar y disociar mesas;
- permitir mover mesa o reubicar operacion en una fase posterior;
- editar mapa/layout solo como funcion mock/futura hasta tener persistencia real;
- acceder a comanda y cobro.

Botones clave del frontoffice:

| Boton | Que significa | Estado esperado |
| --- | --- | --- |
| Abrir mesa | Abrir o entrar en la sesion operativa de una mesa libre u ocupada | Real en V1 |
| Ver comanda | Ir al detalle de la comanda abierta | Real en V1 |
| Cobrar | Ir al flujo de pago/ticket | Real en V1 basico |
| Enviar cocina | Convertir lineas no enviadas en produccion cocina/barra | Real en V1, con idempotencia |
| Buscar reserva | Localizar reserva del dia y vincularla a mesa/sesion | Real en V1 si reservas estan conectadas |
| Mover mesa | Cambiar sesion/comanda a otra mesa | Pendiente para despues del MVP basico |
| Marcar incidencia | Registrar problema operativo de mesa, pedido o servicio | Futuro |
| Agrupar / Dissociar | Usar varias mesas como una unidad operativa | Mock/pending temprano; real cuando haya sesiones multi-mesa |
| Modificar mapa | Editar posicion visual de mesas | Mock/local; futuro con persistencia y auditoria |
| Crear comanda directa | Crear pedido sin mesa fisica | Real en V1 si se necesita barra/takeaway interno |
| Actualizar | Refrescar datos de reservas, catalogo, caja o mesas | Real en V1 |
| Reserves | Abrir panel de reservas del dia | Real en V1 de reservas |
| Ajuda | Abrir ayuda contextual de operador | Mock/local al inicio; real como contenido estable |
| Bloquear | Bloquear terminal sin cerrar turno | Futuro/pending; relacionado con password gate |
| Backoffice/Admin | Ir a administracion si el usuario tiene permiso | Real cuando haya permisos; limitado por password gate al inicio |

El legacy valida muchos de estos botones con localStorage y datos mock. En la app real, las acciones sensibles no deberian depender solo del navegador.

## Backoffice / administración

El backoffice es el area de configuracion, supervision y control. No es para operar cada click de servicio, pero debe dar soporte a la operacion.

| Area admin | Proposito | Informacion principal | Acciones clave | Relacion POS | Estado esperado |
| --- | --- | --- | --- | --- | --- |
| Inici | Hub de navegacion y resumen | Estado de modulos, enlaces, avisos | Entrar a secciones, volver a Frontoffice | Punto de entrada admin | Shell real, datos mock/local |
| Cataleg | Configuracion Cheffing -> TPV | Productos Cheffing, visibilidad, nombre corto, color, orden, estacion | Configurar producto POS, ocultar/activar, revisar pendientes | Alimenta botones de comanda | Futuro real con Cheffing; mock en legacy |
| Zones i taules | Gestion de zonas, mesas y layout base | 6 zonas, 61 mesas, capacidades, reservable/activo | Editar tabla/zona, preparar export frontoffice | Alimenta mapa de sala | Futuro real; mock/local en legacy |
| Reserves | Gestion operativa de reservas | Solicitudes, confirmadas, asignaciones, bloqueos | Confirmar, rechazar, asignar mesa, no-show, cancelar | Vincula reserva con sesion/comanda | Futuro real consumiendo reservas existentes |
| Produccio | Monitor de cocina/barra e impresoras logicas | Tickets, lineas, estaciones, rutas, impresoras logicas | Marcar preparado, cancelar, reimprimir mock | Recibe `Enviar cocina` | V1 con tablero simple; impresion real futura |
| Comandes | Ordenes/comandas pagadas o abiertas | Ordenes, lineas, pagos, mesa, origen | Consultar detalle, filtrar por fecha/mesa | Auditoria de ventas POS | V1 despues de persistencia de comanda |
| Informes | Resumen comercial y export analitico | Ventas por producto, metodo, zona, Cheffing ids | Filtrar, exportar mock | Alimenta control interno | Futuro tras datos reales |
| SIKIM APP | Conector mock de eventos POS | Eventos, batches, estado, ids Cheffing | Encolar, marcar enviado/error mock | Futura integracion consumo/stock | Futuro/mock; no API real |
| Caixa | Caja e informe diario | Sesion de caja, movimientos, efectivo esperado, diferencias | Abrir, cerrar, depositos, retiradas, gastos | Controla cobros y cierre | V1 basico operativo |
| Fiscal / Odoo | Puente futuro de facturas/exports | Solicitudes, Odoo mock, fiscal agent mock, VeriFactu mock | Crear request, encolar export mock | Despues de ticket/pago | Futuro; fuera del alcance inicial |
| Usuaris i permisos | Modelo de roles/capacidades | Usuarios mock, roles, permisos | Consultar matriz, simular permiso | Controla acciones sensibles | Password gate inicial; permisos reales despues |
| Ajuda admin | Base de conocimiento y FAQ | Preguntas, respuestas, propuestas | Preparar respuesta/propuesta mock | Alimenta ayuda operador | Mock/local temprano |
| Frontoffice link | Salto a sala | Enlace a POS | Volver a operar | Une admin y servicio | Real |

El backoffice legacy es una capa `MOCK_ONLY` para validar contratos. No debe interpretarse como backend ya implementado.

## Reservas

Las reservas son centrales para Sikim, especialmente en invierno y en verano con solicitudes externas de ultimo momento.

Flujo funcional recomendado:

1. Entra una solicitud externa de reserva desde el motor publico.
2. La solicitud queda en estado pendiente interno.
3. El POS muestra una notificacion o pop-up si el staff esta en servicio.
4. El staff puede revisar, aceptar o rechazar.
5. Si se confirma, la reserva puede quedar sin mesa o con mesa asignada.
6. La asignacion de mesa debe validar capacidad, disponibilidad y solapes.
7. Al llegar el cliente, el staff usa `Asseure client` o equivalente.
8. La reserva se vincula a una sesion de mesa y comanda.
9. La reserva puede acabar como completada, cancelada, no-show o rechazada.
10. Si una reserva se sienta pero no consume, debe poder cerrarse a `0,00 EUR` sin generar consumo ni movimiento de caja indebido.

Estados utiles:

- `pending` / `requested`: solicitud pendiente, no bloquea mesa.
- `confirmed`: aceptada, puede estar sin mesa.
- `assigned`: tiene mesa asignada y bloquea la franja.
- `seated`: cliente sentado, vinculado a sesion/comanda.
- `cancelled`: cancelada, libera bloqueos.
- `no_show`: no presentado, libera bloqueos.
- `completed`: servicio cerrado, libera mesa.
- `rejected`: rechazada, no bloquea.

El POS no rediseña el motor publico de reservas. En fases futuras, el POS debe consumir estados de reserva y permitir acciones operativas sobre ellas cuando el contrato con reservas este definido.

## Catálogo Cheffing → TPV

Cheffing sigue siendo la fuente de verdad para platos, cartas, menus y producto.

El POS no debe editar casualmente:

- recetas;
- foodcost;
- importaciones;
- escandallos;
- datos maestros de Cheffing.

Lo que necesita el POS es una capa operativa de configuracion para vender y producir:

- visible en POS;
- nombre corto de boton;
- categoria POS;
- orden;
- color;
- estacion: cocina, barra, postres u otra;
- ruta de impresion o produccion;
- disponibilidad operativa;
- precio POS u override de precio solo si se aprueba explicitamente.

El concepto futuro de `pos_products` debe entenderse como overlay/adaptador POS, no como copia libre del catalogo Cheffing. Puede conservar ids Cheffing y anadir configuracion TPV. No esta implementado como tabla real en este repo.

Regla historica importante: cuando una linea se envia a cocina/barra o se vende, debe guardar snapshot de nombre, precio, estacion y metadata relevante para que tickets historicos no cambien si Cheffing se edita despues.

## Mesas, zonas y layout

La referencia legacy define una paridad objetivo de 6 zonas y 61 puntos de servicio:

- Restaurant;
- Invernadero;
- Terraza;
- Food Truck;
- Mediterraneo;
- Lounge Bar.

`Pedidos` aparece como vista especial, no como zona fisica de mesas.

Distinciones clave:

- Mesa fisica: objeto estable del layout.
- Reserva: solicitud/compromiso con cliente.
- Sesion de mesa: uso real de una o varias mesas durante el servicio.
- Comanda: pedido operativo asociado a una sesion o pedido directo.

Estados visuales esperados:

- disponible;
- reservada;
- ocupada;
- pendiente cocina;
- cuenta emitida;
- bloqueada/fuera de servicio;
- agrupada;
- seleccionada en modo asignacion o agrupacion.

Agrupar/disociar mesas debe tratarse como operacion sensible. En real no basta con pintar mesas juntas: debe quedar claro que sesion, comanda, pago y auditoria pertenecen a un grupo de mesas.

Modificar mapa/layout es util, pero no debe pasar a real sin persistencia, permisos y auditoria. En legacy es una edicion mock/local del navegador.

## Comandas

La comanda es el corazon operativo del POS.

Puede existir:

- por sesion de mesa;
- por grupo de mesas;
- por reserva sentada;
- como comanda directa sin mesa.

Elementos principales:

- lineas de pedido;
- cantidades;
- producto POS vinculado a Cheffing;
- notas de cocina;
- modificadores;
- menus o cursos;
- estado draft/no enviado;
- estado enviado a cocina/barra;
- anulaciones o void;
- reclamaciones o reimpresiones;
- pagos asociados al cierre.

Reglas importantes:

- Una linea en borrador no es produccion.
- `Enviar cocina` solo debe enviar lineas pendientes.
- Repetir click no debe duplicar lineas ya enviadas.
- Una nueva linea anadida despues de enviar debe poder enviarse en un segundo envio.
- Cancelar/anular debe exigir motivo y permiso cuando sea sensible.
- `Afegir seguit` o anadir seguimiento/curso debe separarse de lo ya enviado.
- Reimprimir o reclamar no debe crear venta nueva.

## Cocina, barra y producción

La produccion representa lo que cocina/barra tiene que preparar.

Conceptos:

- estaciones: cocina caliente, cocina fria, barra/caja restaurante, cocteleria, foodtruck, postres u otras futuras;
- lineas de produccion;
- tickets de produccion;
- rutas de impresion o destino logico;
- estados de preparacion;
- reclamaciones/reimpresiones.

Estados recomendados:

- `sent`: enviado;
- `preparing`: en preparacion;
- `ready`: preparado;
- `served`: servido;
- `claimed`: reclamado;
- `error`: problema de envio/impresion;
- `cancelled`: cancelado.

El legacy modela impresoras logicas y rutas, pero no imprime de verdad. En el producto real, la impresion debe abstraerse como `print jobs` o cola equivalente antes de conectar hardware.

No hay impresion real todavia. No deben guardarse IPs, contrasenas, claves WiFi o datos sensibles de impresoras en este repo.

## Cobros, tickets y caja

El cobro debe soportar tres modos principales:

- cuenta completa;
- pagar por separado;
- dividir cuenta.

Metodos de pago:

- efectivo;
- tarjeta;
- SumUp mock/futuro;
- otro/manual.

Funciones esperadas:

- importe exacto;
- calculo de cambio;
- registro de metodo de pago;
- ticket de cliente;
- ticket por email como mock/futuro;
- cobro parcial o separado si se aprueba para V1;
- control de errores antes de cerrar la mesa.

Caja/turno:

- abrir caja o turno;
- registrar pagos durante servicio;
- depositos;
- retiradas;
- gastos;
- correcciones;
- cierre de caja;
- efectivo esperado;
- efectivo contado;
- diferencia;
- informe diario.

El ticket de cliente de V1 es operativo, no factura fiscal final. Debe servir para el cliente y para control interno, pero no debe presentarse como factura legal si no existe integracion fiscal aprobada.

## Fiscal / Odoo

Fiscal/Odoo aparece en las referencias como puente futuro/mock.

Lo que modela:

- solicitud de factura;
- cola de export a Odoo mock;
- estado de agente de facturas mock;
- estado fiscal/VeriFactu mock;
- preview de payload operativo.

Lo que no hace:

- no emite factura fiscal real;
- no conecta con Odoo real;
- no conecta con AEAT;
- no implementa VeriFactu;
- no genera numeracion fiscal definitiva;
- no firma facturas;
- no crea QR fiscal real.

Este modulo debe permanecer fuera del alcance inicial. Antes de hacerlo real hacen falta decision tecnica, asesoramiento fiscal/legal y contrato de datos auditables.

## SIKIM APP

El modulo SIKIM APP es un conector futuro/mock para comunicar eventos POS hacia el ecosistema interno.

Idea funcional:

- cuando el POS envia una linea a cocina/barra, se puede generar un evento operativo;
- el evento conserva ids Cheffing, producto, cantidad, mesa, zona, produccion y fecha;
- esos eventos pueden agruparse en batches;
- el sistema futuro podria usarlo para consumo teorico, stock o analitica;
- debe haber idempotencia para no duplicar consumos por reintentos.

No existe una API real SIKIM APP desde este repo. La integracion futura puede ser una API, tablas compartidas, backend compartido, job interno o event bus. La decision queda abierta.

Regla de producto: el POS no es la fuente de verdad de inventario. SIKIM APP/Cheffing debe seguir gobernando stock, compras, proveedores, escandallos y consumo teorico.

## Usuarios, permisos y acceso

Decision actual de producto:

- al inicio, proteger todo el POS con una puerta de password simple y fuerte;
- los dispositivos no deberian pedir password constantemente;
- una TTL conceptual alrededor de 3 dias es razonable para operacion;
- mas adelante, integrar usuarios/permisos con el modelo interno de `Sikim-gestio-reserves`.

Concepto recomendado:

- password solo en variable de entorno;
- nunca hardcodear el password;
- cookie de sesion para mantener el dispositivo autenticado;
- expiracion configurable;
- sin auditoria real por usuario hasta integrar usuarios reales;
- no exponer claves ni `service-role` en navegador.

Permisos futuros:

- acceso POS;
- gestionar comandas;
- enviar cocina/barra;
- anular/cancelar;
- cobrar;
- cerrar turno;
- administrar configuracion POS;
- ver informes;
- operar produccion;
- gestionar reservas.

El legacy tiene matriz mock de roles (`admin`, `manager`, `cambrer`, `cuina`, `auditor`). Esa matriz ayuda a pensar el producto, pero no es seguridad real.

## Ayuda operador y ayuda admin

Hay dos ayudas distintas:

- `/ayuda`: ayuda del operador durante servicio.
- `/admin/help`: base de conocimiento y FAQ de administracion.

La ayuda de operador debe resolver dudas rapidas:

- como abrir/cerrar caja;
- que hacer con una mesa reservada;
- como enviar a cocina;
- como anular una linea;
- como cobrar separado;
- que significa un estado de mesa.

La ayuda admin debe permitir revisar contenidos, preguntas frecuentes y propuestas de respuesta. En legacy el flujo de propuestas es mock/local: no hay IA real, backend real, entrenamiento automatico ni escritura persistente.

## Estados: real, mock y pendiente

Leyenda:

| Estado | Significado |
| --- | --- |
| `Real` | Implementado contra backend/datos reales y utilizable como comportamiento de producto. |
| `Mock/local` | Visible o interactivo solo en prototipo, navegador o fixtures locales. |
| `Pendiente` | Visible o documentado, pero todavia no implementado de forma funcional. |
| `Futuro` | Intencionalmente fuera de V1 o reservado para una fase posterior. |

Esta diferencia importa porque el legacy contiene muchos botones que "funcionan" en localStorage. Eso sirve para validar flujo, pero no equivale a sistema real multi-dispositivo, auditable y seguro.

## Mapa de pantallas

| Area | Route | Legacy reference | Purpose | Current expected status | Notes |
| --- | --- | --- | --- | --- | --- |
| Entrada | `/` | Backoffice/frontoffice shell references | Punto inicial y orientacion | Shell real | No debe prometer backend real |
| Turno/caja gate | `/turno` | `00_frontoffice_initial_closed_cash.png`, cash gate | Abrir contexto de caja/sesion | Shell real, logica real pendiente | Relacionado con password gate y caja |
| POS sala | `/pos` | `frontoffice-v04/index.html` | Zonas, mesas, reservas, acciones rapidas | Shell real; datos mock/local | Debe evolucionar a mesas/sesiones reales |
| Comanda | `/pos/comanda` | Frontoffice ticket/order screens | Anadir productos, notas, menus, enviar cocina | Shell real; persistencia pendiente | Necesita catalogo Cheffing real |
| Cobro | `/pos/cobro` | Payment full/separate/split screenshots | Cobrar cuenta completa/separada/dividida | Shell real; cobro real pendiente | Ticket no fiscal |
| Ticket | `/ticket` | Ticket cliente legacy | Ver/imprimir/enviar ticket operativo | Shell real; impresion real pendiente | No factura fiscal |
| Cocina | `/cocina` | Backoffice production, kitchen board | Ver lineas cocina/barra | Shell real; datos reales pendientes | KDS/print jobs futuros |
| Ayuda operador | `/ayuda` | Help chatbot v0.4 | Ayuda durante servicio | Shell real; contenido mock/local | Separada de admin help |
| Admin inicio | `/admin` | `app/backoffice/index.html` | Hub administracion | Shell real | Enlaces a modulos |
| Catalogo | `/admin/catalogo` | `app/backoffice/catalog.html` | Configurar Cheffing -> TPV | Shell real; integracion pendiente | `pos_products` futuro |
| Mesas | `/admin/mesas` | `app/backoffice/tables.html` | Zonas, mesas, layout | Shell real; persistencia pendiente | 6 zonas / 61 mesas como target legacy |
| Reservas | `/admin/reservas` | `app/backoffice/reservations.html` | Gestion reservas/mesa | Shell real; integracion pendiente | No rediseña motor publico |
| Comandas | `/admin/comandas` | `app/backoffice/orders.html` | Consultar ordenes/comandas | Shell real; datos reales pendientes | Fuente compartida futura |
| Produccion | `/admin/produccion` | `app/backoffice/production.html` | Monitor produccion/impresoras logicas | Shell real; mock/futuro | Sin impresion real |
| Caja | `/admin/caja` | `app/backoffice/cash.html` | Caja e informe diario | Shell real; V1 futura | No fiscal final |
| Informes | `/admin/informes` | `app/backoffice/reports.html` | Ventas/reporting | Shell real; futuro | Depende de ventas reales |
| Usuarios | `/admin/usuarios` | `app/backoffice/users.html` | Roles/permisos | Shell real; password gate inicial | Auth real despues |
| Fiscal | `/admin/fiscal` | `app/backoffice/fiscal.html` | Puente fiscal/Odoo mock | Shell real; futuro | Fuera de alcance inicial |
| SIKIM APP | `/admin/sikim-app` | `app/backoffice/sikim-app.html` | Eventos/batches POS -> SIKIM APP | Shell real; futuro/mock | Sin API real |
| Ayuda admin | `/admin/help` | `app/backoffice/help-admin.html` | KB/FAQ/propuestas | Shell real; mock/local | Alimenta ayuda operador |

## Mapa de acciones principales

| Module | Action | Meaning | Early status | Future real behavior |
| --- | --- | --- | --- | --- |
| Acceso | Password gate | Proteger todas las rutas POS/admin | Pendiente | Password en env + cookie con TTL configurable |
| Turno/caja | Abrir turno/caja | Habilitar operacion del dia | Mock/local en legacy | Crear sesion de caja auditable |
| Sala | Seleccionar mesa | Entrar en una mesa fisica | Shell/mock | Abrir o recuperar sesion de mesa |
| Sala | Agrupar/disociar | Operar varias mesas juntas | Mock/local | Sesion multi-mesa con auditoria |
| Sala | Modificar mapa | Mover mesas visualmente | Mock/local | Persistencia real con permisos |
| Reservas | Aceptar/rechazar | Decidir solicitud pendiente | Mock/local | Actualizar reserva real y notificar estado |
| Reservas | Asignar mesa | Bloquear mesa para franja | Mock/local | Validar capacidad, solape y estado |
| Reservas | Asseure client | Convertir reserva en sesion | Mock/local | Crear sesion/comanda vinculada |
| Comanda | Anadir producto | Crear linea draft | Shell/mock | Persistir linea de comanda |
| Comanda | Anadir nota/modificador | Ajustar preparacion | Mock/local | Guardar instrucciones y snapshot |
| Comanda | Enviar cocina | Generar produccion | Mock/local | Crear lineas de produccion idempotentes |
| Produccion | Marcar listo/servido | Cambiar estado de linea | Mock/local | Actualizar KDS/produccion real |
| Produccion | Reimprimir/reclamar | Repetir aviso sin duplicar venta | Mock/local | Crear print job/reclaim auditable |
| Cobro | Cuenta completa | Cobrar todo | Mock/local | Registrar pago y cerrar sesion |
| Cobro | Separado/dividido | Cobrar partes | Mock/local | Pagos parciales consistentes |
| Caja | Retirada/deposito/gasto | Movimiento manual de caja | Mock/local | Movimiento auditable |
| Caja | Cierre diario | Contar caja y diferencia | Mock/local | Cierre con responsable y reporte |
| Fiscal | Solicitar factura | Pedir factura externa | Mock/futuro | Crear request para sistema fiscal aprobado |
| SIKIM APP | Encolar evento | Preparar consumo/stock futuro | Mock/futuro | Evento idempotente en sistema compartido |
| Ayuda | Consultar FAQ | Resolver duda operativa | Mock/local | Contenido mantenido y contextual |

## Datos necesarios por módulo

Reservas:

- reserva;
- estado;
- fecha/hora/duracion;
- pax;
- cliente;
- notas;
- mesa asignada;
- origen externo/interno;
- historial de aceptacion/rechazo/cancelacion.

Clientes:

- nombre;
- contacto si aplica;
- idioma/preferencias si vienen de reservas;
- notas operativas;
- datos fiscales solo si se aprueba flujo fiscal.

Cheffing products/cards/menus:

- ids Cheffing;
- nombre oficial;
- carta/menu/seccion;
- precio fuente;
- estado activo;
- metadata de plato/producto.

Tables/zones:

- zonas;
- mesas;
- capacidad;
- forma/posicion;
- activa/visible;
- reservable;
- fuera de servicio.

Table sessions:

- mesas vinculadas;
- reserva vinculada opcional;
- estado;
- hora apertura/cierre;
- staff;
- notas;
- cambios de mesa/grupo.

Orders:

- sesion;
- estado;
- totales;
- origen;
- timestamps;
- staff;
- cierre/pago.

Order lines:

- producto POS;
- cantidad;
- precio snapshot;
- nombre snapshot;
- notas;
- modificadores;
- estado draft/sent/void;
- estacion/ruta snapshot.

Production lines:

- order line origen;
- estacion;
- ruta;
- estado;
- ticket de produccion;
- intentos/reclamos;
- cancelaciones.

Payments:

- metodo;
- importe;
- cambio;
- cash session;
- estado;
- referencia externa si aplica;
- actor.

Cash shifts:

- apertura;
- cierre;
- efectivo inicial;
- esperado;
- contado;
- diferencia;
- movimientos;
- responsable.

Print jobs:

- tipo;
- destino logico;
- payload;
- intentos;
- estado;
- errores;
- reimpresion/reclamo.

Fiscal requests:

- venta relacionada;
- tipo de factura;
- datos fiscales si aplica;
- estado;
- sistema externo;
- referencia externa;
- errores.

User/permissions:

- usuario;
- rol;
- capacidades;
- sesion/dispositivo;
- expiracion.

Audit events:

- actor;
- accion;
- modulo;
- entidad;
- antes/despues cuando aplique;
- timestamp;
- motivo para acciones sensibles.

## MVP operativo recomendado

Secuencia recomendada:

1. Password gate.
2. Supabase read connection.
3. Reservations notification/read panel.
4. POS table/session schema.
5. Basic comanda persistence.
6. Cheffing-backed POS catalog.
7. Kitchen/bar send mock-to-real transition.
8. Basic payment/ticket.
9. Shift/cash close.
10. Later auth/per-user permissions and fiscal/payment integrations.

Lectura practica:

- Primero proteger el acceso.
- Despues leer datos reales sin escribir demasiado.
- Luego hacer que reservas y mesas sean utiles durante servicio.
- Despues persistir comandas y envios.
- Finalmente cobrar, cerrar caja y abrir integraciones sensibles solo con contratos claros.

## Fuera de alcance inicial

Queda fuera del alcance inicial:

- facturas fiscales reales;
- AEAT/VeriFactu;
- sincronizacion real con Odoo;
- integracion real SumUp/dataphone;
- puente real de impresoras;
- decremento automatico de inventario;
- BI avanzado;
- pedidos publicos por QR;
- plataformas de delivery;
- soporte multi-local;
- modo offline-first;
- planificacion completa de personal;
- stock real gobernado por POS;
- modificar recetas, costes, compras o importaciones de Cheffing desde POS;
- auth completa por usuario antes de la fase de permisos reales.

## Decisiones abiertas

Antes de convertir los mocks en operacion real hay que decidir:

- estrategia exacta Supabase staging/produccion;
- propiedad exacta de migraciones;
- si las migraciones POS especificas viven en este repo, como parece razonable, y como coordinan con el esquema compartido;
- TTL exacto del password gate;
- si POS puede editar precio fuente Cheffing o solo un overlay/precio POS aprobado;
- mecanismo de pop-up de reservas: polling, Supabase Realtime, PWA notifications u otro;
- como asignar mesas a reservas en verano e invierno;
- como reflejar winter vs summer modes en UI;
- cuando pasar de password gate a usuarios/permisos reales;
- que tabla/evento sera la fuente de verdad para produccion;
- que abstraccion de print jobs usar antes de impresoras reales;
- como auditar acciones sensibles sin frenar el servicio;
- cuando y como abordar fiscalidad, Odoo, VeriFactu o agente fiscal.
