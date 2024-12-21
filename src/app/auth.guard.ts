import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseService } from './services/firebase.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const firebaseService = inject(FirebaseService);
  const router = inject(Router);

  return new Observable<boolean>((subscriber) => {
    firebaseService.observeUser((user) => {
      if (user) {
        subscriber.next(true); // Usuário autenticado
        router.navigate(["/dashboard"]);
        subscriber.complete();
      } else {
        router.navigate(['/home']); // Redireciona se não autenticado
        subscriber.next(false);
        subscriber.complete();
      }
    });
  });
};
