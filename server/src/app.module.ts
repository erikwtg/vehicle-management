import { Module } from '@nestjs/common';
import { VehicleModule } from './vehicle/vehicle.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [VehicleModule, CommonModule],
})
export class AppModule {}
