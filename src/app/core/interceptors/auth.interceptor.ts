import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Adjunta el token Bearer a cada petición saliente cuando hay sesión activa.
 * Es la base de la integración REST: toda llamada HttpClient queda autenticada
 * sin que cada servicio tenga que gestionar cabeceras (DRY, Single Responsibility).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  if (!token) return next(req);

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
  return next(authReq);
};
