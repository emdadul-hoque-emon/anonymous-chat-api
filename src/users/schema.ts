import { relations } from 'drizzle-orm';
import { uuid } from 'drizzle-orm/pg-core';
import { timestamp, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { rooms } from '../rooms/schema';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', {
    length: 24,
  })
    .notNull()
    .unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  rooms: many(rooms),
}));
