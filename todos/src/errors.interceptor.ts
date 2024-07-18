import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { Observable, throwError, catchError } from 'rxjs';
import { EntityNotFoundError } from 'typeorm';

function mapError(err: Error) {
  if (err instanceof EntityNotFoundError) {
    return throwError(() => new RpcException('Related Entity Not Found'));
  }
  // TODO: map Validation Errors
  return throwError(() => err); // weird rethrow, is it how it should be done?
}

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(catchError(mapError));
  }
}
