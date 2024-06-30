import { db } from '$lib/server/db/client';

export const load = async ({ locals }) => {
	try {
		const userId = locals.user?.id;
		if (!userId) {
			throw new Error('Not logged in');
		}
		const cartItems = await db.query.CartItemTable.findMany({
			where: (CartItemTable, { eq }) => eq(CartItemTable.userId, userId),
			orderBy: (CartItemTable, { desc }) => [desc(CartItemTable.createdAt)],
			with: {
				product: true
			}
		});
		return { cartItems };
	} catch (error) {
		console.error(error);
	}
};
