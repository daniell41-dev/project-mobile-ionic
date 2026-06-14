/**
 * API del plugin Capacitor `BiometricAuth`.
 *
 * Plugin propio que expone la autenticación biométrica del dispositivo
 * (huella / rostro). La implementación nativa Android usa `BiometricPrompt`
 * respaldado por el Keystore; iOS usaría `LocalAuthentication` (Face/Touch ID).
 */
export interface BiometricAuthPlugin {
  /** Indica si el dispositivo tiene biometría disponible y configurada. */
  isAvailable(): Promise<IsAvailableResult>;

  /** Lanza el prompt biométrico del sistema. Resuelve con el resultado. */
  authenticate(options: AuthenticateOptions): Promise<AuthenticateResult>;
}

export interface IsAvailableResult {
  available: boolean;
  /** Motivo cuando no está disponible (sin hardware, no enrolado, etc.). */
  reason?: string;
}

export interface AuthenticateOptions {
  /** Texto mostrado al usuario en el prompt del sistema. */
  reason: string;
}

export interface AuthenticateResult {
  verified: boolean;
}
