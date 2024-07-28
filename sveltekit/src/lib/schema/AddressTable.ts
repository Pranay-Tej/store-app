import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { UserTable } from './UserTable';
import { relations } from 'drizzle-orm';

export const AddressTable = pgTable('address', {
	id: uuid('id').defaultRandom().primaryKey().notNull(),
	userId: uuid('user_id')
		.notNull()
		.references(() => UserTable.id, {
			onDelete: 'cascade',
			onUpdate: 'restrict'
		}),
	name: text('name').notNull(),
	address: text('address').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull()
});

export const AddressRelations = relations(AddressTable, ({ one }) => ({
	user: one(UserTable, {
		fields: [AddressTable.userId],
		references: [UserTable.id]
	})
}));
