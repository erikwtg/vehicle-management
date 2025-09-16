import { Module } from '@nestjs/common';
import { VehicleService } from './service/vehicle.service';
import { VehicleController } from './controller/vehicle.controller';
import { VehiclesPublisher } from './gateway/vehicles.publisher';

@Module({
  controllers: [VehicleController],
  providers: [VehicleService, VehiclesPublisher],
})
export class VehicleModule {}
