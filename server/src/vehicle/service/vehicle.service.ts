import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { ReturnVehicleDto } from '../dto/return-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { CursorPaginationDto } from 'src/common/dto/cursor-pagination.dto';
import { VehiclesPublisher } from '../gateway/vehicles.publisher';
import { CursorPaginationResult } from '../types/pagination-result.type';

@Injectable()
export class VehicleService {
  constructor(private readonly vehiclesPublisher: VehiclesPublisher) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const createdVehicle = await this.vehiclesPublisher.requestWithData<
      CreateVehicleDto,
      ReturnVehicleDto
    >('vehicle_created_rpc', createVehicleDto);

    this.vehiclesPublisher.publish('vehicle_created_event', createVehicleDto);

    return createdVehicle;
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    const updatedVehicle = await this.vehiclesPublisher.requestWithData<
      UpdateVehicleDto,
      ReturnVehicleDto
    >('vehicle_updated_rpc', { id, ...updateVehicleDto });

    this.vehiclesPublisher.publish('vehicle_updated_event', {
      id,
      ...updateVehicleDto,
    });

    return updatedVehicle;
  }

  async remove(id: number): Promise<ReturnVehicleDto> {
    const removedVehicle =
      await this.vehiclesPublisher.requestWithId<ReturnVehicleDto>(
        'vehicle_deleted_rpc',
        id,
      );

    this.vehiclesPublisher.publish('vehicle_deleted_event', id);

    return removedVehicle;
  }

  async findAll(
    pagination: CursorPaginationDto,
  ): Promise<CursorPaginationResult<ReturnVehicleDto>> {
    const vehicles = await this.vehiclesPublisher.requestWithoutId<
      ReturnVehicleDto[]
    >('vehicles_get_all_rpc', pagination);

    return {
      data: vehicles,
      nextCursor: vehicles.length ? vehicles[vehicles.length - 1].id : null,
    };
  }

  async findOne(id: number): Promise<CursorPaginationResult<ReturnVehicleDto>> {
    const vehicle =
      await this.vehiclesPublisher.requestWithId<ReturnVehicleDto>(
        'vehicles_get_one_rpc',
        id,
      );

    return {
      data: vehicle,
      nextCursor: null,
    };
  }
}
