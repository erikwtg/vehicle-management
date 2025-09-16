import {
  pgTable,
  serial,
  varchar,
  index,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';

export const vehicles = pgTable(
  'vehicles',
  {
    id: serial('id').primaryKey().notNull(),
    plate: varchar('placa', { length: 255 }).notNull(),
    chassis: varchar('chassi', { length: 255 }).notNull(),
    reindeer: varchar('renavam', { length: 255 }).notNull(),
    model: varchar('modelo', { length: 255 }).notNull(),
    brand: varchar('marca', { length: 255 }).notNull(),
    year: integer('ano').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    plateIdx: index('placa_idx').on(table.plate),
  }),
);
