# 05 - TUTORIAL COMPLETO DEL PROYECTO

> 📖 **Documento vivo.** Describe en detalle qué hay **actualmente** en el proyecto y qué hace
> cada parte, como si fuera un tutorial. Se actualiza al cerrar cada fase (ver
> `docs/04-roadmap-y-fases.md`).

Nimbo es una **app móvil de banca personal** construida con **Ionic 8 · Angular 20 (standalone)
· TypeScript · Capacitor 8**, mercado es-MX / MXN, con tema claro/oscuro.

---

## 1. 🚀 Stack y arranque

### Comandos (siempre `pnpm`)
```bash
pnpm install      # instalar dependencias
pnpm start        # dev server → http://localhost:8100
pnpm build        # build de producción → ./www
pnpm lint         # ESLint
pnpm test         # tests (Karma + Jasmine, con navegador)
pnpm test:ci      # tests headless (CI)
```
> En entornos sin navegador, los tests Karma necesitan `CHROME_BIN`. En este entorno:
> `CHROME_BIN=/opt/pw-browsers/chromium-1194/chrome-linux/chrome pnpm test:ci`.

### Bootstrap — `src/main.ts`
El arranque configura todos los *providers* de la app (sin `NgModule`, 100% standalone):

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'es-MX' },          // moneda/fechas es-MX
    provideIonicAngular(),
    provideHttpClient(withInterceptors([authInterceptor])), // HTTP + Bearer token
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAppInitializer(() => {
      // Restaura sesión y tema ANTES del primer render (evita parpadeos y que
      // el guard vea un estado incorrecto).
      const auth = inject(AuthService);
      const theme = inject(ThemeService);
      return Promise.all([auth.restoreSession(), theme.initialize()]);
    }),
  ],
});
```

Puntos clave:
- **Locale `es-MX`** registrado globalmente → el `CurrencyMxnPipe` y las fechas usan formato MX.
- **`authInterceptor`** se aplica a todo `HttpClient`.
- **`provideAppInitializer`** corre *antes* del primer render: rehidrata token + tema.
- **`PreloadAllModules`**: las rutas lazy se precargan tras el arranque para navegación instantánea.

### Componente raíz — `src/app/app.component.ts`
Solo monta el router outlet de Ionic y **registra los Ionicons** que se usan de forma dinámica
(iconos de categoría/notificación), con `addIcons({...})`. Si un icono dinámico no se registra
aquí, sale vacío.

---

## 2. 🧱 Estructura por capas

```
src/app/
├── core/                  # Singletons app-wide (no UI)
│   ├── guards/            # authGuard
│   ├── interceptors/      # authInterceptor
│   ├── models/            # interfaces de dominio
│   └── services/          # Auth, Storage, Data, Theme
├── shared/                # Reutilizable y presentacional
│   └── pipes/             # currency-mxn.pipe
├── features/              # Una carpeta por feature (páginas lazy)
│   ├── auth/onboarding/ , auth/login/
│   ├── home/ , transactions/ (+ tx-detail/) , send/ (+ send-done/)
│   ├── cards/ , stats/ , profile/ , notifications/
└── tabs/                  # Shell de navegación (ion-tabs) + tabs.routes.ts
```

Reglas de dependencia (ver `docs/03`): `features → shared/core`; nunca `feature → feature`.
Cada página es un componente **standalone** con su propio `imports`, cargada con `loadComponent`.

---

## 3. ⚙️ Servicios core (`src/app/core/services/`)

Todos son `@Injectable({ providedIn: 'root' })` (singletons, tree-shakeable). Usan **Signals**
para estado reactivo (no RxJS, salvo donde se indique).

### `StorageService` — `storage.service.ts`
Almacenamiento clave-valor **no sensible** (preferencias como el tema). Única puerta de acceso
(Dependency Inversion); envuelve `@capacitor/preferences` (`localStorage` en web).
API: `get/set`, `getJSON<T>/setJSON<T>`, `remove`, `clear`.

### `SecureStorageService` — `secure-storage.service.ts` (FASE 5)
Almacenamiento **seguro** para datos sensibles (el token de sesión). Respaldado por
`@aparajita/capacitor-secure-storage`: **Keystore** (Android), **Keychain** (iOS) y un almacén
del navegador como *fallback* web (no hay enclave seguro en web). Misma API string que
`StorageService` (`get/set/remove/clear`) para mantener bajo acoplamiento y ser mockeable.

### `AuthService` — `auth.service.ts`
Estado de sesión con signals:
- `token` (readonly signal) · `isAuthenticated = computed(() => token() !== null)`.
- `login(email, password)`: valida credenciales demo (`demo@nimbo.mx` / `nimbo123`), persiste
  el token vía **`SecureStorageService`** (Keystore/Keychain) y actualiza el estado.
- `logout()`: limpia token y storage.
- `restoreSession()`: rehidrata el token al arrancar (lo llama `provideAppInitializer`).
- El token actual es un blob opaco (`btoa(email:timestamp)`), reemplazable por un JWT real.

### `DataService` — `data.service.ts`
Fachada de datos. Mantiene señales seed es-MX (`user`, `balance`, `cards`, `contacts`,
`savingsGoals`, `notifications`, `statsCategories`, `statsMonthly`) y helpers
`getTransactionById(id)`, `getRecentContacts()`.
Los **movimientos (`transactions`)** ya **no** viven aquí: se hidratan desde
`TransactionRepository` (ver §3.1). El signal se llena en el constructor suscribiéndose a
`repo.getAll()`.

### 3.1 Capa de datos REST — `core/repositories/` (FASE 4)
Patrón **Repository** (GoF) que desacopla el acceso a datos de su origen:
- `transaction.repository.ts`: **interfaz** `TransactionRepository` + **`TRANSACTION_REPOSITORY`**
  (`InjectionToken` con `providedIn: 'root'` y `factory`). La factory elige implementación según
  `environment.useMockApi`. Se usó interfaz + token (no clase abstracta) para evitar el ciclo de
  imports con las implementaciones (que la referencian con `import type`).
- `in-memory-transaction.repository.ts` (**Strategy**): sirve los datos semilla con `of()`
  (offline, demo robusta). Es el modo por defecto.
- `http-transaction.repository.ts` (**Strategy**): `HttpClient` → `{apiBaseUrl}/transactions`,
  mapea DTO→modelo con el **Adapter** (`transaction.adapter.ts`, convierte la fecha ISO a `Date`).
  Devuelve `Observable` (**RxJS**); el `authInterceptor` añade el Bearer token.
- `transaction.seed.ts`: datos semilla (fuente de verdad de los mocks).

**MSW (`src/mocks/`)**: cuando `useMockApi: false`, `main.ts` arranca el service worker de MSW
(`assets/mockServiceWorker.js`) que **intercepta** las llamadas REST en el navegador y responde
con los datos semilla → la capa HttpClient/RxJS se ejercita sin servidor externo. Con
`useMockApi: true` (por defecto) se usa el repo in-memory y MSW no arranca.

### `ThemeService` — `theme.service.ts`
Tema claro/oscuro persistente. `theme` (signal, por defecto `'dark'` = identidad Nimbo).
`initialize()` (al arrancar), `setTheme()`, `toggle()`, `isDark()`. Aplica la clase `dark`/
`light` sobre `<html>` y **sincroniza la barra de estado nativa** vía `StatusBarService`.

### 3.2 Integraciones nativas — servicios envoltorio (FASE 6)
Cada funcionalidad nativa se encapsula en un servicio de `core/services/` con **graceful
fallback en web** (`Capacitor.isNativePlatform()`), para no acoplar las páginas al plugin:
- **`HapticsService`** (`@capacitor/haptics`): `impact()` en los toggles de tarjeta, `success()`
  al confirmar un envío. No-op en web.
- **`StatusBarService`** (`@capacitor/status-bar`): `apply(isDark)` ajusta el estilo de la barra
  de estado según el tema (lo invoca `ThemeService`). Sin impl. web → no-op.
- **`CameraService`** (`@capacitor/camera`): `takeAvatarPhoto()` abre cámara/galería (selector de
  archivos en web) y devuelve un *data URL*; `null` si se cancela. Se usa en el avatar de Perfil.
  El método `capture()` está aislado para poder mockearlo en tests.

### 3.3 Plugin Capacitor propio — `plugins/biometric-auth/` (FASE 7)
Plugin **desarrollado para el proyecto** que expone la autenticación biométrica del dispositivo:
- `src/definitions.ts`: contrato (`isAvailable()`, `authenticate({ reason })`).
- `src/web.ts`: implementación web (`WebPlugin`) — sin biometría en navegador (`available:false`,
  `authenticate` resuelve `verified:true` para la demo).
- `src/index.ts`: `registerPlugin('BiometricAuth', { web: ... })`.
- `android/.../BiometricAuthPlugin.kt`: implementación nativa con `androidx.biometric.BiometricPrompt`
  (`BIOMETRIC_STRONG`) respaldada por el **Keystore**.
- iOS quedaría con `LocalAuthentication` (pendiente, requiere Mac).

La app lo consume con un **path mapping** de TypeScript (`biometric-auth` →
`plugins/biometric-auth/src/index.ts`) y lo envuelve en **`BiometricService`** (`core/services/`),
que gestiona la preferencia "Seguridad y biometría" (persistida en `StorageService`) y exige una
verificación correcta antes de activarla. La fila de Perfil es ahora un toggle.
> Cómo construir/registrar un plugin Capacitor está documentado en `plugins/biometric-auth/README.md`.

---

## 4. 🛡️ Guard e interceptor (`core/`)

### `authGuard` — `guards/auth.guard.ts`
`CanActivateFn` funcional: si `auth.isAuthenticated()` deja pasar; si no, redirige a
`/onboarding` con `router.createUrlTree(['/onboarding'])`. Protege tabs y rutas push.

### `authInterceptor` — `interceptors/auth.interceptor.ts`
`HttpInterceptorFn` funcional: si hay token, clona la petición y añade
`Authorization: Bearer <token>`; si no, la deja pasar. Centraliza la autenticación HTTP (DRY).

---

## 5. 🗂️ Modelos (`core/models/`)

Interfaces de dominio (sin clases):

| Modelo | Campos principales |
|--------|--------------------|
| `User` | `id, name, firstName, email, avatarInitials, clabe, verified` |
| `Transaction` | `id, type('income'\|'expense'), amount, merchant, category, categoryIcon, categoryColor, date, time, day, status, reference, method, fee` |
| `Card` | `id, type, network, lastFour, holder, expiryMonth, expiryYear, balance, creditAvailable, frozen, onlinePurchases` |
| `Contact` | `id, name, initials, bank, clabe, recent` |
| `SavingsGoal` | `id, name, icon, current, target, progress(0–1)` |
| `AppNotification` | `id, icon, iconColor, title, description, time, read` |
| `Category` | `id, name, icon, color` |

---

## 6. 🧭 Navegación

### `app.routes.ts` (raíz)
```
/onboarding , /login           → pre-auth (sin guard, sin tabs)
/transactions/:id              → detalle de movimiento (push, authGuard)
/send , /send/done             → enviar dinero + confirmación (push, authGuard)
/notifications                 → notificaciones (push, authGuard)
'' (pathMatch full)            → redirect a /tabs/home
'' (loadChildren)              → tabs.routes (authGuard sobre todo el subárbol)
```
> El redirect de `''` va **antes** del `loadChildren` con path `''` para que `/` resuelva a
> `/tabs/home` sin pantalla en blanco.

### `tabs/tabs.routes.ts` (autenticado)
`/tabs` (TabsPage) con hijos lazy: `home`, `transactions`, `cards`, `stats`, `profile`, y
redirect por defecto a `home`.

Patrón: pre-auth fuera de tabs; las 5 tabs como hijos; detalle/enviar/notificaciones como
*pushes* hermanos de tabs (overlay de stack). Todo lazy con `loadComponent`.

---

## 7. 🎨 Tema y tokens

### `src/theme/variables.scss`
Dos paletas completas como CSS variables `--nimbo-*` (oscuro por defecto en `:root`/`.dark`,
claro en `.light`). Ejemplos: `--nimbo-bg`, `--nimbo-surface(-2/-3)`, `--nimbo-text(-dim/-mute)`,
`--nimbo-accent(-ink/-soft)`, `--nimbo-up(-soft)`, `--nimbo-down`, radios `sm/md/lg/xl`,
`--nimbo-screen-pad: 20px`, sombras y el degradado de la tarjeta de saldo. También remapea las
`--ion-*` para que los componentes Ionic hereden el tema.

### `src/global.scss`
Fuentes **Plus Jakarta Sans** (UI) y **Sora** (montos, `tabular-nums`). Clases utilitarias:
- `.btn` / `.btn.ghost` — botón unificado a 54px (primario y fantasma del mismo tamaño).
- `.iconbtn` — botón de icono cuadrado con `.badge` (campana de notificaciones).
- `.amount` — aplica Sora a montos.
Overrides de `ion-content/header/toolbar/list/item/card/button` para heredar el tema.

---

## 8. 📱 Las 10 pantallas

| Pantalla | Ruta | Qué muestra / hace | Interacción clave |
|----------|------|--------------------|-------------------|
| Onboarding | `/onboarding` | Bienvenida, logo, CTA | Ir a Login |
| Login | `/login` | Form reactivo email/contraseña, sociales | Validación + estados carga/error |
| Inicio | `/tabs/home` | Saldo, acciones rápidas, meta, movimientos | **Ocultar saldo** (ojo) |
| Movimientos | `/tabs/transactions` | Lista agrupada por día | **Filtro** Todos/Ingresos/Gastos + **búsqueda** |
| Detalle | `/transactions/:id` | Detalle de un movimiento | Resuelve por param de ruta |
| Tarjetas | `/tabs/cards` | Tarjeta hi-fi, tiles, controles | **Toggles** congelar / compras online |
| Análisis | `/tabs/stats` | Donut + barras (Chart.js) | **Segmento** Semana/Mes/Año |
| Perfil | `/tabs/profile` | Datos, preferencias, logout | **Toggle tema** · 🔜 biometría (FASE 7) |
| Notificaciones | `/notifications` | Lista con no-leídos | **Marcar leídas** |
| Enviar | `/send` → `/send/done` | Contacto + monto + confirmación | **Teclado propio** + **buscar contactos** |

---

## 9. 🧪 Testing — dos runners (Jasmine/Karma + Jest)

El proyecto demuestra los tres frameworks que pide el perfil: **Jasmine + Karma** (suite
principal) y **Jest** (runner adicional).

### Karma + Jasmine — `pnpm test:ci`
- Suite principal: **94 tests** sobre `src/**/*.spec.ts`.
- Launcher headless `ChromeHeadlessNoSandbox` (`karma.conf.js`) para CI.
- Cubre servicios (Auth, Storage, SecureStorage, Data, Theme, Haptics, StatusBar, Camera,
  Biometric), repositorios (adapter, in-memory, http), guard, interceptor, pipe y las páginas.
- **Patrones:** `TestBed` + `provideRouter([])`; dobles/fakes para aislar dependencias;
  `HttpTestingController` para HTTP; subclases de prueba para aislar los proxies de plugins
  Capacitor (Camera/Biometric); en Stats se evita `detectChanges()` para no montar los charts.
- En este entorno: `CHROME_BIN=/opt/pw-browsers/chromium-1194/chrome-linux/chrome pnpm test:ci`.

### Jest — `pnpm test:jest`
- Configurado con `jest-preset-angular` (`jest.config.js`, `setup-jest.ts`, `tsconfig.jest.json`).
- Corre los `tests/jest/**/*.jest.ts` (lógica pura: pipe, adapter, repositorio in-memory).
- **Aislado de Karma:** distinta extensión (`*.jest.ts`) y tsconfig propio (`types: ["jest"]`),
  para evitar el choque de globals entre Jasmine y Jest. El `tsconfig.json` base usa
  `types: ["jasmine"]` y excluye `tests/` del programa de Karma/ESLint.

---

## 10. 🛠️ Receta: añadir una feature nueva

1. Crear `src/app/features/<feature>/<feature>.page.ts|html|scss` como componente **standalone**
   (con su `imports` de Ionic).
2. Registrar la ruta lazy en `app.routes.ts` (push) o en `tabs/tabs.routes.ts` (tab), con
   `loadComponent` y `authGuard` si es protegida.
3. Si necesita datos, inyectar `DataService` (o el Repository correspondiente tras FASE 4).
4. Usar tokens `--nimbo-*` y clases globales (`.btn`, `.iconbtn`); registrar Ionicons dinámicos
   en `app.component.ts` si aplica.
5. Formatear dinero con `| currencyMxn`.
6. Escribir su `*.spec.ts` (Karma hoy; Jest desde FASE 8).
7. Cerrar con `pnpm lint && pnpm build` + tests, y actualizar este documento.

---

## 📚 Relacionados
`CLAUDE.md` · `docs/01-flujo-git-github.md` · `docs/02-guia-deploy-y-ci.md` ·
`docs/03-arquitectura-y-buenas-practicas.md` · `docs/04-roadmap-y-fases.md` · `docs/design/`.
