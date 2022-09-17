import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { map, tap, Observable, take, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ValidatorBuilderService {
  constructor(private http: HttpClient) {}

  isAvailable(field: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const check$ = this.http
        .get<{ exists: boolean }>(
          `${environment.backend}/auth/exists/${field}/${control.value}`,
        )
        .pipe(
          catchError((err) => {
            console.error(err);
            return of(null);
          }),
          take(1),
          // tap((value) => console.log(value)),
          map(
            (value) => (value?.exists ? { isAvailable: 'unavailable' } : null),
            // note: can't use {isAvailable: false},
            // because we want to test `if (username.errors.isAvailable)
            // and *ngIf="'isAvailable' in username.errors" works but unfortunately logs an error
          ),
        );
      return check$;
    };
  }
}
