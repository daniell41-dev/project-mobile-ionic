# 04 - ROADMAP Y FASES DE CONSTRUCCIÓN

> 📌 **Este documento es una regla.** Toda sesión futura de Claude (y cualquier dev) debe
> leerlo antes de trabajar y respetar el sistema de fases y el flujo Git descritos aquí.
> Complementa a `CLAUDE.md` (flujo Git operativo) y a
> `docs/03-arquitectura-y-buenas-practicas.md` (estándares de código).

## 🎯 Propósito

Nimbo es un proyecto de portafolio orientado a demostrar el perfil de un **desarrollador
Mobile Ionic senior**. El trabajo se organiza en **fases incrementales**; cada fase cierra
uno o más requisitos concretos del perfil profesional y se entrega de forma autónoma hasta
`develop`.

## 🔄 Flujo Git por fase (obligatorio)

Cada fase sigue **siempre** este ciclo, sin que el usuario tenga que pedirlo (ver `CLAUDE.md`):

```
1. Claude crea un issue describiendo la fase/tarea.
2. Claude trabaja en la rama de sesión y commitea (Conventional Commits).
3. Claude crea el PR: rama de sesión → develop  (con "Closes #N").
4. Claude mergea el PR a develop y cierra el issue.   ← automático, hasta aquí Claude solo.
5. PR develop → main: SOLO cuando el usuario lo pide explícitamente.
```

**Regla de cierre de cada fase:** dejar `pnpm lint && pnpm build` en verde (y los tests), y
actualizar `docs/05-tutorial-proyecto-completo.md` para reflejar el nuevo estado.

---

## ✅ Fases completadas

| Fase | Contenido | Estado |
|------|-----------|--------|
| **FASE 1** | Fundación: design tokens (claro/oscuro), capa `core/shared/features/tabs`, navegación (5 tabs + rutas push + AuthGuard), las 10 pantallas | ✅ en `develop` |
| **FASE 2** | Autenticación: `StorageService`, `AuthService` con token persistido, `authInterceptor`, login reactivo | ✅ en `develop` |
| **Visual** | Pase de fidelidad de las 10 pantallas contra el prototipo del handoff | ✅ en `develop` |
| **FASE 3** | Charts reales (Chart.js) en Análisis + segmento Semana/Mes/Año | ✅ en `develop` |
| **Interacciones** | Auditoría y cierre de las interacciones del handoff (ocultar saldo, filtros, teclado, toggles, tema, buscar contactos…) | ✅ en `develop` |
| **Tests** | 65 tests unitarios (Karma + Jasmine), todos en verde | ✅ en `develop` |

---

## 🛣️ Fases 4–9 (cierre de gaps de la vacante) — ✅ completadas

Cada fase se ejecutó de forma aislada con su propio ciclo issue → PR → `develop`.

### FASE 4 — Capa de datos REST: Repository + HttpClient/RxJS + MSW
- **Objetivo:** sustituir los datos mock de `DataService` por una capa REST real con patrón
  **Repository**.
- **Alcance:** interfaces de repositorio en `core/repositories/`; dos implementaciones
  (Strategy): `InMemory*` (datos seed) y `Http*` (HttpClient → `apiBaseUrl`, con Adapter
  DTO→modelo); selección por `environment.useMockApi`. Datos como `Observable`/`toSignal`
  (RxJS). **MSW** intercepta en el navegador para que la PWA funcione sin servidor externo.
- **Cubre:** consumo de APIs REST (JSON), HttpClient/RxJS, GoF (Repository/Strategy/Adapter),
  SOLID, arquitectura limpia.

### FASE 5 — Almacenamiento seguro nativo
- **Objetivo:** cifrar datos sensibles (token de auth) con almacenamiento seguro nativo.
- **Alcance:** plugin de secure storage; `SecureStorageService` usando **Keystore** (Android)
  / **Keychain** (iOS) con fallback `localStorage` en web. Migrar `TOKEN_KEY` de `AuthService`.
- **Cubre:** mecanismos seguros de almacenamiento (secure storage, Keychain, Keystore).

### FASE 6 — Integraciones nativas + SDKs de terceros
- **Objetivo:** usar funcionalidades nativas reales.
- **Alcance:** plugins ya instalados (`Haptics`, `StatusBar`, `Keyboard`, `App`) + nuevos
  (`Camera` para avatar, `Geolocation`). Cada uso encapsulado en un servicio de `core/services/`
  con *graceful fallback* en web.
- **Cubre:** integraciones nativas Android/iOS, SDKs de terceros, gestión de plugins Capacitor.

### FASE 7 — Plugin Capacitor propio: autenticación biométrica
- **Objetivo:** desarrollar un **plugin Capacitor propio**.
- **Alcance:** `plugins/biometric-auth/` (definitions/web/index + `android/` Kotlin con
  `BiometricPrompt` + Keystore). API `isAvailable()` / `authenticate(reason)`. Web = stub;
  Android = real; iOS = documentado/stub (sin Mac para compilar). Se conecta con la fila
  **"Seguridad y biometría"** de Perfil.
- **Cubre:** desarrollo/modificación de plugins Capacitor, integración nativa profunda.

### FASE 8 — Testing reforzado: Jest junto a Karma
- **Objetivo:** demostrar dominio de **Jest, Jasmine y Karma**.
- **Alcance:** configurar Jest (`jest-preset-angular`) **sin** quitar Karma; specs nuevos en
  Jest para la capa de FASE 4–7; script `pnpm test:jest`; job de CI adicional.
- **Cubre:** desarrollo orientado a pruebas con Jest, Jasmine y Karma.

### FASE 9 — CI/CD y build nativo en la nube (iOS sin Mac)
- **Objetivo:** pipeline de build para Android y iOS sin Mac local.
- **Alcance:** build Android por línea de comandos (cmdline-tools + Gradle → APK); build iOS
  **en la nube** (Codemagic / Ionic Appflow / runner `macos-latest`) → `.ipa`. Ampliar
  `.github/workflows/ci.yml` (lint + build + Karma + Jest).
- **Cubre:** CLI de Ionic, herramientas de build, gestión de plugins, deploy.

---

## 📋 Cobertura de la vacante → fase

| Requisito de la vacante | Fase que lo cubre | Estado |
|-------------------------|-------------------|--------|
| Angular + TypeScript profundo | FASE 1–3 | ✅ |
| Arquitectura limpia, modular, bajo acoplamiento | FASE 1, 4 | ✅ |
| SOLID, GoF, DRY/KISS/YAGNI | FASE 1–2, 4 | ✅ |
| CSS / Flexbox / Grid / Ionic UI | Visual | ✅ |
| CLI Ionic, build, plugins Capacitor/Cordova | 6, 7, 9 | ✅ |
| Desarrollo/modificación de plugins | FASE 7 | ✅ |
| Integraciones nativas + SDKs de terceros | FASE 6 | ✅ |
| TDD con Jest, Jasmine, Karma | Tests, FASE 8 | ✅ |
| APIs REST (JSON), HttpClient/RxJS | FASE 4 | ✅ |
| Almacenamiento seguro (secure storage, Keychain, Keystore) | FASE 5 | ✅ |
| 3+ años de experiencia | — (perfil del candidato) | n/a |

Leyenda: ✅ hecho · 🟡 parcial · 🔜 planificado.

---

## 🍏 Nota: desarrollo sin Mac (con iPhone 14)

Apple obliga a **Xcode (solo macOS)** para compilar/firmar iOS. Estrategia adoptada:

- **PWA en el navegador del iPhone** (`pnpm start --host`) cubre validación de UI, navegación
  e interacciones — el grueso de la demo de portafolio.
- **Android** se compila localmente sin Android Studio (cmdline-tools + Gradle).
- **iOS** se compila **en la nube** (Codemagic / Appflow / GitHub Actions macOS) — ver FASE 9.
- **Expo NO aplica:** es para React Native; Nimbo es Ionic/Angular + Capacitor.

---

## 📚 Documentos relacionados
- `CLAUDE.md` — guía operativa y flujo Git.
- `docs/01-flujo-git-github.md` — flujo Git/GitHub detallado.
- `docs/02-guia-deploy-y-ci.md` — deploy (PWA/nativo) y CI.
- `docs/03-arquitectura-y-buenas-practicas.md` — arquitectura, SOLID, convenciones.
- `docs/05-tutorial-proyecto-completo.md` — tutorial del estado actual (documento vivo).
- `docs/design/` — handoff de diseño de Nimbo.
