import { invalidate } from '$app/navigation';
import { ROUTE_DATA_KEYS } from '$lib/constants/routeDataKeys.js';
import { AddressTable } from '$lib/schema/AddressTable.js';
import { db } from '$lib/server/db/client';
import type { Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ locals, depends }) => {
	depends(ROUTE_DATA_KEYS.addresses);

	const userId = locals.user?.id;
	if (!userId) {
		throw new Error('Not logged in');
	}
	try {
		const addresses = await db.query.AddressTable.findMany({
			where: (AddressTable, { eq }) => eq(AddressTable.userId, userId)
		});
		// console.log(addresses);

		return { addresses };
	} catch (error) {
		console.error(error);
	}
};

export const actions: Actions = {
	add: async (event) => {
		try {
			const userId = event.locals.user?.id;
			if (!userId) {
				throw new Error('Not logged in');
			}
			const data = Object.fromEntries(await event.request.formData());
			await db.insert(AddressTable).values({
				address: data.address,
				name: data.name,
				userId
			});
			invalidate(ROUTE_DATA_KEYS.addresses);
			return { success: true };
		} catch (error) {
			console.error(error);
			return { success: false };
		}
	},

	delete: async (event) => {
		try {
			const userId = event.locals.user?.id;
			const data = Object.fromEntries(await event.request.formData());
			if (!userId || !data.id) {
				throw new Error('Not logged in');
			}
			await db.delete(AddressTable).where(eq(AddressTable.id, data.id));
			invalidate(ROUTE_DATA_KEYS.addresses);
			return { success: true };
		} catch (error) {
			console.error(error);
		}
	}
};
