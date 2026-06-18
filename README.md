# Sikim POS

## Objetivo

Sikim POS es el repositorio dedicado a la futura aplicacion POS / TPV interna del restaurante Sikim.

El objetivo del proyecto es construir una herramienta operativa para el servicio de sala que pueda cubrir, de forma progresiva:

- gestion de mesas;
- sesiones de mesa;
- pedidos y comandas;
- envio a cocina/barra;
- tickets de cliente;
- pagos basicos;
- cierre de turno y caja.

El circuito operativo previsto es:

`reserva o walk-in -> sesion de mesa -> pedido/comanda -> produccion de cocina/barra -> ticket -> pago -> cierre de turno`

## Estado actual

Este repositorio esta en una fase inicial de documentacion y planificacion.

Actualmente:

- `AGENTS.md` define las instrucciones de trabajo para agentes y colaboradores;
- [`docs/architecture/pos-v1.md`](docs/architecture/pos-v1.md) contiene la arquitectura inicial de POS V1;
- [`docs/deployment/vercel.md`](docs/deployment/vercel.md) documenta el despliegue inicial en Vercel;
- existe un scaffold inicial de aplicacion con Next.js, React, TypeScript, Tailwind CSS, ESLint y npm;
- existe un shell inicial navegable de interfaz POS para sala, comanda, cobro, cocina/barra, ticket, turno, administracion y ayuda;
- no existen migraciones de base de datos POS;
- Supabase no esta configurado todavia en este repositorio;
- la URL de produccion es https://sikim-pos.vercel.app;
- existen scripts npm para desarrollo, lint, build y start.

No se deben asumir funcionalidades implementadas solo porque esten descritas como direccion futura.

## Relacion con otros repositorios

El ecosistema Sikim se separa en tres repositorios:

- `sikim-empuriabrava/Sikim-pos`: este repositorio, dedicado al futuro POS / TPV.
- `sikim-empuriabrava/Sikim-gestio-reserves`: aplicacion interna existente para reservas, Cheffing, mantenimiento, capacidad y flujos internos.
- `sikim-empuriabrava/Reserves_extern`: motor publico existente de reservas externas.

Este repositorio no debe duplicar la aplicacion interna de gestion ni redisenar el motor publico de reservas. El POS debe permanecer separado como aplicacion, pero no debe convertirse en un sistema de negocio aislado.

Las futuras integraciones con reservas, Cheffing, usuarios, permisos y sesiones compartidas deben hacerse mediante contratos explicitos.

## Arquitectura y documentacion

El punto de entrada actual de arquitectura es:

- [`docs/architecture/pos-v1.md`](docs/architecture/pos-v1.md)
- [`docs/deployment/vercel.md`](docs/deployment/vercel.md)

Estos documentos definen el alcance conceptual de V1, los limites del repositorio, las relaciones esperadas con reservas y Cheffing, el despliegue inicial en Vercel y las decisiones que siguen abiertas.

Documentos futuros podran cubrir:

- diseno de esquema;
- integracion con Supabase;
- permisos POS;
- estrategia de impresion;
- pagos y cierre de caja;
- QA operativa.

## Direccion tecnica prevista

Salvo que el proyecto decida explicitamente otra cosa, la direccion tecnica prevista es:

- Next.js;
- React;
- TypeScript;
- npm;
- Node.js 20.x;
- Supabase cuando empiece la integracion de backend y datos;
- Vercel para el despliegue.

El scaffold inicial ya sigue esta direccion. Supabase y las integraciones siguen pendientes.

## Fuera del alcance actual

No se deben anadir prematuramente:

- cumplimiento fiscal/legal final;
- VeriFactu o AEAT;
- sincronizacion con Odoo o contabilidad;
- integracion con terminales de pago;
- integraciones de impresoras de produccion;
- decremento automatico de inventario;
- reporting avanzado o BI;
- pedidos por QR;
- pagos online;
- integraciones con plataformas de delivery;
- modo offline-first;
- migraciones de base de datos antes de decidir la propiedad del esquema.

El POS V1 debe entenderse como una base operativa interna, no como una solucion fiscal final.

## Flujo de trabajo recomendado

El flujo recomendado para este repositorio es:

- trabajar en PRs pequenos y tematicos;
- usar worktrees aislados de Codex para cambios;
- leer `AGENTS.md` antes de modificar archivos;
- revisar resumen y diff antes de mergear;
- no mergear automaticamente;
- priorizar PRs de documentacion al inicio;
- separar scaffold de aplicacion, esquema, Supabase y Vercel en PRs distintos;
- no tocar archivos no relacionados.

Para cambios solo de documentacion, el check esperado actualmente es `git diff --check` cuando aplique. Para cambios de aplicacion, usar los scripts disponibles en `package.json`.

## Desarrollo local y CI

El entorno esperado para desarrollo y CI es Node.js 20.x, alineado con `.nvmrc` y `engines.node` en `package.json`.

Para instalaciones limpias, usar `npm ci`. Los checks basicos locales y de CI son:

- `npm run lint`
- `node scripts/pos-ui-shell-contract.test.mjs`
- `npm run build`

No ejecutar `npm audit fix --force` de forma rutinaria: puede cambiar dependencias de forma agresiva y debe revisarse como una tarea separada.

## Seguridad y datos sensibles

Nunca se deben commitear `.env`, `.env.local`, secretos, claves de Supabase, claves `service-role`, passwords de base de datos, tokens o credenciales.

Los ejemplos, fixtures o capturas no deben incluir datos reales de clientes.

Los datos POS son sensibles porque pueden incluir pedidos, datos de clientes, acciones de staff, pagos, movimientos de caja y cierres de turno. Los cambios relacionados con pagos, impresion, fiscalidad o base de datos requieren planificacion explicita y revision.

## Proximos pasos

1. Mantener la documentacion de arquitectura como fuente de verdad.
2. Mantener el scaffold inicial con Next.js, npm y Node.js 20.
3. Mantener actualizada la documentacion del despliegue en Vercel.
4. Decidir integracion Supabase staging vs. produccion compartida.
5. Disenar el esquema POS antes de crear migraciones.
6. Construir los primeros flujos de mesas, sesiones y comandas en PRs pequenos.
