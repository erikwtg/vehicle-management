import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { VehicleRepository } from '../repository/vehicle.repository';

@Injectable()
export class VehicleService {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const vehicle =
      await this.vehicleRepository.createVehicle<CreateVehicleDto>(
        createVehicleDto,
      );

    if (!vehicle) {
      throw new NotFoundException('Veículo não foi cadastrado');
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
      throw new NotFoundException('Veículo não foi atualizado');
    }

    return updatedVehicle;
  }

  async remove(id: number) {
    const removedVehicle = await this.vehicleRepository.deleteVehicle(id);

    if (!removedVehicle) {
      throw new NotFoundException('Veículo não foi removido');
    }

    return removedVehicle;
  }

  async findAll() {
    const vehicles = await this.vehicleRepository.getAllVehicles();

    if (!vehicles) {
      throw new NotFoundException('Nenhum veículo encontrado');
    }

    return vehicles;
  }

  async findOne(id: number) {
    const vehicle = await this.vehicleRepository.getVehicleById(id);

    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    return vehicle;
  }
}
