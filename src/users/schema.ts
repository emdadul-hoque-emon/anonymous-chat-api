import { relations } from 'drizzle-orm';
import { uuid } from 'drizzle-orm/pg-core';
import { timestamp, pgTable, varchar } from 'drizzle-orm/pg-core';
import { rooms } from '../rooms/schema';
import { messages } from '../messages/schema';
import { index } from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    username: varchar('username', {
      length: 24,
    })
      .notNull()
      .unique(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    usernameIndex: index('users_username_idx').on(table.username),
  }),
);

export const userRelations = relations(users, ({ many }) => ({
  rooms: many(rooms),
  messages: many(messages),
}));
