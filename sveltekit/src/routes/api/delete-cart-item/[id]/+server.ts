import { CartItemTable } from '$lib/schema/CartItemTable';
import { db } from '$lib/server/db/client';
import { resolvePromise } from '$lib/utils/resolvePromise';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const DELETE: RequestHandler = async (req) => {
	const cartItemId = req.params.id;

	const userId = req.locals.user?.id;
	if (!userId || !cartItemId) {
		throw error(401, 'Not logged in');
	}
	const [cartItem, err] = await resolvePromise(
		db.delete(CartItemTable).where(eq(CartItemTable.id, cartItemId)).returning()
	);

	if (err || !cartItem) {
		throw error(500, 'Server error');
	}

	return json({
		cartItem
	});
};
