import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * L-6: Global exception filter.
 *
 * - In PRODUCTION: returns generic error messages — no stack traces, no internal
 *   Prisma/NestJS internals are ever exposed to the client.
 * - In DEVELOPMENT: returns the full error details for easier debugging.
 *
 * Registered globally in main.ts via app.useGlobalFilters().
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  private readonly isProd = process.env.NODE_ENV === 'production';

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'An unexpected error occurred.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        message = (exceptionResponse as any).message;
      }
    } else if (exception instanceof Error) {
      // Log full error server-side always
      this.logger.error(
        `Unhandled exception on ${request.method} ${request.url}: ${exception.message}`,
        exception.stack,
      );

      // L-6: In production, never expose internal error messages to clients
      message = this.isProd
        ? 'An internal server error occurred.'
        : exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      // Stack trace ONLY in development — never in production
      ...(this.isProd ? {} : { stack: exception instanceof Error ? exception.stack : undefined }),
    });
  }
}
