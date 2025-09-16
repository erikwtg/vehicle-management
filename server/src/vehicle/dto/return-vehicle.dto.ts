import { IsNotEmpty, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleDto } from './create-vehicle.dto';

export class ReturnVehicleDto extends PartialType(CreateVehicleDto) {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsString()
  createdAt: string;

  @IsNotEmpty()
  @IsString()
  updatedAt: string;
}
