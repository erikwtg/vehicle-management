/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from './vehicle.service';
import { VehicleRepository } from '../repository/vehicle.repository';
import { RedisService } from '../../redis/service/redis.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import {
  VehicleNotFoundError,
  VehicleAlreadyExistsError,
} from '../../common/errors/vehicle.errors';

describe('VehicleService', () => {
  let service: VehicleService;
  let vehicleRepository: jest.Mocked<VehicleRepository>;
  let redisService: jest.Mocked<RedisService>;
  let module: TestingModule;

  const mockVehicleRepository = {
    createVehicle: jest.fn(),
    updateVehicle: jest.fn(),
    deleteVehicle: jest.fn(),
    getAllVehicles: jest.fn(),
    getVehicleById: jest.fn(),
  };

  const mockRedisService = {
    set: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: VehicleRepository,
          useValue: mockVehicleRepository,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    vehicleRepository = module.get(VehicleRepository);
    redisService = module.get(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a vehicle successfully', async () => {
      const createVehicleDto: CreateVehicleDto = {
        plate: 'ABC-1234',
        chassis: '1HGBH41JXMN109186',
        reindeer: '12345678901',
        model: 'Civic',
        brand: 'Honda',
        year: 2023,
      };

      const expectedVehicle = {
        id: 1,
        ...createVehicleDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vehicleRepository.createVehicle.mockResolvedValue(expectedVehicle);

      const result = await service.create(createVehicleDto);

      expect(vehicleRepository.createVehicle).toHaveBeenCalledWith(
        createVehicleDto,
      );
      expect(result).toEqual(expectedVehicle);
    });

    it('should throw VehicleAlreadyExistsError when vehicle already exists', async () => {
      const createVehicleDto: CreateVehicleDto = {
        plate: 'ABC-1234',
        chassis: '1HGBH41JXMN109186',
        reindeer: '12345678901',
        model: 'Civic',
        brand: 'Honda',
        year: 2023,
      };

      vehicleRepository.createVehicle.mockResolvedValue(null as any);

      await expect(service.create(createVehicleDto)).rejects.toThrow(
        VehicleAlreadyExistsError,
      );
      expect(vehicleRepository.createVehicle).toHaveBeenCalledWith(
        createVehicleDto,
      );
    });
  });

  describe('update', () => {
    it('should update a vehicle successfully', async () => {
      const vehicleId = 1;
      const updateVehicleDto: UpdateVehicleDto = {
        id: vehicleId,
        model: 'Accord',
        year: 2024,
      };

      const expectedVehicle = {
        id: vehicleId,
        plate: 'ABC-1234',
        chassis: '1HGBH41JXMN109186',
        reindeer: '12345678901',
        model: 'Accord',
        brand: 'Honda',
        year: 2024,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vehicleRepository.updateVehicle.mockResolvedValue(expectedVehicle);

      const result = await service.update(vehicleId, updateVehicleDto);

      expect(vehicleRepository.updateVehicle).toHaveBeenCalledWith(
        vehicleId,
        updateVehicleDto,
      );
      expect(result).toEqual(expectedVehicle);
    });

    it('should throw VehicleNotFoundError when vehicle does not exist', async () => {
      const vehicleId = 999;
      const updateVehicleDto: UpdateVehicleDto = {
        id: vehicleId,
        model: 'Accord',
      };

      vehicleRepository.updateVehicle.mockResolvedValue(null as any);

      await expect(service.update(vehicleId, updateVehicleDto)).rejects.toThrow(
        VehicleNotFoundError,
      );
      expect(vehicleRepository.updateVehicle).toHaveBeenCalledWith(
        vehicleId,
        updateVehicleDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a vehicle successfully', async () => {
      const vehicleId = 1;
      const expectedVehicle = {
        id: vehicleId,
        plate: 'ABC-1234',
        chassis: '1HGBH41JXMN109186',
        reindeer: '12345678901',
        model: 'Civic',
        brand: 'Honda',
        year: 2023,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vehicleRepository.deleteVehicle.mockResolvedValue(expectedVehicle);

      const result = await service.remove(vehicleId);

      expect(vehicleRepository.deleteVehicle).toHaveBeenCalledWith(vehicleId);
      expect(result).toEqual(expectedVehicle);
    });

    it('should throw VehicleNotFoundError when vehicle does not exist', async () => {
      const vehicleId = 999;

      vehicleRepository.deleteVehicle.mockResolvedValue(null as any);

      await expect(service.remove(vehicleId)).rejects.toThrow(
        VehicleNotFoundError,
      );
      expect(vehicleRepository.deleteVehicle).toHaveBeenCalledWith(vehicleId);
    });
  });

  describe('findAll', () => {
    it('should return paginated vehicles', async () => {
      const paginationDto: CursorPaginationDto = {
        limit: 10,
        cursor: '1',
      };

      const expectedResult = {
        data: [
          {
            id: 1,
            plate: 'ABC-1234',
            chassis: '1HGBH41JXMN109186',
            reindeer: '12345678901',
            model: 'Civic',
            brand: 'Honda',
            year: 2023,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        hasMore: false,
        nextCursor: null,
      };

      vehicleRepository.getAllVehicles.mockResolvedValue(expectedResult.data);

      const result = await service.findAll(paginationDto);

      expect(vehicleRepository.getAllVehicles).toHaveBeenCalledWith(
        paginationDto,
      );
      expect(result).toEqual(expectedResult.data);
    });

    it('should throw VehicleNotFoundError when no vehicles found', async () => {
      const paginationDto: CursorPaginationDto = {
        limit: 10,
        cursor: '1',
      };

      vehicleRepository.getAllVehicles.mockResolvedValue([]);

      await expect(service.findAll(paginationDto)).rejects.toThrow(
        VehicleNotFoundError,
      );
      expect(vehicleRepository.getAllVehicles).toHaveBeenCalledWith(
        paginationDto,
      );
    });
  });

  describe('findOne', () => {
    it('should return a single vehicle', async () => {
      const vehicleId = 1;
      const expectedVehicle = {
        id: vehicleId,
        plate: 'ABC-1234',
        chassis: '1HGBH41JXMN109186',
        reindeer: '12345678901',
        model: 'Civic',
        brand: 'Honda',
        year: 2023,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vehicleRepository.getVehicleById.mockResolvedValue(expectedVehicle);

      const result = await service.findOne(vehicleId);

      expect(vehicleRepository.getVehicleById).toHaveBeenCalledWith(vehicleId);
      expect(result).toEqual(expectedVehicle);
    });

    it('should throw VehicleNotFoundError when vehicle does not exist', async () => {
      const vehicleId = 999;

      vehicleRepository.getVehicleById.mockResolvedValue(null as any);

      await expect(service.findOne(vehicleId)).rejects.toThrow(
        VehicleNotFoundError,
      );
      expect(vehicleRepository.getVehicleById).toHaveBeenCalledWith(vehicleId);
    });
  });

  describe('setVehicleIdempotency', () => {
    it('should set idempotency key in Redis', async () => {
      const key = 'vehicle:123';
      const value = 'processed';

      redisService.set.mockResolvedValue(undefined);

      await service.setVehicleIdempotency(key, value);

      expect(redisService.set).toHaveBeenCalledWith(key, value);
    });
  });

  describe('getVehicleIdempotency', () => {
    it('should get idempotency key from Redis', async () => {
      const key = 'vehicle:123';
      const expectedValue = 'processed';

      redisService.get.mockResolvedValue(expectedValue);

      const result = await service.getVehicleIdempotency(key);

      expect(redisService.get).toHaveBeenCalledWith(key);
      expect(result).toEqual(expectedValue);
    });

    it('should return null when key does not exist', async () => {
      const key = 'vehicle:999';

      redisService.get.mockResolvedValue(null);

      const result = await service.getVehicleIdempotency(key);

      expect(redisService.get).toHaveBeenCalledWith(key);
      expect(result).toBeNull();
    });
  });
});
