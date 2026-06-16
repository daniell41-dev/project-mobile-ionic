# 06 - GUÍA DE ENTREVISTA Y BANCO DE PREGUNTAS

> 🎯 Guía para presentar **Nimbo** en una postulación a **Desarrollador Mobile Ionic** y
> responder con seguridad. Todo lo que se afirma aquí está respaldado por código real del repo
> (se citan archivos). Acompáñala con `docs/04-roadmap-y-fases.md` (qué se hizo y por qué) y
> `docs/05-tutorial-proyecto-completo.md` (cómo funciona cada parte).

---

## 1. 🗣️ Pitch de 30 segundos

> "Nimbo es una app de banca personal hecha con **Ionic 8 + Angular 20 (standalone) + Capacitor 8**
> en TypeScript, para iOS y Android desde una sola base de código. Tiene 10 pantallas, navegación
> por tabs, autenticación con token, tema claro/oscuro, gráficas reales y una capa de datos REST.
> La construí aplicando **arquitectura limpia por capas, SOLID y patrones GoF**, con tests en
> **Karma y Jest**, un **plugin Capacitor propio** de biometría y **CI/CD** que publica una PWA y
> compila el APK. Hay un demo navegable y el repo documenta cada decisión."

**Enlaces que llevas a la entrevista:**
- Demo PWA: `https://daniell41-dev.github.io/project-mobile-ionic/` (ábrela también en tu iPhone).
- Repo + PRs por fase (historial de issues/PRs que muestra proceso, no solo resultado).
- APK descargable (workflow `android.yml`).

---

## 2. 🧭 Recorrido de arquitectura (para compartir pantalla)

1. **Capas** (`src/app/`): `core/` (servicios singleton, guards, interceptors, modelos,
   repositorios), `shared/` (pipes reutilizables), `features/` (una carpeta por pantalla,
   lazy-loaded), `tabs/` (shell de navegación). Regla: `features → shared/core`, nunca entre features.
2. **Arranque** (`src/main.ts`): `bootstrapApplication` + `provideRouter` (lazy + `PreloadAllModules`),
   `provideHttpClient(withInterceptors([authInterceptor]))`, `provideAppInitializer` que restaura
   sesión y tema antes del primer render, locale `es-MX`.
3. **Estado**: **Signals** para estado local/servicios; **RxJS** en la capa de datos (repositorios).
4. **Tema**: design tokens `--nimbo-*` en `src/theme/variables.scss` + clase `dark`/`light` en `<html>`.
5. **Datos**: patrón **Repository** (`core/repositories/`) con dos estrategias y backend simulado MSW.

---

## 3. 🧩 Decisiones técnicas (el "por qué")

| Decisión | Por qué |
|---|---|
| **Standalone components** (sin NgModules) | Estándar Angular moderno; menos boilerplate, mejor tree-shaking y lazy loading directo con `loadComponent`. |
| **Signals** para estado de UI/servicios | Reactividad simple y sin suscripciones manuales; menos fugas. RxJS se reserva para flujos asíncronos (HTTP). |
| **Repository + Strategy** (`transaction.repository.ts`) | Desacopla la UI del origen de datos; permite cambiar mock↔REST por configuración (`useMockApi`) sin tocar las páginas (DIP/OCP). |
| **Adapter** (`transaction.adapter.ts`) | Aísla el formato de transporte (DTO con fecha ISO) del modelo de dominio (`Date`). |
| **MSW** como backend | Ejercita HttpClient/RxJS de verdad en el navegador sin servidor; el demo PWA sigue funcionando. |
| **`StorageService` vs `SecureStorageService`** | Preferencias no sensibles en Preferences; el token en almacenamiento seguro (Keystore/Keychain). DIP: la app depende de la abstracción, no del plugin. |
| **Plugin propio de biometría** | Demuestra desarrollo nativo (Android Kotlin `BiometricPrompt`) y el contrato Capacitor (definitions/web/native). |
| **Karma + Jest** | Cubre los dos runners que pide el mercado; aislados por extensión y tsconfig. |
| **PWA sin ngsw** | Simplicidad para el demo; sin caché offline que oculte cambios ni conflicto con el worker de MSW. |

---

## 4. ✅ Requisito de la vacante → dónde se demuestra

| Requisito | Evidencia en el repo |
|---|---|
| Angular + TypeScript profundo | Standalone, Signals, reactive forms, tipado estricto (`tsconfig` strict). |
| Arquitectura limpia / bajo acoplamiento | `core/shared/features/tabs`; Repository + DIP. |
| SOLID, GoF, DRY/KISS/YAGNI | Repository/Strategy/Adapter; interceptor; `docs/03`. |
| CSS / Flexbox / Grid / Ionic UI | Las 10 pantallas; `global.scss`, tokens, `.btn`/`.iconbtn`. |
| CLI Ionic, build, plugins Capacitor | `capacitor.config.ts`, plugins, workflows `android.yml`/`pages.yml`. |
| Desarrollo de plugins | `plugins/biometric-auth/` (TS + Kotlin) — FASE 7. |
| Integraciones nativas + SDKs | Haptics, StatusBar, Camera — FASE 6. |
| REST (JSON), HttpClient/RxJS | `HttpTransactionRepository` + MSW — FASE 4. |
| Almacenamiento seguro (Keychain/Keystore) | `SecureStorageService` — FASE 5. |
| TDD (Jest, Jasmine, Karma) | 94 specs Karma + 8 Jest — FASE 8. |
| CI/CD | `.github/workflows/ci.yml`, `pages.yml`, `android.yml` — FASE 9. |

---

## 5. ❓ Banco de preguntas de reclutador (con respuestas modelo)

### Angular / TypeScript
- **¿Standalone components vs NgModules?** Standalone elimina los módulos: cada componente declara
  sus `imports`. Simplifica el árbol, mejora el tree-shaking y permite lazy loading con
  `loadComponent`. Todo Nimbo es standalone.
- **¿Signals vs RxJS? ¿Cuándo cada uno?** Signals para estado síncrono y derivaciones (`computed`),
  sin suscripciones ni fugas; RxJS para flujos asíncronos/HTTP. En Nimbo el estado de pantallas es
  signals y los repositorios devuelven `Observable` (se consumen con `toSignal`/`async`).
- **¿Cómo evitas fugas de memoria?** Con signals no hay suscripción manual; con RxJS uso `async`
  pipe o `takeUntilDestroyed`. Evito suscripciones colgadas en componentes.
- **¿Change detection?** Componentes ligeros + signals; Ionic ya usa estrategias eficientes. Si
  hiciera falta, `OnPush`.

### Ionic / CSS
- **¿Por qué design tokens en CSS variables?** Centralizan color/espaciado y permiten tema
  claro/oscuro cambiando una clase en `<html>`, sin recompilar ni lógica por componente.
- **¿Cómo maquetas?** Flexbox/Grid + componentes Ionic (`ion-content`, `ion-card`, `ion-list`,
  `ion-segment`). Botones unificados con una clase `.btn` propia para consistencia de altura.
- **¿Teclado numérico propio en "Enviar"?** Sí, un grid 4×3 propio (no el nativo) que actualiza el
  monto y el texto del botón en vivo — requisito de UX del diseño.

### SOLID / patrones / clean code
- **Da un ejemplo de SOLID aplicado.** *DIP*: las páginas dependen de `TransactionRepository`
  (abstracción), no de HttpClient ni de los mocks. *OCP*: agregar una fuente nueva = nueva
  implementación, sin tocar consumidores.
- **¿Qué patrones GoF usaste y por qué?** Repository (acceso a datos), Strategy (in-memory vs HTTP),
  Adapter (DTO↔modelo), y el interceptor HTTP como patrón transversal (DRY: el token se añade en un
  solo sitio).
- **¿DRY/KISS/YAGNI?** No metí NgRx ni un backend real porque YAGNI para el alcance; mantuve la capa
  de datos simple pero extensible.

### Capacitor / plugins / nativo
- **¿Diferencia Capacitor vs Cordova?** Capacitor es el sucesor moderno: APIs basadas en promesas,
  proyectos nativos como ciudadanos de primera clase, mejor interop con SPM/Gradle. Nimbo usa
  Capacitor 8.
- **¿Has desarrollado un plugin?** Sí, `plugins/biometric-auth/`: contrato en `definitions.ts`,
  implementación web (`web.ts`) y nativa Android en Kotlin con `BiometricPrompt` + Keystore; se
  registra con `registerPlugin`. La app lo consume vía `BiometricService` (envoltorio testeable).
- **¿Cómo manejas que un plugin no exista en web?** `Capacitor.isNativePlatform()` + *graceful
  fallback*: p. ej. `StatusBarService`/`HapticsService` son no-op en web; la cámara usa el selector
  de archivos; la biometría web resuelve para no bloquear el demo.

### Integraciones nativas / SDKs
- **¿Qué APIs nativas integraste?** Haptics (feedback), StatusBar (color según tema), Camera (avatar)
  y biometría (plugin propio). Cada una encapsulada en un servicio de `core/` para bajo acoplamiento.

### REST / RxJS / HttpClient
- **¿Cómo consumes una API REST?** `HttpClient` en un repositorio que mapea DTO→modelo con un
  Adapter y devuelve `Observable`. El `authInterceptor` añade `Authorization: Bearer` a cada
  petición. La base de la API vive en `environments/`.
- **¿Y sin backend?** MSW intercepta en el navegador y responde con datos semilla, así pruebo el
  camino HTTP/RxJS real sin servidor.
- **Operadores RxJS que usas:** `map` para transformar respuestas; `firstValueFrom` en tests;
  `of` en la implementación in-memory.

### Almacenamiento seguro
- **¿Dónde guardas el token?** En **secure storage** (`@aparajita/capacitor-secure-storage`):
  Keystore en Android, Keychain en iOS, con fallback web. Nunca en `localStorage` plano en nativo.
- **¿Por qué dos servicios de storage?** Separación de responsabilidades: datos sensibles
  (`SecureStorageService`) vs preferencias (`StorageService`).

### Testing (Jest / Jasmine / Karma)
- **¿Qué runners usas?** Karma + Jasmine para la suite principal (94 specs) y Jest para una porción
  (`pnpm test:jest`). Aislados por extensión (`*.jest.ts`) y tsconfig propio para que no choquen los
  globals.
- **¿Cómo testeas un plugin nativo?** Aíslo la llamada al plugin en un método `protected` y en el
  test uso una subclase que lo sustituye (evito el proxy de Capacitor). Igual con la cámara.
- **¿Cómo aíslas dependencias?** `TestBed` + fakes/`useValue`; `HttpTestingController` para HTTP.

### CI/CD y build sin Mac
- **¿Tu pipeline?** GitHub Actions: `ci.yml` (lint + build + Karma + Jest en cada PR), `pages.yml`
  (publica la PWA), `android.yml` (compila el APK). PRs protegidos contra `develop`/`main`.
- **No tienes Mac, ¿cómo harías iOS?** iOS exige Xcode/macOS; lo resuelvo con **CI en la nube**
  (Codemagic / Ionic Appflow / runner `macos-latest`) que genera el `.ipa`. Para validación rápida,
  la **PWA** corre en Safari del iPhone.
- **¿Expo sirve?** No: Expo es de React Native. Nimbo es Ionic/Angular + Capacitor.

### Proceso / Git
- **¿Cómo trabajas con Git?** Flujo con `develop` y ramas de trabajo; cada bloque es un issue → PR a
  `develop` (Conventional Commits, `Closes #N`) → merge; y un PR de release `develop → main`. El
  historial del repo lo demuestra.

---

## 6. 🎬 Cómo demostrar en vivo
1. **PWA en el iPhone**: abrir el link en Safari → "Añadir a inicio" → recorrer pantallas, cambiar
   tema, filtrar movimientos, abrir el donut/barras de Análisis.
2. **Código**: enseñar `core/repositories/` (Repository/Strategy/Adapter) y `plugins/biometric-auth/`.
3. **CI**: mostrar los checks verdes en un PR y los workflows.
4. **APK**: ejecutar `android.yml` y descargar el artifact (si preguntan por build nativo).

---

## 7. ⚠️ Honestidad técnica (qué decir si preguntan límites)
- El backend es **mock** (MSW / in-memory): la integración REST es real a nivel de cliente, pero no
  hay servidor propio. Sé exactamente cómo conectarlo (cambiar `useMockApi` y apuntar `apiBaseUrl`).
- **iOS** aún no compilado localmente (sin Mac); resuelto con CI en la nube. Android sí compila.
- La biometría tiene implementación **Android** real; **iOS** queda como stub documentado.
- Los iconos del manifest parten de un SVG de marca; para tiendas añadiría PNGs 180/192/512.

> Mostrar que conoces los límites y cómo cerrarlos transmite seniority.
