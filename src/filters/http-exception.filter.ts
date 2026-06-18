import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

type ExceptionResponse = {
  message?: string | string[];
  details?: unknown;
};

function extractMessage(exception: HttpException): string | string[] | null {
  const raw = exception.getResponse();
  if (typeof raw === 'string') return raw;
  if (typeof raw === 'object' && raw !== null) {
    return (raw as ExceptionResponse).message ?? null;
  }
  return null;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = exception.getStatus();
    const message = extractMessage(exception);

    if (statusCode === HttpStatus.UNPROCESSABLE_ENTITY) {
      return response.status(statusCode).json({
        status: statusCode,
        error: { code: 'UNPROCESSABLE_ENTITY', message },
      });
    }

    if (
      statusCode === HttpStatus.CONFLICT ||
      statusCode === HttpStatus.NOT_FOUND ||
      statusCode === HttpStatus.FORBIDDEN ||
      statusCode === HttpStatus.UNAUTHORIZED
    ) {
      return response.status(statusCode).json({
        status: statusCode,
        error: message,
      });
    }

    if (statusCode === HttpStatus.BAD_REQUEST) {
      let details: Record<string, string> | string | string[] | null = null;
      if (Array.isArray(message)) {
        details = {};
        for (const msg of message) {
          const field = msg.split(' ')[0];
          details[field] = msg.replace(new RegExp(`^${field} `), '');
        }
      } else {
        details = message;
      }
      return response.status(statusCode).json({
        status: statusCode,
        error: {
          code: 'BAD_REQUEST',
          message: 'Invalid request body',
          details,
        },
      });
    }

    const isDev = process.env.NODE_ENV !== 'production';
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: isDev
          ? (message ?? 'Internal server error')
          : 'Internal server error',
      },
    });
  }
}
