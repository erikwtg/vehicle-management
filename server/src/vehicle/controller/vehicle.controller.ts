import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { VehicleService } from '../service/vehicle.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { CursorPaginationDto } from 'src/common/dto/cursor-pagination.dto';
import { RpcErrorInterceptor } from 'src/common/interceptors/rpc-exception.interceptor';

@UseInterceptors(RpcErrorInterceptor)
@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.create(createVehicleDto);
  }

  @Get()
  findAll(@Query() cursorPaginationDto: CursorPaginationDto) {
    return this.vehicleService.findAll(cursorPaginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehicleService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.vehicleService.remove(id);
  }
}
