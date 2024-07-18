import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { Observable, throwError, catchError } from 'rxjs';

function mapError(err: Error) {
  if (err.message === 'Related Entity Not Found') {
    return throwError(() => new NotFoundException(err.message));
  }
  if (err.message === 'Wrong Position Value') {
    return throwError(() => new BadRequestException(err.message));
  }
  if (err.message === 'Unauthorized') {
    return throwError(() => new UnauthorizedException());
  }
  return throwError(() => err); // weird rethrow, is it how it should be done?
}

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(catchError(mapError));
  }
}
