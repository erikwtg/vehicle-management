import { RpcException } from '@nestjs/microservices';

export class RpcServiceUnavailableError extends RpcException {
  constructor(message = 'Serviço temporariamente indisponível') {
    super({ message, statusCode: 503 });
  }
}
