import { ExceptionFilter, Catch, HttpException, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name);

  catch(exception: unknown) {
    let payload: any = { message: 'Internal RPC error', statusCode: 500 };

    if (exception instanceof RpcException) {
      payload = exception.getError() || payload;
    }

    if (exception instanceof Error && 'statusCode' in exception) {
      payload = {
        message: exception.message,
        statusCode: (exception as any).statusCode,
      };
    }

    if (exception instanceof HttpException) {
      payload = {
        message: exception.message,
        statusCode: exception.getStatus(),
      };
    }

    this.logger.error(`RPC Error: ${JSON.stringify(payload)}`);

    return throwError(() => new RpcException(payload));
  }
}
