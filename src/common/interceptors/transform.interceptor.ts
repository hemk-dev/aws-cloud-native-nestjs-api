import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { IApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, IApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IApiResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    
    // Skip transformation for metrics endpoint (Prometheus needs plain text)
    if (request.url === '/metrics' || request.url.startsWith('/metrics')) {
      return next.handle() as Observable<any>;
    }
    
    const statusCode = ctx.getResponse().statusCode;

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode,
        message: data?.message || 'Request successful',
        data: data?.message ? data.data : data,
        timestamp: new Date().toISOString(),
        path: request.url,
      })),
    );
  }
}
