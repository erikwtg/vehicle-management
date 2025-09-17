import { ExceptionFilter, Catch, HttpException, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name);

  catch(exception: unknown) {
    let message = 'Internal RPC error';

    if (exception instanceof RpcException) {
      message = exception.message;
    } else if (exception instanceof HttpException) {
      message = exception.message;
    }

    this.logger.error(`RPC Error: ${JSON.stringify(message)}`);

    return throwError(() => new RpcException(message));
  }
}
