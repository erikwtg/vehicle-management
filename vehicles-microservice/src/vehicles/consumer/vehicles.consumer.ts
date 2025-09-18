import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { VehicleService } from '../service/vehicle.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { CursorPaginationDto } from 'src/common/dto/cursor-pagination.dto';
import { VehicleIdempotencyError } from 'src/common/errors/vehicle.errors';

@Controller()
export class VehiclesConsumer {
  private readonly logger = new Logger(VehiclesConsumer.name);

  constructor(private readonly vehicleService: VehicleService) {}

  @MessagePattern('vehicle_created_rpc')
  async handleVehicleCreated(
    @Payload() data: CreateVehicleDto,
    @Ctx() context: RmqContext,
  ) {
    const msgId = context.getMessage().properties.messageId;
    const key = `vehicle:${data.plate}:${data.chassis}:${msgId}`;

    const exists = await this.vehicleService.getVehicleIdempotency(key);
    if (exists) {
      throw new VehicleIdempotencyError('Veículo já foi processado');
    }

    const createdVehicle = await this.vehicleService.create(data);

    await this.vehicleService.setVehicleIdempotency(
      key,
      String(createdVehicle.id),
    );

    return createdVehicle;
  }

  @EventPattern('vehicle_created_event')
  handleVehicleCreatedNotification(@Payload() data: CreateVehicleDto) {
    this.logger.log('[EVENT] - Veículo criado: ' + JSON.stringify(data));
  }

  @MessagePattern('vehicle_updated_rpc')
  async handleVehicleUpdated(@Payload() data: UpdateVehicleDto) {
    const updatedVehicle = await this.vehicleService.update(data.id, data);
    return updatedVehicle;
  }

  @EventPattern('vehicle_updated_event')
  handleVehicleUpdatedNotification(@Payload() data: UpdateVehicleDto) {
    this.logger.log('[EVENT] - Veículo atualizado: ' + JSON.stringify(data));
  }

  @MessagePattern('vehicle_deleted_rpc')
  async handleVehicleDeleted(@Payload() id: number) {
    const deletedVehicle = await this.vehicleService.remove(id);
    return deletedVehicle;
  }

  @EventPattern('vehicle_deleted_event')
  handleVehicleDeletedNotification(@Payload() id: number) {
    this.logger.log('[EVENT] - Veículo deletado: ' + JSON.stringify(id));
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
