import { Injectable } from '@nestjs/common';
import { db } from '../../config/drizzle/config';
import { vehicles } from '../../config/database/schema';
import { eq, asc } from 'drizzle-orm';
import { Vehicle } from '../entity/vehicle.entity';

@Injectable()
export class VehicleRepository {
  async createVehicle<T>(data: T): Promise<Vehicle> {
    return db
      .insert(vehicles)
      .values(data as Vehicle)
      .returning()
      .then((rows) => (rows[0] as Vehicle) || null);
  }

  async updateVehicle<T>(id: number, data: T): Promise<Vehicle> {
    return db
      .update(vehicles)
      .set(data as Vehicle)
      .where(eq(vehicles.id, id))
      .returning()
      .execute()
      .then((rows) => (rows[0] as Vehicle) || null);
  }

  async deleteVehicle(id: number): Promise<Vehicle> {
    return await db
      .delete(vehicles)
      .where(eq(vehicles.id, id))
      .returning()
      .execute()
      .then((rows) => (rows[0] as Vehicle) || null);
  }

  async getVehicleById(id: number): Promise<Vehicle> {
    return db
      .select()
      .from(vehicles)
      .where(eq(vehicles.id, id))
      .execute()
      .then((rows) => (rows[0] as Vehicle) || null);
  }

  async getAllVehicles(limit = 20): Promise<Vehicle[]> {
    return db
      .select()
      .from(vehicles)
      .orderBy(asc(vehicles.createdAt))
      .limit(limit)
      .execute()
      .then((rows) => (rows as Vehicle[]) || []);
  }
}
