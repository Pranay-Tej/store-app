import { CartItemTable } from '$lib/schema/CartItemTable';
import { db } from '$lib/server/db/client';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async (req) => {
	const body = await req.request.json();
	const cartItemId = req.params.id;

	const userId = req.locals.user?.id;
	if (!userId || !cartItemId) {
		throw error(401, 'Not logged in');
	}
	const cartItem = await db
		.update(CartItemTable)
		.set({
			quantity: body.quantity
		})
		.where(eq(CartItemTable.id, cartItemId))
		.returning();

	return json({
		cartItem
	});
};
