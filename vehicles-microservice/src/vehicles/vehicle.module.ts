import { Module } from '@nestjs/common';
import { VehicleService } from './service/vehicle.service';
import { VehiclesConsumer } from './consumer/vehicles.consumer';
import { VehicleRepository } from './repository/vehicle.repository';

@Module({
  controllers: [VehiclesConsumer],
  providers: [VehicleService, VehicleRepository],
  exports: [VehicleService],
})
export class VehicleModule {}
