# 03 - ARQUITECTURA Y BUENAS PRÁCTICAS

Reglas de estructura, arquitectura y calidad de código para **Nimbo** (Ionic 8 + Angular 20
standalone + TypeScript + Capacitor). El objetivo es un código **limpio, modular y de bajo
acoplamiento**, aplicando **SOLID**, patrones **GoF** y principios **DRY / KISS / YAGNI**.

---

## 🧱 Estructura de carpetas (Clean / por capas)

```
src/app/
├── core/                      # Lógica singleton de toda la app (se instancia una vez)
│   ├── models/                # Interfaces y tipos de dominio (Transaction, Card, ...)
│   ├── services/              # Servicios con estado/IO (DataService, ThemeService, ...)
│   ├── guards/                # Route guards (auth.guard.ts)
│   ├── interceptors/          # HTTP interceptors (auth, errores) — cuando haya API real
│   └── constants/             # Constantes y tokens de configuración
│
├── shared/                    # Reutilizable y SIN estado de negocio (presentacional)
│   ├── components/            # balance-card, numeric-keypad, transaction-row, ...
│   ├── pipes/                 # currency-mxn, relative-time, ...
│   └── directives/            # directivas reutilizables
│
├── features/                  # Una carpeta por feature; páginas lazy-loaded
│   ├── auth/                  # onboarding.page, login.page
│   ├── home/                  # home.page
│   ├── transactions/          # transactions.page, tx-detail.page
│   ├── send/                  # send.page, send-done.page
│   ├── cards/                 # cards.page
│   ├── stats/                 # stats.page
│   ├── profile/               # profile.page
│   └── notifications/         # notifications.page
│
├── tabs/                      # Shell de navegación con <ion-tabs>
│
├── app.component.ts           # Root
└── app.routes.ts              # Rutas raíz (pre-auth + tabs)
```

### Reglas de dependencia (bajo acoplamiento)

```
features  ──►  shared  ──►  (Ionic/Angular)
   │
   └────────►  core
```

- `features` puede usar `core` y `shared`.
- `shared` **no** depende de `features` ni de `core/services` (es presentacional y genérico).
- `core` no depende de `features`.
- **Prohibido** importar entre features hermanas (p. ej. `home` importando de `cards`). Si
  algo se comparte, sube a `shared` (UI) o `core` (lógica/datos).

---

## 📛 Convenciones de nombres

| Tipo | Sufijo / patrón | Ejemplo |
|------|-----------------|---------|
| Página (ruteable) | `*.page.ts` / `.html` / `.scss` | `home.page.ts` |
| Componente | `*.component.ts` | `balance-card.component.ts` |
| Servicio | `*.service.ts` | `data.service.ts` |
| Modelo / interfaz | `*.model.ts` | `transaction.model.ts` |
| Guard | `*.guard.ts` | `auth.guard.ts` |
| Pipe | `*.pipe.ts` | `currency-mxn.pipe.ts` |
| Interceptor | `*.interceptor.ts` | `auth.interceptor.ts` |

- **Archivos y carpetas:** `kebab-case` (`numeric-keypad`).
- **Clases:** `PascalCase` (`BalanceCardComponent`).
- **Variables/métodos:** `camelCase`. **Constantes globales:** `UPPER_SNAKE_CASE`.
- **Selectores de componente:** prefijo `app-` (`app-balance-card`).
- Una clase pública por archivo.

---

## 🅰️ Reglas Angular / Ionic (standalone)

- **Todo standalone.** Sin `NgModule`. Cada componente/página declara sus `imports`.
- **Routing con `provideRouter`** (ver `main.ts`) y **lazy loading** por feature:

  ```ts
  // app.routes.ts (patrón)
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.page').then(m => m.HomePage),
  }
  ```

- **Importar solo los componentes Ionic que se usan** (tree-shaking):

  ```ts
  import { IonHeader, IonToolbar, IonContent, IonCard } from '@ionic/angular/standalone';
  ```

- **Iconos con `addIcons`** (no el set global):

  ```ts
  import { addIcons } from 'ionicons';
  import { send, card, person } from 'ionicons/icons';
  addIcons({ send, card, person });
  ```

- **Detección de cambios:** usar `ChangeDetectionStrategy.OnPush` en componentes
  presentacionales.
- **Estado reactivo:** preferir **Signals** para estado local y **RxJS** para flujos
  asíncronos / streams. No mezclar sin razón.
- **Inyección:** usar `inject()` en lugar de inyección por constructor cuando aporte
  claridad.
- **Plantillas:** usar el control flow nuevo (`@if`, `@for`, `@switch`).

---

## 🧩 Patrón de componentes: contenedor vs presentacional

- **Páginas (`features/*`) = contenedores:** obtienen datos de servicios (`core`), manejan
  navegación y orquestan. Poca o ninguna lógica de presentación compleja.
- **Componentes (`shared/*`) = presentacionales:** reciben datos por `@Input()`/signals y
  emiten eventos por `@Output()`. **Sin** acceso a servicios de datos. Reutilizables y
  testeables de forma aislada.

Componentes compartidos previstos para Nimbo: `balance-card`, `numeric-keypad`,
`transaction-row`, `quick-action`, `card-visual`, `section-header`, `list-item-detail`.

---

## 🛠️ Servicios (capa `core/services`)

- Un servicio = una responsabilidad (SRP). Ejemplos:
  - `DataService` — provee datos mock (es-MX/MXN): usuario, transacciones, contactos,
    tarjetas, categorías. Equivalente a `docs/design/prototipo/data.js`.
  - `ThemeService` — modo claro/oscuro: respeta `prefers-color-scheme`, persiste la
    preferencia y aplica la clase `.dark` en `<html>`.
  - `StorageService` — abstracción de almacenamiento (envuelve Ionic Storage / Capacitor
    Preferences / Secure Storage). El resto del código depende de **esta interfaz**, no del
    plugin concreto (DIP).
  - `AuthService` — estado de autenticación (mock al inicio) usado por `auth.guard`.
- `@Injectable({ providedIn: 'root' })` para singletons.
- Exponer estado como **signals** o **observables de solo lectura**; mutaciones solo dentro
  del servicio (encapsulación).

---

## 💵 Formato de moneda y locale (es-MX / MXN)

- Registrar el locale `es-MX` y usar el `CurrencyPipe` de Angular, o un `CurrencyMxnPipe`
  propio en `shared/pipes` que envuelva:

  ```ts
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  ```

- Los montos usan la fuente **Sora** con `font-variant-numeric: tabular-nums` (ver tokens
  en `docs/design/README.md`).

---

## 🎨 Estilos y theming

- **Design tokens** como variables Ionic (`--ion-*` y tokens propios) en
  `src/theme/variables.scss`, con bloque para **modo claro** y **modo oscuro** (`.dark` /
  `prefers-color-scheme`). Fuente de verdad: `docs/design/README.md` y
  `docs/design/prototipo/styles.css`.
- Tipografías (Plus Jakarta Sans + Sora) importadas en `global.scss`.
- Usar **CSS variables** y utilidades de Ionic; preferir **Flexbox/Grid** y los componentes
  de layout de Ionic (`ion-grid`, `ion-row`, `ion-col`).
- Estilos de componente **encapsulados** en su `.scss`; nada de estilos globales salvo
  tokens/tipografía.
- Hit targets mínimos **44px**.

---

## 🧪 Testing

- **Unitarios:** Jasmine + Karma (`*.spec.ts` junto a cada unidad). Probar:
  - Servicios (lógica, transformaciones, formato de moneda).
  - Pipes y componentes presentacionales (entradas → salida/render).
- Mockear dependencias (servicios) en specs de componentes; aprovechar que los
  presentacionales no tienen IO.
- `pnpm test` (con navegador) en local; `pnpm test:ci` (headless) en CI.
- Apuntar a cubrir la lógica de negocio; no perseguir 100% en plantillas triviales (YAGNI).

---

## 📐 Principios aplicados

### SOLID
- **S**RP — cada clase/servicio/componente, una responsabilidad.
- **O**CP — extender vía nuevos componentes/servicios, no modificando los existentes.
- **L**SP — implementaciones intercambiables tras una interfaz (p. ej. `StorageService`).
- **I**SP — interfaces pequeñas y específicas (modelos por dominio).
- **D**IP — depender de abstracciones (interfaces/tokens), no de implementaciones (plugins).

### Patrones GoF útiles aquí
- **Singleton** — servicios `providedIn: 'root'`.
- **Strategy** — distintas implementaciones de almacenamiento detrás de `StorageService`.
- **Facade** — `DataService` como fachada de los datos mock/API.
- **Observer** — RxJS / Signals para reactividad.
- **Adapter** — envolver plugins de Capacitor tras una interfaz propia.

### DRY / KISS / YAGNI
- **DRY** — extraer lógica/UI repetida a `shared` o `core`.
- **KISS** — la solución más simple que funcione; evitar abstracciones prematuras.
- **YAGNI** — no construir lo que aún no se necesita (no agregar API real, i18n completo,
  etc. hasta que toque).

---

## ✅ Definition of Done (por tarea)

- [ ] Cumple la estructura de carpetas y convenciones de nombres.
- [ ] Componentes standalone; imports mínimos; lazy loading si es página.
- [ ] Sin errores de `pnpm lint` ni de build.
- [ ] Usa componentes Ionic nativos y respeta los design tokens (claro/oscuro).
- [ ] Lógica de negocio en servicios; UI reutilizable en `shared`.
- [ ] Tests unitarios de la lógica nueva (cuando aplique).
- [ ] Sin `console.log` de debug ni código muerto.
- [ ] Commit con Conventional Commits.

---

> Este documento es la referencia de arquitectura. El **qué** construir (pantallas, tokens,
> mapeo a `ion-*`) está en `docs/design/README.md` (handoff de Nimbo).
