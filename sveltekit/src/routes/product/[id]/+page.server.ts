import { db } from '$lib/server/db/client';
import { resolvePromise } from '$lib/utils/resolvePromise.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const [product, err] = await resolvePromise(
		db.query.ProductTable.findFirst({
			where: (ProductTable, { eq }) => eq(ProductTable.id, params.id)
		})
	);

	if (!product || err) {
		error(404, {
			message: 'Product not found'
		});
	}
	
	return { product };
};
