/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { VehicleRepository } from './vehicle.repository';
import { Vehicle } from '../entity/vehicle.entity';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { db } from '../../config/drizzle/config';
import { vehicles } from '../../config/database/schema';

jest.mock('../../config/drizzle/config', () => ({
  db: {
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    select: jest.fn(),
  },
}));

describe('VehicleRepository Integration Tests', () => {
  let repository: VehicleRepository;
  let mockDb: jest.Mocked<typeof db>;
  let module: TestingModule;

  const mockVehicle: Vehicle = {
    id: 1,
    plate: 'ABC-1234',
    chassis: '1HGBH41JXMN109186',
    reindeer: '12345678901',
    model: 'Civic',
    brand: 'Honda',
    year: 2023,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [VehicleRepository],
    }).compile();

    repository = module.get<VehicleRepository>(VehicleRepository);
    mockDb = db as jest.Mocked<typeof db>;

    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (module) {
      await module.close();
    }
  });

  describe('createVehicle', () => {
    it('should create a vehicle successfully', async () => {
      const createData = {
        plate: 'ABC-1234',
        chassis: '1HGBH41JXMN109186',
        reindeer: '12345678901',
        model: 'Civic',
        brand: 'Honda',
        year: 2023,
      };

      const mockInsert = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        then: jest.fn().mockResolvedValue([mockVehicle]),
      };

      mockDb.insert.mockReturnValue(mockInsert as any);

      const result = await repository.createVehicle(createData);

      expect(mockDb.insert).toHaveBeenCalledWith(vehicles);
      expect(mockInsert.values).toHaveBeenCalledWith(createData);
      expect(mockInsert.returning).toHaveBeenCalled();
      expect(result).toEqual([mockVehicle]);
    });

    it('should return null when creation fails', async () => {
      const createData = {
        plate: 'ABC-1234',
        chassis: '1HGBH41JXMN109186',
        reindeer: '12345678901',
        model: 'Civic',
        brand: 'Honda',
        year: 2023,
      };

      const mockInsert = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        then: jest.fn().mockResolvedValue([]),
      };

      mockDb.insert.mockReturnValue(mockInsert as any);

      const result = await repository.createVehicle(createData);

      expect(result).toEqual([]);
    });
  });

  describe('updateVehicle', () => {
    it('should update a vehicle successfully', async () => {
      const vehicleId = 1;
      const updateData = {
        model: 'Accord',
        year: 2024,
      };

      const updatedVehicle = { ...mockVehicle, ...updateData };

      const mockUpdate = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockReturnThis(),
        then: jest.fn().mockResolvedValue([updatedVehicle]),
      };

      mockDb.update.mockReturnValue(mockUpdate as any);

      const result = await repository.updateVehicle(vehicleId, updateData);

      expect(mockDb.update).toHaveBeenCalledWith(vehicles);
      expect(mockUpdate.set).toHaveBeenCalledWith(updateData);
      expect(mockUpdate.where).toHaveBeenCalled();
      expect(mockUpdate.returning).toHaveBeenCalled();
      expect(mockUpdate.execute).toHaveBeenCalled();
      expect(result).toEqual([updatedVehicle]);
    });

    it('should return null when vehicle not found', async () => {
      const vehicleId = 999;
      const updateData = { model: 'Accord' };

      const mockUpdate = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockReturnThis(),
        then: jest.fn().mockResolvedValue([]),
      };

      mockDb.update.mockReturnValue(mockUpdate as any);

      const result = await repository.updateVehicle(vehicleId, updateData);

      expect(result).toEqual([]);
    });
  });

  describe('deleteVehicle', () => {
    it('should delete a vehicle successfully', async () => {
      const vehicleId = 1;

      const mockDelete = {
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockReturnThis(),
        then: jest.fn().mockResolvedValue([mockVehicle]),
      };

      mockDb.delete.mockReturnValue(mockDelete as any);

      const result = await repository.deleteVehicle(vehicleId);

      expect(mockDb.delete).toHaveBeenCalledWith(vehicles);
      expect(mockDelete.where).toHaveBeenCalled();
      expect(mockDelete.returning).toHaveBeenCalled();
      expect(mockDelete.execute).toHaveBeenCalled();
      expect(result).toEqual([mockVehicle]);
    });

    it('should return null when vehicle not found', async () => {
      const vehicleId = 999;

      const mockDelete = {
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockReturnThis(),
        then: jest.fn().mockResolvedValue([]),
      };

      mockDb.delete.mockReturnValue(mockDelete as any);

      const result = await repository.deleteVehicle(vehicleId);

      expect(result).toEqual([]);
    });
  });

  describe('getVehicleById', () => {
    it('should return a vehicle by id', async () => {
      const vehicleId = 1;

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockReturnThis(),
        then: jest.fn().mockResolvedValue([mockVehicle]),
      };

      mockDb.select.mockReturnValue(mockSelect as any);

      const result = await repository.getVehicleById(vehicleId);

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockSelect.from).toHaveBeenCalledWith(vehicles);
      expect(mockSelect.where).toHaveBeenCalled();
      expect(mockSelect.execute).toHaveBeenCalled();
      expect(result).toEqual([mockVehicle]);
    });

    it('should return null when vehicle not found', async () => {
      const vehicleId = 999;

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockReturnThis(),
        then: jest.fn().mockResolvedValue([]),
      };

      mockDb.select.mockReturnValue(mockSelect as any);

      const result = await repository.getVehicleById(vehicleId);

      expect(result).toEqual([]);
    });
  });

  describe('getAllVehicles', () => {
    it('should return paginated vehicles', async () => {
      const paginationDto: CursorPaginationDto = {
        limit: 10,
        cursor: '1',
      };

      const mockVehicles = [mockVehicle];

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        execute: jest.fn().mockReturnThis(),
        then: jest.fn().mockResolvedValue(mockVehicles),
      };

      mockDb.select.mockReturnValue(mockSelect as any);

      const result = await repository.getAllVehicles(paginationDto);

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockSelect.from).toHaveBeenCalledWith(vehicles);
      expect(mockSelect.where).toHaveBeenCalled();
      expect(mockSelect.orderBy).toHaveBeenCalled();
      expect(mockSelect.limit).toHaveBeenCalledWith(10);
      expect(mockSelect.execute).toHaveBeenCalled();
      expect(result).toEqual(mockVehicles);
    });

    it('should return empty array when no vehicles found', async () => {
      const paginationDto: CursorPaginationDto = {
        limit: 10,
        cursor: '1',
      };

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        execute: jest.fn().mockReturnThis(),
        then: jest.fn().mockResolvedValue([]),
      };

      mockDb.select.mockReturnValue(mockSelect as any);

      const result = await repository.getAllVehicles(paginationDto);

      expect(result).toEqual([]);
    });

    it('should handle pagination without cursor', async () => {
      const paginationDto: CursorPaginationDto = {
        limit: 5,
      };

      const mockVehicles = [mockVehicle];

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        execute: jest.fn().mockReturnThis(),
        then: jest.fn().mockResolvedValue(mockVehicles),
      };

      mockDb.select.mockReturnValue(mockSelect as any);

      const result = await repository.getAllVehicles(paginationDto);

      expect(mockSelect.limit).toHaveBeenCalledWith(5);
      expect(result).toEqual(mockVehicles);
    });
  });
});
