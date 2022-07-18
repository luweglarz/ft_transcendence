import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private jwt: JwtService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (request.url.startsWith('http://localhost:3000')) {
      const token = this.jwt.getToken();
      if (token)
        request = request.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
    }
    return next.handle(request);
  }
}
