import { CartItemTable } from '$lib/schema/CartItemTable';
import { db } from '$lib/server/db/client';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (req) => {
	const body = await req.request.json();
    
    const userId = req.locals.user?.id;
	if (!userId) {
		throw error(401, 'Not logged in');
	}
	const cartItem = await db
		.insert(CartItemTable)
		.values({
			userId,
			productId: body.productId,
			quantity: 1
		})
		.returning();

	return json({
		cartItem
	});
};
