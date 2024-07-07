import { db } from '$lib/server/db/client.js';

export const load = async ({ locals, params }) => {
	const userId = locals.user?.id;
	if (!userId) {
		throw new Error('Not logged in');
	}
	const id = params.id;
	const order = await db.query.OrderTable.findFirst({
		where: (OrderTable, { eq }) => eq(OrderTable.id, id),
		with: {
			orderItems: {
				with: {
					product: true
				}
			}
		}
	});

	return { order };
};
