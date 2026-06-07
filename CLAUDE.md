# CLAUDE.md

Guía operativa para Claude (y cualquier dev) en este repositorio. Léela antes de trabajar.

## Proyecto

**Nimbo** — app móvil de banca personal. Stack: **Ionic 8 · Angular 20 (standalone) ·
TypeScript · Capacitor 8**. Mercado es-MX, moneda MXN, tema claro/oscuro.

El diseño objetivo (10 pantallas, 5 tabs, tokens, mapeo a componentes `ion-*` y el prompt
de construcción) está en **`docs/design/README.md`**. Aún se está en fase de reglas; la
construcción de pantallas viene después.

## Gestor de paquetes: pnpm (obligatorio)

⚠️ **Usa siempre `pnpm`, nunca `npm` ni `yarn`.** El lockfile es `pnpm-lock.yaml`.

```bash
pnpm install        # instalar dependencias
pnpm start          # dev server → http://localhost:8100
pnpm build          # build de producción → ./www
pnpm lint           # ESLint
pnpm test           # tests (Karma + Jasmine, con navegador)
pnpm test:ci        # tests headless (CI)
```

Capacitor: `npx cap sync` / `npx cap add android|ios` / `npx cap open ...`.

## Antes de terminar una tarea

Ejecuta y deja en verde:

```bash
pnpm lint && pnpm build
```

(`pnpm test:ci` requiere Chrome; en entornos sin navegador se valida en CI.)

## Convenciones

- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`,
  `chore:`). Ver `docs/01-flujo-git-github.md`.
- **Ramas:** `feature/<issue>-<desc>` desde `develop`; PR a `develop`; al cerrar fase, PR
  `develop → main`.
- **Arquitectura y estilo:** `docs/03-arquitectura-y-buenas-practicas.md`
  (estructura `core/ shared/ features/ tabs/`, standalone + lazy loading, SOLID, DRY/KISS/
  YAGNI, componentes Ionic nativos, design tokens).
- **Deploy / CI:** `docs/02-guia-deploy-y-ci.md`.

## Entorno Claude Code on the web

- Cada sesión trabaja sobre su **rama de sesión asignada** y solo hace push a ella.
- Claude commitea a esa rama; **el usuario** abre y mergea los PRs hacia `develop`/`main`.
- No crear PRs salvo que el usuario lo pida explícitamente.

## Documentación del repo

- `docs/01-flujo-git-github.md` — flujo Git/GitHub.
- `docs/02-guia-deploy-y-ci.md` — deploy (PWA/nativo) y CI.
- `docs/03-arquitectura-y-buenas-practicas.md` — arquitectura, convenciones, SOLID.
- `docs/design/` — handoff de diseño de Nimbo (qué construir).
