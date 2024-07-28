import { ROUTE_DATA_KEYS } from '$lib/constants/routeDataKeys.js';
import { db } from '$lib/server/db/client.js';
import { resolvePromise } from '$lib/utils/resolvePromise.js';
import { error } from '@sveltejs/kit';

export const load = async ({ locals, depends }) => {
	depends(ROUTE_DATA_KEYS.appRootLayout);

	const user = locals.user;
	const userId = user?.id;

	if (userId) {
		const [userCartItems, err] = await resolvePromise(
			db.query.CartItemTable.findMany({
				where: (CartItemTable, { eq }) => eq(CartItemTable.userId, userId),
				orderBy: (CartItemTable, { desc }) => [desc(CartItemTable.createdAt)],
				with: {
					product: true
				}
			})
		);

		if (err || !userCartItems) {
			throw error(404, { message: 'Cart items not found' });
		}

		return { user, userCartItems };
	}
	
	return { user, userCartItems: [] };
};
