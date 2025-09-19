import { faker } from '@faker-js/faker';
import { vehicles } from '../database/schema'; // ajuste caminho do schema
import { db } from '../../config/drizzle/config';

const brazilianBrands = [
  {
    brand: 'Volkswagen',
    models: ['Gol', 'Polo', 'Jetta', 'Passat', 'T-Cross', 'Tiguan', 'Amarok'],
  },
  {
    brand: 'Chevrolet',
    models: ['Onix', 'Prisma', 'Cruze', 'Tracker', 'S10', 'Spin', 'Cobalt'],
  },
  {
    brand: 'Fiat',
    models: ['Uno', 'Palio', 'Siena', 'Strada', 'Toro', 'Argo', 'Cronos'],
  },
  {
    brand: 'Ford',
    models: [
      'Ka',
      'Fiesta',
      'Focus',
      'EcoSport',
      'Ranger',
      'Edge',
      'Territory',
    ],
  },
  {
    brand: 'Hyundai',
    models: ['HB20', 'Creta', 'Tucson', 'Santa Fe', 'Azera', 'Elantra', 'ix35'],
  },
  {
    brand: 'Toyota',
    models: ['Corolla', 'Etios', 'Yaris', 'RAV4', 'Hilux', 'SW4', 'Prius'],
  },
  {
    brand: 'Honda',
    models: ['Civic', 'Fit', 'City', 'HR-V', 'CR-V', 'Accord', 'WR-V'],
  },
  {
    brand: 'Nissan',
    models: [
      'March',
      'Versa',
      'Sentra',
      'Kicks',
      'Frontier',
      'X-Trail',
      'Livina',
    ],
  },
  {
    brand: 'Renault',
    models: [
      'Sandero',
      'Logan',
      'Duster',
      'Captur',
      'Kwid',
      'Oroch',
      'Fluence',
    ],
  },
  {
    brand: 'Peugeot',
    models: ['208', '2008', '3008', '5008', '308', 'Partner', 'Expert'],
  },
];

function generateBrazilianPlate(): string {
  const useNewFormat = faker.datatype.boolean({ probability: 0.3 });

  if (useNewFormat) {
    const letters = faker.string.alpha({ length: 3, casing: 'upper' });
    const firstNumber = faker.string.numeric(1);
    const letter = faker.string.alpha({ length: 1, casing: 'upper' });
    const lastNumbers = faker.string.numeric(2);
    return `${letters}${firstNumber}${letter}${lastNumbers}`;
  } else {
    const letters = faker.string.alpha({ length: 3, casing: 'upper' });
    const numbers = faker.string.numeric(4);
    return `${letters}${numbers}`;
  }
}

function generateChassis(): string {
  const validChars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
  let chassis = '';

  for (let i = 0; i < 17; i++) {
    chassis += validChars.charAt(Math.floor(Math.random() * validChars.length));
  }

  return chassis;
}

function generateRenavam(): string {
  return faker.string.numeric(11);
}

function getBrazilianVehicle() {
  const brandData = faker.helpers.arrayElement(brazilianBrands);
  const model = faker.helpers.arrayElement(brandData.models);
  return { brand: brandData.brand, model };
}

async function main() {
  console.log('🌱 Iniciando seed...');

  const vehiclesToInsert = Array.from({ length: 500 }).map(() => {
    const { brand, model } = getBrazilianVehicle();

    return {
      plate: generateBrazilianPlate(),
      chassis: generateChassis(),
      reindeer: generateRenavam(),
      model,
      brand,
      year: faker.number.int({ min: 2000, max: 2024 }),
      createdAt: faker.date.past({ years: 2 }),
    };
  });

  await db.insert(vehicles).values(vehiclesToInsert);

  console.log(
    `✅ Seed concluído! ${vehiclesToInsert.length} veículos inseridos`,
  );
  console.log('📋 Dados gerados com padrões brasileiros:');
  console.log('   • Placas: formato antigo (ABC1234) e Mercosul (ABC1D23)');
  console.log('   • Chassi: 17 caracteres alfanuméricos válidos');
  console.log('   • RENAVAM: 11 dígitos numéricos');
  console.log('   • Marcas e modelos: veículos populares no Brasil');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
