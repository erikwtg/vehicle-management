import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { VehiclesConsumer } from './vehicles/consumer/vehicles.consumer';
import { VehicleModule } from './vehicles/vehicle.module';

@Module({
  imports: [VehicleModule],
  controllers: [VehiclesConsumer],
  providers: [AppService],
})
export class AppModule {}
