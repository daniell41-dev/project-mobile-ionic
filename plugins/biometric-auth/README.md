# biometric-auth (plugin Capacitor propio)

Plugin Capacitor desarrollado para Nimbo que expone la **autenticación biométrica**
del dispositivo (huella / rostro).

## API

```ts
import { BiometricAuth } from 'biometric-auth';

const { available } = await BiometricAuth.isAvailable();
if (available) {
  const { verified } = await BiometricAuth.authenticate({ reason: 'Desbloquea Nimbo' });
}
```

| Método | Descripción |
|--------|-------------|
| `isAvailable()` | `{ available, reason? }` — si el dispositivo tiene biometría configurada. |
| `authenticate({ reason })` | `{ verified }` — lanza el prompt biométrico del sistema. |

## Implementaciones

- **Android** (`android/`): `androidx.biometric.BiometricPrompt` con autenticadores
  `BIOMETRIC_STRONG`, respaldado por el **Keystore**. Ver `BiometricAuthPlugin.kt`.
- **iOS**: usaría `LocalAuthentication` (Face ID / Touch ID). Pendiente de compilar
  (requiere Xcode / macOS).
- **Web** (`src/web.ts`): no hay biometría del sistema → `isAvailable: false` y
  `authenticate` resuelve `verified: true` (degradación para la demo PWA).

## Estructura

```
plugins/biometric-auth/
├── src/
│   ├── definitions.ts   # contrato (interfaz del plugin)
│   ├── web.ts           # implementación web (WebPlugin)
│   └── index.ts         # registerPlugin('BiometricAuth')
├── android/             # implementación Kotlin (BiometricPrompt + Keystore)
├── package.json
└── README.md
```

## Consumo en la app

El proyecto lo consume con un *path mapping* de TypeScript (`biometric-auth` →
`plugins/biometric-auth/src/index.ts`) y lo envuelve en `core/services/biometric.service.ts`.
En un proyecto real se publicaría como paquete npm e instalaría con `pnpm add` + `npx cap sync`.
