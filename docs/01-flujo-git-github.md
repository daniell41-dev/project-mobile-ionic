# 01 - FLUJO GIT Y GITHUB

## 📖 Guía Completa del Workflow de Git Flow

Este documento explica el flujo de trabajo con Git y GitHub que se usará durante todo el
desarrollo del proyecto **Nimbo** (Ionic + Angular + Capacitor).

> **Stack:** Ionic 8 · Angular 20 (standalone) · TypeScript · Capacitor 8 · **pnpm** como
> gestor de paquetes.

---

## 🌳 Estructura de Ramas

```
main (producción - protegida)
  ↑
  │ (PR al final de cada FASE)
  │
develop (integración - default)
  ↑
  │ (PRs de cada tarea)
  │
feature/[issue-number]-[descripcion] (tareas individuales)
```

### Descripción de Ramas:

- **`main`**: Rama de producción
  - Solo código estable y probado
  - Origen de los builds nativos (Capacitor) y de la demo web (PWA)
  - Protegida: solo acepta PRs de `develop`
  - Nunca se trabaja directamente aquí

- **`develop`**: Rama de desarrollo
  - Integración de todas las tareas
  - Rama por defecto del repositorio
  - Base para crear ramas `feature/*`
  - Siempre debe estar funcional (lint + build OK)

- **`feature/[issue-number]-[descripcion]`**: Ramas de tareas
  - Una rama por tarea/issue
  - Se crean desde `develop`
  - Se fusionan de vuelta a `develop` vía PR
  - Se eliminan después del merge

---

## ☁️ Adaptación a Claude Code on the web

Este repositorio se desarrolla en parte con **Claude Code on the web**, donde cada sesión
trabaja sobre una **rama de sesión asignada** (p. ej. `claude/<nombre>`) y, por seguridad,
**solo puede hacer push a esa rama**.

Por eso, la convención práctica es:

| Quién | Hace |
|-------|------|
| **Claude (sesión web)** | Desarrolla la tarea y hace commits a su **rama de sesión**; sigue Conventional Commits; deja la rama lista para PR. |
| **Tú (mantenedor)** | Abres el PR de esa rama hacia `develop`, revisas, mergeas y, al cerrar la fase, abres el PR `develop → main`. |

El flujo `develop + feature/* + PR` descrito abajo es el **estándar del equipo** y el que
aplicas tú cuando trabajas localmente. En sesiones de Claude, la "rama feature" es la rama
de sesión; el resto del flujo (PR, review, merge) lo gestionas tú.

---

## 🔄 Flujo de Trabajo por Fase

### FASE N - Flujo Completo

```
┌──────────────────────────────────────┐
│  1. INICIO DE FASE                   │
│  - Crear issue de FASE               │
│  - Anotar número (#15 ejemplo)       │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  2. POR CADA TAREA                   │
│  ┌────────────────────────────────┐  │
│  │ a) Crear issue de tarea        │  │
│  │ b) Crear rama feature          │  │
│  │ c) Desarrollar                 │  │
│  │ d) Commit y push               │  │
│  │ e) Crear PR a develop          │  │
│  │ f) Code review                 │  │
│  │ g) Merge PR                    │  │
│  │ h) Cerrar issue                │  │
│  └────────────────────────────────┘  │
│  (Repetir para todas las tareas)     │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  3. FIN DE FASE                      │
│  - Lint + build + tests              │
│  - PR develop → main                 │
│  - ⚠️ DETENER DESARROLLO             │
│  - 📢 NOTIFICAR                      │
│  - ⏸️ ESPERAR APROBACIÓN             │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  4. DESPUÉS DE APROBACIÓN            │
│  - Merge PR                          │
│  - Cerrar issue de FASE              │
│  - Actualizar develop                │
│  - Continuar con siguiente fase      │
└──────────────────────────────────────┘
```

---

## 📝 Comandos Git Detallados

### INICIO DE FASE

#### 1. Crear Issue de Fase en GitHub

```bash
gh issue create \
  --title "FASE [N]: [Nombre de la fase]" \
  --body "## Objetivo
Descripción de lo que se logrará en esta fase.

## Tareas
- [ ] Tarea 1
- [ ] Tarea 2
...

## Criterios de Aceptación
- Todas las tareas completadas
- Lint, build y tests en verde
- Funcionalidad probada en Ionic serve"
```

**Anotar el número de issue** (ejemplo: #15)

---

### POR CADA TAREA

#### 1. Asegurarse de estar en develop actualizado

```bash
git checkout develop
git pull origin develop
git status
```

#### 2. Crear Issue de Tarea

```bash
gh issue create \
  --title "[Descripción concisa de la tarea]" \
  --body "## Objetivo
Qué se va a implementar/modificar.

## Pasos
1. Paso 1
2. Paso 2

## Archivos Afectados
- src/app/features/...

## Criterios de Aceptación
- [ ] Funcionalidad implementada
- [ ] Sin errores de TypeScript / lint
- [ ] Probado en \`pnpm start\`

## Related
Parte de #[número-issue-fase]"
```

**Anotar el número de issue** (ejemplo: #23)

#### 3. Crear Rama Feature

```bash
git checkout -b feature/23-home-screen

# Verificar rama actual
git branch
```

**Nomenclatura de ramas:**

- Prefijo: `feature/`
- Número de issue: `23`
- Descripción corta: `home-screen`
- Todo en minúsculas con guiones `-`

#### 4. Desarrollar la Tarea

```bash
git status
git diff
```

#### 5. Hacer Commit

```bash
git add .
git commit -m "feat: add balance-card component to home screen"
git log --oneline
```

**Convenciones de Commits** (Conventional Commits):

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formato de código (sin cambio lógico)
refactor: refactorización
test: agregar o modificar tests
chore: tareas de mantenimiento

Ejemplos (contexto Ionic/Angular):
feat: add numeric keypad component for send flow
fix: prevent verified chip overflow in profile card
refactor: extract DataService for mock transactions
test: add unit tests for currency formatting pipe
```

#### 6. Push de la Rama

```bash
# Primera vez (crear rama en remoto)
git push -u origin feature/23-home-screen

# Pushes subsecuentes
git push
```

#### 7. Crear Pull Request

```bash
gh pr create \
  --base develop \
  --head feature/23-home-screen \
  --title "Add home screen with balance card and quick actions" \
  --body "## Cambios
- Implementada pantalla Inicio (ion-header collapse + ion-content)
- Tarjeta de saldo con degradado de marca y botón ocultar
- Fila de 4 acciones rápidas (ion-grid)
- Lista de movimientos recientes (ion-list + ion-item)

## Testing
- ✅ \`pnpm lint\` sin errores
- ✅ \`pnpm build\` exitoso
- ✅ Probado en \`pnpm start\` (modo claro y oscuro)

## Screenshots
[Agregar capturas si es relevante]

Closes #23
Related to #15"
```

#### 8. Code Review

**Auto-Review Checklist:**

```markdown
## Funcionalidad
- [ ] El código hace lo que dice que hace
- [ ] La app corre sin errores (pnpm start)
- [ ] No hay warnings en consola
- [ ] TypeScript / lint sin errores

## Calidad de Código
- [ ] Componentes standalone bien organizados (core/shared/features)
- [ ] Nombres descriptivos (*.page.ts, *.component.ts, *.service.ts)
- [ ] Sin código comentado innecesario ni console.logs de debug
- [ ] Imports ordenados; sin dependencias circulares
- [ ] Cumple SOLID / DRY / KISS (ver doc 03)

## Git
- [ ] Commits con mensajes descriptivos (Conventional Commits)
- [ ] No hay archivos innecesarios (www/, .angular/ ignorados)
- [ ] El PR está asociado al issue correcto

## UI / Móvil
- [ ] Usa componentes Ionic nativos (no HTML del prototipo copiado)
- [ ] Respeta design tokens (modo claro y oscuro)
- [ ] Hit targets ≥ 44px; responsive
```

**Probar PR localmente (opcional):**

```bash
gh pr checkout 45
pnpm install
pnpm start
git checkout develop
```

#### 9. Aprobar y Merge del PR

```bash
# Merge con squash (recomendado - historial limpio)
gh pr merge 45 --squash

# Cleanup
git checkout develop
git pull origin develop
git branch -d feature/23-home-screen
```

**GitHub automáticamente:** cierra el PR, elimina la rama remota (si está configurado) y
cierra el issue (si pusiste "Closes #23").

#### 10. Cerrar Issue (si no se cerró automático)

```bash
gh issue close 23
```

---

### FIN DE FASE

#### 1. Verificar que Todas las Tareas Están Mergeadas

```bash
git checkout develop
git pull origin develop
git log --oneline -20
```

#### 2. Verificar Build, Lint y Tests

```bash
pnpm install        # si cambiaron dependencias
pnpm lint
pnpm build          # genera ./www
pnpm test:ci        # tests headless

# Probar la app
pnpm start          # abrir http://localhost:8100
```

#### 3. Crear PR develop → main

```bash
gh pr create \
  --base main \
  --head develop \
  --title "FASE [N]: [Nombre de la fase]" \
  --body "## Resumen
Descripción general de lo logrado en esta fase.

## Tareas Completadas
- [x] Tarea 1 (#23)
- [x] Tarea 2 (#24)
...

## Testing
- ✅ Lint OK
- ✅ Build OK
- ✅ Tests OK
- ✅ Probado en Ionic serve (claro/oscuro)

Closes #15"
```

#### 4. ⚠️ DETENER DESARROLLO

**No continúes con la siguiente fase.** El PR `develop → main` requiere revisión manual.

#### 5. 📢 NOTIFICAR

```
FASE [N] completada y lista para revisión.
PR #[número] creado: develop → main
Esperando aprobación para continuar.
```

#### 6. ⏸️ ESPERAR APROBACIÓN

El usuario revisará el código en GitHub, la app y que todas las tareas se completaron.

#### 7. Después de Aprobación - Merge

```bash
gh pr merge [número-pr] --merge

git checkout develop && git pull origin develop
git checkout main && git pull origin main
git checkout develop
```

#### 8. Cerrar Issue de Fase

```bash
gh issue close 15
```

---

## 🛠️ Comandos de Referencia Rápida

### Git Básico

```bash
git status
git branch -a
git checkout nombre-rama
git checkout -b nombre-nueva-rama
git diff [archivo]
git log --oneline --graph --all
git fetch origin
git pull origin develop
```

### GitHub CLI

```bash
gh issue list | gh issue view N | gh issue create | gh issue close N
gh pr list | gh pr view N | gh pr create | gh pr checkout N | gh pr merge N
gh repo view | gh browse
```

### pnpm (Ionic / Angular)

```bash
pnpm install              # Instalar dependencias
pnpm start                # Dev server (ionic serve / ng serve) → http://localhost:8100
pnpm build                # Build de producción → ./www
pnpm watch                # Build en modo desarrollo con watch
pnpm lint                 # ESLint
pnpm test                 # Tests unitarios (Karma + Jasmine, con navegador)
pnpm test:ci              # Tests headless (CI)
```

> ⚠️ **Usa siempre `pnpm`, nunca `npm` ni `yarn`.** El lockfile del repo es `pnpm-lock.yaml`.

### Capacitor (build nativo)

```bash
npx cap add android       # añadir plataforma
npx cap sync              # sincronizar www/ con el proyecto nativo
npx cap open android      # abrir en Android Studio
```

---

## 🔧 Resolución de Problemas Comunes

### Problema 1: Merge Conflicts

```bash
git status
# Editar archivos, resolver marcadores <<<<<<, ======, >>>>>>
git add archivo-resuelto.ts
git commit -m "resolve merge conflicts"
git push
```

### Problema 2: Olvidaste crear rama desde develop

```bash
git checkout -b feature/nueva-rama
git checkout develop
git reset --hard origin/develop
git checkout feature/nueva-rama
```

### Problema 3: Actualizar tu rama con cambios de develop

```bash
git fetch origin
git rebase origin/develop      # o: git merge origin/develop
# Si hay conflictos: resolver, git add ., git rebase --continue
git push --force-with-lease
```

### Problema 4: Commit con mensaje incorrecto

```bash
git commit --amend -m "mensaje correcto"
git push --force-with-lease    # solo si ya habías hecho push
```

### Problema 5: Olvidaste agregar archivos al último commit

```bash
git add archivo-olvidado.ts
git commit --amend --no-edit
git push --force-with-lease
```

### Problema 6: Deshacer el último commit (local)

```bash
git reset --soft HEAD~1    # mantiene cambios
git reset --hard HEAD~1    # descarta cambios
```

---

## 🎯 Best Practices

### ✅ HACER:

- ✅ Commits frecuentes con mensajes descriptivos (Conventional Commits)
- ✅ Una rama por tarea (no mezclar tareas)
- ✅ PRs pequeños y enfocados
- ✅ `pnpm lint && pnpm build` antes de push
- ✅ Revisar tu propio código antes de crear PR
- ✅ Mantener `develop` siempre funcional
- ✅ Actualizar `develop` antes de crear nueva rama
- ✅ Cerrar issues al completar tareas

### ❌ NO HACER:

- ❌ Trabajar directamente en `develop` o `main`
- ❌ PRs gigantes con múltiples funcionalidades
- ❌ Commits con mensajes vagos ("fix", "update", "wip")
- ❌ Push de código que no compila
- ❌ Dejar `console.log` de debug
- ❌ Mezclar `npm`/`yarn` con `pnpm` (rompe el lockfile)
- ❌ Force push a `develop` o `main`

---

## 📝 Template de Mensaje de Commit

```
<tipo>: <descripción corta>

[Opcional] Descripción larga explicando el por qué y el contexto.

[Opcional] Refs/Closes: #issue-number
```

**Ejemplos:**

```
feat: add light/dark theme toggle in profile

Implements ThemeService backed by localStorage and respects
prefers-color-scheme on first load.

Refs: #45
```

```
fix: correct transaction filter on income/expense segment

Closes #52
```

---

## 🔐 Seguridad

### .gitignore Esencial (Ionic / Angular)

```gitignore
# Dependencies
node_modules/

# Ionic / Angular build output
/www
/.angular
/dist
/out-tsc

# Native (Capacitor)
/android
/ios

# Environments con secretos (si se usan)
src/environments/environment.local.ts

# Testing
/coverage

# OS / Editor
.DS_Store
Thumbs.db
*.swp
```

### ⚠️ NUNCA commitear:

- ❌ Keystores de Android (`*.keystore`, `*.jks`) ni contraseñas de firma
- ❌ API keys / tokens / secretos de SDKs de terceros
- ❌ Archivos de credenciales
- ❌ `google-services.json` / `GoogleService-Info.plist` con claves reales (según política)

---

## 📞 Ayuda Adicional

- **Git Docs**: https://git-scm.com/doc
- **GitHub CLI Docs**: https://cli.github.com/manual/
- **GitHub Flow**: https://docs.github.com/en/get-started/quickstart/github-flow
- **Conventional Commits**: https://www.conventionalcommits.org/
- **pnpm**: https://pnpm.io/

---

**¡Éxito con el flujo de trabajo! 🚀**

Un flujo limpio y organizado hace el desarrollo más fácil y el código más mantenible.
