import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

const logger = new Logger('HttpLogger');

export function httpLoggingMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const startedAt = Date.now();

  response.on('finish', () => {
    const duration = Date.now() - startedAt;
    logger.log(
      `${request.method} ${request.originalUrl} -> ${response.statusCode} -> ${duration} ms`,
    );
  });

  next();
}
