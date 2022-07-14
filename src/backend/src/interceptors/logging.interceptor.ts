import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const now = Date.now();

    this.logger.debug(
      `
📩 ${request.method} ${request.url}
Headers: ${JSON.stringify(request.headers, null, 2)}
Body: ${JSON.stringify(request.body, null, 2)}
Handled by: ${context.getClass().name}.${context.getHandler().name}()`,
    );

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<Response>();
        this.logger.debug(`🚀 [${response.statusCode}] (took: ${
          Date.now() - now
        }ms)
        `);
        // this.logger.debug(JSON.stringify(res, null, 2)); // to print the body (with `tap((res) => ...`))
      }),
    );
  }
}
