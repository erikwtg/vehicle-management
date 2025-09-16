import { Injectable } from '@nestjs/common';
import { db } from '../../config/drizzle/config';
import { vehicles } from '../../config/database/schema';
import { eq, asc } from 'drizzle-orm';
import { Vehicle } from '../entity/vehicle.entity';

@Injectable()
export class VehicleRepository {
  async createVehicle(data: {
    plate: string;
    chassis: string;
    reindeer: string;
    model: string;
    brand: string;
    year: number;
  }): Promise<Vehicle> {
    return db
      .insert(vehicles)
      .values(data)
      .returning()
      .then((rows) => (rows[0] as Vehicle) || null);
  }

  async updateVehicle(
    vehicleId: number,
    data: {
      plate?: string;
      chassis?: string;
      reindeer?: string;
      model?: string;
      brand?: string;
      year?: number;
    },
  ): Promise<Vehicle> {
    return db
      .update(vehicles)
      .set(data)
      .where(eq(vehicles.id, vehicleId))
      .returning()
      .execute()
      .then((rows) => (rows[0] as Vehicle) || null);
  }

  async deleteVehicle(vehicleId: number): Promise<void> {
    await db.delete(vehicles).where(eq(vehicles.id, vehicleId)).execute();
  }

  async getVehicleById(vehicleId: number): Promise<Vehicle> {
    return db
      .select()
      .from(vehicles)
      .where(eq(vehicles.id, vehicleId))
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
