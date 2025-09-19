export interface Vehicle {
  id?: number;
  plate: string;
  chassis: string;
  reindeer: string;
  model: string;
  brand: string;
  year: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleListResponse {
  data: Vehicle[];
  nextCursor: string;
  hasMore: boolean;
}
