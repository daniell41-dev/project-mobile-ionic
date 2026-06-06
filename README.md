# project-mobile-ionic

Aplicación móvil híbrida construida con **Ionic 8 + Angular 20 (standalone) + Capacitor 8**.

Proyecto de portafolio orientado a demostrar buenas prácticas de ingeniería de
software en desarrollo móvil: arquitectura limpia y modular, principios SOLID,
patrones de diseño, consumo de APIs REST, integraciones nativas y almacenamiento
seguro.

## Stack

| Capa | Tecnología |
|------|------------|
| UI / Framework | Ionic 8 (componentes UI) |
| Frontend | Angular 20 con componentes *standalone* |
| Lenguaje | TypeScript 5.9 |
| Runtime nativo | Capacitor 8 (Android / iOS) |
| Testing | Jasmine + Karma |
| Linting | ESLint + `@angular-eslint` |

## Requisitos

- Node.js 20+ (probado en Node 22)
- npm 10+
- Ionic CLI: `npm install -g @ionic/cli`
- Para compilar nativo: Android Studio (Android) y/o Xcode (iOS)

## Puesta en marcha

```bash
# Instalar dependencias
npm install

# Servir en el navegador con recarga en caliente
npm start            # o: ionic serve

# Compilar la web (genera ./www)
npm run build
```

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm start` | Levanta el servidor de desarrollo (`ng serve`) |
| `npm run build` | Compila la app web a `./www` |
| `npm run watch` | Compila en modo desarrollo con *watch* |
| `npm test` | Ejecuta los tests unitarios (Jasmine + Karma) |
| `npm run test:ci` | Tests en modo headless, sin *watch* (CI) |
| `npm run lint` | Analiza el código con ESLint |

## Capacitor (compilación nativa)

```bash
# Añadir plataformas (requiere los SDK nativos instalados)
npx cap add android
npx cap add ios

# Sincronizar la web compilada con los proyectos nativos
npm run build && npx cap sync

# Abrir el proyecto nativo en el IDE correspondiente
npx cap open android
npx cap open ios
```

La configuración de Capacitor vive en [`capacitor.config.ts`](./capacitor.config.ts).

## Estructura del proyecto

```
src/
├── app/
│   ├── tabs/                 # Layout de navegación por pestañas
│   ├── tab1/ tab2/ tab3/     # Páginas de ejemplo del starter
│   ├── explore-container/    # Componente de ejemplo
│   ├── app.component.ts      # Componente raíz
│   └── app.routes.ts         # Rutas de la aplicación
├── theme/variables.scss      # Variables de tema de Ionic
├── global.scss               # Estilos globales
└── main.ts                   # Bootstrap de la aplicación
```

> La estructura por capas (core / shared / features) y las convenciones de
> arquitectura se documentarán en las reglas del proyecto en una fase posterior.

## Notas

- Los tests unitarios requieren un navegador Chrome/Chromium para Karma. En
  entornos sin navegador (CI/cloud) se debe proveer un Chrome headless y la
  variable `CHROME_BIN`.
