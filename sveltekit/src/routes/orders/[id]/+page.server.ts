import { db } from '$lib/server/db/client.js';
import { resolvePromise } from '$lib/utils/resolvePromise.js';
import { error } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
	const userId = locals.user?.id;
	if (!userId) {
		throw error(401, { message: 'Not logged in' });
	}
	const id = params.id;
	const [order, err] = await resolvePromise(
		db.query.OrderTable.findFirst({
			where: (OrderTable, { eq }) => eq(OrderTable.id, id),
			with: {
				orderItems: {
					with: {
						product: true
					}
				}
			}
		})
	);

	if (err || !order) {
		throw error(404, { message: 'Order not found' });
	}

	return { order };
};
