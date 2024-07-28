import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { AddressTable } from './AddressTable';
import { CartItemTable } from './CartItemTable';
import { OrderItemTable } from './OrderItemTable';
import { OrderTable } from './OrderTable';

export const UserTable = pgTable('user', {
	id: uuid('id').primaryKey().notNull(),
	name: varchar('name', { length: 100 }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull()
});

export const UserRelations = relations(UserTable, ({ many }) => ({
	addresses: many(AddressTable),
	cartItems: many(CartItemTable),
	orderItems: many(OrderItemTable),
	orders: many(OrderTable)
}));
