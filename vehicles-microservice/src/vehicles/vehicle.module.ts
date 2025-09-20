import { Module } from '@nestjs/common';
import { VehicleService } from './service/vehicle.service';
import { VehiclesConsumer } from './consumer/vehicles.consumer';
import { VehicleRepository } from './repository/vehicle.repository';
import { RedisService } from '../redis/service/redis.service';

@Module({
  controllers: [VehiclesConsumer],
  providers: [VehicleService, VehicleRepository, RedisService],
  exports: [VehicleService],
})
export class VehicleModule {}
