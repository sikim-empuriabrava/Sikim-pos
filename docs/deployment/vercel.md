# Despliegue en Vercel

## Estado actual

El scaffold inicial de Next.js de Sikim POS ya esta desplegado en Vercel.

La aplicacion de produccion esta protegida por una puerta inicial de contrasena compartida. Todavia no hay Supabase, autenticacion real de usuarios ni integraciones operativas conectadas.

## URL de producción

La URL de produccion es:

https://sikim-pos.vercel.app

## Configuración esperada

La configuracion esperada del proyecto en Vercel es:

- Framework preset: Next.js
- Root directory: `.`
- Install command: valor por defecto de Vercel para npm o `npm install`
- Build command: `npm run build`
- Production branch: `main`
- Preview deployments para ramas de pull request

No se debe asumir que existe un archivo de configuracion custom de Vercel en este repositorio.

## Variables de entorno

La puerta inicial de acceso requiere variables de entorno de servidor en Vercel:

- `POS_ACCESS_PASSWORD_HASH`: hash SHA-256 hexadecimal de la contrasena compartida.
- `POS_SESSION_SECRET`: secreto para firmar la cookie httpOnly de sesion; minimo 32 caracteres aleatorios.
- `POS_SESSION_MAX_AGE_SECONDS`: opcional; por defecto `259200` segundos, unos 3 dias.

No se deben commitear valores reales en `.env`, `.env.local` ni en la documentacion. Si faltan las variables requeridas, la aplicacion falla cerrada y `/login` muestra un error de configuracion.

Ejemplos locales para generar valores:

```bash
node -e "const crypto=require('crypto'); console.log(crypto.createHash('sha256').update('CAMBIA_ESTA_CONTRASENA').digest('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Cuando empiece la integracion con Supabase, las variables se deben configurar en los settings del proyecto en Vercel y no se deben commitear en el repositorio.

Variables futuras posibles:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Estas variables son placeholders futuros y no quedan configuradas por este PR. No se deben incluir claves reales en la documentacion ni en archivos del repositorio.

## Flujo de despliegue

El flujo esperado de despliegue es:

- mergear a `main` dispara un despliegue de produccion;
- las ramas de pull request generan preview deployments;
- el build de Vercel debe pasar antes de mergear;
- si el build falla, se deben revisar los logs de despliegue antes de continuar.

## Checks recomendados antes de mergear

Antes de mergear cambios de aplicacion, ejecutar:

```bash
npm ci
npm run lint
node scripts/pos-ui-shell-contract.test.mjs
node scripts/pos-password-gate-contract.test.mjs
npm run build
```

El desarrollo local debe usar Node.js 20.x, alineado con `.nvmrc` y `package.json`.

## Node.js

El proyecto apunta a Node.js 20.x.

El desarrollo local debe hacerse con Node.js 20.x. Se observo un warning local al usar Node `v24.15.0`, pero `npm run lint` y `npm run build` pasaron.

Si aparece un problema de instalacion, lint, build o runtime, la reproduccion y el debugging deben priorizar Node.js 20.x.

## Limitaciones actuales

Limitaciones actuales del despliegue:

- no hay conexion con Supabase todavia;
- no hay autenticacion real de usuarios todavia;
- la puerta de acceso actual es una contrasena compartida temporal;
- no hay modulos POS todavia;
- no hay pagos;
- no hay impresion;
- no hay logica fiscal;
- no hay integracion de cocina/barra.

## Próximos pasos

1. Mantener actualizada la documentacion de despliegue.
2. Decidir integracion Supabase staging vs. produccion compartida.
3. Anadir variables de entorno solo cuando empiece la integracion con Supabase.
4. Construir los modulos POS en PRs pequenos.
