import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    const statusCode = exception.getStatus();

    if (statusCode === HttpStatus.UNPROCESSABLE_ENTITY) {
      return response.status(statusCode).json({
        status: statusCode,
        error: {
          code: 'UNPROCESSABLE_ENTITY',
          message: exception['response']['message'] || null,
        },
      });
    } else if (statusCode === HttpStatus.CONFLICT) {
      return response.status(statusCode).json({
        status: statusCode,
        error: exception['response']['message'] || null,
      });
    } else if (statusCode === HttpStatus.NOT_FOUND) {
      return response.status(statusCode).json({
        status: statusCode,
        error: exception['response']['message'] || null,
      });
    } else if (statusCode === HttpStatus.FORBIDDEN) {
      return response.status(statusCode).json({
        status: statusCode,
        error: exception['response']['message'] || null,
      });
    } else if (statusCode === HttpStatus.UNAUTHORIZED) {
      return response.status(statusCode).json({
        status: statusCode,
        error: exception['response']['message'] || null,
      });
    } else if (statusCode === HttpStatus.BAD_REQUEST) {
      let error = {};
      try {
        if (Array.isArray(exception['response']['message'])) {
          for (const message of exception['response']['message']) {
            const firstString = message.split(' ')[0];
            error[firstString] = message.replace(
              new RegExp(`^${firstString} `),
              '',
            );
          }
        } else {
          error = exception['response']['message'];
        }
      } catch (e) {
        error = exception['response']['message'];
      }
      return response.status(statusCode).json({
        status: statusCode,
        error: {
          code: 'BAD_REQUEST',
          message: 'Invalid request body',
          details: error,
        },
      });
    } else {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: exception['response']['message'] || 'internal server error',
          details: exception['response']['details'] || null,
        },
      });
    }
  }
}
