import { RpcException } from '@nestjs/microservices';

export class VehicleNotFoundError extends RpcException {
  constructor(message = 'Veículo não encontrado') {
    super({ message, statusCode: 404 });
  }
}

export class VehicleAlreadyExistsError extends RpcException {
  constructor(message = 'Veículo já existe') {
    super({ message, statusCode: 409 });
  }
}

export class VehicleIdempotencyError extends RpcException {
  constructor(message = 'Veículo já foi processado') {
    super({ message, statusCode: 409 });
  }
}
