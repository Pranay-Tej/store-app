import { ROUTE_DATA_KEYS } from '$lib/constants/routeDataKeys.js';
import { db } from '$lib/server/db/client.js';

export const load = async ({ locals, depends }) => {
	depends(ROUTE_DATA_KEYS.appRootLayout);

	try {
		const user = locals.user;
		const userId = user?.id;
		let userCartItems;

		if (userId) {
			userCartItems = await db.query.CartItemTable.findMany({
				where: (CartItemTable, { eq }) => eq(CartItemTable.userId, userId),
				orderBy: (CartItemTable, { desc }) => [desc(CartItemTable.createdAt)],
				with: {
					product: true
				}
			});
		}
		return { user, userCartItems: userCartItems ?? [] };
	} catch (error) {
		console.error(error);
	}
};
