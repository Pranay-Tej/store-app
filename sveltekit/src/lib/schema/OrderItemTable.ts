import { integer, pgTable, uuid } from 'drizzle-orm/pg-core';
import { OrderTable } from './OrderTable';
import { ProductTable } from './ProductTable';
import { UserTable } from './UserTable';
import { relations } from 'drizzle-orm';

export const OrderItemTable = pgTable('order_item', {
	id: uuid('id').defaultRandom().primaryKey().notNull(),
	quantity: integer('quantity').notNull(),
	orderId: uuid('order_id')
		.notNull()
		.references(() => OrderTable.id, {
			onDelete: 'cascade',
			onUpdate: 'restrict'
		}),
	productId: uuid('product_id').references(() => ProductTable.id, {
		onDelete: 'set null',
		onUpdate: 'restrict'
	}),
	userId: uuid('user_id')
		.notNull()
		.references(() => UserTable.id, {
			onDelete: 'cascade',
			onUpdate: 'restrict'
		})
});

export const OrderItemRelations = relations(OrderItemTable, ({ one }) => ({
	order: one(OrderTable, {
		fields: [OrderItemTable.orderId],
		references: [OrderTable.id]
	}),
	product: one(ProductTable, {
		fields: [OrderItemTable.productId],
		references: [ProductTable.id]
	}),
	user: one(UserTable, {
		fields: [OrderItemTable.userId],
		references: [UserTable.id]
	})
}));

export type OrderItemInsert = typeof OrderItemTable.$inferInsert;
