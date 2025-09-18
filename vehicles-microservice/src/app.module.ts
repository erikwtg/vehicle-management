import { Module } from '@nestjs/common';
import { VehiclesConsumer } from './vehicles/consumer/vehicles.consumer';
import { VehicleModule } from './vehicles/vehicle.module';
import { RedisModule } from './redis/redis.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [VehicleModule, RedisModule, CommonModule],
  controllers: [VehiclesConsumer],
})
export class AppModule {}
