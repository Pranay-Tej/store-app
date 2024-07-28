import { ROUTE_DATA_KEYS } from '$lib/constants/routeDataKeys.js';
import { AddressTable } from '$lib/schema/AddressTable.js';
import { db } from '$lib/server/db/client';
import { resolvePromise } from '$lib/utils/resolvePromise.js';
import { error, fail, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ locals, depends }) => {
	depends(ROUTE_DATA_KEYS.addresses);

	const userId = locals.user?.id;
	if (!userId) {
		throw error(401, { message: 'Not logged in' });
	}
	const [addresses, err] = await resolvePromise(
		db.query.AddressTable.findMany({
			where: (AddressTable, { eq }) => eq(AddressTable.userId, userId)
		})
	);

	if (err || !addresses) {
		throw error(404, { message: 'Addresses not found' });
	}

	return { addresses };
};

export const actions: Actions = {
	add: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) {
			return fail(401, { message: 'Not logged in' });
		}
		const data = Object.fromEntries(await event.request.formData());
		const [_, err] = await resolvePromise(
			db
				.insert(AddressTable)
				.values({
					address: data.address,
					name: data.name,
					userId
				})
				.returning()
		);
		if (err) {
			return fail(500, { success: false });
		}
		return { success: true };
	},

	delete: async (event) => {
		const userId = event.locals.user?.id;
		const data = Object.fromEntries(await event.request.formData());
		if (!userId || !data.id) {
			return fail(401, { message: 'Not logged in' });
		}

		const [_, err] = await resolvePromise(
			db.delete(AddressTable).where(eq(AddressTable.id, data.id)).returning()
		);
		if (err) {
			return fail(500, { success: false });
		}
		return { success: true };
	}
};
