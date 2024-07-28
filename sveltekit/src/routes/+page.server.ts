import { db } from '$lib/server/db/client';
import { resolvePromise } from '$lib/utils/resolvePromise';
import { error } from '@sveltejs/kit';

export const load = async () => {
	const [products, err] = await resolvePromise(db.query.ProductTable.findMany());
	if (err) {
		error(404, {
			message: 'Products not found'
		});
	}
	return { products };
};
