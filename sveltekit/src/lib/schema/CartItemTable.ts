import { integer, pgTable, timestamp, uuid, unique } from 'drizzle-orm/pg-core';
import { ProductTable } from './ProductTable';
import { UserTable } from './UserTable';
import { relations } from 'drizzle-orm';

export const CartItemTable = pgTable(
	'cart_item',
	{
		id: uuid('id').defaultRandom().primaryKey().notNull(),
		productId: uuid('product_id')
			.notNull()
			.references(() => ProductTable.id, {
				onDelete: 'cascade',
				onUpdate: 'restrict'
			}),
		quantity: integer('quantity').notNull(),
		userId: uuid('user_id')
			.notNull()
			.references(() => UserTable.id, {
				onDelete: 'cascade',
				onUpdate: 'restrict'
			}),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull()
	},
	(table) => {
		return {
			cartItemsProductIdUserIdKey: unique().on(table.productId, table.userId)
		};
	}
);

export const CartItemRelations = relations(CartItemTable, ({ one }) => ({
	product: one(ProductTable, {
		fields: [CartItemTable.productId],
		references: [ProductTable.id]
	}),
	user: one(UserTable, {
		fields: [CartItemTable.userId],
		references: [UserTable.id]
	})
}));

export type CartItem = typeof CartItemTable.$inferSelect;
