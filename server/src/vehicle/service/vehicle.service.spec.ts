import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from './vehicle.service';
import { VehiclesPublisher } from '../gateway/vehicles.publisher';
import { CircuitBreakerService } from '../../common/circuit-breaker/service/circuit-breaker.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { ReturnVehicleDto } from '../dto/return-vehicle.dto';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { CursorPaginationResult } from '../types/pagination-result.type';

describe('VehicleService', () => {
  let service: VehicleService;
  let vehiclesPublisher: jest.Mocked<VehiclesPublisher>;
  let circuitBreakerService: jest.Mocked<CircuitBreakerService>;

  const mockCircuitBreaker = {
    fire: jest.fn(),
  };

  beforeEach(async () => {
    const mockVehiclesPublisher = {
      publish: jest.fn(),
      requestWithoutId: jest.fn(),
      requestWithId: jest.fn(),
      requestWithData: jest.fn(),
    };

    const mockCircuitBreakerService = {
      create: jest.fn().mockReturnValue(mockCircuitBreaker),
      call: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: VehiclesPublisher,
          useValue: mockVehiclesPublisher,
        },
        {
          provide: CircuitBreakerService,
          useValue: mockCircuitBreakerService,
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    vehiclesPublisher = module.get(VehiclesPublisher);
    circuitBreakerService = module.get(CircuitBreakerService);
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

      const mockVehicle: ReturnVehicleDto = {
        id: 1,
        ...createVehicleDto,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      circuitBreakerService.call.mockResolvedValue(mockVehicle);

      const result = await service.create(createVehicleDto);

      expect(circuitBreakerService.call).toHaveBeenCalledWith(
        'vehicle_create',
        createVehicleDto,
      );
      expect(vehiclesPublisher.publish).toHaveBeenCalledWith(
        'vehicle_created_event',
        createVehicleDto,
      );
      expect(result).toEqual(mockVehicle);
    });

    it('should handle circuit breaker failure', async () => {
      const createVehicleDto: CreateVehicleDto = {
        plate: 'ABC-1234',
        chassis: '1HGBH41JXMN109186',
        reindeer: '12345678901',
        model: 'Civic',
        brand: 'Honda',
        year: 2023,
      };

      circuitBreakerService.call.mockRejectedValue(
        new Error('Service unavailable'),
      );

      await expect(service.create(createVehicleDto)).rejects.toThrow(
        'Service unavailable',
      );
      expect(vehiclesPublisher.publish).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a vehicle successfully', async () => {
      const vehicleId = 1;
      const updateVehicleDto: UpdateVehicleDto = {
        model: 'Accord',
        year: 2024,
      };

      const mockVehicle: ReturnVehicleDto = {
        id: vehicleId,
        plate: 'ABC-1234',
        chassis: '1HGBH41JXMN109186',
        reindeer: '12345678901',
        model: 'Accord',
        brand: 'Honda',
        year: 2024,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      circuitBreakerService.call.mockResolvedValue(mockVehicle);

      const result = await service.update(vehicleId, updateVehicleDto);

      expect(circuitBreakerService.call).toHaveBeenCalledWith(
        'vehicle_update',
        {
          id: vehicleId,
          ...updateVehicleDto,
        },
      );
      expect(vehiclesPublisher.publish).toHaveBeenCalledWith(
        'vehicle_updated_event',
        {
          id: vehicleId,
          ...updateVehicleDto,
        },
      );
      expect(result).toEqual(mockVehicle);
    });
  });

  describe('remove', () => {
    it('should remove a vehicle successfully', async () => {
      const vehicleId = 1;
      const mockVehicle: ReturnVehicleDto = {
        id: vehicleId,
        plate: 'ABC-1234',
        chassis: '1HGBH41JXMN109186',
        reindeer: '12345678901',
        model: 'Civic',
        brand: 'Honda',
        year: 2023,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vehiclesPublisher.requestWithId.mockResolvedValue(mockVehicle);

      const result = await service.remove(vehicleId);

      expect(vehiclesPublisher.requestWithId).toHaveBeenCalledWith(
        'vehicle_deleted_rpc',
        vehicleId,
      );
      expect(vehiclesPublisher.publish).toHaveBeenCalledWith(
        'vehicle_deleted_event',
        vehicleId,
      );
      expect(result).toEqual(mockVehicle);
    });
  });

  describe('findAll', () => {
    it('should return paginated vehicles', async () => {
      const paginationDto: CursorPaginationDto = {
        limit: 10,
        cursor: '1',
      };

      const mockVehicles = [
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
      ];

      const expectedResult: CursorPaginationResult<ReturnVehicleDto> = {
        data: mockVehicles,
        hasMore: false,
        nextCursor: null,
      };

      vehiclesPublisher.requestWithoutId.mockResolvedValue(mockVehicles);

      const result = await service.findAll(paginationDto);

      expect(vehiclesPublisher.requestWithoutId).toHaveBeenCalledWith(
        'vehicles_get_all_rpc',
        { ...paginationDto, limit: paginationDto.limit + 1 },
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single vehicle', async () => {
      const vehicleId = 1;
      const mockVehicle: ReturnVehicleDto = {
        id: vehicleId,
        plate: 'ABC-1234',
        chassis: '1HGBH41JXMN109186',
        reindeer: '12345678901',
        model: 'Civic',
        brand: 'Honda',
        year: 2023,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const expectedResult: CursorPaginationResult<ReturnVehicleDto> = {
        data: mockVehicle,
        hasMore: false,
        nextCursor: null,
      };

      vehiclesPublisher.requestWithId.mockResolvedValue(mockVehicle);

      const result = await service.findOne(vehicleId);

      expect(vehiclesPublisher.requestWithId).toHaveBeenCalledWith(
        'vehicles_get_one_rpc',
        vehicleId,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
