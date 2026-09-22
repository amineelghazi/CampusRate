import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

const types: Record<number, string> = {
  400: '/problems/validation-error',
  404: '/problems/not-found',
  409: '/problems/conflict',
  500: '/problems/internal-error',
};

const titles: Record<number, string> = {
  400: 'Invalid request',
  404: 'Resource not found',
  409: 'Conflict with current state',
  500: 'Internal server error',
};

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();

    let status = 500;
    let detail = 'An unexpected error occurred.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body: any = exception.getResponse();
      detail = Array.isArray(body.message) ? body.message.join(', ') : body.message;
    } else if (exception.status === 400) {
      status = 400;
      detail = 'Malformed request body.';
    }

    response.status(status).type('application/problem+json').json({
      type: types[status] ?? 'about:blank',
      title: titles[status] ?? 'Error',
      status: status,
      detail: detail,
      instance: request.originalUrl,
    });
  }
}