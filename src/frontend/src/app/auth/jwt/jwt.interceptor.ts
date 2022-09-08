import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { JwtService } from './jwt.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private jwt: JwtService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (request.url.startsWith(environment.backend)) {
      return this.jwt.getToken$().pipe(
        switchMap((token) => {
          if (token)
            request = request.clone({
              setHeaders: { Authorization: `Bearer ${token}` },
            });
          return next.handle(request);
        }),
      );
    }
    return next.handle(request);
  }
}
