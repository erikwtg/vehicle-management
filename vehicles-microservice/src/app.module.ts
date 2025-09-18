import { Module } from '@nestjs/common';
import { VehiclesConsumer } from './vehicles/consumer/vehicles.consumer';
import { VehicleModule } from './vehicles/vehicle.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [VehicleModule, RedisModule],
  controllers: [VehiclesConsumer],
})
export class AppModule {}
