import { db } from '$lib/server/db/client.js';
import { resolvePromise } from '$lib/utils/resolvePromise.js';
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const userId = locals.user?.id;
	if (!userId) {
		throw error(401, { message: 'Not logged in' });
	}
	const [orders, err] = await resolvePromise(
		db.query.OrderTable.findMany({
			where: (OrderTable, { eq }) => eq(OrderTable.userId, userId)
		})
	);
	if (err || !orders) {
		throw error(404, { message: 'Orders not found' });
	}
	return { orders };
};
