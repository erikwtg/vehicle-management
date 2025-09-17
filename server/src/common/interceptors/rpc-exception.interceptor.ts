import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RpcErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        let rpcPayload = error?.error || error?.message || error;

        if (typeof rpcPayload === 'string') {
          try {
            rpcPayload = JSON.parse(rpcPayload);
          } catch {
            // mantém string
          }
        }

        const statusCode =
          rpcPayload?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = rpcPayload?.message || 'Erro RPC';

        return throwError(
          () => new HttpException(message as string, statusCode as number),
        );
      }),
    );
  }
}
