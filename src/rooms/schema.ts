import { relations } from 'drizzle-orm';
import { pgTable, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from '../users/schema';
import { messages } from '../messages/schema';
import { index } from 'drizzle-orm/pg-core';

export const rooms = pgTable(
  'rooms',
  {
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
  },
  (table) => ({
    nameIndex: index('rooms_name_idx').on(table.name),
  }),
);

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  owner: one(users, {
    fields: [rooms.ownerId],
    references: [users.id],
  }),
  messages: many(messages),
}));
