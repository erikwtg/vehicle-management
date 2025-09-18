import { Module } from '@nestjs/common';
import { VehicleService } from './service/vehicle.service';
import { VehicleController } from './controller/vehicle.controller';
import { VehiclesPublisher } from './gateway/vehicles.publisher';
import { CircuitBreakerService } from 'src/common/circuit-breaker/service/circuit-breaker.service';

@Module({
  controllers: [VehicleController],
  providers: [VehicleService, VehiclesPublisher, CircuitBreakerService],
})
export class VehicleModule {}
