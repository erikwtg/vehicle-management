import { Module } from '@nestjs/common';
import { CircuitBreakerService } from './service/circuit-breaker.service';

@Module({
  providers: [CircuitBreakerService],
  exports: [CircuitBreakerService],
})
export class CircuitBreakerModule {}
