import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.writeLog(request, response.statusCode, startedAt);
      }),
      catchError((error: unknown) => {
        const status =
          error instanceof HttpException ? error.getStatus() : 500;
        this.writeLog(request, status, startedAt);
        return throwError(() => error);
      }),
    );
  }

  private writeLog(request: Request, status: number, startedAt: number) {
    const duration = Date.now() - startedAt;
    this.logger.log(
      `${request.method} ${request.originalUrl} -> ${status} -> ${duration} ms`,
    );
  }
}
