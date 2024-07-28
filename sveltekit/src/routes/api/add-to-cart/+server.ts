import { CartItemTable } from '$lib/schema/CartItemTable';
import { db } from '$lib/server/db/client';
import { resolvePromise } from '$lib/utils/resolvePromise';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (req) => {
	const body = await req.request.json();

	const userId = req.locals.user?.id;
	if (!userId) {
		throw error(401, 'Not logged in');
	}
	const [cartItem, err] = await resolvePromise(
		db
			.insert(CartItemTable)
			.values({
				userId,
				productId: body.productId,
				quantity: 1
			})
			.returning()
	);
	if (err || !cartItem) {
		throw error(500, 'Server error');
	}

	return json({
		cartItem
	});
};
