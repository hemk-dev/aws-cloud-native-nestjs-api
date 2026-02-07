import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { IApiResponse } from '../interfaces/api-response.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error: string | object | undefined;

    // Handle ThrottlerException with custom message format
    if (exception instanceof ThrottlerException) {
      statusCode = HttpStatus.TOO_MANY_REQUESTS;
      message = 'Too many requests, please try again later.';
      error = 'Too Many Requests';
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const res = exceptionResponse as Record<string, any>;

        // Handle class-validator errors (field-level messages)
        if (Array.isArray(res.message)) {
          message = 'Validation failed';
          const fieldErrors: Record<string, string[]> = {};
          for (const msg of res.message) {
            if (typeof msg === 'string') {
              // Try to extract field name from validation message
              const parts = msg.split(' ');
              const field = parts[0] || 'general';
              if (!fieldErrors[field]) {
                fieldErrors[field] = [];
              }
              fieldErrors[field].push(msg);
            }
          }
          error = fieldErrors;
        } else {
          message = (res.message as string) || message;
          if (res.error) {
            error = res.error as string;
          }
        }
      }
    } else {
      this.logger.error(
        'Unhandled exception',
        exception instanceof Error ? exception.stack : String(exception),
      );
      error = 'An unexpected error occurred';
    }

    const errorResponse: IApiResponse<null> = {
      success: false,
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(statusCode).json(errorResponse);
  }
}
