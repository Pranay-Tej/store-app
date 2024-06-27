import { integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { UserTable } from './UserTable';
import { relations } from 'drizzle-orm';
import { OrderItemTable } from './OrderItemTable';

export const statusEnum = pgEnum('status', ['payment_pending', 'paid', 'shipped', 'delivered']);

export const OrderTable = pgTable('order', {
	id: uuid('id').defaultRandom().primaryKey().notNull(),
	userId: uuid('user_id')
		.notNull()
		.references(() => UserTable.id, {
			onDelete: 'cascade',
			onUpdate: 'restrict'
		}),
	name: text('name').notNull(),
	address: text('address').notNull(),
	status: statusEnum('status').notNull(),
	orderToken: text('order_token').unique(),
	paymentLink: text('payment_link').unique(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	amount: integer('amount').notNull()
});

export const OrderTableRelations = relations(OrderTable, ({ one, many }) => ({
	orderItems: many(OrderItemTable),
	user: one(UserTable, {
		fields: [OrderTable.userId],
		references: [UserTable.id]
	})
}));
