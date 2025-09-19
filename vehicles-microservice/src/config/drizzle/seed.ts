import { faker } from '@faker-js/faker';
import { vehicles } from '../database/schema'; // ajuste caminho do schema
import { db } from '../../config/drizzle/config';

async function main() {
  console.log('🌱 Iniciando seed...');

  const vehiclesToInsert = Array.from({ length: 50 }).map(() => ({
    plate: faker.vehicle.vrm(),
    chassis: faker.string.alphanumeric(17),
    reindeer: faker.string.numeric(11),
    model: faker.vehicle.model(),
    brand: faker.vehicle.manufacturer(),
    year: faker.number.int({ min: 1995, max: 2024 }),
    createdAt: faker.date.past(),
  }));

  await db.insert(vehicles).values(vehiclesToInsert);

  console.log(
    `✅ Seed concluído! ${vehiclesToInsert.length} veículos inseridos`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
