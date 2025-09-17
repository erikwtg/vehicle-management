import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { VehicleService } from '../service/vehicle.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { CursorPaginationDto } from 'src/common/dto/cursor-pagination.dto';

@Controller()
export class VehiclesConsumer {
  private readonly logger = new Logger(VehiclesConsumer.name);

  constructor(private readonly vehicleService: VehicleService) {}

  @MessagePattern('vehicle_created_rpc')
  async handleVehicleCreated(@Payload() data: CreateVehicleDto) {
    const createdVehicle = await this.vehicleService.create(data);
    this.logger.log('Veículo criado: ' + JSON.stringify(createdVehicle));
    return createdVehicle;
  }

  @EventPattern('vehicle_created_event')
  async handleVehicleCreatedNotification(@Payload() data: CreateVehicleDto) {
    await this.vehicleService.create(data);
    this.logger.log('Veículo criado: ' + JSON.stringify(data));
  }

  @MessagePattern('vehicle_updated_rpc')
  async handleVehicleUpdated(@Payload() data: UpdateVehicleDto) {
    const updatedVehicle = await this.vehicleService.update(data.id, data);
    this.logger.log('Veículo atualizado: ' + JSON.stringify(updatedVehicle));
    return updatedVehicle;
  }

  @EventPattern('vehicle_updated_event')
  async handleVehicleUpdatedNotification(@Payload() data: UpdateVehicleDto) {
    await this.vehicleService.update(data.id, data);
    this.logger.log('Veículo atualizado: ' + JSON.stringify(data));
  }

  @MessagePattern('vehicle_deleted_rpc')
  async handleVehicleDeleted(@Payload() id: number) {
    const deletedVehicle = await this.vehicleService.remove(id);
    this.logger.log('Veículo deletado: ' + JSON.stringify(deletedVehicle));
    return deletedVehicle;
  }

  @EventPattern('vehicle_deleted_event')
  async handleVehicleDeletedNotification(@Payload() id: number) {
    await this.vehicleService.remove(id);
    this.logger.log('Veículo deletado: ' + JSON.stringify(id));
  }

  @MessagePattern('vehicles_get_all_rpc')
  async handleVehicleGetAll(@Payload() pagination: CursorPaginationDto) {
    return await this.vehicleService.findAll(pagination);
  }

  @MessagePattern('vehicles_get_one_rpc')
  async handleVehicleGetOne(@Payload() id: number) {
    return await this.vehicleService.findOne(id);
  }
}
