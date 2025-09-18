import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { VehicleRepository } from '../repository/vehicle.repository';
import { CursorPaginationDto } from 'src/common/dto/cursor-pagination.dto';
import {
  VehicleNotFoundError,
  VehicleAlreadyExistsError,
} from 'src/common/errors/vehicle.errors';
import { RedisService } from 'src/redis/service/redis.service';

@Injectable()
export class VehicleService {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly redisService: RedisService,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const vehicle =
      await this.vehicleRepository.createVehicle<CreateVehicleDto>(
        createVehicleDto,
      );

    if (!vehicle) {
      throw new VehicleAlreadyExistsError('Veículo já foi cadastrado');
    }

    return vehicle;
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    const updatedVehicle =
      await this.vehicleRepository.updateVehicle<UpdateVehicleDto>(
        id,
        updateVehicleDto,
      );

    if (!updatedVehicle) {
      throw new VehicleNotFoundError('Veículo não foi encontrado');
    }

    return updatedVehicle;
  }

  async remove(id: number) {
    const removedVehicle = await this.vehicleRepository.deleteVehicle(id);

    if (!removedVehicle) {
      throw new VehicleNotFoundError('Veículo não foi encontrado');
    }

    return removedVehicle;
  }

  async findAll(pagination: CursorPaginationDto) {
    const vehicles = await this.vehicleRepository.getAllVehicles(pagination);

    if (!vehicles) {
      throw new VehicleNotFoundError('Nenhum veículo encontrado');
    }

    return vehicles;
  }

  async findOne(id: number) {
    const vehicle = await this.vehicleRepository.getVehicleById(id);

    if (!vehicle) {
      throw new VehicleNotFoundError('Veículo não encontrado');
    }

    return vehicle;
  }

  async setVehicleIdempotency(key: string, value: string) {
    await this.redisService.set(key, value);
  }

  async getVehicleIdempotency(key: string) {
    return await this.redisService.get(key);
  }
}
