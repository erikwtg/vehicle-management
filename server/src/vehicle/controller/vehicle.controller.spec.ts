import { Test, TestingModule } from '@nestjs/testing';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from '../service/vehicle.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { ReturnVehicleDto } from '../dto/return-vehicle.dto';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { CursorPaginationResult } from '../types/pagination-result.type';

describe('VehicleController', () => {
  let controller: VehicleController;
  let vehicleService: jest.Mocked<VehicleService>;

  const mockVehicleService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [
        {
          provide: VehicleService,
          useValue: mockVehicleService,
        },
      ],
    }).compile();

    controller = module.get<VehicleController>(VehicleController);
    vehicleService = module.get(VehicleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a vehicle', async () => {
      const createVehicleDto: CreateVehicleDto = {
        plate: 'ABC-1234',
        chassis: '1HGBH41JXMN109186',
        reindeer: '12345678901',
        model: 'Civic',
        brand: 'Honda',
        year: 2023,
      };

      const expectedResult: ReturnVehicleDto = {
        id: 1,
        ...createVehicleDto,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vehicleService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createVehicleDto);

      expect(vehicleService.create).toHaveBeenCalledWith(createVehicleDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return paginated vehicles', async () => {
      const paginationDto: CursorPaginationDto = {
        limit: 10,
        cursor: '1',
      };

      const expectedResult: CursorPaginationResult<ReturnVehicleDto> = {
        data: [
          {
            id: 1,
            plate: 'ABC-1234',
            chassis: '1HGBH41JXMN109186',
            reindeer: '12345678901',
            model: 'Civic',
            brand: 'Honda',
            year: 2023,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        hasMore: false,
        nextCursor: null,
      };

      vehicleService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(paginationDto);

      expect(vehicleService.findAll).toHaveBeenCalledWith(paginationDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single vehicle', async () => {
      const vehicleId = '1';
      const expectedResult: CursorPaginationResult<ReturnVehicleDto> = {
        data: {
          id: 1,
          plate: 'ABC-1234',
          chassis: '1HGBH41JXMN109186',
          reindeer: '12345678901',
          model: 'Civic',
          brand: 'Honda',
          year: 2023,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        hasMore: false,
        nextCursor: null,
      };

      vehicleService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(vehicleId);

      expect(vehicleService.findOne).toHaveBeenCalledWith(Number(vehicleId));
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a vehicle', async () => {
      const vehicleId = 1;
      const updateVehicleDto: UpdateVehicleDto = {
        model: 'Accord',
        year: 2024,
      };

      const expectedResult: ReturnVehicleDto = {
        id: 1,
        plate: 'ABC-1234',
        chassis: '1HGBH41JXMN109186',
        reindeer: '12345678901',
        model: 'Accord',
        brand: 'Honda',
        year: 2024,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vehicleService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(vehicleId, updateVehicleDto);

      expect(vehicleService.update).toHaveBeenCalledWith(
        vehicleId,
        updateVehicleDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove a vehicle', async () => {
      const vehicleId = 1;
      const expectedResult: ReturnVehicleDto = {
        id: 1,
        plate: 'ABC-1234',
        chassis: '1HGBH41JXMN109186',
        reindeer: '12345678901',
        model: 'Civic',
        brand: 'Honda',
        year: 2023,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vehicleService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(vehicleId);

      expect(vehicleService.remove).toHaveBeenCalledWith(vehicleId);
      expect(result).toEqual(expectedResult);
    });
  });
});
