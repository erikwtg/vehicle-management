import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { VehicleRepository } from '../repository/vehicle.repository';

@Injectable()
export class VehicleService {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  create(createVehicleDto: CreateVehicleDto) {
    return this.vehicleRepository.createVehicle(createVehicleDto);
  }

  findAll() {
    return this.vehicleRepository.getAllVehicles();
  }

  findOne(id: number) {
    return this.vehicleRepository.getVehicleById(id);
  }

  update(id: number, updateVehicleDto: UpdateVehicleDto) {
    return this.vehicleRepository.updateVehicle(id, updateVehicleDto);
  }

  remove(id: number) {
    return this.vehicleRepository.deleteVehicle(id);
  }
}
