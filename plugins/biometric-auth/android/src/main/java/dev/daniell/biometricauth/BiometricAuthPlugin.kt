package dev.daniell.biometricauth

import androidx.appcompat.app.AppCompatActivity
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricManager.Authenticators.BIOMETRIC_STRONG
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

/**
 * Implementación Android del plugin BiometricAuth.
 *
 * Usa androidx.biometric.BiometricPrompt (huella / rostro) con autenticadores
 * BIOMETRIC_STRONG, respaldados por el Keystore del sistema. Expone dos métodos
 * al puente JS: isAvailable() y authenticate().
 */
@CapacitorPlugin(name = "BiometricAuth")
class BiometricAuthPlugin : Plugin() {

    @PluginMethod
    fun isAvailable(call: PluginCall) {
        val manager = BiometricManager.from(context)
        val status = manager.canAuthenticate(BIOMETRIC_STRONG)
        val available = status == BiometricManager.BIOMETRIC_SUCCESS

        val result = JSObject()
        result.put("available", available)
        if (!available) {
            result.put("reason", reasonFor(status))
        }
        call.resolve(result)
    }

    @PluginMethod
    fun authenticate(call: PluginCall) {
        val reason = call.getString("reason") ?: "Verifica tu identidad"
        val activity = activity as? AppCompatActivity
            ?: run { call.reject("Activity no disponible"); return }

        activity.runOnUiThread {
            val executor = ContextCompat.getMainExecutor(context)
            val prompt = BiometricPrompt(
                activity,
                executor,
                object : BiometricPrompt.AuthenticationCallback() {
                    override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                        val res = JSObject()
                        res.put("verified", true)
                        call.resolve(res)
                    }

                    override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                        val res = JSObject()
                        res.put("verified", false)
                        call.resolve(res)
                    }
                }
            )

            val info = BiometricPrompt.PromptInfo.Builder()
                .setTitle("Autenticación")
                .setSubtitle(reason)
                .setNegativeButtonText("Cancelar")
                .setAllowedAuthenticators(BIOMETRIC_STRONG)
                .build()

            prompt.authenticate(info)
        }
    }

    private fun reasonFor(status: Int): String = when (status) {
        BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE -> "Sin hardware biométrico"
        BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE -> "Hardware no disponible"
        BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED -> "Sin biometría registrada"
        else -> "Biometría no disponible"
    }
}
