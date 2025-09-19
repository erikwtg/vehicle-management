import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { ReturnVehicleDto } from '../dto/return-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { CursorPaginationDto } from 'src/common/dto/cursor-pagination.dto';
import { VehiclesPublisher } from '../gateway/vehicles.publisher';
import { CursorPaginationResult } from '../types/pagination-result.type';
import { CircuitBreakerService } from 'src/common/circuit-breaker/service/circuit-breaker.service';

@Injectable()
export class VehicleService implements OnModuleInit {
  constructor(
    private readonly vehiclesPublisher: VehiclesPublisher,
    private readonly circuitBreakerService: CircuitBreakerService,
  ) {}

  onModuleInit() {
    this.circuitBreakerService.create<[CreateVehicleDto], ReturnVehicleDto>(
      'vehicle_create',
      (dto) =>
        this.vehiclesPublisher.requestWithData('vehicle_created_rpc', dto),
    );

    this.circuitBreakerService.create<
      [UpdateVehicleDto & { id: number }],
      ReturnVehicleDto
    >('vehicle_update', (payload) =>
      this.vehiclesPublisher.requestWithData('vehicle_updated_rpc', payload),
    );
  }

  async create(createVehicleDto: CreateVehicleDto): Promise<ReturnVehicleDto> {
    const createdVehicle = await this.circuitBreakerService.call<
      [CreateVehicleDto],
      ReturnVehicleDto
    >('vehicle_create', createVehicleDto);

    this.vehiclesPublisher.publish('vehicle_created_event', createVehicleDto);

    return createdVehicle;
  }

  async update(
    id: number,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<ReturnVehicleDto> {
    const updatedVehicle = await this.circuitBreakerService.call<
      [UpdateVehicleDto & { id: number }],
      ReturnVehicleDto
    >('vehicle_update', { id, ...updateVehicleDto });

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
    >('vehicles_get_all_rpc', { ...pagination, limit: pagination.limit + 1 });

    const hasMore = vehicles.length > pagination.limit;
    const data = vehicles.slice(0, pagination.limit);

    return {
      data,
      nextCursor: hasMore ? data[data.length - 1].id : null,
      hasMore,
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
      hasMore: false,
    };
  }
}
