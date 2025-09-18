import { Module } from '@nestjs/common';
import { RpcErrorInterceptor } from './interceptors/rpc-exception.interceptor';
import { ExceptionsFilter } from './filters/http-exception.filter';
import { CircuitBreakerModule } from './circuit-breaker/circuit-breaker.module';

@Module({
  imports: [CircuitBreakerModule],
  providers: [RpcErrorInterceptor, ExceptionsFilter],
  exports: [CircuitBreakerModule],
})
export class CommonModule {}
