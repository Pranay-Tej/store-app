import { db } from '$lib/server/db/client.js';

export const load = async ({ locals }) => {
	const userId = locals.user?.id;
	if (!userId) {
		throw new Error('Not logged in');
	}
	try {
		const orders = await db.query.OrderTable.findMany({
			where: (OrderTable, { eq }) => eq(OrderTable.userId, userId)
		});
		return { orders };
	} catch (error) {
		console.error(error);
	}
};
