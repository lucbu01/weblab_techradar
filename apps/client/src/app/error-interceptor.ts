import { inject } from '@angular/core';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function errorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const snackBar = inject(MatSnackBar);
  return next(req).pipe(
    catchError(() => {
      const errorMessage =
        'Bei der Kommunikation mit dem Server ist ein Fehler aufgetreten. Bitte versuche es noch einmal.';
      snackBar.open(errorMessage, 'OK', {
        duration: 5000,
      });
      return throwError(() => new Error(errorMessage));
    }),
  );
}
