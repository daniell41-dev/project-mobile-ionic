# 02 - GUÍA DE DEPLOY Y CI

## 🚀 Despliegue de una app Ionic + Capacitor

Esta guía cubre cómo verificar, integrar y desplegar **Nimbo** (Ionic + Angular +
Capacitor). A diferencia de una app web tradicional, una app Ionic tiene **tres destinos**
posibles, no excluyentes:

```
┌─────────────────────────────────────────────────────────┐
│  Código (Angular + Ionic)                                │
└───────────────┬─────────────────────────────────────────┘
                │  pnpm build  → genera ./www (web assets)
                ▼
   ┌────────────────────┬───────────────────┬──────────────────┐
   ▼                    ▼                   ▼                  
 PWA / Web            Android (APK/AAB)    iOS (IPA)
 (demo en vivo)       vía Capacitor        vía Capacitor
 GitHub Pages /       + Android Studio     + Xcode
 Firebase Hosting     → Play Store         → App Store
```

> Para un **portafolio**, lo más valioso y rápido es la **demo PWA en vivo** (un link que
> el reclutador puede abrir) + el repo. Los builds nativos a stores son opcionales y más
> laboriosos (cuentas de desarrollador, firma, revisión).

---

## PARTE 1: PRE-DEPLOY (verificación local)

Antes de cualquier despliegue, todo debe pasar localmente:

```bash
pnpm install
pnpm lint           # ESLint sin errores
pnpm build          # Compila a ./www → "Application bundle generation complete"
pnpm test:ci        # Tests headless (requiere Chrome/Chromium)
```

**Verificar:**

- ✅ Sin errores de TypeScript / lint
- ✅ Build exitoso (carpeta `www/` generada)
- ✅ Tests en verde
- ✅ La app se ve correcta en `pnpm start` (modo claro y oscuro)

### Variables de entorno (Angular)

Angular **no usa archivos `.env`** como Next.js. Las configuraciones por entorno viven en
`src/environments/`:

```
src/environments/
├── environment.ts        # desarrollo (valores por defecto)
└── environment.prod.ts   # producción
```

```ts
// src/environments/environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'https://api.ejemplo.dev',
};
```

- **Nunca** pongas secretos reales en estos archivos si el repo es público: en apps móviles
  todo lo empaquetado es accesible por el usuario. Para claves sensibles usa un backend
  propio o almacenamiento seguro (Keychain/Keystore vía Capacitor).
- Si necesitas un archivo local con secretos, créalo como `environment.local.ts` y añádelo
  a `.gitignore`.

---

## PARTE 2: CI CON GITHUB ACTIONS

El repo incluye un workflow en `.github/workflows/ci.yml` que se ejecuta en cada PR hacia
`develop` y `main`. Hace de "portero": ningún PR se mergea si no pasa.

**Qué ejecuta:**

1. Checkout del código.
2. Instala pnpm (`pnpm/action-setup`) y Node 20 (`actions/setup-node` con `cache: pnpm`).
3. `pnpm install --frozen-lockfile`.
4. `pnpm lint`.
5. `pnpm build`.
6. `pnpm test:ci` con Chrome headless sin sandbox (`ChromeHeadlessNoSandbox`, definido en
   `karma.conf.js`). `ubuntu-latest` ya trae Chrome preinstalado.
7. `pnpm test:jest` (runner Jest, suite de `tests/jest/`).

Además, `.github/workflows/android.yml` (manual, `workflow_dispatch`) compila el **APK** de
Android en la nube y lo publica como artifact (ver Parte 4-bis).

**Recomendado en GitHub** → *Settings → Branches → Branch protection rules* para `main` y
`develop`:

- ✅ Require a pull request before merging
- ✅ Require status checks to pass → seleccionar el job de CI
- ✅ (opcional) Require 1 review

---

## PARTE 3: DEMO WEB / PWA (recomendado para portafolio)

Ionic corre en navegador sin cambios. Publicar `www/` da un **link de demo navegable**.

### Opción A — GitHub Pages

1. Build con el `baseHref` correcto (Pages sirve bajo `/<repo>/`):

   ```bash
   pnpm exec ng build --configuration production --base-href /project-mobile-ionic/
   ```

2. Publicar `www/` en la rama `gh-pages` (manual con `git subtree`/`gh-pages`, o con una
   GitHub Action de deploy de Pages).
3. Activar Pages en *Settings → Pages* apuntando a `gh-pages`.

> Nota: el routing de Ionic usa el History API; en Pages conviene una copia de
> `index.html` como `404.html` para que las rutas profundas no den 404 al recargar.

### Opción B — Firebase Hosting

```bash
pnpm add -D firebase-tools
pnpm exec firebase login
pnpm exec firebase init hosting     # public dir = www, SPA = yes
pnpm build
pnpm exec firebase deploy --only hosting
```

Firebase reescribe todas las rutas a `index.html` automáticamente (ideal para SPA/Ionic).

### (Opcional) Convertirla en PWA instalable

```bash
pnpm exec ng add @angular/pwa
```

Añade `manifest.webmanifest` + service worker; tras `pnpm build` la demo es instalable.

---

## PARTE 4: BUILD NATIVO CON CAPACITOR

La configuración vive en `capacitor.config.ts` (`appId`, `appName`, `webDir: 'www'`).

### 4.1 Añadir plataformas (una vez)

```bash
pnpm add @capacitor/android @capacitor/ios   # según destino
npx cap add android
npx cap add ios
```

> Las carpetas `android/` e `ios/` están en `.gitignore` por defecto en este flujo; se
> regeneran con `cap add`. Si decides versionarlas (para personalización nativa), quítalas
> del `.gitignore`.

### 4.2 Ciclo de trabajo (cada vez que cambias la web)

```bash
pnpm build          # genera www/
npx cap sync        # copia www/ + actualiza plugins nativos
npx cap open android   # abre Android Studio
npx cap open ios       # abre Xcode (solo macOS)
```

### 4.3 Requisitos

| Plataforma | Necesitas |
|------------|-----------|
| Android | Android Studio, JDK 17, Android SDK |
| iOS | macOS + Xcode + CocoaPods |

### 4.4 Generar artefactos

- **Android:** desde Android Studio → *Build → Generate Signed Bundle/APK* (AAB para Play
  Store, APK para pruebas). Requiere un **keystore** (NO se commitea).
- **iOS:** desde Xcode → *Product → Archive* → distribuir.

---

## PARTE 4-bis: BUILD NATIVO SIN MAC (y sin Android Studio)

Estrategia adoptada en este proyecto (desarrollo sin Mac, con un iPhone físico de pruebas).
> ⚠️ **Expo no aplica**: es para React Native. Nimbo es Ionic/Angular + Capacitor.

### Android sin Android Studio (solo CLI)
Basta el **JDK 17** + **Android SDK command-line tools** (mucho más ligero que el IDE):

```bash
pnpm build && npx cap sync android
cd android && ./gradlew assembleDebug      # APK en android/app/build/outputs/apk/debug/
```

En CI está automatizado: workflow **`.github/workflows/android.yml`** (`workflow_dispatch`)
hace setup de JDK + Android SDK, compila y sube el **APK** como artifact descargable.

### iOS sin Mac → build en la nube
Compilar iOS exige **Xcode (solo macOS)**; sin Mac local, se usa CI en la nube que provee
máquinas macOS para generar el `.ipa`:

| Servicio | Notas |
|----------|-------|
| **Ionic Appflow** | Pensado para Ionic/Capacitor; build iOS/Android gestionado. |
| **Codemagic** | Tier gratuito; `.ipa` con firma; bueno para portafolio. |
| **GitHub Actions** `macos-latest` | Runner macOS con Xcode preinstalado. |

Ejemplo (esqueleto) de job iOS en GitHub Actions:

```yaml
jobs:
  ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build && npx cap add ios && npx cap sync ios
      - run: xcodebuild -workspace ios/App/App.xcworkspace -scheme App -sdk iphonesimulator
```

> Para validación rápida en el iPhone 14 sin compilar nativo: abrir la **PWA** en Safari
> (`pnpm start --host` + misma red) y "Añadir a pantalla de inicio".

---

## PARTE 5: TROUBLESHOOTING

**`pnpm build` falla**
- Revisa el error de TypeScript/lint; corre `pnpm lint` aparte.
- Verifica versiones de dependencias y que el lockfile esté actualizado (`pnpm install`).

**Tests fallan en CI pero pasan local**
- Asegúrate de que `test:ci` usa `--browsers=ChromeHeadlessNoSandbox` y que el launcher
  está en `karma.conf.js`.

**Pantalla en blanco tras desplegar la web**
- `baseHref` incorrecto (GitHub Pages) → reconstruir con `--base-href /<repo>/`.
- Rutas 404 al recargar → configurar fallback a `index.html` (Firebase) o `404.html`
  (Pages).

**`npx cap sync` no refleja cambios**
- Olvidaste `pnpm build` antes; `cap sync` copia `www/`, no compila.

**App nativa muestra versión vieja**
- Ejecuta `pnpm build && npx cap sync` y vuelve a correr desde el IDE.

---

## PARTE 6: CHECKLIST FINAL

### Pre-deploy
- [ ] `pnpm lint` OK
- [ ] `pnpm build` OK (carpeta `www/`)
- [ ] `pnpm test:ci` OK
- [ ] `.gitignore` correcto (sin `www/`, `android/`, `ios/`, keystores)
- [ ] Todo pusheado y CI en verde

### Demo web (portafolio)
- [ ] `baseHref` correcto
- [ ] Demo accesible por URL
- [ ] Rutas profundas funcionan al recargar
- [ ] Modo claro/oscuro OK

### Nativo (opcional)
- [ ] `npx cap sync` sin errores
- [ ] Build firmado generado
- [ ] Keystore/credenciales guardados **fuera** del repo

---

## 📞 Recursos Útiles

- **Ionic Docs**: https://ionicframework.com/docs
- **Capacitor Docs**: https://capacitorjs.com/docs
- **Angular Deployment**: https://angular.dev/tools/cli/deployment
- **GitHub Actions**: https://docs.github.com/actions
- **Firebase Hosting**: https://firebase.google.com/docs/hosting

---

**🎉 ¡A desplegar!** Para el portafolio, prioriza la demo PWA + un repo limpio con CI en
verde; los builds a stores cuando los necesites de verdad.
