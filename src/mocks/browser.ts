import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/** Service worker de MSW para el navegador (intercepta peticiones REST). */
export const worker = setupWorker(...handlers);

/**
 * Arranca MSW. El worker se sirve desde `assets/` (config de Angular), por eso
 * se fija la URL. Peticiones no manejadas pasan de largo (`bypass`).
 */
export function startMockServiceWorker(): Promise<unknown> {
  return worker.start({
    serviceWorker: { url: 'assets/mockServiceWorker.js' },
    onUnhandledRequest: 'bypass',
  });
}
