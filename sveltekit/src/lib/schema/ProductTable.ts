import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { CartItemTable } from './CartItemTable';
import { OrderItemTable } from './OrderItemTable';

export const ProductTable = pgTable('product', {
	id: uuid('id').defaultRandom().primaryKey().notNull(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	price: integer('price').notNull(),
	imageUrl: text('image_url').notNull()
});

export const ProductRelations = relations(ProductTable, ({ many }) => ({
	cartItems: many(CartItemTable),
	orderItems: many(OrderItemTable)
}));

export type Product = typeof ProductTable.$inferSelect;
