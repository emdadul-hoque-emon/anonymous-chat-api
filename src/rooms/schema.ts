import { relations } from 'drizzle-orm';
import { pgTable, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from '../users/schema';

export const rooms = pgTable('rooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', {
    length: 24,
  })
    .notNull()
    .unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
});

export const roomsRelations = relations(rooms, ({ one }) => ({
  owner: one(users, {
    fields: [rooms.ownerId],
    references: [users.id],
  }),
}));
