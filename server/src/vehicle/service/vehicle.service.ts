import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { ReturnVehicleDto } from '../dto/return-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { VehiclesPublisher } from '../gateway/vehicles.publisher';

@Injectable()
export class VehicleService {
  constructor(private readonly vehiclesPublisher: VehiclesPublisher) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const createdVehicle = await this.vehiclesPublisher.requestWithData<
      CreateVehicleDto,
      ReturnVehicleDto
    >('vehicle_created_rpc', createVehicleDto);

    if (!createdVehicle) {
      throw new NotFoundException('Veículo não foi criado');
    }

    this.vehiclesPublisher.publish('vehicle_created_event', createVehicleDto);

    return createdVehicle;
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    const updatedVehicle = await this.vehiclesPublisher.requestWithData<
      UpdateVehicleDto,
      ReturnVehicleDto
    >('vehicle_updated_rpc', { id, ...updateVehicleDto });

    if (!updatedVehicle) {
      throw new NotFoundException('Veículo não foi atualizado');
    }

    this.vehiclesPublisher.publish('vehicle_updated_event', {
      id,
      ...updateVehicleDto,
    });

    if (!updatedVehicle) {
      throw new NotFoundException('Veículo não foi atualizado');
    }

    return updatedVehicle;
  }

  async remove(id: number): Promise<ReturnVehicleDto> {
    const removedVehicle =
      await this.vehiclesPublisher.requestWithId<ReturnVehicleDto>(
        'vehicle_deleted_rpc',
        id,
      );

    if (!removedVehicle) {
      throw new NotFoundException('Veículo não foi removido');
    }

    this.vehiclesPublisher.publish('vehicle_deleted_event', id);

    return removedVehicle;
  }

  async findAll(): Promise<ReturnVehicleDto[]> {
    const vehicles = await this.vehiclesPublisher.requestWithoutId<
      ReturnVehicleDto[]
    >('vehicles_get_all_rpc');

    if (!vehicles) {
      throw new NotFoundException('Nenhum veículo foi encontrado');
    }

    return vehicles;
  }

  async findOne(id: number): Promise<ReturnVehicleDto> {
    const vehicle =
      await this.vehiclesPublisher.requestWithId<ReturnVehicleDto>(
        'vehicles_get_one_rpc',
        id,
      );

    if (!vehicle) {
      throw new NotFoundException('Veículo não foi encontrado');
    }

    return vehicle;
  }
}
