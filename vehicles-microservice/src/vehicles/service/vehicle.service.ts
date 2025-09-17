import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { VehicleRepository } from '../repository/vehicle.repository';

@Injectable()
export class VehicleService {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async create(createVehicleDto: CreateVehicleDto) {
    return await this.vehicleRepository.createVehicle<CreateVehicleDto>(
      createVehicleDto,
    );
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    return await this.vehicleRepository.updateVehicle<UpdateVehicleDto>(
      id,
      updateVehicleDto,
    );
  }

  async remove(id: number) {
    return await this.vehicleRepository.deleteVehicle(id);
  }

  async findAll() {
    return await this.vehicleRepository.getAllVehicles();
  }

  async findOne(id: number) {
    return await this.vehicleRepository.getVehicleById(id);
  }
}
