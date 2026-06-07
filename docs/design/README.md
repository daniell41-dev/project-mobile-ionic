# Handoff: Nimbo — App de banca personal (Ionic)

## Resumen
Nimbo es una **app móvil de banca personal / billetera** (saldos, transferencias, tarjetas,
estadísticas). Este paquete contiene un **prototipo de alta fidelidad navegable en HTML** que
define el look & feel, el flujo de navegación y el contenido de 10 pantallas, más el mapeo de cada
zona a su **componente Ionic** correspondiente.

- **Mercado / idioma:** México · Español · moneda **MXN**
- **Plataformas:** iOS y Android desde una sola base de código (Ionic)
- **Estilo:** premium, oscuro y elegante, con **modo claro y modo oscuro** (toggle)
- **Acento de marca:** azul `#2A6FDB`
- **Tipografía:** Plus Jakarta Sans (UI) + Sora (números/montos)

---

## Sobre los archivos de diseño
Los archivos en `prototipo/` son **una referencia de diseño hecha en HTML/React** — muestran la
apariencia y el comportamiento buscados, **no son código de producción para copiar tal cual.**

La tarea es **recrear estos diseños en un proyecto Ionic real**, usando los componentes y patrones
nativos de Ionic. Stack objetivo:

- **Ionic 7+ con Angular** (`@ionic/angular`) + **TypeScript**, con **componentes standalone** y
  `provideRouter`. (El prototipo está escrito en React solo como referencia visual; el mapeo de
  componentes `ion-*` es idéntico en Angular.)
- **Capacitor** para empaquetar a iOS/Android.
- Routing con **Angular Router** + `ion-tabs` / `<ion-router-outlet>`.

## Fidelidad
**Alta fidelidad (hi-fi).** Colores, tipografía, espaciado e interacciones son finales. Recrea la UI
de forma fiel usando componentes Ionic y los tokens definidos abajo (CSS variables de Ionic).

---

## Design Tokens

Defínelos como variables de Ionic en `:root` y en `body[color-scheme]` / `.dark`. Ionic ya soporta
modo oscuro vía `prefers-color-scheme` o una clase `.dark` en `<html>`.

### Color — Modo OSCURO (default)
| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#090B10` | Fondo de la app |
| `--surface` | `#14181F` | Tarjetas / ion-card |
| `--surface-2` | `#1B212B` | Inputs, leads de lista |
| `--surface-3` | `#232B37` | Pistas de barras / tracks |
| `--hairline` | `rgba(255,255,255,0.075)` | Bordes / divisores |
| `--text` | `#EEF1F6` | Texto principal |
| `--text-dim` | `#9BA4B3` | Texto secundario |
| `--text-mute` | `#626C7C` | Texto terciario / labels |
| `--accent` | `#4C8DFF` | Acento (tinte claro para oscuro) |
| `--up` | `#3FD1A0` | Ingresos / éxito |
| `--down` | `#FF8A8A` | Gastos / peligro |

### Color — Modo CLARO
| Token | Valor |
|---|---|
| `--bg` | `#EDF0F5` |
| `--surface` | `#FFFFFF` |
| `--surface-2` | `#F4F6FA` |
| `--surface-3` | `#EAEEF5` |
| `--hairline` | `rgba(13,19,32,0.08)` |
| `--text` | `#0E1320` |
| `--text-dim` | `#5A6473` |
| `--text-mute` | `#8A94A4` |
| `--accent` | `#2A6FDB` (acento base de marca) |
| `--up` | `#128C5E` |
| `--down` | `#D2453C` |

### Acento de marca (constante en ambos modos)
`--accent-500: #2A6FDB` · `--accent-400: #4C8DFF` · `--accent-600: #1F5BC0`
Degradado de tarjeta de saldo: `linear-gradient(150deg, #2A6FDB, #1B3F86 60%, #14264F)`.

### Tipografía
- **UI:** `"Plus Jakarta Sans"`, pesos 400/500/600/700/800. Títulos con `letter-spacing: -0.02em`.
- **Números/montos:** `"Sora"` con `font-variant-numeric: tabular-nums`.
- Escala: saldo grande 38px/700 · monto enviar 52px/700 · H1 pantalla 21px/700 ·
  item título 15px/600 · subtítulo 12.5px · labels 12–13px.
- Importar de Google Fonts.

### Radios / espaciado / sombra
- Radios: `sm 10px · md 16px · lg 22px · xl 28px`. Padding lateral de pantalla: **20px**.
- Sombra de tarjeta elevada (oscuro): `0 18px 50px -20px rgba(0,0,0,.8)`.
- Hit targets mínimos **44px** (cumplido en botones, items y teclado).

---

## Navegación (arquitectura)

**Pre-auth (sin tabs):** `Onboarding → Login → (autenticar) → Home`

**Autenticado — `IonTabs` con 5 pestañas:**
1. **Inicio** (`home`)
2. **Movimientos** (`transactions`)
3. **Tarjetas** (`cards`)
4. **Análisis** (`stats`)
5. **Perfil** (`profile`)

**Pushes de stack (sobre la pestaña activa):**
- `Detalle de movimiento` (desde Home o Movimientos)
- `Enviar dinero` → `Confirmación de envío` (desde acción rápida "Enviar")
- `Notificaciones` (desde la campana del header)

Transiciones: usar las nativas de Ionic (`IonRouterOutlet`). En el prototipo son instantáneas a
propósito (para que las capturas no fallen); en Ionic deja las animaciones por defecto.

---

## Pantallas / Vistas

> Para cada una se indica el propósito, el layout y el **mapeo a componentes Ionic**.
> El mismo mapeo está embebido en el prototipo: abre `Nimbo Wallet.html` y activa
> **"Notas Ionic"** (arriba a la derecha) para verlo actualizarse por pantalla.

### 1. Onboarding (`onboarding`)
- **Propósito:** bienvenida + propuesta de valor.
- **Layout:** `ion-content` fullscreen, fondo con degradado radial de acento; logo + titular +
  subtítulo centrados; 3 puntos de paginación; al pie dos botones.
- **Ionic:** `ion-content` · `ion-slides`/`swiper` (3 pasos) · `ion-button expand="block"`
  ("Crear cuenta" solid, "Ya tengo cuenta" `fill="outline"`).

### 2. Login (`login`)
- **Propósito:** ingreso por correo.
- **Layout:** back, titular, campos correo/contraseña, link "¿Olvidaste tu contraseña?", botón
  "Entrar", separador "o continúa con", botones Apple/Google.
- **Ionic:** `ion-input` + `ion-item` (`fill="outline"`, `labelPlacement="stacked"`) ·
  `ion-input type="password"` con `ion-icon` `slot="end"` para toggle de visibilidad ·
  `ion-button` (sociales con `ion-icon slot="start"`).

### 3. Inicio (`home`)
- **Propósito:** resumen: saldo, acciones rápidas, meta de ahorro, movimientos recientes.
- **Layout:** header con avatar (izq) + saludo + campana con badge (der); **tarjeta de saldo** con
  degradado de marca y ojo para ocultar; fila de 4 acciones rápidas (Enviar/Solicitar/Pagar/Cobrar);
  tarjeta de meta de ahorro con barra de progreso (62%); lista de movimientos recientes.
- **Ionic:** `ion-header` (collapse) + `ion-toolbar` (`ion-avatar` slot start, `ion-button`+`ion-badge`
  slot end) · `ion-card` (saldo) · `ion-grid`/`ion-row`/`ion-col` (acciones) · `ion-progress-bar`
  (`value={0.62}`) · `ion-list` + `ion-item button` (movimientos).

### 4. Movimientos (`transactions`)
- **Propósito:** historial completo, buscable y filtrable, agrupado por día.
- **Layout:** título + campana; `ion-searchbar`; filtro Todos/Ingresos/Gastos; encabezados por día
  (Hoy, Ayer, 4 jun…); filas de transacción (icono de categoría + nombre + categoría·hora + monto;
  ingresos en verde con `+`, gastos con `−`).
- **Ionic:** `ion-searchbar` · `ion-segment`/`ion-segment-button` (o `ion-chip`) ·
  `ion-item-divider` sticky (día) · `ion-list` + `ion-item` · opcional `ion-infinite-scroll`.

### 5. Detalle de movimiento (`txdetail`)
- **Propósito:** detalle de una transacción.
- **Layout:** back + "más" (slot end); icono grande + monto + comercio; lista clave/valor
  (Estado con chip "Completado", Fecha, Categoría, Método, Referencia, Comisión); botones
  "Descargar comprobante" y "Reportar un problema" (este último en rojo).
- **Ionic:** `ion-toolbar` + `ion-back-button` · `ion-buttons slot="end"` · `ion-list` `lines="inset"`
  de pares clave/valor · `ion-chip color="success"` · `ion-button fill="outline"`.

### 6. Enviar dinero (`send`) → Confirmación (`sendDone`)
- **Propósito:** elegir contacto e ingresar monto.
- **Layout (paso 1):** `ion-searchbar`; recientes como avatares horizontales; lista "Tus contactos".
- **Layout (paso 2):** chip del destinatario; monto grande; saldo disponible; **teclado numérico
  custom** (3×4, incluye `.` y borrar); botón fijo "Enviar $X" al pie.
- **Confirmación:** ícono de éxito, mensaje, chip "SPEI · llega en segundos", botón "Volver al inicio".
- **Ionic:** `ion-searchbar` + `ion-list` + `ion-avatar` · **teclado propio** con `ion-grid`
  (NO usar teclado nativo para el monto) · `ion-footer` con `ion-button` · pantalla/`ion-modal`
  de éxito.

### 7. Tarjetas (`cards`)
- **Propósito:** ver tarjeta, saldos y controles.
- **Layout:** visual de tarjeta (débito) con degradado, chip, número, titular y logo de red;
  dos tiles (Saldo débito / Crédito disponible); sección "Controles" con dos toggles
  (Congelar tarjeta, Compras en línea); lista "Más opciones" (PIN/CVV, copiar datos, límites,
  tarjeta física).
- **Ionic:** `ion-slides` (carrusel si hay varias tarjetas) · componente **custom** para el visual de
  tarjeta (no es un `ion-` nativo) · `ion-grid` (tiles) · `ion-toggle` dentro de `ion-item` ·
  `ion-list`.

### 8. Análisis / Estadísticas (`stats`)
- **Propósito:** gasto por categoría y tendencia mensual.
- **Layout:** `ion-segment` Semana/Mes/Año; **donut** de gasto por categoría (6 categorías con %)
  con total al centro; **barras** de gasto mensual (6 meses, mes actual resaltado); tarjeta de "Tip
  de ahorro".
- **Ionic:** `ion-segment` · gráficas con **Chart.js / ngx-charts / ApexCharts** (en el prototipo el
  donut es `conic-gradient` y las barras son divs — en producción usa una librería de charts) ·
  `ion-card` como contenedores.

### 9. Perfil (`profile`)
- **Propósito:** datos de cuenta, preferencias, cerrar sesión.
- **Layout:** tarjeta de cabecera (avatar + nombre + email + chip "Verificada"); grupo "Cuenta"
  (Datos personales, Mis cuentas y CLABE, Seguridad y biometría); grupo "Preferencias"
  (Notificaciones, Idioma=Español, Ayuda y soporte); botón "Cerrar sesión" (rojo); versión al pie.
  - ⚠️ El chip "Verificada" debe tener `flex: 0 0 auto` + `white-space: nowrap` y el bloque de
    nombre/email `min-width: 0` con elipsis, para que el chip no se desborde de la tarjeta.
- **Ionic:** `ion-card`/`ion-item` (cabecera, chip = `ion-chip color="success"`) ·
  `ion-list-header` + `ion-list` (grupos) · `ion-item` con `detail` (flecha) ·
  `ion-button color="danger"`.

### 10. Notificaciones (`notifications`)
- **Propósito:** avisos (pagos, seguridad, metas, estados de cuenta).
- **Layout:** back + "Marcar leídas"; lista con icono, título, descripción (multilínea), marca de
  tiempo y punto de no leído.
- **Ionic:** `ion-toolbar` + `ion-back-button` + acción `slot="end"` · `ion-list` + `ion-item`
  (`ion-label` con text-wrap) · `ion-note` (marca de tiempo).

---

## Interacciones & comportamiento
- **Ocultar saldo:** el ojo en la tarjeta de saldo alterna entre el monto y `$ •••••••`.
- **Filtro de movimientos:** Todos/Ingresos/Gastos filtra la lista en cliente.
- **Enviar:** elegir contacto → teclado actualiza el monto y el texto del botón en vivo →
  confirmación → "Volver al inicio" regresa a la pestaña Inicio.
- **Toggles de tarjeta:** Congelar y Compras en línea cambian estado y su texto descriptivo.
- **Tema:** toggle claro/oscuro a nivel app (en el prototipo vive en la barra superior de
  presentación; en Ionic será una preferencia en Perfil + `prefers-color-scheme`).
- **Tab activo:** resalta en color de acento.

## Estado (state)
- `theme: 'dark' | 'light'`
- `authed: boolean`
- Navegación por stack/tabs (en Ionic: router de Ionic, no estado manual)
- `Send`: `recipient`, `amount` (string que construye el teclado)
- `Cards`: `frozen`, `onlinePurchases`
- Datos de ejemplo en `prototipo/data.js` (usuario, transacciones, contactos, categorías, meses).

## Assets
- **Iconos:** set de línea propio (stroke 2px, 24×24) — ver objeto `ICONS` en `components.jsx`.
  En Ionic, sustituir por **Ionicons** (`ion-icon`) con equivalentes (home, swap-horizontal, card,
  bar-chart, person, notifications, search, send, etc.).
- **Imágenes:** no se usan fotos; todo es UI + iconos. No hay assets binarios que migrar.
- **Fuentes:** Google Fonts (Plus Jakarta Sans, Sora).

## Archivos de este paquete
- `prototipo/Nimbo Wallet.html` — entrada; activar "Notas Ionic" para ver el mapeo por pantalla.
- `prototipo/styles.css` — tokens y todos los estilos (fuente de verdad para colores/espaciado).
- `prototipo/data.js` — datos de ejemplo (es-MX).
- `prototipo/components.jsx` — iconos, status bar, tab bar, headers, fila de transacción.
- `prototipo/screens-auth.jsx` — Onboarding, Login.
- `prototipo/screens-core.jsx` — Home, Movimientos, Detalle, Enviar, Confirmación, Notificaciones.
- `prototipo/screens-more.jsx` — Tarjetas, Análisis, Perfil.
- `prototipo/app.jsx` — shell, navegación y el objeto `IONIC_NOTES` (mapeo a componentes Ionic).
- `capturas/` — screenshots de referencia.

---

## ▶️ PROMPT LISTO PARA CLAUDE CODE

> Copia y pega esto en Claude Code, dentro de la carpeta donde quieras crear el proyecto, y arrastra
> también esta carpeta `design_handoff_nimbo/` para que tenga las referencias.

```
Quiero construir "Nimbo", una app móvil de banca personal con Ionic Angular + TypeScript + Capacitor,
para iOS y Android. En esta carpeta (design_handoff_nimbo/) tienes el handoff: lee README.md completo
y usa prototipo/ como referencia visual de alta fidelidad (NO copies el HTML tal cual: recréalo con
componentes Ionic nativos). El mapeo de cada zona a su componente ion-* está en el README y embebido
en el prototipo.

Stack y arquitectura:
- Ionic 7+ con Angular (componentes standalone), TypeScript, Capacitor.
- Routing con Angular Router (provideRouter) + ion-tabs / <ion-router-outlet>. Tabs: Inicio,
  Movimientos, Tarjetas, Análisis, Perfil. Onboarding y Login van fuera de los tabs. Detalle, Enviar
  y Notificaciones son rutas hijas (push) que muestran tab bar según corresponda.
- Importa los componentes de Ionic vía IonicModule o standalone imports (addIcons de ionicons).
- Modo claro/oscuro con CSS variables de Ionic (--ion-*) en theme/variables.css + soporte de clase
  .dark; respeta prefers-color-scheme y deja la preferencia en Perfil (servicio + localStorage).
- Tipografía Plus Jakarta Sans (UI) y Sora (montos, con tabular-nums) desde Google Fonts.
- Iconos con Ionicons (ion-icon).

Empieza por:
1. Crear el proyecto con `ionic start nimbo tabs --type=angular` (standalone).
2. Definir los design tokens del README como variables de Ionic en theme/variables.css (modo claro y
   oscuro) y la tipografía en global.scss.
3. Montar la navegación (tabs + rutas hijas + flujo pre-auth con un AuthGuard simple).
4. Implementar las pantallas en este orden: Inicio, Movimientos, Detalle, Enviar, Tarjetas, Análisis,
   Perfil, Notificaciones, Onboarding, Login. Una carpeta por página con su .page.ts/.html/.scss.
5. Usar datos mock equivalentes a prototipo/data.js (es-MX, MXN) en un DataService (o JSON + service).

Detalles a respetar: tarjeta de saldo con degradado de marca y botón de ocultar; teclado numérico
PROPIO para montos (no el nativo); filtros de movimientos; toggles de tarjeta (congelar / compras en
línea); gráficas de Análisis con una librería de charts (ng2-charts/Chart.js o ngx-charts); chip
"Verificada" sin desbordarse. Formatea moneda con un CurrencyPipe configurado a es-MX/MXN o
Intl.NumberFormat('es-MX', {style:'currency', currency:'MXN'}).

Hazlo pantalla por pantalla y muéstrame el resultado de cada una antes de seguir.
```
